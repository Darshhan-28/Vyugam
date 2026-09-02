// ============================================================
// POST /api/coordinator/checkin
// Records a confirmed event check-in (after coordinator confirms).
// Coordinator JWT is validated by requireCoordinator middleware.
// GAS enforces GAS_COORD_SECRET so unauthenticated direct calls are rejected.
// GAS also enforces duplicate-prevention with a script lock.
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

async function handler(req: VercelRequest, res: VercelResponse, coordinatorId: string) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { participant_id, event_id } = req.body as {
    participant_id: string;
    event_id: string;
  };

  if (!participant_id || !event_id) {
    return res.status(400).json({ error: 'participant_id and event_id are required' });
  }
  if (!(event_id in EVENTS)) {
    return res.status(400).json({ error: 'Invalid event_id' });
  }

  try {
    // { coord: true } injects GAS_COORD_SECRET — GAS rejects calls without it
    const result = await callGAS(
      'recordCheckin',
      { participantId: participant_id, eventId: event_id, coordinatorId },
      { coord: true }
    ) as { success?: boolean; error?: string; status?: string; event?: string; [key: string]: unknown };

    if (result.status === 'ALREADY_CHECKED_IN') {
      return res.status(409).json(result);
    }
    if (result.error) {
      return res.status(400).json(result);
    }
    return res.status(201).json(result);
  } catch (err) {
    if (err instanceof GasError) return res.status(err.statusCode).json({ error: err.message });
    console.error('[Checkin] Error:', err);
    return res.status(503).json({ error: 'Check-in failed. Please retry.' });
  }
}

export default requireCoordinator(handler);
