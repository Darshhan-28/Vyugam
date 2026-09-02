// ============================================================
// POST /api/admin/cancel
// Cancel an active pass
// ============================================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireAdmin } from '../_lib/auth';
import { callGAS, GasError } from '../_lib/gas';

async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { participant_id, participantId, id } = req.body as {
    participant_id?: string;
    participantId?: string;
    id?: string;
  };
  const targetId = participant_id || participantId || id;

  if (!targetId) return res.status(400).json({ error: 'participant_id is required' });

  try {
    const result = await callGAS(
      'cancelPass',
      { participantId: targetId, id: targetId },
      { admin: true }
    );
    return res.status(200).json(result);
  } catch (err) {
    if (err instanceof GasError) return res.status(err.statusCode).json({ error: err.message });
    console.error('[Cancel] Error:', err);
    return res.status(500).json({ error: 'Action failed. Please try again.' });
  }
}

export default requireAdmin(handler);
