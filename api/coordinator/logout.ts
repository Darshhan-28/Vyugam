// ============================================================
// POST /api/coordinator/logout
// ============================================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { destroyCoordinatorSession } from '../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  destroyCoordinatorSession(req, res);
  return res.status(200).json({ success: true });
}
