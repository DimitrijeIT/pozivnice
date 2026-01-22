/**
 * Automated Theme Selection Handler
 *
 * This script handles theme selection from the preview page
 * and automatically triggers GitHub Actions to generate the final site.
 *
 * Setup:
 * 1. Open Script Editor in your Google Sheet
 * 2. Paste this code
 * 3. Add Script Properties (same as intake handler):
 *    - GITHUB_TOKEN
 *    - GITHUB_REPO
 * 4. Deploy as web app:
 *    - Deploy > New deployment
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the web app URL to your config.js (THEME_SELECTION_URL)
 */

/**
 * Get configuration from Script Properties
 */
function getConfig() {
  const props = PropertiesService.getScriptProperties();
  return {
    GITHUB_TOKEN: props.getProperty('GITHUB_TOKEN') || '',
    GITHUB_REPO: props.getProperty('GITHUB_REPO') || '',
    MASTER_SHEET_NAME: 'Weddings'
  };
}

/**
 * Handle POST requests for theme selection
 */
function doPost(e) {
  const CONFIG = getConfig();

  try {
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

    if (!slug) {
      return createResponse(false, 'Missing wedding slug');
    }

    if (!theme) {
      return createResponse(false, 'Missing theme selection');
    }

    // Valid themes
    const validThemes = [
      'classic', 'modern', 'romantic', 'minimal', 'rustic',
      'botanical', 'moody', 'gatsby', 'editorial', 'whimsical'
    ];

    if (!validThemes.includes(theme)) {
      return createResponse(false, 'Invalid theme: ' + theme);
    }

    // Get wedding data from sheet
    const weddingData = getWeddingData(slug, CONFIG);

    if (!weddingData) {
      return createResponse(false, 'Wedding not found: ' + slug);
    }

    // Update theme selection in sheet
    updateThemeSelection(slug, theme, CONFIG);

    // Trigger GitHub Action to generate final site
    if (CONFIG.GITHUB_TOKEN && CONFIG.GITHUB_REPO) {
      const success = triggerFinalSiteGeneration(slug, theme, weddingData.contact_email, CONFIG);

      if (success) {
        return createResponse(true, 'Theme selected and final site generation started', {
          slug: slug,
          theme: theme,
          status: 'generating'
        });
      } else {
        return createResponse(false, 'Theme saved but automatic generation failed. Contact support.');
      }
    } else {
      return createResponse(true, 'Theme selected. Site will be generated shortly.', {
        slug: slug,
        theme: theme,
        status: 'pending_generation'
      });
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
  "theme": "botanical"
}
    </pre>
    <p>Valid themes: classic, modern, romantic, minimal, rustic, botanical, moody, gatsby, editorial, whimsical</p>
  `);
}

/**
 * Get wedding data from sheet
 */
function getWeddingData(slug, CONFIG) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.MASTER_SHEET_NAME);

  if (!sheet) return null;

  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === slug) {
      const wedding = {};
      headers.forEach((header, index) => {
        wedding[header.toLowerCase().replace(/ /g, '_')] = data[i][index];
      });
      return wedding;
    }
  }

  return null;
}

/**
 * Update theme selection in sheet
 */
function updateThemeSelection(slug, theme, CONFIG) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.MASTER_SHEET_NAME);

  if (!sheet) return;

  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === slug) {
      const row = i + 1;
      sheet.getRange(row, 18).setValue('final_generating'); // Status
      sheet.getRange(row, 20).setValue(theme); // Selected Theme
      sheet.getRange(row, 21).setValue(new Date().toISOString()); // Theme Selected At
      break;
    }
  }
}

/**
 * Trigger GitHub Actions to generate final site
 */
function triggerFinalSiteGeneration(slug, theme, contactEmail, CONFIG) {
  const url = 'https://api.github.com/repos/' + CONFIG.GITHUB_REPO + '/dispatches';

  const payload = {
    event_type: 'theme-selected',
    client_payload: {
      slug: slug,
      theme: theme,
      contact_email: contactEmail || ''
    }
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': 'token ' + CONFIG.GITHUB_TOKEN,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Google-Apps-Script'
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();

    if (responseCode === 204 || responseCode === 200) {
      Logger.log('Final site generation triggered for: ' + slug + ' with theme: ' + theme);
      return true;
    } else {
      Logger.log('GitHub API error: ' + responseCode + ' - ' + response.getContentText());
      return false;
    }
  } catch (error) {
    Logger.log('Error triggering GitHub Action: ' + error.toString());
    return false;
  }
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
 * Test function
 */
function testThemeSelection() {
  const CONFIG = getConfig();

  const testEvent = {
    postData: {
      contents: JSON.stringify({
        slug: 'ana-marko',
        theme: 'botanical'
      })
    }
  };

  const result = doPost(testEvent);
  Logger.log(result.getContent());
}
