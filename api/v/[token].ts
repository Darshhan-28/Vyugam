// ============================================================
// GET /api/v/[token]
// Short URL redirect — QR codes point here → redirect to /pass/:token
// ============================================================

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { token } = req.query as { token: string };
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Invalid token' });
  }
  // Permanent-ish redirect (307 allows re-checking in case of pass revocation)
  return res.redirect(307, `/pass/${token}`);
}
