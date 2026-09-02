// ============================================================
// POST /api/coordinator/login   — log in with username + PIN
// GET  /api/coordinator/login   — check session status
// ============================================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callGAS, GasError } from '../_lib/gas';
import {
  createCoordinatorSession,
  validateCoordinatorSession,
} from '../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Session check (GET)
  if (req.method === 'GET') {
    const { valid, coordinator_id, name, assigned_event_id } = validateCoordinatorSession(req);
    if (!valid || !coordinator_id) {
      return res.status(401).json({ authenticated: false });
    }
    return res.status(200).json({
      authenticated: true,
      coordinator: {
        id: coordinator_id,
        name: name || coordinator_id,
        assigned_event_id: assigned_event_id || 'code-crusade',
      },
    });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, pin } = req.body as { username: string; pin: string };

  if (!username || !pin) {
    return res.status(400).json({ error: 'Coordinator ID and PIN are required' });
  }

  try {
    const result = await callGAS('coordLogin', { username, pin }) as {
      success?: boolean;
      error?: string;
      coordinator?: { id: string; name: string; assigned_event_id: string };
    };

    if (!result.success || !result.coordinator) {
      await new Promise((r) => setTimeout(r, 300)); // timing-safe delay
      return res.status(401).json({ error: result.error || 'Invalid credentials' });
    }

    const { id, name, assigned_event_id } = result.coordinator;
    createCoordinatorSession(id, name, assigned_event_id, res);

    return res.status(200).json({
      success: true,
      coordinator: { id, name, assigned_event_id },
    });
  } catch (err) {
    if (err instanceof GasError) return res.status(err.statusCode).json({ error: err.message });
    console.error('[CoordLogin] Error:', err);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
}
