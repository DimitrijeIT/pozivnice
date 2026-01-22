/**
 * Automated Theme Selection Handler
 *
 * This script handles theme selection from the preview page
 * and automatically triggers GitHub Actions to generate the final site.
 *
 * Setup:
 * 1. Create a NEW Google Apps Script project (script.google.com)
 * 2. Paste this code
 * 3. Add Script Properties (Project Settings > Script Properties):
 *    - GITHUB_TOKEN = your GitHub personal access token
 *    - GITHUB_REPO = username/repo-name (e.g., DimitrijeIT/pozivnice)
 * 4. Deploy as web app:
 *    - Deploy > New deployment
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the web app URL to your templates (THEME_SELECTION_URL in config.js)
 */

/**
 * Get configuration from Script Properties
 */
function getConfig() {
  const props = PropertiesService.getScriptProperties();
  return {
    GITHUB_TOKEN: props.getProperty('GITHUB_TOKEN') || '',
    GITHUB_REPO: props.getProperty('GITHUB_REPO') || ''
  };
}

/**
 * Handle POST requests for theme selection
 */
function doPost(e) {
  const CONFIG = getConfig();

  try {
    Logger.log('Received POST request');
    Logger.log('PostData: ' + (e.postData ? e.postData.contents : 'none'));

    let data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    } else {
      Logger.log('No data received');
      return createResponse(false, 'No data received');
    }

    Logger.log('Parsed data: ' + JSON.stringify(data));

    const slug = data.slug;
    const theme = data.theme;

    if (!slug) {
      Logger.log('Missing slug');
      return createResponse(false, 'Missing wedding slug');
    }

    if (!theme) {
      Logger.log('Missing theme');
      return createResponse(false, 'Missing theme selection');
    }

    // Valid themes
    const validThemes = [
      'classic', 'modern', 'romantic', 'minimal', 'rustic',
      'botanical', 'moody', 'gatsby', 'editorial', 'whimsical'
    ];

    if (!validThemes.includes(theme)) {
      Logger.log('Invalid theme: ' + theme);
      return createResponse(false, 'Invalid theme: ' + theme);
    }

    Logger.log('Processing theme selection: ' + slug + ' -> ' + theme);

    // Trigger GitHub Action to generate final site
    if (CONFIG.GITHUB_TOKEN && CONFIG.GITHUB_REPO) {
      Logger.log('Triggering GitHub Action...');
      Logger.log('Repo: ' + CONFIG.GITHUB_REPO);

      const success = triggerFinalSiteGeneration(slug, theme, CONFIG);

      if (success) {
        Logger.log('GitHub Action triggered successfully');
        return createResponse(true, 'Theme selected! Your site is being generated.', {
          slug: slug,
          theme: theme,
          status: 'generating'
        });
      } else {
        Logger.log('Failed to trigger GitHub Action');
        return createResponse(false, 'Theme saved but generation failed. Please contact support.');
      }
    } else {
      Logger.log('GitHub not configured');
      Logger.log('GITHUB_TOKEN exists: ' + (CONFIG.GITHUB_TOKEN ? 'yes' : 'no'));
      Logger.log('GITHUB_REPO exists: ' + (CONFIG.GITHUB_REPO ? 'yes' : 'no'));
      return createResponse(false, 'Server not configured. Please contact support.');
    }

  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
    return createResponse(false, 'Server error: ' + error.toString());
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  const CONFIG = getConfig();

  return HtmlService.createHtmlOutput(`
    <h1>Theme Selection Handler</h1>
    <p>Status: <strong style="color: ${CONFIG.GITHUB_TOKEN && CONFIG.GITHUB_REPO ? 'green' : 'red'}">
      ${CONFIG.GITHUB_TOKEN && CONFIG.GITHUB_REPO ? 'Configured ✓' : 'Not configured ✗'}
    </strong></p>
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
 * Trigger GitHub Actions to generate final site
 */
function triggerFinalSiteGeneration(slug, theme, CONFIG) {
  const url = 'https://api.github.com/repos/' + CONFIG.GITHUB_REPO + '/dispatches';

  const payload = {
    event_type: 'theme-selected',
    client_payload: {
      slug: slug,
      theme: theme
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
    Logger.log('Calling GitHub API: ' + url);
    Logger.log('Payload: ' + JSON.stringify(payload));

    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();

    Logger.log('GitHub API response code: ' + responseCode);
    Logger.log('GitHub API response: ' + responseText);

    if (responseCode === 204 || responseCode === 200) {
      Logger.log('Final site generation triggered for: ' + slug + ' with theme: ' + theme);
      return true;
    } else {
      Logger.log('GitHub API error: ' + responseCode + ' - ' + responseText);
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
 * Test function - run manually to test the GitHub trigger
 */
function testThemeSelection() {
  const CONFIG = getConfig();

  Logger.log('=== Testing Theme Selection ===');
  Logger.log('GITHUB_TOKEN exists: ' + (CONFIG.GITHUB_TOKEN ? 'YES (length: ' + CONFIG.GITHUB_TOKEN.length + ')' : 'NO'));
  Logger.log('GITHUB_REPO: ' + (CONFIG.GITHUB_REPO || 'NOT SET'));

  if (!CONFIG.GITHUB_TOKEN || !CONFIG.GITHUB_REPO) {
    Logger.log('ERROR: Missing configuration. Add GITHUB_TOKEN and GITHUB_REPO to Script Properties.');
    return;
  }

  const testSlug = 'test-' + Date.now();
  const testTheme = 'botanical';

  Logger.log('Test slug: ' + testSlug);
  Logger.log('Test theme: ' + testTheme);

  const success = triggerFinalSiteGeneration(testSlug, testTheme, CONFIG);
  Logger.log('Trigger result: ' + (success ? 'SUCCESS' : 'FAILED'));
}

/**
 * Show setup instructions
 */
function showSetupInstructions() {
  Logger.log(`
=== THEME SELECTION HANDLER SETUP ===

1. Go to Project Settings (gear icon on left)
2. Scroll down to "Script Properties"
3. Click "Add script property" and add:

   GITHUB_TOKEN = your_personal_access_token
   (Same token as intake form handler)

   GITHUB_REPO = your-username/pozivnice
   (Same repo as intake form handler)

4. Deploy as Web App:
   - Click Deploy > New deployment
   - Select type: Web app
   - Execute as: Me
   - Who has access: Anyone
   - Click Deploy

5. Copy the Web App URL

6. Update THEME_SELECTION_URL in scripts/config.js

7. Re-run generate-preview to use new URL

=====================================
  `);
}
