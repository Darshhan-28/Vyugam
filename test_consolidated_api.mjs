const BASE_URL = "http://localhost:5173";

async function testConsolidatedApi() {
  console.log("=================================================");
  console.log("🚀 CONSOLIDATED API (Vite Dev Server) TEST RUN");
  console.log("=================================================\n");

  // 1. Admin Login
  console.log("▶ 1. POST /api/admin/login");
  let res = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin_password' }),
  });
  console.log("  Status:", res.status);
  const cookieHeader = res.headers.get('set-cookie') || '';
  const adminCookie = cookieHeader.split(';')[0];
  console.log("  ✓ Admin cookie set.");

  // 2. Register Participant
  const timestamp = Date.now();
  const email = `consolidated_${timestamp}@vyugam.in`;
  console.log("\n▶ 2. POST /api/register (email:", email, ")");
  res = await fetch(`${BASE_URL}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Consolidated Delegate',
      email,
      phone: '9112233445',
      college: 'PA College',
      department: 'CSE',
      year: 'IV Year',
      utr: 'UTR777888',
    }),
  });
  console.log("  Status:", res.status);
  const regData = await res.json();
  console.log("  Response:", regData);
  const participantId = regData.participant_id;
  if (!participantId) throw new Error("Registration failed!");

  // 3. Admin Get Registration Detail
  console.log(`\n▶ 3. GET /api/admin/registration/${participantId}`);
  res = await fetch(`${BASE_URL}/api/admin/registration/${participantId}`, {
    headers: { cookie: adminCookie },
  });
  console.log("  Status:", res.status);
  const detailData = await res.json();
  console.log("  Participant Name:", detailData.name, "| Status:", detailData.payment_status);
  if (res.status !== 200) throw new Error("Get registration detail failed!");

  // 4. Admin Verify Payment
  console.log(`\n▶ 4. POST /api/admin/verify`);
  res = await fetch(`${BASE_URL}/api/admin/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', cookie: adminCookie },
    body: JSON.stringify({ participant_id: participantId }),
  });
  console.log("  Status:", res.status);
  const verifyData = await res.json();
  console.log("  Verify Result:", verifyData);

  // 5. Admin Get Registration Detail after Verify
  console.log(`\n▶ 5. GET /api/admin/registration/${participantId} (post-verify)`);
  res = await fetch(`${BASE_URL}/api/admin/registration/${participantId}`, {
    headers: { cookie: adminCookie },
  });
  const updatedDetail = await res.json();
  console.log("  Status:", res.status, "| Pass Status:", updatedDetail.pass_status, "| Pass ID:", updatedDetail.pass_id);
  const passToken = updatedDetail.secure_pass_token;

  // 6. Public Pass Lookup
  console.log(`\n▶ 6. GET /api/pass/${passToken}`);
  res = await fetch(`${BASE_URL}/api/pass/${passToken}`);
  const passData = await res.json();
  console.log("  Status:", res.status, "| Holder:", passData.name, "| Pass Status:", passData.status);

  // 7. Coordinator Login
  console.log("\n▶ 7. POST /api/coordinator/login");
  res = await fetch(`${BASE_URL}/api/coordinator/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'cr01', pin: '2601' }),
  });
  const coordData = await res.json();
  console.log("  Status:", res.status, "| Coord:", coordData.coordinator?.name);
  const coordCookie = (res.headers.get('set-cookie') || '').split(';')[0];

  // 8. Coordinator Scan Token
  console.log("\n▶ 8. POST /api/coordinator/scan");
  res = await fetch(`${BASE_URL}/api/coordinator/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', cookie: coordCookie },
    body: JSON.stringify({ token: passToken, eventId: 'code-crusade' }),
  });
  const scanData = await res.json();
  console.log("  Status:", res.status, "| Scan Result:", scanData.status);

  // 9. Coordinator Checkin
  console.log("\n▶ 9. POST /api/coordinator/checkin");
  res = await fetch(`${BASE_URL}/api/coordinator/checkin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', cookie: coordCookie },
    body: JSON.stringify({ participantId, eventId: 'code-crusade' }),
  });
  const checkinData = await res.json();
  console.log("  Status:", res.status, "| Checkin Entry:", checkinData.entry_id);

  console.log("\n=================================================");
  console.log("🎉 CONSOLIDATED API TEST PASSED 100% SUCCESSFULLY!");
  console.log("=================================================");
}

testConsolidatedApi().catch((err) => {
  console.error("\n❌ API TEST FAILED:", err);
  process.exit(1);
});
