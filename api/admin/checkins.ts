// ============================================================
// GET /api/admin/checkins
// Returns attendance summary for the admin dashboard
// ============================================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireAdmin } from '../_lib/auth';
import { callGAS, GasError } from '../_lib/gas';

async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const result = await callGAS('getCheckinSummary', {}, { admin: true });
    return res.status(200).json(result);
  } catch (err) {
    if (err instanceof GasError) return res.status(err.statusCode).json({ error: err.message });
    console.error('[Checkins] Error:', err);
    return res.status(500).json({ error: 'Failed to fetch attendance data.' });
  }
}

export default requireAdmin(handler);
