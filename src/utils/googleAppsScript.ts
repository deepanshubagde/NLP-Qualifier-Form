export const GOOGLE_APPS_SCRIPT_CODE = `// Exact code.gs deployed for Monkhood Qualifier Form (15 columns)
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Parse the incoming JSON data from the web form
  var data = JSON.parse(e.postData.contents);
  
  // Create a timestamp
  var timestamp = new Date();
  
  // Map the incoming data to the exactly 15 columns in the sheet
  var rowData = [
    timestamp,
    data.name,
    data.gender,
    data.age,
    data.city,
    data.q1,  // Which of the Following Describes you the Best
    data.q2,  // Which of the Following Areas you are Struggling
    data.q3,  // Experiencing patterns of failure... (Yes/No)
    data.q4,  // Attended Deepanshu Sir’s Event earlier? (Yes/No)
    data.q5,  // Feel brain fog... (Yes/No)
    data.q6,  // Know you have more in you... (Yes/No)
    data.q7,  // Heard of NLP? (Yes/No)
    data.q8,  // Attended the NLP workshop earlier? (Yes/No)
    data.q9,  // Major obstacle stopping you...
    data.q10  // Willing to invest...
  ];
  
  // Append the row to the sheet
  sheet.appendRow(rowData);
  
  // Send a success response back to the web form
  return ContentService.createTextOutput(JSON.stringify({"result":"success"}))
    .setMimeType(ContentService.MimeType.JSON);
}

// Handle preflight CORS requests from the browser
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}
`;
