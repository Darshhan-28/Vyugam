// ============================================================
// VYUGAM 2.0 — Google Apps Script Proxy Client
// Single source of truth for all GAS calls from Vercel.
// Optimized: per-action timeouts, in-flight dedup for reads,
// single retry for idempotent GET-like actions.
// ============================================================

export class GasError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'GasError';
  }
}

/**
 * Call a Google Apps Script Web App action.
 *
 * opts.admin   — injects adminSecret into the payload (for admin-gated actions)
 * opts.coord   — injects coordSecret into the payload (for coordinator-gated actions)
 * opts.timeoutMs — request timeout in milliseconds (defaults per-action)
 */
const DEFAULT_GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbz27HT7yPxOoVvjoAZwgJ9DqufE9yUboAMXgsqQHdoCDOn6HD3_3xbziWlAGAn8yCQQRw/exec';
const DEFAULT_GAS_ADMIN_SECRET = 'Sakho115';
const DEFAULT_GAS_COORD_SECRET = 'Vyugam2k26';

// Per-action timeouts: admin list/summary calls scan full sheets in GAS.
const ACTION_TIMEOUTS: Record<string, number> = {
  getRegistrations: 28000,
  getCheckinSummary: 28000,
  getScreenshot: 25000,
  getRegistration: 20000,
  getPassByToken: 15000,
  checkEmailExists: 12000,
};

// Idempotent read actions safe to retry once on timeout/502.
// Never retry writes: registerParticipant, uploadScreenshot, verifyPayment,
// rejectPayment, cancelPass, resendPassEmail, recordCheckin, coordLogin.
const RETRYABLE_ACTIONS = new Set([
  'getRegistrations',
  'getRegistration',
  'getCheckinSummary',
  'getScreenshot',
  'getPassByToken',
  'checkEmailExists',
  'scanToken',
]);

// In-flight dedup for reads: same action+key shares one promise.
const inflight = new Map<string, Promise<unknown>>();

function dedupKey(action: string, payload: Record<string, unknown>): string | null {
  if (!RETRYABLE_ACTIONS.has(action)) return null;
  const id = payload.id ?? payload.participantId ?? payload.token ?? payload.email ?? '';
  const filter = payload.filter ?? '';
  const eventId = payload.eventId ?? '';
  return `${action}|${String(id)}|${String(filter)}|${String(eventId)}`;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function callGAS(
  action: string,
  payload: Record<string, unknown> = {},
  opts: { admin?: boolean; coord?: boolean; timeoutMs?: number } = {}
): Promise<unknown> {
  const gasUrl = process.env.GAS_WEB_APP_URL || DEFAULT_GAS_WEB_APP_URL;
  const adminSecret = process.env.GAS_ADMIN_SECRET || DEFAULT_GAS_ADMIN_SECRET;
  const coordSecret = process.env.GAS_COORD_SECRET || DEFAULT_GAS_COORD_SECRET;

  if (!gasUrl) {
    const isDev = process.env.NODE_ENV !== 'production';
    if (isDev) {
      console.warn(`[GAS Dev Mock] Action "${action}" — GAS_WEB_APP_URL not set. Returning mock response.`);
      if (action === 'checkEmailExists') return { exists: false };
      if (action === 'registerParticipant') return { success: true, participantId: 'DEV-MOCK-' + Date.now() };
      if (action === 'uploadScreenshot') return { success: true };
      if (action === 'getPassByToken') return { status: 'ACTIVE', name: 'Dev User', college: 'PACET', department: 'IT', year: '3', pass_id: 'DEV-001', qr_data_url: '', event_date: '2026-09-24' };
      if (action === 'getRegistrations') return { participants: [] };
      if (action === 'getRegistration') return { error: 'Not found (dev mock)' };
      if (action === 'verifyPayment') return { success: true };
      if (action === 'rejectPayment') return { success: true };
      if (action === 'cancelPass') return { success: true };
      if (action === 'resendPassEmail') return { success: true };
      if (action === 'getCheckinSummary') return { summary: { total_passes: 0, active_passes: 0, pending_passes: 0, total_checkins: 0, event_counts: [] }, checkins: [] };
      if (action === 'getScreenshot') return { error: 'No screenshot (dev mock)' };
      if (action === 'coordLogin') return { success: false, error: 'Coord login unavailable (dev mock)' };
      if (action === 'scanToken') return { error: 'Scan unavailable (dev mock)' };
      if (action === 'recordCheckin') return { success: true };
      return {};
    }
    throw new GasError(503, 'GAS_WEB_APP_URL is not configured. Add it to environment variables.');
  }

  const key = dedupKey(action, payload);
  if (key && inflight.has(key)) return inflight.get(key)!;

  const task = (async () => {
    const body: Record<string, unknown> = { action, ...payload };
    if (opts.admin) body.adminSecret = adminSecret;
    if (opts.coord) body.coordSecret = coordSecret;

    // Build target URL with query parameters.
    // When Node fetch follows Google Apps Script's 302 Redirect after a POST,
    // Node fetch converts the HTTP method to GET and drops the POST request body.
    // Appending action, id, adminSecret, coordSecret, etc. to the URL query string ensures that
    // Google Apps Script preserves these parameters in e.parameter when handling the redirected GET request.
    const urlObj = new URL(gasUrl);
    Object.entries(body).forEach(([k, v]) => {
      if (v !== undefined && v !== null && typeof v !== 'object') {
        const valStr = String(v);
        if (k !== 'base64' && valStr.length <= 500) {
          urlObj.searchParams.set(k, valStr);
        }
      }
    });
    const targetUrl = urlObj.toString();

    const timeoutMs = opts.timeoutMs ?? ACTION_TIMEOUTS[action] ?? 15000;
    const maxAttempts = RETRYABLE_ACTIONS.has(action) ? 2 : 1;
    let lastErr: unknown = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      const startTime = Date.now();

      try {
        const res = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(body),
          signal: controller.signal,
          redirect: 'follow',
        });

        const duration = Date.now() - startTime;
        let json: unknown;
        let text = '';
        try {
          text = await res.text();
          json = JSON.parse(text);
        } catch {
          console.error(`[GAS Client Error] Action "${action}" returned non-JSON after ${duration}ms. HTTP status: ${res.status}. Body preview: ${text.slice(0, 300)}`);
          throw new GasError(502, 'GAS returned a non-JSON response. Check that the Web App URL is correct and deployed.');
        }

        if (
          typeof json === 'object' &&
          json !== null &&
          'error' in json &&
          typeof (json as Record<string, unknown>).error === 'string'
        ) {
          const errMsg = (json as Record<string, string>).error;
          const targetId = (payload.id || payload.participantId || 'N/A') as string;
          console.error(`[GAS Business Error] Action: "${action}" | Target ID: "${targetId}" | Duration: ${duration}ms | GAS Status: ${res.status} | Error: "${errMsg}"`);

          const lower = errMsg.toLowerCase();
          if (errMsg === 'Unauthorized' || lower.includes('unauthorized')) {
            throw new GasError(401, 'Unauthorized');
          }
          if (lower.includes('not found')) {
            throw new GasError(404, errMsg);
          }
          if (lower.includes('already verified') || lower.includes('already checked in')) {
            throw new GasError(409, errMsg);
          }
          throw new GasError(400, errMsg);
        }

        return json;
      } catch (err) {
        const duration = Date.now() - startTime;
        if (err instanceof GasError) throw err;
        lastErr = err;
        const isAbort = (err as Error).name === 'AbortError';
        const isRetryable = attempt < maxAttempts;
        if (isRetryable) {
          console.warn(`[GAS Retry] Action "${action}" attempt ${attempt} failed after ${duration}ms (${(err as Error).message}). Retrying once…`);
          await sleep(400);
          continue;
        }
        if (isAbort) {
          console.error(`[GAS Client Error] Action "${action}" timed out after ${duration}ms (limit: ${timeoutMs}ms).`);
          throw new GasError(504, `GAS request timed out after ${Math.round(timeoutMs / 1000)} seconds.`);
        }
        console.error(`[GAS Client Error] Action "${action}" failed after ${duration}ms:`, (err as Error).message);
        throw new GasError(502, 'Could not reach Google Apps Script: ' + (err as Error).message);
      } finally {
        clearTimeout(timeoutId);
      }
    }
    throw lastErr instanceof Error ? lastErr : new GasError(502, 'GAS request failed');
  })();

  if (key) {
    inflight.set(key, task);
    task.then(
      () => { if (inflight.get(key) === task) inflight.delete(key); },
      () => { if (inflight.get(key) === task) inflight.delete(key); }
    );
  }
  return task;
}
