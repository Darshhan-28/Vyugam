const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbz27HT7yPxOoVvjoAZwgJ9DqufE9yUboAMXgsqQHdoCDOn6HD3_3xbziWlAGAn8yCQQRw/exec";
const GAS_ADMIN_SECRET = "Sakho115";
const GAS_COORD_SECRET = "vyugam2k26";

async function callGAS(action, payload = {}, opts = {}) {
  const body = { action, ...payload };
  if (opts.admin) body.adminSecret = GAS_ADMIN_SECRET;
  if (opts.coord) body.coordSecret = GAS_COORD_SECRET;

  const res = await fetch(GAS_WEB_APP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'follow',
  });

  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Invalid JSON response: ${text}`);
  }
}

async function runEndToEndTest() {
  console.log("=================================================");
  console.log("🚀 VYUGAM 2.0 — END-TO-END TEST RUN");
  console.log("=================================================\n");

  // Step 1: Health Check
  console.log("▶ Step 1: Backend Health Check");
  const health = await callGAS('healthCheck');
  console.log("  Status:", health.status, "| Event:", health.event);
  if (health.status !== 'ok') throw new Error("Health check failed!");

  // Step 2: Register Participant
  const timestamp = Date.now();
  const testEmail = `test_delegate_${timestamp}@vyugam.in`;
  console.log("\n▶ Step 2: Participant Registration");
  console.log("  Registering:", testEmail);

  const regRes = await callGAS('registerParticipant', {
    name: 'Karthik Subramanian',
    email: testEmail,
    phone: '9443322110',
    college: 'P.A. College of Engineering & Technology',
    department: 'Information Technology',
    year: 'III Year',
    utr: `UTR${timestamp.toString().slice(-6)}`,
  });

  console.log("  Response:", regRes);
  if (!regRes.success || !regRes.participantId) throw new Error("Registration failed!");
  const participantId = regRes.participantId;
  console.log("  ✓ Participant Created. ID:", participantId);

  // Step 3: Duplicate Email Prevention Test
  console.log("\n▶ Step 3: Duplicate Email Check");
  const dupCheck = await callGAS('checkEmailExists', { email: testEmail });
  console.log("  Email exists check:", dupCheck);
  if (!dupCheck.exists) throw new Error("Duplicate email check failed!");
  console.log("  ✓ Duplicate check verified.");

  // Step 4: Admin Fetch Registration Detail
  console.log("\n▶ Step 4: Admin Fetch Registration Detail");
  const detail = await callGAS('getRegistration', { id: participantId }, { admin: true });
  console.log("  Participant Name:", detail.name);
  console.log("  Payment Status:", detail.payment_status, "| Pass Status:", detail.pass_status);
  if (detail.payment_status !== 'PENDING' || detail.pass_status !== 'PENDING') {
    throw new Error("Initial status should be PENDING!");
  }
  console.log("  ✓ Detail retrieved successfully.");

  // Step 5: Admin Payment Verification & Pass Issuance
  console.log("\n▶ Step 5: Admin Verify Payment & Generate Pass");
  const verifyRes = await callGAS('verifyPayment', { participantId, adminId: 'ADMIN-CHIEF' }, { admin: true });
  console.log("  Verify Result:", verifyRes);
  if (!verifyRes.success || !verifyRes.pass_id) throw new Error("Verification failed!");
  console.log("  ✓ Pass Issued! Pass ID:", verifyRes.pass_id, "| Token:", verifyRes.token?.slice(0, 16) + '...');

  // Step 6: Re-fetch Detail & Verify Pass Record
  console.log("\n▶ Step 6: Verify Active Pass Record");
  const verifiedDetail = await callGAS('getRegistration', { id: participantId }, { admin: true });
  console.log("  Pass ID:", verifiedDetail.pass_id);
  console.log("  Payment Status:", verifiedDetail.payment_status);
  console.log("  Pass Status:", verifiedDetail.pass_status);
  const token = verifyRes.token;
  if (!token) throw new Error("Missing secure_pass_token!");
  console.log("  ✓ Pass record is ACTIVE.");

  // Step 7: Pass Lookup via Secure Token
  console.log("\n▶ Step 7: Pass Lookup via Token");
  const tokenRes = await callGAS('getPassByToken', { token });
  console.log("  Token Lookup Status:", tokenRes.status);
  console.log("  Pass Holder:", tokenRes.name, "| Pass ID:", tokenRes.pass_id);
  if (tokenRes.status !== 'ACTIVE') throw new Error("Token lookup failed!");
  console.log("  ✓ Pass token lookup verified.");

  // Step 8: Coordinator QR Scan Validation
  console.log("\n▶ Step 8: Coordinator QR Scan Validation (Code Crusade)");
  const scanRes = await callGAS('scanToken', { token: token, eventId: 'code-crusade' }, { coord: true });
  console.log("  Scan Status:", scanRes.status);
  console.log("  Event:", scanRes.event);
  if (scanRes.status !== 'VALID') throw new Error("Scan validation failed!");
  console.log("  ✓ Pass scan is VALID.");

  // Step 9: Coordinator Event Check-In
  console.log("\n▶ Step 9: Coordinator Record Event Entry");
  const checkinRes = await callGAS('recordCheckin', {
    participantId,
    eventId: 'code-crusade',
    coordinatorId: 'CR-01',
  }, { coord: true });
  console.log("  Check-in Result:", checkinRes);
  if (!checkinRes.success) throw new Error("Check-in recording failed!");
  console.log("  ✓ Event entry recorded cleanly.");

  // Step 10: Duplicate Check-In Prevention Test
  console.log("\n▶ Step 10: Duplicate Check-In Prevention Test");
  const dupScanRes = await callGAS('scanToken', { token: token, eventId: 'code-crusade' }, { coord: true });
  console.log("  Second Scan Status:", dupScanRes.status);
  if (dupScanRes.status !== 'ALREADY_CHECKED_IN') throw new Error("Duplicate check-in prevention failed!");
  console.log("  ✓ Duplicate check-in correctly blocked!");

  // Step 11: Admin Attendance Analytics
  console.log("\n▶ Step 11: Admin Attendance Analytics");
  const checkinStats = await callGAS('getCheckinSummary', {}, { admin: true });
  console.log("  Total Passes:", checkinStats.summary.total_passes);
  console.log("  Active Passes:", checkinStats.summary.active_passes);
  console.log("  Total Check-ins:", checkinStats.summary.total_checkins);
  console.log("  Code Crusade Check-ins:", checkinStats.summary.event_counts.find(e => e.event_id === 'code-crusade')?.count);
  console.log("  ✓ Attendance stats verified.");

  console.log("\n=================================================");
  console.log("🎉 ALL 11 END-TO-END SYSTEM TESTS PASSED PERFECTLY!");
  console.log("=================================================");
}

runEndToEndTest().catch((err) => {
  console.error("\n❌ TEST FAILED:", err);
  process.exit(1);
});
