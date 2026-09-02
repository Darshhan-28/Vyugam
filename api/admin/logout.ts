// ============================================================
// POST /api/admin/logout
// ============================================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { destroyAdminSession } from '../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  destroyAdminSession(req, res);
  return res.status(200).json({ success: true });
}
