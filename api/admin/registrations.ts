// ============================================================
// GET /api/admin/registrations
// Returns list of all participants (admin only)
// ============================================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireAdmin } from '../_lib/auth';
import { callGAS, GasError } from '../_lib/gas';

async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { status } = req.query as { status?: string };

  try {
    const result = await callGAS('getRegistrations', { filter: status || 'all' }, { admin: true });
    return res.status(200).json(result);
  } catch (err) {
    if (err instanceof GasError) return res.status(err.statusCode).json({ error: err.message });
    console.error('[Registrations] Error:', err);
    return res.status(500).json({ error: 'Failed to fetch registrations' });
  }
}

export default requireAdmin(handler);
