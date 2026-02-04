/**
 * RSVP Handler
 *
 * This script handles RSVP form submissions from wedding invitation pages.
 * Each wedding has its own dedicated Google Spreadsheet for RSVP responses,
 * looked up via the RSVP_Lookup tab in the master spreadsheet.
 *
 * Setup:
 * 1. Create a Google Sheet (or use existing one)
 * 2. Open Script Editor (Extensions > Apps Script)
 * 3. Paste this code
 * 4. Deploy as web app:
 *    - Deploy > New deployment
 *    - Select type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the web app URL to your config.js
 */

// Configuration
const CONFIG = {
  MASTER_SPREADSHEET_ID: PropertiesService.getScriptProperties().getProperty('MASTER_SPREADSHEET_ID') || '',
  NOTIFY_EMAILS: {} // Map of slug to notification email, e.g., {'ana-marko': 'couple@email.com'}
};

/**
 * Look up per-couple spreadsheet ID from the RSVP_Lookup tab
 */
function lookupSpreadsheetId(slug) {
  var ss = CONFIG.MASTER_SPREADSHEET_ID
    ? SpreadsheetApp.openById(CONFIG.MASTER_SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();

  var lookupSheet = ss.getSheetByName('RSVP_Lookup');
  if (!lookupSheet) {
    Logger.log('RSVP_Lookup tab not found');
    return null;
  }

  var data = lookupSheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === slug) {
      return data[i][1]; // Column B: Spreadsheet ID
    }
  }

  Logger.log('No RSVP spreadsheet found for slug: ' + slug);
  return null;
}

/**
 * Handle POST requests for RSVP submissions
 */
function doPost(e) {
  try {
    // Parse request data
    let data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    } else {
      return createResponse(false, 'No data received');
    }

    // Validate required fields
    const slug = data.slug;
    const name = data.name;
    const attending = data.attending;

    if (!slug) {
      return createResponse(false, 'Missing wedding slug');
    }

    if (!name || name.trim() === '') {
      return createResponse(false, 'Name is required');
    }

    if (!attending || (attending !== 'yes' && attending !== 'no')) {
      return createResponse(false, 'Attendance status is required');
    }

    // Prepare RSVP data
    const rsvpData = {
      name: name.trim(),
      email: (data.email || '').trim(),
      phone: (data.phone || '').trim(),
      attending: attending,
      guests_count: attending === 'yes' ? (parseInt(data.guests_count) || 1) : 0,
      meal_preference: attending === 'yes' ? (data.meal_preference || '') : '',
      message: (data.message || '').trim(),
      submitted_at: data.submitted_at || new Date().toISOString(),
      ip_address: '', // Would need additional setup to capture
      user_agent: ''  // Would need additional setup to capture
    };

    // Save RSVP
    const result = saveRSVP(slug, rsvpData);

    if (result.success) {
      // Send notification if configured
      const notifyEmail = CONFIG.NOTIFY_EMAILS[slug];
      if (notifyEmail) {
        sendRSVPNotification(notifyEmail, slug, rsvpData);
      }

      return createResponse(true, 'RSVP saved successfully', {
        attending: result.counts.attending,
        notAttending: result.counts.notAttending,
        totalGuests: result.counts.totalGuests
      });
    } else {
      return createResponse(false, result.error);
    }

  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return createResponse(false, 'Server error: ' + error.toString());
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return HtmlService.createHtmlOutput(`
    <h1>RSVP Handler</h1>
    <p>This endpoint accepts POST requests with RSVP data.</p>
    <p>Expected payload:</p>
    <pre>
{
  "slug": "wedding-slug",
  "name": "Guest Name",
  "email": "guest@email.com",
  "phone": "+381...",
  "attending": "yes|no",
  "guests_count": 2,
  "meal_preference": "meat|fish|vegetarian",
  "message": "Optional message"
}
    </pre>
  `);
}

/**
 * Save RSVP to per-couple spreadsheet
 */
function saveRSVP(slug, rsvpData) {
  var spreadsheetId = lookupSpreadsheetId(slug);
  if (!spreadsheetId) {
    return { success: false, error: 'No RSVP spreadsheet found for this wedding' };
  }

  var ss;
  try {
    ss = SpreadsheetApp.openById(spreadsheetId);
  } catch (error) {
    Logger.log('Failed to open RSVP spreadsheet ' + spreadsheetId + ': ' + error.toString());
    return { success: false, error: 'Failed to open RSVP spreadsheet' };
  }

  var sheet = ss.getSheets()[0];

  // Check for duplicate submission (same name)
  const existingData = sheet.getDataRange().getValues();
  let existingRow = -1;

  for (let i = 1; i < existingData.length; i++) {
    if (existingData[i][0].toLowerCase() === rsvpData.name.toLowerCase()) {
      existingRow = i + 1;
      break;
    }
  }

  // Prepare row data
  const row = [
    rsvpData.name,
    rsvpData.email,
    rsvpData.phone,
    rsvpData.attending === 'yes' ? 'Да' : 'Не',
    rsvpData.guests_count,
    rsvpData.meal_preference,
    rsvpData.message,
    rsvpData.submitted_at
  ];

  // Update or append
  if (existingRow !== -1) {
    // Update existing row
    sheet.getRange(existingRow, 1, 1, row.length).setValues([row]);
  } else {
    // Append new row
    sheet.appendRow(row);
  }

  // Calculate counts
  const counts = calculateCounts(sheet);

  return {
    success: true,
    counts: counts
  };
}

/**
 * Calculate RSVP counts
 */
function calculateCounts(sheet) {
  const data = sheet.getDataRange().getValues();

  let attending = 0;
  let notAttending = 0;
  let totalGuests = 0;

  for (let i = 1; i < data.length; i++) {
    const isAttending = data[i][3] === 'Да' || data[i][3] === 'yes';
    const guestCount = parseInt(data[i][4]) || 1;

    if (isAttending) {
      attending++;
      totalGuests += guestCount;
    } else {
      notAttending++;
    }
  }

  return {
    attending: attending,
    notAttending: notAttending,
    totalGuests: totalGuests
  };
}

/**
 * Create JSON response
 */
function createResponse(success, message, data) {
  const response = {
    success: success,
    message: message
  };

  if (data) {
    Object.assign(response, data);
  }

  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Send RSVP notification email
 */
function sendRSVPNotification(email, slug, rsvpData) {
  const attendingText = rsvpData.attending === 'yes' ? 'ДОЛАЗИ' : 'НЕ ДОЛАЗИ';

  const subject = `Нова потврда: ${rsvpData.name} - ${attendingText}`;

  let body = `
Нова потврда доласка за ваше венчање!

Гост: ${rsvpData.name}
Статус: ${attendingText}
`;

  if (rsvpData.attending === 'yes') {
    body += `Број гостију: ${rsvpData.guests_count}
`;
    if (rsvpData.meal_preference) {
      body += `Преференција оброка: ${rsvpData.meal_preference}
`;
    }
  }

  if (rsvpData.email) {
    body += `Е-маил: ${rsvpData.email}
`;
  }

  if (rsvpData.phone) {
    body += `Телефон: ${rsvpData.phone}
`;
  }

  if (rsvpData.message) {
    body += `
Порука:
${rsvpData.message}
`;
  }

  body += `
---
Време пријаве: ${rsvpData.submitted_at}
`;

  MailApp.sendEmail(email, subject, body);
}

/**
 * Test function
 */
function testRSVP() {
  const testEvent = {
    postData: {
      contents: JSON.stringify({
        slug: 'test-wedding',
        name: 'Петар Петровић',
        email: 'petar@example.com',
        phone: '+381641234567',
        attending: 'yes',
        guests_count: 2,
        meal_preference: 'meat',
        message: 'Радујемо се!'
      })
    }
  };

  const result = doPost(testEvent);
  Logger.log(result.getContent());
}
