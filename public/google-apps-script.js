/**
 * Google Apps Script Webhook Handler for Monkhood NLP Coaching Form
 * 
 * Instructions to set up:
 * 1. Open your Google Sheet (e.g., "NLP Advanced Coaching Qualifications")
 * 2. Click "Extensions" > "Apps Script" in the top menu
 * 3. Replace any existing code with this script
 * 4. Click "Deploy" (top right) > "New deployment"
 * 5. Select type: "Web app"
 * 6. Configuration:
 *    - Description: "Form Webhook"
 *    - Execute as: "Me" (your Google account)
 *    - Who has access: "Anyone" (CRITICAL for form submission)
 * 7. Click "Deploy", authorize permissions when prompted
 * 8. Copy the "Web App URL" (ends with /exec)
 * 9. Paste that URL into the Webhook settings of this form!
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName("Responses") || doc.getActiveSheet();

    // Check if header row exists, if not add it
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Full Name",
        "Gender",
        "Age",
        "City",
        "WhatsApp / Phone",
        "Email Address",
        "Current Profession / Profile",
        "Struggling Areas",
        "Pattern of Failure / Frustration",
        "Attended Deepanshu Sir's Event Earlier",
        "Brain Fog / Lack of Energy & Purpose",
        "Capable of More But Stuck",
        "Heard of NLP",
        "Attended NLP Workshop Earlier",
        "Major Obstacle",
        "Investment Willingness",
        "Personal Note / Goal"
      ]);
      // Style header
      var headerRange = sheet.getRange(1, 1, 1, 18);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#F3F4F6");
    }

    var data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else {
      data = e.parameter;
    }

    var timestamp = new Date();
    var obstacle = data.majorObstacle === "Other" && data.majorObstacleOther 
      ? "Other: " + data.majorObstacleOther 
      : (data.majorObstacle || "");

    var strugglingAreas = Array.isArray(data.strugglingAreas) 
      ? data.strugglingAreas.join(", ") 
      : (data.strugglingAreas || "");

    var row = [
      timestamp,
      data.name || "",
      data.gender || "",
      data.age || "",
      data.city || "",
      data.whatsapp || "",
      data.email || "",
      data.occupation || "",
      strugglingAreas,
      data.patternsOfFailure || "",
      data.attendedDeepanshuEvent || "",
      data.brainFogTired || "",
      data.capableMoreNotHappening || "",
      data.heardOfNLP || "",
      data.attendedNLPWorkshop || "",
      obstacle,
      data.investmentCapacity || "",
      data.personalNotes || ""
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "message": "Qualification recorded successfully!" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ "status": "active", "service": "Monkhood Qualifier Webhook" }))
    .setMimeType(ContentService.MimeType.JSON);
}
