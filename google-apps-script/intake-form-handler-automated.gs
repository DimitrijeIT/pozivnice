/**
 * Automated Intake Form Handler
 *
 * This script handles new wedding intake form submissions
 * and automatically triggers GitHub Actions to generate the preview site.
 *
 * Setup:
 * 1. Create a Google Form with the required fields
 * 2. Create a Google Sheet linked to the form
 * 3. Open Script Editor (Extensions > Apps Script)
 * 4. Paste this code
 * 5. Add your GitHub token to Script Properties:
 *    - Project Settings > Script Properties > Add
 *    - GITHUB_TOKEN = your_personal_access_token
 *    - GITHUB_REPO = username/repo-name
 * 6. Set up trigger: Triggers > Add Trigger > onFormSubmit
 *    - Event source: From spreadsheet
 *    - Event type: On form submit
 */

/**
 * Get configuration from Script Properties
 */
function getConfig() {
  const props = PropertiesService.getScriptProperties();
  return {
    GITHUB_TOKEN: props.getProperty('GITHUB_TOKEN') || '',
    GITHUB_REPO: props.getProperty('GITHUB_REPO') || '',
    MASTER_SHEET_NAME: 'Weddings',
    NOTIFY_EMAIL: props.getProperty('NOTIFY_EMAIL') || ''
  };
}

/**
 * Generate URL-safe slug from names
 */
function generateSlug(brideName, groomName) {
  const cyrillicToLatin = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'ђ': 'dj', 'е': 'e',
    'ж': 'z', 'з': 'z', 'и': 'i', 'ј': 'j', 'к': 'k', 'л': 'l', 'љ': 'lj',
    'м': 'm', 'н': 'n', 'њ': 'nj', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's',
    'т': 't', 'ћ': 'c', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'c',
    'џ': 'dz', 'ш': 's',
    'А': 'a', 'Б': 'b', 'В': 'v', 'Г': 'g', 'Д': 'd', 'Ђ': 'dj', 'Е': 'e',
    'Ж': 'z', 'З': 'z', 'И': 'i', 'Ј': 'j', 'К': 'k', 'Л': 'l', 'Љ': 'lj',
    'М': 'm', 'Н': 'n', 'Њ': 'nj', 'О': 'o', 'П': 'p', 'Р': 'r', 'С': 's',
    'Т': 't', 'Ћ': 'c', 'У': 'u', 'Ф': 'f', 'Х': 'h', 'Ц': 'c', 'Ч': 'c',
    'Џ': 'dz', 'Ш': 's'
  };

  let combined = (brideName || '') + '-' + (groomName || '');
  let slug = '';

  for (let i = 0; i < combined.length; i++) {
    const char = combined[i];
    slug += cyrillicToLatin[char] || char;
  }

  slug = slug.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug;
}

/**
 * Format date for JSON (ISO 8601)
 */
function formatDateForJson(dateValue) {
  if (!dateValue) return '';

  // If it's already a string in YYYY-MM-DD format, return it
  if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return dateValue;
  }

  // If it's a Date object
  if (dateValue instanceof Date) {
    return dateValue.toISOString().split('T')[0];
  }

  // Try to parse string date
  const date = new Date(dateValue);
  if (!isNaN(date.getTime())) {
    return date.toISOString().split('T')[0];
  }

  return dateValue.toString();
}

/**
 * Main form submit handler - Works with SPREADSHEET trigger
 * Event source: From spreadsheet
 * Event type: On form submit
 */
function onFormSubmit(e) {
  const CONFIG = getConfig();

  try {
    Logger.log('Form submit event received');
    Logger.log('Event object: ' + JSON.stringify(e));

    // Get form data from namedValues (spreadsheet trigger)
    let formData = {};

    if (e.namedValues) {
      // Spreadsheet trigger - e.namedValues contains arrays
      Logger.log('Using namedValues');
      for (let key in e.namedValues) {
        // namedValues returns arrays, get first element
        formData[key] = e.namedValues[key][0] || '';
      }
    } else if (e.values) {
      // Alternative: use e.values with column headers
      Logger.log('Using values array');
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

      for (let i = 0; i < headers.length && i < e.values.length; i++) {
        formData[headers[i]] = e.values[i] || '';
      }
    } else {
      Logger.log('No form data found in event');
      return;
    }

    Logger.log('Parsed form data: ' + JSON.stringify(formData));

    // Map form fields to data object (flexible field name matching)
    const weddingData = {
      bride_name: formData['Име младе'] || formData['Bride Name'] || formData['име младе'] || '',
      groom_name: formData['Име младожење'] || formData['Groom Name'] || formData['име младожење'] || '',
      wedding_date: formatDateForJson(formData['Датум венчања'] || formData['Wedding Date'] || formData['датум венчања'] || ''),
      ceremony_venue: formData['Место церемоније'] || formData['Ceremony Venue'] || formData['место церемоније'] || '',
      ceremony_address: formData['Адреса церемоније'] || formData['Ceremony Address'] || formData['адреса церемоније'] || '',
      ceremony_time: formData['Време церемоније'] || formData['Ceremony Time'] || formData['време церемоније'] || '',
      ceremony_map_url: formData['Google Maps линк за церемонију'] || formData['Ceremony Map URL'] || '',
      reception_venue: formData['Место прославе'] || formData['Reception Venue'] || formData['место прославе'] || '',
      reception_address: formData['Адреса прославе'] || formData['Reception Address'] || formData['адреса прославе'] || '',
      reception_time: formData['Време прославе'] || formData['Reception Time'] || formData['време прославе'] || '',
      reception_map_url: formData['Google Maps линк за прославу'] || formData['Reception Map URL'] || '',
      contact_email: formData['Е-маил за контакт'] || formData['Contact Email'] || formData['е-маил за контакт'] || formData['Email'] || '',
      contact_phone: formData['Телефон за контакт'] || formData['Phone'] || formData['телефон за контакт'] || '',
      story_text: formData['Ваша прича (како сте се упознали)'] || formData['Ваша прича'] || formData['Story'] || '',
      dress_code_text: formData['Дрес код'] || formData['Dress Code'] || formData['дрес код'] || '',
      rsvp_deadline: formatDateForJson(formData['Рок за потврду доласка (RSVP)'] || formData['RSVP Deadline'] || ''),
      wedding_hashtag: formData['Хаштаг венчања'] || formData['Hashtag'] || formData['хаштаг венчања'] || '',
      additional_info: formData['Додатне напомене'] || formData['Additional Info'] || formData['додатне напомене'] || '',
      invitation_intro: 'Са великом радошћу вас позивамо',
      invitation_text: 'да присуствујете нашем венчању и прослави љубави.',
      invitation_signature: 'Са љубављу, младенци'
    };

    Logger.log('Wedding data: ' + JSON.stringify(weddingData));

    // Validate required fields
    if (!weddingData.bride_name || !weddingData.groom_name) {
      Logger.log('Missing required fields: bride_name or groom_name');
      return;
    }

    // Generate slug
    weddingData.slug = generateSlug(weddingData.bride_name, weddingData.groom_name);
    Logger.log('Generated slug: ' + weddingData.slug);

    // Add metadata
    weddingData.status = 'preview_generating';
    weddingData.submitted_at = new Date().toISOString();
    weddingData.selected_theme = '';
    weddingData.theme_selected_at = '';

    // Trigger GitHub Actions to generate preview
    if (CONFIG.GITHUB_TOKEN && CONFIG.GITHUB_REPO) {
      Logger.log('Triggering GitHub Action...');
      Logger.log('Repo: ' + CONFIG.GITHUB_REPO);

      const success = triggerGitHubAction(weddingData, CONFIG);

      if (success) {
        Logger.log('GitHub Action triggered successfully for: ' + weddingData.slug);
      } else {
        Logger.log('Failed to trigger GitHub Action for: ' + weddingData.slug);
      }
    } else {
      Logger.log('GitHub not configured - GITHUB_TOKEN or GITHUB_REPO missing');
      Logger.log('GITHUB_TOKEN exists: ' + (CONFIG.GITHUB_TOKEN ? 'yes' : 'no'));
      Logger.log('GITHUB_REPO exists: ' + (CONFIG.GITHUB_REPO ? 'yes' : 'no'));

      // Send notification email for manual processing
      if (CONFIG.NOTIFY_EMAIL) {
        sendManualNotificationEmail(weddingData, CONFIG);
      }
    }

    Logger.log('Successfully processed wedding submission: ' + weddingData.slug);

  } catch (error) {
    Logger.log('Error processing form submission: ' + error.toString());
    Logger.log('Error stack: ' + error.stack);
    throw error;
  }
}

/**
 * Trigger GitHub Actions workflow via repository dispatch
 */
function triggerGitHubAction(weddingData, CONFIG) {
  const url = 'https://api.github.com/repos/' + CONFIG.GITHUB_REPO + '/dispatches';

  const payload = {
    event_type: 'new-wedding',
    client_payload: {
      slug: weddingData.slug,
      contact_email: weddingData.contact_email,
      wedding_data: weddingData
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
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();

    Logger.log('GitHub API response code: ' + responseCode);
    Logger.log('GitHub API response: ' + responseText);

    if (responseCode === 204 || responseCode === 200) {
      Logger.log('GitHub Action triggered successfully');
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
 * Send manual notification email (when GitHub not configured)
 */
function sendManualNotificationEmail(data, CONFIG) {
  const subject = 'Нова пријава за позивницу: ' + data.bride_name + ' & ' + data.groom_name;
  const body = `
Примљена је нова пријава за венчање!

Младенци: ${data.bride_name} & ${data.groom_name}
Датум венчања: ${data.wedding_date}
Slug: ${data.slug}

Контакт: ${data.contact_email}

---
Следећи корак: Покрени команду за генерисање прегледа:
node scripts/generate-preview.js ${data.slug}
  `;

  MailApp.sendEmail(CONFIG.NOTIFY_EMAIL, subject, body);
}

/**
 * Process a specific row from the sheet manually
 * Change the ROW_NUMBER to the row you want to process
 */
function processRowManually() {
  const ROW_NUMBER = 2; // Change this to the row you want to process (2 = first data row after headers)

  const CONFIG = getConfig();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rowData = sheet.getRange(ROW_NUMBER, 1, 1, sheet.getLastColumn()).getValues()[0];

  // Build formData object from row
  let formData = {};
  for (let i = 0; i < headers.length; i++) {
    formData[headers[i]] = rowData[i] || '';
  }

  Logger.log('Processing row ' + ROW_NUMBER);
  Logger.log('Form data: ' + JSON.stringify(formData));

  // Build wedding data (same logic as onFormSubmit)
  const weddingData = {
    bride_name: formData['Име младе'] || formData['Bride Name'] || '',
    groom_name: formData['Име младожење'] || formData['Groom Name'] || '',
    wedding_date: formatDateForJson(formData['Датум венчања'] || formData['Wedding Date'] || ''),
    ceremony_venue: formData['Место церемоније'] || formData['Ceremony Venue'] || '',
    ceremony_address: formData['Адреса церемоније'] || formData['Ceremony Address'] || '',
    ceremony_time: formData['Време церемоније'] || formData['Ceremony Time'] || '',
    ceremony_map_url: formData['Google Maps линк за церемонију'] || formData['Ceremony Map URL'] || '',
    reception_venue: formData['Место прославе'] || formData['Reception Venue'] || '',
    reception_address: formData['Адреса прославе'] || formData['Reception Address'] || '',
    reception_time: formData['Време прославе'] || formData['Reception Time'] || '',
    reception_map_url: formData['Google Maps линк за прославу'] || formData['Reception Map URL'] || '',
    contact_email: formData['Е-маил за контакт'] || formData['Contact Email'] || formData['Email'] || '',
    contact_phone: formData['Телефон за контакт'] || formData['Phone'] || '',
    story_text: formData['Ваша прича (како сте се упознали)'] || formData['Ваша прича'] || formData['Story'] || '',
    dress_code_text: formData['Дрес код'] || formData['Dress Code'] || '',
    rsvp_deadline: formatDateForJson(formData['Рок за потврду доласка (RSVP)'] || formData['RSVP Deadline'] || ''),
    wedding_hashtag: formData['Хаштаг венчања'] || formData['Hashtag'] || '',
    additional_info: formData['Додатне напомене'] || formData['Additional Info'] || '',
    invitation_intro: 'Са великом радошћу вас позивамо',
    invitation_text: 'да присуствујете нашем венчању и прослави љубави.',
    invitation_signature: 'Са љубављу, младенци'
  };

  if (!weddingData.bride_name || !weddingData.groom_name) {
    Logger.log('ERROR: Missing bride_name or groom_name');
    return;
  }

  weddingData.slug = generateSlug(weddingData.bride_name, weddingData.groom_name);
  weddingData.status = 'preview_generating';
  weddingData.submitted_at = new Date().toISOString();

  Logger.log('Wedding slug: ' + weddingData.slug);

  if (CONFIG.GITHUB_TOKEN && CONFIG.GITHUB_REPO) {
    const success = triggerGitHubAction(weddingData, CONFIG);
    Logger.log('GitHub trigger result: ' + (success ? 'SUCCESS' : 'FAILED'));
  } else {
    Logger.log('ERROR: GitHub not configured');
  }
}

/**
 * Test function - run manually to test the GitHub trigger
 */
function testGitHubTrigger() {
  const CONFIG = getConfig();

  Logger.log('=== Testing GitHub Configuration ===');
  Logger.log('GITHUB_TOKEN exists: ' + (CONFIG.GITHUB_TOKEN ? 'YES (length: ' + CONFIG.GITHUB_TOKEN.length + ')' : 'NO'));
  Logger.log('GITHUB_REPO: ' + (CONFIG.GITHUB_REPO || 'NOT SET'));

  if (!CONFIG.GITHUB_TOKEN || !CONFIG.GITHUB_REPO) {
    Logger.log('ERROR: Missing configuration. Add GITHUB_TOKEN and GITHUB_REPO to Script Properties.');
    return;
  }

  const testData = {
    bride_name: 'Тест',
    groom_name: 'Тест',
    wedding_date: '2025-06-15',
    ceremony_venue: 'Тест Место',
    ceremony_address: 'Тест Адреса 123',
    ceremony_time: '14:00',
    reception_venue: 'Тест Ресторан',
    reception_address: 'Тест Адреса 456',
    reception_time: '17:00',
    contact_email: 'test@example.com',
    slug: 'test-' + Date.now(),
    invitation_intro: 'Са великом радошћу вас позивамо',
    invitation_text: 'да присуствујете нашем венчању.',
    invitation_signature: 'Са љубављу'
  };

  Logger.log('Test data slug: ' + testData.slug);

  const success = triggerGitHubAction(testData, CONFIG);
  Logger.log('Trigger result: ' + (success ? 'SUCCESS' : 'FAILED'));
}

/**
 * Show setup instructions
 */
function showSetupInstructions() {
  Logger.log(`
=== SETUP INSTRUCTIONS ===

1. Go to Project Settings (gear icon on left)
2. Scroll down to "Script Properties"
3. Click "Add script property" and add:

   GITHUB_TOKEN = your_personal_access_token
   (Create at: https://github.com/settings/tokens with 'repo' scope)

   GITHUB_REPO = your-username/invitations
   (Your GitHub repository, e.g., 'john/wedding-invitations')

4. Make sure the trigger is set up:
   - Click Triggers (clock icon)
   - Add Trigger
   - Function: onFormSubmit
   - Event source: From spreadsheet
   - Event type: On form submit

5. To test: Run the testGitHubTrigger function

=========================
  `);
}
