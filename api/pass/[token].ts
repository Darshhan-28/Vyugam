// ============================================================
// GET /api/pass/[token]
// Returns public pass data for the participant pass page.
// QR code is generated server-side here (keeps qrcode library in Vercel).
// ============================================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import QRCode from 'qrcode';
import { callGAS, GasError } from '../_lib/gas';

const BASE_URL = process.env.BASE_URL || 'https://vyugam.vercel.app';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.query as { token: string };
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Invalid token' });
  }

  try {
    const data = await callGAS('getPassByToken', { token }) as {
      status: string;
      participantId?: string;
      name?: string;
      college?: string;
      department?: string;
      year?: string;
      pass_id?: string;
      secure_pass_token?: string;
      event_date?: string;
      error?: string;
    };

    if (!data || data.status === 'INVALID_TOKEN') {
      return res.status(404).json({ status: 'INVALID_TOKEN', error: 'Pass not found' });
    }

    if (data.status === 'CANCELLED') {
      return res.status(200).json({ status: 'CANCELLED', pass_id: data.pass_id || null });
    }

    if (data.status === 'PENDING') {
      return res.status(200).json({ status: 'PENDING', pass_id: null });
    }

    // Active pass — generate QR code here in Vercel (avoids UrlFetch quota in GAS)
    const passUrl = `${BASE_URL}/v/${data.secure_pass_token}`;
    const qrDataUrl = await QRCode.toDataURL(passUrl, {
      width: 320,
      margin: 2,
      color: { dark: '#050505', light: '#FFFFFF' },
      errorCorrectionLevel: 'M',
    });

    return res.status(200).json({
      status: 'ACTIVE',
      name: data.name,
      college: data.college,
      department: data.department,
      year: data.year,
      pass_id: data.pass_id,
      qr_data_url: qrDataUrl,
      event_date: data.event_date || '24 September 2026',
    });
  } catch (err) {
    if (err instanceof GasError) return res.status(err.statusCode).json({ error: err.message });
    console.error('[Pass] Error:', err);
    return res.status(500).json({ error: 'Failed to load pass' });
  }
}
