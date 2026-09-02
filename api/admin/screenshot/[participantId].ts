// ============================================================
// GET /api/admin/screenshot/[participantId]
// Securely proxies a payment screenshot from Google Drive.
// The file stays PRIVATE in Drive — this endpoint fetches it
// via GAS (as the Drive owner), decodes base64, and streams
// it to the admin browser as a binary image response.
// Admin JWT is required; the Drive file is NEVER made public.
// ============================================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { validateAdminSession } from '../../_lib/auth';
import { callGAS, GasError } from '../../_lib/gas';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  // Enforce admin session
  if (!validateAdminSession(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const idRaw = req.query.participantId || req.query.id || (req.query as Record<string, unknown>)['participantId'];
  const participantId = Array.isArray(idRaw) ? idRaw[0] : (idRaw as string | undefined);

  if (!participantId || participantId === 'undefined') {
    return res.status(400).json({ error: 'Participant ID is required' });
  }

  try {
    const result = await callGAS(
      'getScreenshot',
      { participantId, id: participantId },
      { admin: true }
    ) as {
      success?: boolean;
      base64?: string;
      mimeType?: string;
      error?: string;
    };

    if (result.error || !result.base64) {
      return res.status(404).json({ error: result.error || 'Screenshot not found' });
    }

    // Decode base64 → binary buffer and stream as image
    const buffer = Buffer.from(result.base64, 'base64');
    const mimeType = result.mimeType || 'image/jpeg';

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Cache-Control', 'private, no-store');
    res.status(200).send(buffer);
  } catch (err) {
    if (err instanceof GasError) return res.status(err.statusCode).json({ error: err.message });
    console.error('[Screenshot Proxy] Error:', err);
    return res.status(500).json({ error: 'Failed to fetch screenshot.' });
  }
}
