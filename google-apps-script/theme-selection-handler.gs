/**
 * Theme Selection Handler
 *
 * This script handles theme selection from the preview page.
 * Deploy as a web app to receive POST requests from the theme selector.
 *
 * Setup:
 * 1. Create a Google Sheet (or use existing one with Weddings sheet)
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
  SPREADSHEET_ID: '', // Leave empty to use active spreadsheet
  MASTER_SHEET_NAME: 'Weddings',
  NOTIFY_EMAIL: '', // Optional: Email to notify on theme selection
  WEBHOOK_URL: '' // Optional: Webhook to call when theme is selected
};

/**
 * Handle POST requests for theme selection
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

    const slug = data.slug;
    const theme = data.theme;
    const selectedAt = data.selected_at || new Date().toISOString();

    if (!slug || !theme) {
      return createResponse(false, 'Missing required fields: slug and theme');
    }

    // Update the wedding record
    const result = updateWeddingTheme(slug, theme, selectedAt);

    if (result.success) {
      // Send notification if configured
      if (CONFIG.NOTIFY_EMAIL) {
        sendThemeNotification(slug, theme, result.weddingData);
      }

      // Call webhook if configured
      if (CONFIG.WEBHOOK_URL) {
        callWebhook({
          event: 'theme_selected',
          slug: slug,
          theme: theme,
          selected_at: selectedAt
        });
      }

      return createResponse(true, 'Theme selection saved', { slug, theme });
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
    <h1>Theme Selection Handler</h1>
    <p>This endpoint accepts POST requests with theme selection data.</p>
    <p>Expected payload:</p>
    <pre>
{
  "slug": "wedding-slug",
  "theme": "classic|modern|romantic|minimal|rustic",
  "selected_at": "2025-01-01T00:00:00Z"
}
    </pre>
  `);
}

/**
 * Update wedding record with selected theme
 */
function updateWeddingTheme(slug, theme, selectedAt) {
  const ss = CONFIG.SPREADSHEET_ID
    ? SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();

  const sheet = ss.getSheetByName(CONFIG.MASTER_SHEET_NAME);

  if (!sheet) {
    return { success: false, error: 'Master sheet not found' };
  }

  // Find the row with matching slug
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const slugCol = headers.indexOf('Slug');
  const themeCol = headers.indexOf('Selected Theme');
  const themeAtCol = headers.indexOf('Theme Selected At');
  const statusCol = headers.indexOf('Status');

  if (slugCol === -1) {
    return { success: false, error: 'Slug column not found' };
  }

  // Find the wedding row
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][slugCol] === slug) {
      rowIndex = i + 1; // +1 because array is 0-indexed but sheets are 1-indexed
      break;
    }
  }

  if (rowIndex === -1) {
    return { success: false, error: 'Wedding not found: ' + slug };
  }

  // Update theme columns
  if (themeCol !== -1) {
    sheet.getRange(rowIndex, themeCol + 1).setValue(theme);
  }
  if (themeAtCol !== -1) {
    sheet.getRange(rowIndex, themeAtCol + 1).setValue(selectedAt);
  }
  if (statusCol !== -1) {
    sheet.getRange(rowIndex, statusCol + 1).setValue('theme_selected');
  }

  // Get wedding data for notification
  const weddingData = {};
  headers.forEach((header, index) => {
    weddingData[header] = data[rowIndex - 1][index];
  });

  return {
    success: true,
    weddingData: weddingData
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
    response.data = data;
  }

  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Send theme selection notification
 */
function sendThemeNotification(slug, theme, weddingData) {
  const themeNames = {
    'classic': 'Класичан',
    'modern': 'Модеран',
    'romantic': 'Романтичан',
    'minimal': 'Минималистички',
    'rustic': 'Рустикални'
  };

  const subject = 'Тема изабрана: ' + (weddingData['Bride Name'] || '') + ' & ' + (weddingData['Groom Name'] || '');
  const body = `
Младенци су изабрали тему за своју позивницу!

Slug: ${slug}
Изабрана тема: ${themeNames[theme] || theme}

Младенци: ${weddingData['Bride Name'] || ''} & ${weddingData['Groom Name'] || ''}
Датум венчања: ${weddingData['Wedding Date'] || ''}

---
Следећи корак: Генериши финалну страницу и објави.
  `;

  MailApp.sendEmail(CONFIG.NOTIFY_EMAIL, subject, body);
}

/**
 * Call webhook URL
 */
function callWebhook(data) {
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(data)
  };

  try {
    UrlFetchApp.fetch(CONFIG.WEBHOOK_URL, options);
  } catch (error) {
    Logger.log('Webhook call failed: ' + error.toString());
  }
}

/**
 * Test function
 */
function testThemeSelection() {
  const testEvent = {
    postData: {
      contents: JSON.stringify({
        slug: 'ana-marko',
        theme: 'classic',
        selected_at: new Date().toISOString()
      })
    }
  };

  const result = doPost(testEvent);
  Logger.log(result.getContent());
}
