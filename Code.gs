/**
 * VYUGAM 2.0 — Google Apps Script Backend
 * ============================================================
 * Single file backend replacing Upstash Redis, Vercel Blob, and Resend.
 *
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet (create one if needed with 6 tabs:
 *    Dashboard, Participants, Payments, Events, Check-ins, Coordinators)
 * 2. Go to Extensions → Apps Script.
 * 3. Paste this entire file into Code.gs, replacing existing content.
 * 4. Fill in the CONFIG section below with your actual values.
 * 5. Run setupSheet() once (Run → Run function → setupSheet) to initialize headers.
 * 6. Click "Deploy" → "New deployment" → Type: "Web app"
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 7. Copy the Web App URL → paste as GAS_WEB_APP_URL in Vercel env vars.
 * 8. Set GAS_ADMIN_SECRET in Vercel to the same value as ADMIN_SECRET below.
 */

// ── CONFIG ───────────────────────────────────────────────────

const CONFIG = {
  // The Google Drive folder ID where payment screenshots are stored.
  DRIVE_FOLDER_ID: '1nrN9jtzfdMY-I0Rv9IeItizkg0rpzu4K',

  // Secret shared with Vercel — must match GAS_ADMIN_SECRET in .env
  ADMIN_SECRET: 'Sakho115',

  // Email from name shown in Gmail confirmation emails
  EMAIL_FROM_NAME: 'VYUGAM 2.0',

  // Your deployed Vercel site URL (no trailing slash)
  BASE_URL: 'https://vyugam2k2620.vercel.app',

  // A shared secret that coordinator sessions must present to call check-in APIs.
  COORD_SECRET: 'Vyugam2k26',

  // Sheet tab names
  SHEET: {
    PARTICIPANTS: 'Participants',
    PAYMENTS: 'Payments',
    EVENTS: 'Events',
    CHECKINS: 'Check-ins',
    COORDINATORS: 'Coordinators',
    DASHBOARD: 'Dashboard',
  },

  // Known events
  EVENTS: {
    'code-crusade': 'Code Crusade',
    'logic-arena': 'Logic Arena',
    'ui-ux-studio': 'UI/UX Studio',
    'tech-tactics': 'Tech Tactics',
    'pixel-pulse': 'Pixel Pulse',
  },
};

// ── MAIN ROUTER ───────────────────────────────────────────────

function handleRequest(params) {
  try {
    if (!params) params = {};
    const action = params.action;
    const adminSecret = params.adminSecret || params.secret;
    const coordSecret = params.coordSecret || params.secret;

    if (!action) {
      return jsonResponse({ status: 'active', event: 'VYUGAM 2.0 Backend API' });
    }

    switch (action) {
      // ── Public ──
      case 'checkEmailExists':
        return jsonResponse(checkEmailExists(params.email));

      case 'registerParticipant':
        return jsonResponse(registerParticipant(params));

      case 'uploadScreenshot':
        return jsonResponse(uploadScreenshot(params.participantId || params.id, params.base64, params.mimeType));

      case 'getPassByToken':
        return jsonResponse(getPassByToken(params.token));

      // ── Admin (require adminSecret) ──
      case 'getRegistrations':
        requireAdmin(adminSecret);
        return jsonResponse(getRegistrations(params.filter));

      case 'getRegistration':
        requireAdmin(adminSecret);
        return jsonResponse(getRegistration(params.id || params.participantId));

      case 'verifyPayment':
        requireAdmin(adminSecret);
        return jsonResponse(verifyPayment(params.participantId || params.id, params.adminId));

      case 'rejectPayment':
        requireAdmin(adminSecret);
        return jsonResponse(rejectPayment(params.participantId || params.id, params.adminId));

      case 'cancelPass':
        requireAdmin(adminSecret);
        return jsonResponse(cancelPass(params.participantId || params.id));

      case 'resendPassEmail':
        requireAdmin(adminSecret);
        return jsonResponse(resendPassEmail(params.participantId || params.id));

      case 'getCheckinSummary':
        requireAdmin(adminSecret);
        return jsonResponse(getCheckinSummary());

      // ── Coordinator ──
      case 'coordLogin':
        return jsonResponse(coordLogin(params.username, params.pin));

      case 'scanToken':
        requireCoord(coordSecret);
        return jsonResponse(scanToken(params.token, params.eventId));

      case 'recordCheckin':
        requireCoord(coordSecret);
        return jsonResponse(recordCheckin(params.participantId || params.id, params.eventId, params.coordinatorId));

      case 'getScreenshot':
        requireAdmin(adminSecret);
        return jsonResponse(getScreenshot(params.participantId || params.id));

      // ── Health ──
      case 'healthCheck':
        return jsonResponse({ status: 'ok', event: 'VYUGAM 2.0 Backend' });

      default:
        return jsonResponse({ error: 'Unknown action' }, 400);
    }
  } catch (err) {
    if (err.message === 'UNAUTHORIZED') {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }
    console.error('[handleRequest Error] ' + err.toString());
    return jsonResponse({ error: err.message || 'Internal error' }, 500);
  }
}

function doGet(e) {
  const params = (e && e.parameter) ? e.parameter : {};
  return handleRequest(params);
}

function doPost(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return jsonResponse({ error: 'Missing request payload' }, 400);
  }

  let payload;
  try {
    payload = JSON.parse(e.postData.contents);
  } catch (parseErr) {
    return jsonResponse({ error: 'Invalid JSON payload' }, 400);
  }

  return handleRequest(payload);
}

// ── HELPERS ───────────────────────────────────────────────────

function jsonResponse(data, statusCode) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

function requireAdmin(secret) {
  if (!secret || secret !== CONFIG.ADMIN_SECRET) {
    throw new Error('UNAUTHORIZED');
  }
}

function requireCoord(secret) {
  if (!secret) throw new Error('UNAUTHORIZED');
  if (CONFIG.COORD_SECRET === 'REPLACE_WITH_YOUR_COORD_SECRET' || !CONFIG.COORD_SECRET) {
    if (secret.toLowerCase() === 'vyugam2k26') return;
  }
  if (secret !== CONFIG.COORD_SECRET && secret.toLowerCase() !== CONFIG.COORD_SECRET.toLowerCase()) {
    throw new Error('UNAUTHORIZED');
  }
}

function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(name);
  if (!sheet) throw new Error('Sheet not found: ' + name);
  return sheet;
}

function generateId(length) {
  length = length || 32;
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generatePassId() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  // Use a named range 'PassCounter' (cell in Dashboard) to track the counter
  let counter = 1;
  try {
    const range = ss.getRangeByName('PassCounter');
    if (range) {
      counter = (range.getValue() || 0) + 1;
      range.setValue(counter);
    } else {
      // Fallback: count verified participants
      const sheet = getSheet(CONFIG.SHEET.PARTICIPANTS);
      const data = sheet.getDataRange().getValues();
      counter = data.slice(1).filter(function(r) { return r[11] === 'VERIFIED'; }).length + 1;
    }
  } catch (e) {
    counter = Math.floor(Math.random() * 99999) + 1;
  }
  return 'VYG26-' + String(counter).padStart(5, '0');
}

function nowISO() {
  return new Date().toISOString();
}

// ── PARTICIPANT SHEET COLUMN INDICES (0-based) ──
// A=0  B=1  C=2  D=3  E=4  F=5  G=6  H=7  I=8  J=9  K=10 L=11 M=12 N=13 O=14 P=15 Q=16
const P_COL = {
  ROW_ID: 0,       // A
  ID: 1,           // B — participant ID
  PASS_ID: 2,      // C
  TOKEN: 3,        // D — secure_pass_token
  NAME: 4,         // E
  EMAIL: 5,        // F
  PHONE: 6,        // G
  COLLEGE: 7,      // H
  DEPT: 8,         // I
  YEAR: 9,         // J
  UTR: 10,         // K
  PAY_STATUS: 11,  // L
  PASS_STATUS: 12, // M
  CREATED_AT: 13,  // N
  VERIFIED_AT: 14, // O
  VERIFIED_BY: 15, // P
  PASS_CREATED: 16 // Q
};

// ── PAYMENTS SHEET COLUMN INDICES (0-based) ──
const PM_COL = {
  PARTICIPANT_ID: 0, // A
  FILE_ID: 1,        // B
  VIEW_LINK: 2,      // C
  UPLOADED_AT: 3,    // D
};

// ── COORDINATORS SHEET COLUMN INDICES (0-based) ──
const CR_COL = {
  ID: 0,       // A
  NAME: 1,     // B
  USERNAME: 2, // C
  PIN: 3,      // D
  EVENT_ID: 4, // E
  STATUS: 5,   // F
};

// ── CHECK-INS SHEET COLUMN INDICES (0-based) ──
const CI_COL = {
  ID: 0,           // A
  PART_ID: 1,      // B
  PART_NAME: 2,    // C
  PASS_ID: 3,      // D
  COLLEGE: 4,      // E
  EVENT_ID: 5,     // F
  EVENT_NAME: 6,   // G
  COORD_ID: 7,     // H
  COORD_NAME: 8,   // I
  SCANNED_AT: 9,   // J
  STATUS: 10,      // K
};

function checkEmailExists(email) {
  if (!email) return { exists: false };
  const sheet = getSheet(CONFIG.SHEET.PARTICIPANTS);
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return { exists: false };
  const emails = sheet.getRange(2, P_COL.EMAIL + 1, lastRow - 1, 1).getValues();
  const normalized = email.toLowerCase().trim();
  for (let i = 0; i < emails.length; i++) {
    if (String(emails[i][0]).toLowerCase().trim() === normalized) {
      return { exists: true };
    }
  }
  return { exists: false };
}

function registerParticipant(data) {
  const lock = LockService.getScriptLock();
  let hasLock = false;

  try {
    hasLock = lock.tryLock(10000);
    if (!hasLock) {
      return { error: 'Server busy, please retry' };
    }

    const sheet = getSheet(CONFIG.SHEET.PARTICIPANTS);
    const id = generateId(32);
    const now = nowISO();
    const lastRow = sheet.getLastRow();
    const rowId = lastRow; // 1-based row number of data (header is row 1, first data is row 2)

    sheet.appendRow([
      rowId,                // A — row id
      id,                   // B — participant ID
      '',                   // C — pass ID (empty until verified)
      '',                   // D — secure pass token (empty until verified)
      data.name || '',      // E
      (data.email || '').toLowerCase().trim(), // F
      data.phone || '',     // G
      data.college || '',   // H
      data.department || '', // I
      data.year || '',      // J
      data.utr || '',       // K
      'PENDING',            // L — payment status
      'PENDING',            // M — pass status
      now,                  // N — created at
      '',                   // O — verified at
      '',                   // P — verified by
      '',                   // Q — pass created at
    ]);
    SpreadsheetApp.flush();

    return { success: true, participantId: id };
  } finally {
    if (hasLock) {
      try {
        lock.releaseLock();
      } catch (e) {}
    }
  }
}

function uploadScreenshot(participantId, base64, mimeType) {
  if (!participantId || !base64) return { success: false, error: 'Missing data' };

  try {
    const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
    const bytes = Utilities.base64Decode(base64);
    const blob = Utilities.newBlob(bytes, mimeType || 'image/jpeg',
      'payment_' + participantId + '.' + (mimeType ? mimeType.split('/')[1] : 'jpg'));

    const file = folder.createFile(blob);
    // Restrict access — only accessible to the sheet owner
    file.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);

    const fileId = file.getId();
    const viewLink = 'https://drive.google.com/file/d/' + fileId + '/view';

    // Save to Payments sheet
    const paySheet = getSheet(CONFIG.SHEET.PAYMENTS);
    paySheet.appendRow([
      participantId,   // A
      fileId,          // B
      viewLink,        // C
      nowISO(),        // D
    ]);

    return { success: true, fileId: fileId };
  } catch (err) {
    Logger.log('[uploadScreenshot Error] ' + err.toString());
    return { success: false, error: err.message };
  }
}

// ── PASS LOOKUP ───────────────────────────────────────────────

function getPassByToken(token) {
  if (!token) return { status: 'INVALID_TOKEN' };

  const sheet = getSheet(CONFIG.SHEET.PARTICIPANTS);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[P_COL.TOKEN] === token) {
      const passStatus = row[P_COL.PASS_STATUS];
      const payStatus = row[P_COL.PAY_STATUS];

      if (passStatus === 'CANCELLED') {
        return { status: 'CANCELLED', pass_id: row[P_COL.PASS_ID] || null };
      }
      if (payStatus !== 'VERIFIED' || passStatus !== 'ACTIVE') {
        return { status: 'PENDING', pass_id: null };
      }

      return {
        status: 'ACTIVE',
        participantId: row[P_COL.ID],
        name: row[P_COL.NAME],
        college: row[P_COL.COLLEGE],
        department: row[P_COL.DEPT],
        year: row[P_COL.YEAR],
        pass_id: row[P_COL.PASS_ID],
        secure_pass_token: row[P_COL.TOKEN],
        event_date: '24 September 2026',
      };
    }
  }

  return { status: 'INVALID_TOKEN' };
}

// ── ADMIN — REGISTRATIONS ─────────────────────────────────────

function getRegistrations(filter) {
  const partSheet = getSheet(CONFIG.SHEET.PARTICIPANTS);
  const paySheet = getSheet(CONFIG.SHEET.PAYMENTS);

  const participants = partSheet.getDataRange().getValues().slice(1);
  const payments = paySheet.getDataRange().getValues().slice(1);

  // Build payment lookup: participantId -> fileId
  const paymentMap = {};
  for (let i = 0; i < payments.length; i++) {
    paymentMap[payments[i][PM_COL.PARTICIPANT_ID]] = payments[i][PM_COL.FILE_ID];
  }

  const list = participants.map(function(row) {
    return {
      id: row[P_COL.ID],
      pass_id: row[P_COL.PASS_ID] || null,
      name: row[P_COL.NAME],
      email: row[P_COL.EMAIL],
      phone: row[P_COL.PHONE],
      college: row[P_COL.COLLEGE],
      department: row[P_COL.DEPT],
      year: row[P_COL.YEAR],
      utr: row[P_COL.UTR] || null,
      payment_status: row[P_COL.PAY_STATUS],
      pass_status: row[P_COL.PASS_STATUS],
      created_at: row[P_COL.CREATED_AT] ? new Date(row[P_COL.CREATED_AT]).toISOString() : '',
      verified_at: row[P_COL.VERIFIED_AT] ? new Date(row[P_COL.VERIFIED_AT]).toISOString() : null,
      verified_by: row[P_COL.VERIFIED_BY] || null,
      has_screenshot: !!paymentMap[row[P_COL.ID]],
    };
  }).filter(function(p) { return p.id; }); // skip blank rows

  // Apply filter
  const filtered = !filter || filter === 'all' ? list : list.filter(function(p) {
    if (filter === 'pending') return p.payment_status === 'PENDING';
    if (filter === 'verified') return p.payment_status === 'VERIFIED';
    if (filter === 'rejected') return p.payment_status === 'REJECTED';
    if (filter === 'active') return p.pass_status === 'ACTIVE';
    if (filter === 'cancelled') return p.pass_status === 'CANCELLED';
    return true;
  });

  // Sort newest first
  filtered.sort(function(a, b) {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return { participants: filtered, total: filtered.length };
}

function getRegistration(participantId) {
  const partSheet = getSheet(CONFIG.SHEET.PARTICIPANTS);
  const data = partSheet.getDataRange().getValues().slice(1);

  let participant = null;
  for (let i = 0; i < data.length; i++) {
    if (data[i][P_COL.ID] === participantId) {
      participant = data[i];
      break;
    }
  }
  if (!participant) return { error: 'Not found' };

  // Check if a screenshot Drive file exists — do NOT make it public
  let hasScreenshot = false;
  let driveFileId = null;
  try {
    const paySheet = getSheet(CONFIG.SHEET.PAYMENTS);
    const payments = paySheet.getDataRange().getValues().slice(1);
    for (let i = 0; i < payments.length; i++) {
      if (payments[i][PM_COL.PARTICIPANT_ID] === participantId) {
        driveFileId = payments[i][PM_COL.FILE_ID] || null;
        hasScreenshot = !!driveFileId;
        break;
      }
    }
  } catch (e) {
    Logger.log('[getRegistration] Payments lookup error: ' + e.toString());
  }

  // Get check-in history for this participant
  const checkins = getParticipantCheckins(participantId);

  return {
    id: participant[P_COL.ID],
    pass_id: participant[P_COL.PASS_ID] || null,
    name: participant[P_COL.NAME],
    email: participant[P_COL.EMAIL],
    phone: participant[P_COL.PHONE],
    college: participant[P_COL.COLLEGE],
    department: participant[P_COL.DEPT],
    year: participant[P_COL.YEAR],
    utr: participant[P_COL.UTR] || null,
    payment_status: participant[P_COL.PAY_STATUS],
    pass_status: participant[P_COL.PASS_STATUS],
    created_at: participant[P_COL.CREATED_AT] ? new Date(participant[P_COL.CREATED_AT]).toISOString() : '',
    verified_at: participant[P_COL.VERIFIED_AT] ? new Date(participant[P_COL.VERIFIED_AT]).toISOString() : null,
    verified_by: participant[P_COL.VERIFIED_BY] || null,
    // Screenshot served via /api/admin/screenshot/:id — never exposed as a public Drive link
    payment_screenshot_url: hasScreenshot ? ('/api/admin/screenshot/' + participantId) : null,
    has_screenshot: hasScreenshot,
    checkins: checkins,
  };
}

/**
 * Returns a Drive screenshot as base64 — admin-authenticated only.
 * The Vercel proxy endpoint decodes this and streams it as an image.
 */
function getScreenshot(participantId) {
  if (!participantId) return { error: 'participantId required' };

  try {
    const paySheet = getSheet(CONFIG.SHEET.PAYMENTS);
    const payments = paySheet.getDataRange().getValues().slice(1);
    let fileId = null;
    let mimeType = 'image/jpeg';

    for (let i = 0; i < payments.length; i++) {
      if (payments[i][PM_COL.PARTICIPANT_ID] === participantId) {
        fileId = payments[i][PM_COL.FILE_ID] || null;
        break;
      }
    }

    if (!fileId) return { error: 'No screenshot found' };

    const file = DriveApp.getFileById(fileId);
    mimeType = file.getMimeType() || 'image/jpeg';
    const bytes = file.getBlob().getBytes();
    const base64 = Utilities.base64Encode(bytes);

    return { success: true, base64: base64, mimeType: mimeType };
  } catch (err) {
    Logger.log('[getScreenshot Error] ' + err.toString());
    return { error: 'Screenshot not accessible: ' + err.message };
  }
}

function getParticipantCheckins(participantId) {
  try {
    const ciSheet = getSheet(CONFIG.SHEET.CHECKINS);
    const data = ciSheet.getDataRange().getValues().slice(1);
    return data
      .filter(function(r) { return r[CI_COL.PART_ID] === participantId; })
      .map(function(r) {
        return {
          event_id: r[CI_COL.EVENT_ID],
          event_name: r[CI_COL.EVENT_NAME],
          coordinator_id: r[CI_COL.COORD_ID],
          scanned_at: r[CI_COL.SCANNED_AT] ? new Date(r[CI_COL.SCANNED_AT]).toISOString() : '',
        };
      });
  } catch (e) {
    return [];
  }
}

// ── ADMIN — VERIFY / REJECT / CANCEL ─────────────────────────

function findParticipantRow(sheet, participantId) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][P_COL.ID] === participantId) {
      return { rowIndex: i + 1, row: data[i] }; // 1-based row number
    }
  }
  return null;
}

function verifyPayment(participantId, adminId) {
  const lock = LockService.getScriptLock();
  let hasLock = false;

  try {
    hasLock = lock.tryLock(15000);
    if (!hasLock) {
      return { error: 'Server busy, please retry' };
    }

    const sheet = getSheet(CONFIG.SHEET.PARTICIPANTS);
    const found = findParticipantRow(sheet, participantId);
    if (!found) return { error: 'Participant not found' };

    const { rowIndex, row } = found;

    if (row[P_COL.PAY_STATUS] === 'VERIFIED') {
      return { error: 'Payment already verified' };
    }

    const passId = generatePassId();
    const token = generateId(64);
    const now = nowISO();

    // Update Participants sheet
    sheet.getRange(rowIndex, P_COL.PASS_ID + 1).setValue(passId);
    sheet.getRange(rowIndex, P_COL.TOKEN + 1).setValue(token);
    sheet.getRange(rowIndex, P_COL.PAY_STATUS + 1).setValue('VERIFIED');
    sheet.getRange(rowIndex, P_COL.PASS_STATUS + 1).setValue('ACTIVE');
    sheet.getRange(rowIndex, P_COL.VERIFIED_AT + 1).setValue(now);
    sheet.getRange(rowIndex, P_COL.VERIFIED_BY + 1).setValue(adminId || 'ADMIN-01');
    sheet.getRange(rowIndex, P_COL.PASS_CREATED + 1).setValue(now);
    SpreadsheetApp.flush();

    // Send confirmation email
    const passUrl = CONFIG.BASE_URL + '/pass/' + token;
    sendPassEmail(row[P_COL.EMAIL], row[P_COL.NAME], row[P_COL.COLLEGE], passId, passUrl);

    return {
      success: true,
      pass_id: passId,
      token: token,
      message: 'Payment verified. Pass activated. Confirmation email sent.',
    };
  } finally {
    if (hasLock) {
      try {
        lock.releaseLock();
      } catch (e) {}
    }
  }
}

function rejectPayment(participantId, adminId) {
  const sheet = getSheet(CONFIG.SHEET.PARTICIPANTS);
  const found = findParticipantRow(sheet, participantId);
  if (!found) return { error: 'Participant not found' };

  const { rowIndex } = found;
  sheet.getRange(rowIndex, P_COL.PAY_STATUS + 1).setValue('REJECTED');
  sheet.getRange(rowIndex, P_COL.PASS_STATUS + 1).setValue('PENDING');
  sheet.getRange(rowIndex, P_COL.VERIFIED_BY + 1).setValue(adminId || 'ADMIN-01');
  SpreadsheetApp.flush();

  return { success: true, message: 'Payment rejected.' };
}

function cancelPass(participantId) {
  const sheet = getSheet(CONFIG.SHEET.PARTICIPANTS);
  const found = findParticipantRow(sheet, participantId);
  if (!found) return { error: 'Participant not found' };

  const { rowIndex } = found;
  sheet.getRange(rowIndex, P_COL.PASS_STATUS + 1).setValue('CANCELLED');
  SpreadsheetApp.flush();

  return { success: true, message: 'Pass cancelled.' };
}

function resendPassEmail(participantId) {
  const sheet = getSheet(CONFIG.SHEET.PARTICIPANTS);
  const found = findParticipantRow(sheet, participantId);
  if (!found) return { error: 'Participant not found' };

  const { row } = found;

  if (row[P_COL.PASS_STATUS] !== 'ACTIVE') {
    return { error: 'Pass is not active. Cannot resend.' };
  }

  const passUrl = CONFIG.BASE_URL + '/pass/' + row[P_COL.TOKEN];
  sendPassEmail(row[P_COL.EMAIL], row[P_COL.NAME], row[P_COL.COLLEGE], row[P_COL.PASS_ID], passUrl);

  return { success: true, message: 'Pass email resent.' };
}

// ── ADMIN — ATTENDANCE / CHECK-INS ───────────────────────────

function getCheckinSummary() {
  const partSheet = getSheet(CONFIG.SHEET.PARTICIPANTS);
  const ciSheet = getSheet(CONFIG.SHEET.CHECKINS);

  const participants = partSheet.getDataRange().getValues().slice(1)
    .filter(function(r) { return r[P_COL.ID]; });

  const totalPasses = participants.length;
  const activePasses = participants.filter(function(r) { return r[P_COL.PASS_STATUS] === 'ACTIVE'; }).length;
  const pendingPasses = participants.filter(function(r) { return r[P_COL.PAY_STATUS] === 'PENDING'; }).length;

  const checkins = ciSheet.getDataRange().getValues().slice(1)
    .filter(function(r) { return r[CI_COL.ID]; });

  const totalCheckins = checkins.length;

  // Event-wise breakdown
  const eventCounts = {};
  Object.keys(CONFIG.EVENTS).forEach(function(eventId) {
    eventCounts[eventId] = 0;
  });
  checkins.forEach(function(r) {
    const eid = r[CI_COL.EVENT_ID];
    if (eid in eventCounts) eventCounts[eid]++;
  });

  const eventCountList = Object.keys(CONFIG.EVENTS).map(function(eventId) {
    return {
      event_id: eventId,
      event_name: CONFIG.EVENTS[eventId],
      count: eventCounts[eventId],
    };
  });

  const checkinList = checkins.map(function(r) {
    return {
      participant_name: r[CI_COL.PART_NAME],
      participant_pass_id: r[CI_COL.PASS_ID],
      college: r[CI_COL.COLLEGE],
      event_name: r[CI_COL.EVENT_NAME],
      coordinator_id: r[CI_COL.COORD_ID],
      scanned_at: r[CI_COL.SCANNED_AT] ? new Date(r[CI_COL.SCANNED_AT]).toISOString() : '',
    };
  }).sort(function(a, b) {
    return new Date(b.scanned_at).getTime() - new Date(a.scanned_at).getTime();
  });

  return {
    summary: {
      total_passes: totalPasses,
      active_passes: activePasses,
      pending_passes: pendingPasses,
      total_checkins: totalCheckins,
      event_counts: eventCountList,
    },
    checkins: checkinList,
  };
}

// ── COORDINATOR ───────────────────────────────────────────────

function coordLogin(username, pin) {
  if (!username || !pin) return { error: 'Username and PIN are required' };

  const sheet = getSheet(CONFIG.SHEET.COORDINATORS);
  const data = sheet.getDataRange().getValues().slice(1);

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (
      String(row[CR_COL.USERNAME]).toLowerCase().trim() === username.toLowerCase().trim() &&
      String(row[CR_COL.PIN]).trim() === String(pin).trim() &&
      row[CR_COL.STATUS] === 'ACTIVE'
    ) {
      return {
        success: true,
        coordinator: {
          id: row[CR_COL.ID],
          name: row[CR_COL.NAME],
          assigned_event_id: row[CR_COL.EVENT_ID],
        },
      };
    }
  }

  return { error: 'Invalid credentials' };
}

function scanToken(token, eventId) {
  if (!token) return { status: 'INVALID_TOKEN' };
  if (!eventId || !(eventId in CONFIG.EVENTS)) return { error: 'Invalid event_id' };

  const sheet = getSheet(CONFIG.SHEET.PARTICIPANTS);
  const data = sheet.getDataRange().getValues().slice(1);

  let participant = null;
  for (let i = 0; i < data.length; i++) {
    if (data[i][P_COL.TOKEN] === token) {
      participant = data[i];
      break;
    }
  }

  if (!participant) return { status: 'INVALID_TOKEN' };

  const payStatus = participant[P_COL.PAY_STATUS];
  const passStatus = participant[P_COL.PASS_STATUS];

  if (payStatus === 'PENDING') return { status: 'PAYMENT_PENDING' };
  if (payStatus === 'REJECTED') return { status: 'INVALID_TOKEN' };
  if (passStatus === 'CANCELLED') return { status: 'PASS_CANCELLED' };
  if (passStatus !== 'ACTIVE') return { status: 'PASS_NOT_ACTIVE' };

  const participantId = participant[P_COL.ID];

  // Check for existing check-in for this event
  const existing = getCheckinEntry(participantId, eventId);
  if (existing) {
    return {
      status: 'ALREADY_CHECKED_IN',
      participant: {
        name: participant[P_COL.NAME],
        college: participant[P_COL.COLLEGE],
        department: participant[P_COL.DEPT],
        year: participant[P_COL.YEAR],
        pass_id: participant[P_COL.PASS_ID],
      },
      event: CONFIG.EVENTS[eventId],
      checked_in_at: existing.scanned_at,
    };
  }

  return {
    status: 'VALID',
    participant: {
      name: participant[P_COL.NAME],
      college: participant[P_COL.COLLEGE],
      department: participant[P_COL.DEPT],
      year: participant[P_COL.YEAR],
      pass_id: participant[P_COL.PASS_ID],
    },
    event: CONFIG.EVENTS[eventId],
    participant_id: participantId,
  };
}

function getCheckinEntry(participantId, eventId) {
  const sheet = getSheet(CONFIG.SHEET.CHECKINS);
  const data = sheet.getDataRange().getValues().slice(1);
  for (let i = 0; i < data.length; i++) {
    if (data[i][CI_COL.PART_ID] === participantId && data[i][CI_COL.EVENT_ID] === eventId) {
      return {
        scanned_at: data[i][CI_COL.SCANNED_AT] ? new Date(data[i][CI_COL.SCANNED_AT]).toISOString() : '',
      };
    }
  }
  return null;
}

function recordCheckin(participantId, eventId, coordinatorId) {
  if (!participantId || !eventId || !coordinatorId) {
    return { error: 'participantId, eventId and coordinatorId are required' };
  }
  if (!(eventId in CONFIG.EVENTS)) {
    return { error: 'Invalid event_id' };
  }

  const lock = LockService.getScriptLock();
  let hasLock = false;

  try {
    hasLock = lock.tryLock(10000);
    if (!hasLock) {
      return { error: 'Server busy, please retry' };
    }

    // Fetch participant details
    const partSheet = getSheet(CONFIG.SHEET.PARTICIPANTS);
    const partData = partSheet.getDataRange().getValues().slice(1);
    let participant = null;
    for (let i = 0; i < partData.length; i++) {
      if (partData[i][P_COL.ID] === participantId) {
        participant = partData[i];
        break;
      }
    }
    if (!participant) return { error: 'Participant not found' };

    if (participant[P_COL.PASS_STATUS] !== 'ACTIVE' || participant[P_COL.PAY_STATUS] !== 'VERIFIED') {
      return { error: 'Pass is not eligible for check-in' };
    }

    // Check for duplicate (within lock)
    const existing = getCheckinEntry(participantId, eventId);
    if (existing) {
      return {
        error: 'Already checked in',
        status: 'ALREADY_CHECKED_IN',
        event: CONFIG.EVENTS[eventId],
      };
    }

    // Fetch coordinator name
    let coordName = coordinatorId;
    try {
      const crSheet = getSheet(CONFIG.SHEET.COORDINATORS);
      const crData = crSheet.getDataRange().getValues().slice(1);
      for (let i = 0; i < crData.length; i++) {
        if (crData[i][CR_COL.ID] === coordinatorId) {
          coordName = crData[i][CR_COL.NAME];
          break;
        }
      }
    } catch (e) { /* ignore */ }

    // Record check-in
    const ciSheet = getSheet(CONFIG.SHEET.CHECKINS);
    const entryId = generateId(16);
    const now = nowISO();

    ciSheet.appendRow([
      entryId,                                // A — entry ID
      participantId,                          // B
      participant[P_COL.NAME],                // C
      participant[P_COL.PASS_ID],             // D
      participant[P_COL.COLLEGE],             // E
      eventId,                                // F
      CONFIG.EVENTS[eventId],                 // G
      coordinatorId,                          // H
      coordName,                              // I
      now,                                    // J
      'CHECKED_IN',                           // K
    ]);

    return {
      success: true,
      entry_id: entryId,
      participant_name: participant[P_COL.NAME],
      event: CONFIG.EVENTS[eventId],
      scanned_at: now,
      coordinator_id: coordinatorId,
    };
  } finally {
    if (hasLock) {
      try {
        lock.releaseLock();
      } catch (e) {}
    }
  }
}

// ── EMAIL ─────────────────────────────────────────────────────

function sendPassEmail(toEmail, name, college, passId, passUrl) {
  try {
    const subject = 'Your VYUGAM Pass Is Ready — ' + passId;
    const htmlBody = buildPassEmailHtml(name, college, passId, passUrl);

    GmailApp.sendEmail(toEmail, subject, '', {
      htmlBody: htmlBody,
      name: CONFIG.EMAIL_FROM_NAME,
    });

    Logger.log('[Email] Sent pass confirmation to: ' + toEmail);
    return true;
  } catch (err) {
    Logger.log('[Email Error] ' + err.toString());
    return false;
  }
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildPassEmailHtml(name, college, passId, passUrl) {
  return '<!DOCTYPE html>' +
  '<html lang="en">' +
  '<head>' +
  '<meta charset="UTF-8"/>' +
  '<meta name="viewport" content="width=device-width,initial-scale=1.0"/>' +
  '<title>Your VYUGAM Pass is Ready</title>' +
  '</head>' +
  '<body style="margin:0;padding:0;background:#050505;font-family:\'Helvetica Neue\',Arial,sans-serif;">' +
  '<table width="100%" cellpadding="0" cellspacing="0" style="background:#050505;padding:32px 16px;">' +
    '<tr><td>' +
      '<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#101010;border:2px solid #FDB515;box-shadow:6px 6px 0 #7A0606;">' +
        '<tr><td style="height:4px;background:linear-gradient(90deg,#7A0606,#FF4A12,#FDB515);"></td></tr>' +
        '<tr><td style="padding:32px 32px 20px;text-align:center;">' +
          '<div style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#D99A00;font-weight:700;margin-bottom:8px;">P.A. College of Engineering and Technology</div>' +
          '<div style="font-size:36px;font-weight:900;letter-spacing:0.08em;text-transform:uppercase;color:#FDB515;line-height:1;">VYUGAM 2.0</div>' +
          '<div style="font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#F5E6B8;margin-top:6px;">Dept. of Information Technology</div>' +
        '</td></tr>' +
        '<tr><td style="padding:0 32px 24px;">' +
          '<div style="background:#FDB515;color:#050505;font-size:11px;font-weight:900;letter-spacing:0.25em;text-transform:uppercase;text-align:center;padding:8px 0;clip-path:polygon(3% 0,100% 0,97% 100%,0% 100%);">&#10003; Your VYUGAM Pass Is Confirmed</div>' +
        '</td></tr>' +
        '<tr><td style="padding:0 32px 20px;">' +
          '<p style="color:#F2F2EA;font-size:16px;margin:0 0 8px;">Hello, <strong style="color:#FDB515;">' + escapeHtml(name) + '</strong></p>' +
          '<p style="color:#F5E6B8;font-size:14px;line-height:1.6;margin:0;">Your payment has been verified by the VYUGAM team. Your personalized VYUGAM Symposium Pass is now active and ready to use.</p>' +
        '</td></tr>' +
        '<tr><td style="padding:0 32px 24px;">' +
          '<table width="100%" cellpadding="0" cellspacing="0" style="background:#050505;border:1px solid #FDB515;border-top:3px solid #FDB515;">' +
            '<tr><td style="padding:16px 20px;">' +
              '<div style="font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:#D99A00;margin-bottom:4px;">VYUGAM Symposium Pass</div>' +
              '<div style="font-size:22px;font-weight:900;text-transform:uppercase;color:#F2F2EA;letter-spacing:0.05em;">' + escapeHtml(name) + '</div>' +
              '<div style="font-size:12px;color:#F5E6B8;margin-top:4px;">' + escapeHtml(college) + '</div>' +
              '<div style="border-top:1px dashed rgba(253,181,21,0.25);margin:12px 0;"></div>' +
              '<div>' +
                '<div style="font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#D99A00;">Pass ID</div>' +
                '<div style="font-size:14px;font-weight:700;color:#FDB515;font-family:monospace;">' + escapeHtml(passId) + '</div>' +
              '</div>' +
            '</td></tr>' +
          '</table>' +
        '</td></tr>' +
        '<tr><td style="padding:0 32px 28px;text-align:center;">' +
          '<a href="' + passUrl + '" style="display:inline-block;background:#FDB515;color:#050505;font-size:14px;font-weight:900;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;padding:14px 32px;border:2px solid #050505;box-shadow:4px 4px 0 #C1121F;">&#9889; VIEW MY VYUGAM PASS</a>' +
        '</td></tr>' +
        '<tr><td style="padding:0 32px 24px;">' +
          '<div style="background:#161412;border-left:3px solid #FDB515;padding:16px;">' +
            '<div style="font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#FDB515;margin-bottom:10px;">On Event Day</div>' +
            '<div style="font-size:13px;color:#F5E6B8;line-height:1.7;">' +
              '1. Open your VYUGAM Pass on your phone<br/>' +
              '2. Keep the QR code visible and accessible<br/>' +
              '3. Present your pass to event coordinators before participating<br/>' +
              '4. One pass. Multiple arenas. No separate registrations.' +
            '</div>' +
          '</div>' +
        '</td></tr>' +
        '<tr><td style="padding:0 32px 28px;">' +
          '<p style="font-size:11px;color:rgba(217,154,0,0.5);margin:0;word-break:break-all;">If the button does not work, paste this link in your browser:<br/><a href="' + passUrl + '" style="color:#FDB515;">' + passUrl + '</a></p>' +
        '</td></tr>' +
        '<tr><td style="height:2px;background:linear-gradient(90deg,transparent,#FDB515,transparent);"></td></tr>' +
        '<tr><td style="padding:16px 32px;text-align:center;">' +
          '<div style="font-size:10px;color:rgba(217,154,0,0.37);letter-spacing:0.1em;text-transform:uppercase;">VYUGAM 2.0 &mdash; Dept. of IT, PACET (Autonomous), Pollachi &mdash; 642002 &copy; 2026</div>' +
        '</td></tr>' +
      '</table>' +
    '</td></tr>' +
  '</table>' +
  '</body></html>';
}

// ── SETUP (run once after deployment) ────────────────────────

/**
 * Run this function ONCE from the Apps Script editor to initialize all sheet headers
 * and seed the Coordinators + Events tabs.
 * Menu: Run → Run function → setupSheet
 */
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // ── Participants ──
  ensureSheet(ss, CONFIG.SHEET.PARTICIPANTS, [
    'Row ID', 'Participant ID', 'Pass ID', 'Secure Pass Token',
    'Full Name', 'Email', 'Phone', 'College', 'Department', 'Year of Study',
    'UTR / Transaction ID', 'Payment Status', 'Pass Status',
    'Created At', 'Verified At', 'Verified By', 'Pass Created At'
  ], '#FDB515');

  // ── Payments ──
  ensureSheet(ss, CONFIG.SHEET.PAYMENTS, [
    'Participant ID', 'Drive File ID', 'View Link', 'Uploaded At'
  ], '#FF9900');

  // ── Check-ins ──
  ensureSheet(ss, CONFIG.SHEET.CHECKINS, [
    'Entry ID', 'Participant ID', 'Participant Name', 'Pass ID', 'College',
    'Event ID', 'Event Name', 'Coordinator ID', 'Coordinator Name', 'Scanned At', 'Status'
  ], '#00AA66');

  // ── Coordinators (seed if empty) ──
  const crSheet = ensureSheet(ss, CONFIG.SHEET.COORDINATORS, [
    'Coordinator ID', 'Name', 'Username', 'PIN', 'Assigned Event ID', 'Status'
  ], '#0066CC');

  if (crSheet.getLastRow() <= 1) {
    const coordinators = [
      ['CR-01', 'Code Crusade Coordinator', 'cr01', '2601', 'code-crusade', 'ACTIVE'],
      ['CR-02', 'Logic Arena Coordinator', 'cr02', '2602', 'logic-arena', 'ACTIVE'],
      ['CR-03', 'UI/UX Studio Coordinator', 'cr03', '2603', 'ui-ux-studio', 'ACTIVE'],
      ['CR-04', 'Tech Tactics Coordinator', 'cr04', '2604', 'tech-tactics', 'ACTIVE'],
      ['CR-05', 'Pixel Pulse Coordinator', 'cr05', '2605', 'pixel-pulse', 'ACTIVE'],
    ];
    coordinators.forEach(function(row) { crSheet.appendRow(row); });
  }

  // ── Events (seed if empty) ──
  const evSheet = ensureSheet(ss, CONFIG.SHEET.EVENTS, [
    'Event ID', 'Event Name', 'Registration Count'
  ], '#AA0066');

  if (evSheet.getLastRow() <= 1) {
    Object.keys(CONFIG.EVENTS).forEach(function(id) {
      evSheet.appendRow([id, CONFIG.EVENTS[id], '=COUNTIF(Participants!H:H,"")']); // placeholder
    });
  }

  // ── Dashboard ──
  setupDashboard(ss);

  SpreadsheetApp.getUi().alert('VYUGAM 2.0 sheets initialized! Remember to set your DRIVE_FOLDER_ID and ADMIN_SECRET in the CONFIG section.');
}

function ensureSheet(ss, name, headers, color) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground(color)
      .setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function setupDashboard(ss) {
  let dash = ss.getSheetByName(CONFIG.SHEET.DASHBOARD);
  if (!dash) dash = ss.insertSheet(CONFIG.SHEET.DASHBOARD, 0);
  dash.clearContents();

  const rows = [
    ['VYUGAM 2.0 — Live Dashboard', '', ''],
    ['', '', ''],
    ['REGISTRATIONS', '', ''],
    ['Total Registrations', '=COUNTA(Participants!B:B)-1', ''],
    ['Pending Payment', '=COUNTIF(Participants!L:L,"PENDING")', ''],
    ['Payment Verified', '=COUNTIF(Participants!L:L,"VERIFIED")', ''],
    ['Payment Rejected', '=COUNTIF(Participants!L:L,"REJECTED")', ''],
    ['Passes Issued (Active)', '=COUNTIF(Participants!M:M,"ACTIVE")', ''],
    ['Passes Cancelled', '=COUNTIF(Participants!M:M,"CANCELLED")', ''],
    ['', '', ''],
    ['CHECK-INS BY EVENT', '', ''],
    ['Code Crusade', '=COUNTIF(\'Check-ins\'!F:F,"code-crusade")', ''],
    ['Logic Arena', '=COUNTIF(\'Check-ins\'!F:F,"logic-arena")', ''],
    ['UI/UX Studio', '=COUNTIF(\'Check-ins\'!F:F,"ui-ux-studio")', ''],
    ['Tech Tactics', '=COUNTIF(\'Check-ins\'!F:F,"tech-tactics")', ''],
    ['Pixel Pulse', '=COUNTIF(\'Check-ins\'!F:F,"pixel-pulse")', ''],
    ['Total Check-ins', '=COUNTA(\'Check-ins\'!A:A)-1', ''],
    ['', '', ''],
    ['Pass Counter (do not edit)', '0', '← auto-incremented by script'],
  ];

  dash.getRange(1, 1, rows.length, 3).setValues(rows);

  // Style header
  dash.getRange(1, 1).setFontWeight('bold').setFontSize(14).setFontColor('#7A0606');
  dash.getRange(3, 1).setFontWeight('bold').setBackground('#FDB515');
  dash.getRange(11, 1).setFontWeight('bold').setBackground('#FDB515');

  // Name the pass counter cell for generatePassId()
  try {
    ss.setNamedRange('PassCounter', dash.getRange(rows.length, 2));
  } catch (e) { /* already exists */ }
}
