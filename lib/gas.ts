// ============================================================
// VYUGAM 2.0 — Google Apps Script Proxy Client
// Single source of truth for all GAS calls from Vercel.
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
 * opts.timeoutMs — request timeout in milliseconds (default 28s)
 */
const DEFAULT_GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbz27HT7yPxOoVvjoAZwgJ9DqufE9yUboAMXgsqQHdoCDOn6HD3_3xbziWlAGAn8yCQQRw/exec';
const DEFAULT_GAS_ADMIN_SECRET = 'Sakho115';
const DEFAULT_GAS_COORD_SECRET = 'Vyugam2k26';

export async function callGAS(
  action: string,
  payload: Record<string, unknown> = {},
  opts: { admin?: boolean; coord?: boolean; timeoutMs?: number } = {}
): Promise<unknown> {
  const gasUrl = process.env.GAS_WEB_APP_URL || DEFAULT_GAS_WEB_APP_URL;
  const adminSecret = process.env.GAS_ADMIN_SECRET || DEFAULT_GAS_ADMIN_SECRET;
  const coordSecret = process.env.GAS_COORD_SECRET || DEFAULT_GAS_COORD_SECRET;

  if (!gasUrl) {
    console.error(`[GAS Client Error] Action "${action}" failed: GAS_WEB_APP_URL is missing in environment variables.`);
    throw new GasError(503, 'GAS_WEB_APP_URL is not configured. Add it to environment variables.');
  }

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

  const controller = new AbortController();
  const timeoutMs = opts.timeoutMs ?? 15000;
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
    if ((err as Error).name === 'AbortError') {
      console.error(`[GAS Client Error] Action "${action}" timed out after ${duration}ms (limit: ${timeoutMs}ms).`);
      throw new GasError(504, `GAS request timed out after ${Math.round(timeoutMs / 1000)} seconds.`);
    }
    console.error(`[GAS Client Error] Action "${action}" failed after ${duration}ms:`, (err as Error).message);
    throw new GasError(502, 'Could not reach Google Apps Script: ' + (err as Error).message);
  } finally {
    clearTimeout(timeoutId);
  }
}
