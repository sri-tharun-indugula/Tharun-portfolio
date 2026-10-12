/**
 * ============================================================================
 * GOOGLE APPS SCRIPT: TURN GOOGLE SHEETS INTO A LIVE PORTFOLIO API
 * ============================================================================
 *
 * HOW TO USE THIS IN 3 EASY STEPS:
 * 1. Open your Google Sheet (e.g. named "My Portfolio").
 *    Create a sheet/tab called "Projects" with the following columns in Row 1:
 *    [ id | title | description | category | tags | demoUrl | githubUrl | imageUrl | featured ]
 *
 * 2. In Google Sheets, click: Extensions > Apps Script
 *    Delete whatever is in Code.gs, paste all the code below, and click Save (Ctrl+S).
 *
 * 3. Click "Deploy" > "New deployment"
 *    - Select type: "Web app"
 *    - Description: "Portfolio API"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (Required so your website can fetch the projects)
 *    - Click "Deploy", authorize access, and copy the "Web app URL".
 *
 * 4. Paste that Web App URL into your Portfolio website settings!
 * ============================================================================
 */

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Projects") || ss.getSheets()[0];
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        count: 0,
        projects: []
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const headers = data[0].map(h => String(h).trim().toLowerCase());
    const rows = data.slice(1);
    
    const projects = rows.map((row, index) => {
      let item = { id: index + 1 };
      headers.forEach((header, colIdx) => {
        let val = row[colIdx];
        if (header === "tags" && typeof val === "string") {
          item[header] = val.split(",").map(t => t.trim()).filter(Boolean);
        } else if (header === "featured") {
          item[header] = String(val).toLowerCase() === "true" || val === true || val === 1;
        } else {
          item[header] = val;
        }
      });
      return item;
    }).filter(p => p.title); // only return rows with titles
    
    const response = {
      status: "success",
      count: projects.length,
      updatedAt: new Date().toISOString(),
      projects: projects
    };
    
    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handles incoming contact messages from your portfolio contact form
 * and saves them directly to an "Inquiries" sheet!
 */
function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let inquiriesSheet = ss.getSheetByName("Inquiries");
    
    if (!inquiriesSheet) {
      inquiriesSheet = ss.insertSheet("Inquiries");
      inquiriesSheet.appendRow(["Timestamp", "Name", "Email", "Subject", "Message"]);
    }
    
    const payload = JSON.parse(e.postData.contents);
    inquiriesSheet.appendRow([
      new Date(),
      payload.name || "Anonymous",
      payload.email || "No email",
      payload.subject || "General Inquiry",
      payload.message || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Message received successfully!"
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
