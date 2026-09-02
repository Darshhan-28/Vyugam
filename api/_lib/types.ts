// ============================================================
// VYUGAM 2.0 — Shared TypeScript Types
// ============================================================

export type PaymentStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type PassStatus = 'PENDING' | 'ACTIVE' | 'CANCELLED';

export interface Participant {
  id: string;
  pass_id: string | null;
  secure_pass_token: string | null;
  name: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  year: string;
  payment_screenshot_url: string | null;
  utr: string | null;
  payment_status: PaymentStatus;
  pass_status: PassStatus;
  created_at: string;
  verified_at: string | null;
  verified_by: string | null;
  pass_created_at: string | null;
}

export interface EventEntry {
  id: string;
  participant_id: string;
  event_id: string;
  coordinator_id: string;
  scanned_at: string;
  status: 'CHECKED_IN';
}

export interface Coordinator {
  id: string;
  name: string;
  username: string;
  password_hash: string;
  assigned_event_id: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
}

export interface AdminSession {
  type: 'admin';
  username: string;
  created_at: string;
}

export interface CoordSession {
  type: 'coordinator';
  coordinator_id: string;
  created_at: string;
}

// Public-safe participant view (for pass page)
export interface PublicPassData {
  name: string;
  college: string;
  department: string;
  year: string;
  pass_id: string;
  pass_status: PassStatus;
  qr_data_url: string;
  event_date: string;
}

// Coordinator scan result
export interface ScanResult {
  status: 'VALID' | 'ALREADY_CHECKED_IN' | 'PASS_NOT_ACTIVE' | 'PAYMENT_PENDING' | 'PASS_CANCELLED' | 'INVALID_TOKEN';
  participant?: {
    name: string;
    college: string;
    department: string;
    year: string;
    pass_id: string;
  };
  event?: string;
  checked_in_at?: string;
  message?: string;
}

// Known events
export const EVENTS: Record<string, string> = {
  'code-crusade': 'Code Crusade',
  'logic-arena': 'Logic Arena',
  'ui-ux-studio': 'UI/UX Studio',
  'tech-tactics': 'Tech Tactics',
  'pixel-pulse': 'Pixel Pulse',
};
