// ============================================================
// POST /api/register
// Handles new participant registration.
// Saves to Google Sheets via Apps Script. Uploads screenshot to Drive.
// ============================================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callGAS, GasError } from './_lib/gas';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      name,
      email,
      phone,
      college,
      department,
      year,
      utr,
      screenshotBase64,
      screenshotType,
    } = req.body as {
      name: string;
      email: string;
      phone: string;
      college: string;
      department: string;
      year: string;
      utr?: string;
      screenshotBase64?: string;
      screenshotType?: string;
    };

    // ── Validation ───────────────────────────────────────────
    if (!name?.trim()) return res.status(400).json({ error: 'Name is required' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email?.trim() ?? ''))
      return res.status(400).json({ error: 'Valid email is required' });
    if (!/^[0-9]{10}$/.test(phone?.trim() ?? ''))
      return res.status(400).json({ error: 'Valid 10-digit phone number is required' });
    if (!college?.trim()) return res.status(400).json({ error: 'College is required' });
    if (!department?.trim()) return res.status(400).json({ error: 'Department is required' });
    if (!year?.trim()) return res.status(400).json({ error: 'Year is required' });

    // ── Duplicate check ──────────────────────────────────────
    const checkResult = await callGAS('checkEmailExists', { email: email.trim().toLowerCase() }) as { exists: boolean };
    if (checkResult.exists) {
      return res.status(409).json({
        error: 'This email is already registered. If you believe this is an error, contact the VYUGAM team.',
      });
    }

    // ── Create participant ───────────────────────────────────
    const regResult = await callGAS('registerParticipant', {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      college: college.trim(),
      department: department.trim(),
      year: year.trim(),
      utr: utr?.trim() || '',
    }) as { success: boolean; participantId: string; error?: string };

    if (!regResult.success || !regResult.participantId) {
      return res.status(500).json({ error: regResult.error || 'Registration failed. Please try again.' });
    }

    // ── Screenshot upload (non-blocking) ────────────────────
    if (screenshotBase64) {
      // Validate size: base64 length * 0.75 ≈ byte size
      const approxBytes = Math.ceil(screenshotBase64.length * 0.75);
      if (approxBytes > 3 * 1024 * 1024) {
        // Don't fail the registration — just skip the upload
        console.warn('[Register] Screenshot too large, skipping upload');
      } else {
        callGAS('uploadScreenshot', {
          participantId: regResult.participantId,
          base64: screenshotBase64,
          mimeType: screenshotType || 'image/jpeg',
        }).catch((err) => console.error('[Register] Screenshot upload error:', err));
      }
    }

    return res.status(201).json({
      success: true,
      participant_id: regResult.participantId,
      message: 'Registration submitted. Payment pending verification.',
    });
  } catch (err) {
    if (err instanceof GasError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error('[Register] Error:', err);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
}
