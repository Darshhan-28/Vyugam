// ============================================================
// POST /api/coordinator/scan
// Validates a QR token and returns participant info.
// Called BEFORE confirming entry — validates only, does not record.
// Coordinator JWT is validated by requireCoordinator middleware.
// GAS enforces GAS_COORD_SECRET so unauthenticated direct calls are rejected.
// ============================================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireCoordinator } from '../_lib/auth';
import { callGAS, GasError } from '../_lib/gas';

const EVENTS: Record<string, string> = {
  'code-crusade': 'Code Crusade',
  'logic-arena': 'Logic Arena',
  'ui-ux-studio': 'UI/UX Studio',
  'tech-tactics': 'Tech Tactics',
  'pixel-pulse': 'Pixel Pulse',
};

async function handler(req: VercelRequest, res: VercelResponse, _coordinatorId: string) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { token, event_id } = req.body as { token: string; event_id: string };

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'token is required' });
  }
  if (!event_id || !(event_id in EVENTS)) {
    return res.status(400).json({ error: 'Valid event_id is required' });
  }

  try {
    // { coord: true } injects GAS_COORD_SECRET into the payload
    const result = await callGAS('scanToken', { token, eventId: event_id }, { coord: true });
    return res.status(200).json(result);
  } catch (err) {
    if (err instanceof GasError) return res.status(err.statusCode).json({ error: err.message });
    console.error('[Scan] Error:', err);
    return res.status(503).json({ error: 'Scanner temporarily unavailable. Please retry.' });
  }
}

export default requireCoordinator(handler);
