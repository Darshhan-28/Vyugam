// ============================================================
// VYUGAM 2.0 — Native Vercel Catch-All Serverless Function
// Path: /api/[...path].ts
// Handles all /api/* routes in a single Vercel Serverless Function (Count = 1).
// ============================================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callGAS, GasError } from '../lib/gas';
import {
  verifyAdminPassword,
  createAdminSession,
  validateAdminSession,
  destroyAdminSession,
  createCoordinatorSession,
  validateCoordinatorSession,
  destroyCoordinatorSession,
} from '../lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Normalize request URL path
  const rawUrl = req.url || '';
  const urlObj = new URL(rawUrl, `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname.replace(/\/$/, ''); // e.g. /api/register or /api/admin/registrations
  const method = (req.method || 'GET').toUpperCase();

  // Helper to parse JSON body if needed
  const body = (req.body && typeof req.body === 'object') ? req.body : {};

  try {
    // ── 1. PUBLIC: Participant Registration ─────────────────────
    if (pathname === '/api/register' && method === 'POST') {
      const {
        name,
        email,
        phone,
        college,
        department,
        year,
        utr,
        screenshotBase64,
        screenshotType,
      } = body as Record<string, string>;

      if (!name?.trim()) return res.status(400).json({ error: 'Name is required' });
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email?.trim() ?? '')) {
        return res.status(400).json({ error: 'Valid email is required' });
      }
      if (!/^[0-9]{10}$/.test(phone?.trim() ?? '')) {
        return res.status(400).json({ error: 'Valid 10-digit phone number is required' });
      }
      if (!college?.trim()) return res.status(400).json({ error: 'College is required' });
      if (!department?.trim()) return res.status(400).json({ error: 'Department is required' });
      if (!year?.trim()) return res.status(400).json({ error: 'Year is required' });

      // Check email duplicate
      const checkResult = (await callGAS('checkEmailExists', { email: email.trim().toLowerCase() })) as { exists: boolean };
      if (checkResult.exists) {
        return res.status(409).json({
          error: 'This email is already registered. If you believe this is an error, contact the VYUGAM team.',
        });
      }

      // Register participant
      const regResult = (await callGAS('registerParticipant', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        college: college.trim(),
        department: department.trim(),
        year: year.trim(),
        utr: utr?.trim() || '',
      })) as { success: boolean; participantId: string; error?: string };

      if (!regResult.success || !regResult.participantId) {
        return res.status(500).json({ error: regResult.error || 'Registration failed. Please try again.' });
      }

      // Upload payment screenshot if provided (non-blocking)
      if (screenshotBase64) {
        const approxBytes = Math.ceil(screenshotBase64.length * 0.75);
        if (approxBytes <= 3 * 1024 * 1024) {
          callGAS('uploadScreenshot', {
            participantId: regResult.participantId,
            base64: screenshotBase64,
            mimeType: screenshotType || 'image/jpeg',
          }).catch((err) => console.error('[Register] Screenshot upload error:', err));
        }
      }

      return res.status(201).json({
        success: true,
        participant_id: regResult.participantId,
        message: 'Registration submitted. Payment pending verification.',
      });
    }

    // ── 2. PUBLIC: Check Email Exists ───────────────────────────
    if (pathname === '/api/check-email' && method === 'POST') {
      const { email } = body as Record<string, string>;
      if (!email) return res.status(400).json({ error: 'Email is required' });
      const checkResult = await callGAS('checkEmailExists', { email: email.trim().toLowerCase() });
      return res.status(200).json(checkResult);
    }

    // ── 3. PUBLIC: Upload Screenshot ────────────────────────────
    if (pathname === '/api/upload-screenshot' && method === 'POST') {
      const { participantId, base64, mimeType } = body as Record<string, string>;
      if (!participantId || !base64) return res.status(400).json({ error: 'participantId and base64 required' });
      const uploadResult = await callGAS('uploadScreenshot', { participantId, base64, mimeType });
      return res.status(200).json(uploadResult);
    }

    // ── 4. PUBLIC: Digital Pass Data ────────────────────────────
    if (pathname.startsWith('/api/pass') && method === 'GET') {
      const pathParts = pathname.split('/');
      const token = pathParts.length > 3 ? pathParts[3] : (req.query.token as string);

      if (!token) return res.status(400).json({ error: 'token is required' });

      const result = await callGAS('getPassByToken', { token });
      return res.status(200).json(result);
    }

    // ── 5. PUBLIC: Short URL QR Redirect ────────────────────────
    if (pathname.startsWith('/api/v/') && method === 'GET') {
      const token = pathname.split('/')[3] || (req.query.token as string);
      if (!token) return res.status(400).json({ error: 'token is required' });
      return res.redirect(307, `/pass/${token}`);
    }

    // ── 6. ADMIN: Auth Routes ───────────────────────────────────
    if (pathname === '/api/admin/login') {
      if (method === 'GET') {
        const valid = validateAdminSession(req);
        return valid ? res.status(200).json({ authenticated: true }) : res.status(401).json({ authenticated: false });
      }
      if (method === 'POST') {
        const { username, password } = body as Record<string, string>;
        if (!username || !password) return res.status(400).json({ error: 'Username and password are required' });

        const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
        if (username !== expectedUsername) {
          await new Promise((r) => setTimeout(r, 300));
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const valid = await verifyAdminPassword(password);
        if (!valid) {
          await new Promise((r) => setTimeout(r, 300));
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        createAdminSession(res);
        return res.status(200).json({ success: true });
      }
    }

    if (pathname === '/api/admin/logout' && method === 'POST') {
      destroyAdminSession(req, res);
      return res.status(200).json({ success: true });
    }

    // ── 7. ADMIN: Protected Routes ──────────────────────────────
    if (pathname.startsWith('/api/admin')) {
      if (!validateAdminSession(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Registrations List: GET /api/admin/registrations
      if (pathname === '/api/admin/registrations' && method === 'GET') {
        const statusFilter = (req.query.status as string) || 'all';
        const result = await callGAS('getRegistrations', { filter: statusFilter }, { admin: true });
        return res.status(200).json(result);
      }

      // Single Registration Detail: GET /api/admin/registration/:id
      if (pathname.startsWith('/api/admin/registration') && method === 'GET') {
        const pathParts = pathname.split('/');
        const idRaw = (pathParts.length > 4 ? pathParts[4] : null) || req.query.id || req.query.registrationId;
        const participantId = Array.isArray(idRaw) ? idRaw[0] : (idRaw as string | undefined);

        if (!participantId || participantId === 'undefined') {
          return res.status(400).json({ error: 'Participant ID is required' });
        }

        const result = (await callGAS('getRegistration', { id: participantId, participantId }, { admin: true })) as Record<string, unknown>;
        if (result.error) return res.status(404).json({ error: result.error });
        return res.status(200).json(result);
      }

      // Verify Payment: POST /api/admin/verify
      if (pathname === '/api/admin/verify' && method === 'POST') {
        const targetId = body.participant_id || body.participantId || body.id;
        if (!targetId) return res.status(400).json({ error: 'participant_id is required' });

        const result = await callGAS('verifyPayment', { participantId: targetId, id: targetId, adminId: 'ADMIN-01' }, { admin: true });
        return res.status(200).json(result);
      }

      // Reject Payment: POST /api/admin/reject
      if (pathname === '/api/admin/reject' && method === 'POST') {
        const targetId = body.participant_id || body.participantId || body.id;
        if (!targetId) return res.status(400).json({ error: 'participant_id is required' });

        const result = await callGAS('rejectPayment', { participantId: targetId, id: targetId, adminId: 'ADMIN-01' }, { admin: true });
        return res.status(200).json(result);
      }

      // Cancel Pass: POST /api/admin/cancel
      if (pathname === '/api/admin/cancel' && method === 'POST') {
        const targetId = body.participant_id || body.participantId || body.id;
        if (!targetId) return res.status(400).json({ error: 'participant_id is required' });

        const result = await callGAS('cancelPass', { participantId: targetId, id: targetId }, { admin: true });
        return res.status(200).json(result);
      }

      // Resend Pass Email: POST /api/admin/resend
      if (pathname === '/api/admin/resend' && method === 'POST') {
        const targetId = body.participant_id || body.participantId || body.id;
        if (!targetId) return res.status(400).json({ error: 'participant_id is required' });

        const result = await callGAS('resendPassEmail', { participantId: targetId, id: targetId }, { admin: true });
        return res.status(200).json(result);
      }

      // Attendance Analytics: GET /api/admin/checkins or GET /api/admin/summary
      if ((pathname === '/api/admin/checkins' || pathname === '/api/admin/summary') && method === 'GET') {
        const result = await callGAS('getCheckinSummary', {}, { admin: true });
        return res.status(200).json(result);
      }

      // Payment Screenshot Proxy: GET /api/admin/screenshot/:participantId
      if (pathname.startsWith('/api/admin/screenshot') && method === 'GET') {
        const pathParts = pathname.split('/');
        const idRaw = (pathParts.length > 4 ? pathParts[4] : null) || req.query.participantId || req.query.id;
        const participantId = Array.isArray(idRaw) ? idRaw[0] : (idRaw as string | undefined);

        if (!participantId || participantId === 'undefined') {
          return res.status(400).json({ error: 'Participant ID is required' });
        }

        const result = (await callGAS('getScreenshot', { participantId, id: participantId }, { admin: true })) as {
          success?: boolean;
          base64?: string;
          mimeType?: string;
          error?: string;
        };

        if (result.error || !result.base64) {
          return res.status(404).json({ error: result.error || 'Screenshot not found' });
        }

        const buffer = Buffer.from(result.base64, 'base64');
        const mimeType = result.mimeType || 'image/jpeg';

        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Length', buffer.length);
        res.setHeader('Cache-Control', 'private, no-store');
        return res.status(200).send(buffer);
      }
    }

    // ── 8. COORDINATOR: Auth Routes ─────────────────────────────
    if (pathname === '/api/coordinator/login' || pathname === '/api/coord/login') {
      if (method === 'GET') {
        const { valid, coordinator_id, name, assigned_event_id } = validateCoordinatorSession(req);
        return res.status(200).json({
          authenticated: valid,
          coordinator: valid ? { id: coordinator_id, name, assigned_event_id } : null,
        });
      }
      if (method === 'POST') {
        const { username, pin } = body as Record<string, string>;
        if (!username || !pin) return res.status(400).json({ error: 'Username and PIN are required' });

        const result = (await callGAS('coordLogin', { username, pin })) as {
          success?: boolean;
          error?: string;
          coordinator?: { id: string; name: string; assigned_event_id: string };
        };

        if (!result.success || !result.coordinator) {
          return res.status(401).json({ error: result.error || 'Invalid credentials' });
        }

        createCoordinatorSession(
          result.coordinator.id,
          result.coordinator.name,
          result.coordinator.assigned_event_id,
          res
        );

        return res.status(200).json(result);
      }
    }

    if (pathname === '/api/coordinator/logout' && method === 'POST') {
      destroyCoordinatorSession(req, res);
      return res.status(200).json({ success: true });
    }

    // ── 9. COORDINATOR: Protected Scan & Check-in ────────────────
    if (pathname.startsWith('/api/coordinator') || pathname === '/api/scan' || pathname === '/api/checkin') {
      const { valid, coordinator_id } = validateCoordinatorSession(req);
      if (!valid || !coordinator_id) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // QR Token Scan Validation: POST /api/coordinator/scan or POST /api/scan
      if ((pathname === '/api/coordinator/scan' || pathname === '/api/scan') && method === 'POST') {
        const { token, eventId } = body as Record<string, string>;
        if (!token || !eventId) return res.status(400).json({ error: 'token and eventId are required' });

        const result = await callGAS('scanToken', { token, eventId }, { coord: true });
        return res.status(200).json(result);
      }

      // Check-in Record Entry: POST /api/coordinator/checkin or POST /api/checkin
      if ((pathname === '/api/coordinator/checkin' || pathname === '/api/checkin') && method === 'POST') {
        const { participantId, eventId, id } = body as Record<string, string>;
        const targetId = participantId || id;
        if (!targetId || !eventId) return res.status(400).json({ error: 'participantId and eventId are required' });

        const result = await callGAS('recordCheckin', { participantId: targetId, id: targetId, eventId, coordinatorId: coordinator_id }, { coord: true });
        return res.status(200).json(result);
      }
    }

    // Default 404 for unknown /api/* routes
    return res.status(404).json({ error: `API route ${pathname} not found` });
  } catch (err) {
    if (err instanceof GasError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(`[API Handler Error] Route ${pathname}:`, err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
