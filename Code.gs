/**
 * VYUGAM 2.0 — Google Apps Script for Google Sheets Backend
 * ============================================================
 * INSTRUCTIONS TO SET UP:
 * 1. Open Google Sheets (https://sheets.google.com) and create a new blank spreadsheet.
 * 2. Rename sheet1 or header row (Row 1):
 *    Col A: Timestamp | Col B: Name | Col C: Email | Col D: Phone | Col E: College | Col F: Event Track | Col G: Team Size | Col H: Message
 * 3. Go to Extensions -> Apps Script.
 * 4. Paste this entire code into `Code.gs` replacing any default content.
 * 5. Click "Deploy" (top right) -> "New deployment".
 * 6. Select type: "Web app".
 * 7. Set:
 *    - Description: "Vyugam 2.0 Registration API"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (CRITICAL!)
 * 8. Click "Deploy", grant permissions if asked.
 * 9. Copy the generated Web App URL (starts with https://script.google.com/macros/s/...).
 * 10. Open vyugam-2.0.html and replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with your copied URL.
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getActiveSheet();

    // If sheet is fresh and empty, create headers automatically
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Full Name (Lead)",
        "Email",
        "Phone Number",
        "College / Institution",
        "Year of Study",
        "Department",
        "Event Track",
        "Team Size",
        "Team Members Details",
        "Message / Note"
      ]);
      sheet.getRange(1, 1, 1, 11).setFontWeight("bold").setBackground("#FDB515").setFontColor("#050505");
    }

    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);

    var timestamp = new Date();
    var name = data.name || "";
    var email = data.email || "";
    var phone = data.phone || "";
    var college = data.college || "";
    var year = data.year || "";
    var dept = data.dept || "";
    var eventTrack = data.event || "";
    var teamSize = data.teamSize || "";
    var teamMembers = data.teamMembers || "";
    var message = data.message || "";

    sheet.appendRow([
      timestamp,
      name,
      email,
      phone,
      college,
      year,
      dept,
      eventTrack,
      teamSize,
      teamMembers,
      message
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "message": "Registration recorded successfully!" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ "status": "active", "event": "VYUGAM 2.0 Registration API" }))
    .setMimeType(ContentService.MimeType.JSON);
}
