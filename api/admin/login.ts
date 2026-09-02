// ============================================================
// POST /api/admin/login   — log in
// GET  /api/admin/login   — check session
// ============================================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  verifyAdminPassword,
  createAdminSession,
  validateAdminSession,
} from '../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Session check (GET)
  if (req.method === 'GET') {
    const valid = validateAdminSession(req);
    return valid
      ? res.status(200).json({ authenticated: true })
      : res.status(401).json({ authenticated: false });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, password } = req.body as { username: string; password: string };

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
  if (username !== expectedUsername) {
    await new Promise((r) => setTimeout(r, 300)); // timing-safe delay
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
