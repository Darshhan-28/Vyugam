// ============================================================
// GET /api/admin/registration/[id]
// Returns full detail for a single participant (admin only)
// Includes screenshot URL and check-in history
// ============================================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireAdmin } from '../../_lib/auth';
import { callGAS, GasError } from '../../_lib/gas';

async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  // Extract ID safely from query params
  const idRaw = req.query.id || req.query.registrationId || (req.query as Record<string, unknown>)['id'];
  const participantId = Array.isArray(idRaw) ? idRaw[0] : (idRaw as string | undefined);

  if (!participantId || participantId === 'undefined') {
    return res.status(400).json({ error: 'Participant ID is required' });
  }

  try {
    const result = await callGAS(
      'getRegistration',
      { id: participantId, participantId },
      { admin: true }
    ) as Record<string, unknown>;

    if (result.error) {
      return res.status(404).json({ error: result.error });
    }
    return res.status(200).json(result);
  } catch (err) {
    if (err instanceof GasError) return res.status(err.statusCode).json({ error: err.message });
    console.error('[Registration Detail] Error:', err);
    return res.status(500).json({ error: 'Failed to fetch participant.' });
  }
}

export default requireAdmin(handler);
