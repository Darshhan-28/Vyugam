// ============================================================
// VYUGAM 2.0 — Authentication & Session Utilities
// Stateless JWT-based sessions (replaces Upstash Redis sessions)
// ============================================================

import jwt from 'jsonwebtoken';
import { compare, hash } from 'bcryptjs';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const ADMIN_SESSION_TTL_S = 86400;   // 24 hours
const COORD_SESSION_TTL_S = 43200;   // 12 hours

function getAdminSecret(): string {
  return process.env.ADMIN_JWT_SECRET || 'vyugam-admin-dev-secret-change-in-prod';
}

function getCoordSecret(): string {
  return process.env.COORDINATOR_JWT_SECRET || 'vyugam-coord-dev-secret-change-in-prod';
}

// ── Cookie helpers ────────────────────────────────────────────

export function extractCookie(req: VercelRequest, name: string): string | null {
  const cookieHeader = req.headers.cookie || '';
  for (const cookie of cookieHeader.split(';')) {
    const eqIdx = cookie.indexOf('=');
    if (eqIdx === -1) continue;
    const key = cookie.slice(0, eqIdx).trim();
    const value = cookie.slice(eqIdx + 1).trim();
    if (key === name) return value || null;
  }
  return null;
}

function buildCookieHeader(name: string, value: string, maxAge: number): string {
  return `${name}=${value}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}`;
}

function clearCookieHeader(name: string): string {
  return `${name}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`;
}

// ── Admin Authentication ──────────────────────────────────────

export function createAdminSession(res: VercelResponse): void {
  const token = jwt.sign(
    { type: 'admin', username: process.env.ADMIN_USERNAME || 'admin' },
    getAdminSecret(),
    { expiresIn: ADMIN_SESSION_TTL_S }
  );
  res.setHeader('Set-Cookie', buildCookieHeader('vyugam_admin', token, ADMIN_SESSION_TTL_S));
}

export function validateAdminSession(req: VercelRequest): boolean {
  const token = extractCookie(req, 'vyugam_admin');
  if (!token) return false;
  try {
    const payload = jwt.verify(token, getAdminSecret()) as { type?: string };
    return payload?.type === 'admin';
  } catch {
    return false;
  }
}

export function destroyAdminSession(_req: VercelRequest, res: VercelResponse): void {
  res.setHeader('Set-Cookie', clearCookieHeader('vyugam_admin'));
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const storedHash = process.env.ADMIN_PASSWORD_HASH;
  if (storedHash) return compare(password, storedHash);
  const plain = process.env.ADMIN_PASSWORD;
  if (plain) return password === plain;
  return false;
}

export async function hashPassword(pwd: string): Promise<string> {
  return hash(pwd, 12);
}

// ── Coordinator Authentication ────────────────────────────────

export function createCoordinatorSession(
  coordinatorId: string,
  coordinatorName: string,
  assignedEventId: string,
  res: VercelResponse
): void {
  const token = jwt.sign(
    { type: 'coordinator', coordinator_id: coordinatorId, name: coordinatorName, assigned_event_id: assignedEventId },
    getCoordSecret(),
    { expiresIn: COORD_SESSION_TTL_S }
  );
  res.setHeader('Set-Cookie', buildCookieHeader('vyugam_coord', token, COORD_SESSION_TTL_S));
}

export function validateCoordinatorSession(
  req: VercelRequest
): { valid: boolean; coordinator_id: string | null; name: string | null; assigned_event_id: string | null } {
  const token = extractCookie(req, 'vyugam_coord');
  if (!token) return { valid: false, coordinator_id: null, name: null, assigned_event_id: null };
  try {
    const payload = jwt.verify(token, getCoordSecret()) as {
      type?: string;
      coordinator_id?: string;
      name?: string;
      assigned_event_id?: string;
    };
    if (payload?.type !== 'coordinator' || !payload.coordinator_id) {
      return { valid: false, coordinator_id: null, name: null, assigned_event_id: null };
    }
    return {
      valid: true,
      coordinator_id: payload.coordinator_id,
      name: payload.name || null,
      assigned_event_id: payload.assigned_event_id || null,
    };
  } catch {
    return { valid: false, coordinator_id: null, name: null, assigned_event_id: null };
  }
}

export function destroyCoordinatorSession(_req: VercelRequest, res: VercelResponse): void {
  res.setHeader('Set-Cookie', clearCookieHeader('vyugam_coord'));
}

// ── Auth middleware wrappers ──────────────────────────────────

export function requireAdmin(
  handler: (req: VercelRequest, res: VercelResponse) => Promise<void>
) {
  return async (req: VercelRequest, res: VercelResponse) => {
    if (!validateAdminSession(req)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    return handler(req, res);
  };
}

export function requireCoordinator(
  handler: (req: VercelRequest, res: VercelResponse, coordinatorId: string) => Promise<void>
) {
  return async (req: VercelRequest, res: VercelResponse) => {
    const { valid, coordinator_id } = validateCoordinatorSession(req);
    if (!valid || !coordinator_id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    return handler(req, res, coordinator_id);
  };
}
