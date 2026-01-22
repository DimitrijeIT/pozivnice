/**
 * Automated Intake Form Handler
 *
 * This script handles new wedding intake form submissions
 * and automatically triggers GitHub Actions to generate the preview site.
 *
 * Setup:
 * 1. Create a Google Form with the required fields (see below)
 * 2. Create a Google Sheet linked to the form
 * 3. Open Script Editor (Extensions > Apps Script)
 * 4. Paste this code
 * 5. Add your GitHub token to Script Properties:
 *    - Project Settings > Script Properties > Add
 *    - GITHUB_TOKEN = your_personal_access_token
 *    - GITHUB_REPO = username/repo-name
 * 6. Set up trigger: Triggers > Add Trigger > onFormSubmit
 *
 * Required Form Fields (exact names in Serbian):
 * - Име младе
 * - Име младожење
 * - Датум венчања
 * - Е-маил за контакт
 * - Место церемоније
 * - Адреса церемоније
 * - Време церемоније
 * - Место прославе
 * - Адреса прославе
 * - Време прославе
 */

/**
 * Get configuration from Script Properties
 */
function getConfig() {
  const props = PropertiesService.getScriptProperties();
  return {
    GITHUB_TOKEN: props.getProperty('GITHUB_TOKEN') || '',
    GITHUB_REPO: props.getProperty('GITHUB_REPO') || '', // format: username/repo
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

  let combined = brideName + '-' + groomName;
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
 * Main form submit handler - Automated version
 */
function onFormSubmit(e) {
  const CONFIG = getConfig();

  try {
    const response = e.response;
    const itemResponses = response.getItemResponses();

    // Extract form data
    const formData = {};
    itemResponses.forEach(function(itemResponse) {
      const title = itemResponse.getItem().getTitle();
      formData[title] = itemResponse.getResponse();
    });

    // Map form fields to data object
    const weddingData = {
      bride_name: formData['Име младе'] || '',
      groom_name: formData['Име младожење'] || '',
      wedding_date: formatDateForJson(formData['Датум венчања']),
      ceremony_venue: formData['Место церемоније'] || '',
      ceremony_address: formData['Адреса церемоније'] || '',
      ceremony_time: formData['Време церемоније'] || '',
      ceremony_map_url: formData['Google Maps линк за церемонију'] || '',
      reception_venue: formData['Место прославе'] || '',
      reception_address: formData['Адреса прославе'] || '',
      reception_time: formData['Време прославе'] || '',
      reception_map_url: formData['Google Maps линк за прославу'] || '',
      contact_email: formData['Е-маил за контакт'] || '',
      contact_phone: formData['Телефон за контакт'] || '',
      story_text: formData['Ваша прича (како сте се упознали)'] || '',
      dress_code_text: formData['Дрес код'] || '',
      rsvp_deadline: formatDateForJson(formData['Рок за потврду доласка (RSVP)']),
      wedding_hashtag: formData['Хаштаг венчања'] || '',
      additional_info: formData['Додатне напомене'] || '',
      invitation_intro: 'Са великом радошћу вас позивамо',
      invitation_text: 'да присуствујете нашем венчању и прослави љубави.',
      invitation_signature: 'Са љубављу, младенци'
    };

    // Generate slug
    weddingData.slug = generateSlug(weddingData.bride_name, weddingData.groom_name);

    // Add metadata
    weddingData.status = 'preview_generating';
    weddingData.submitted_at = new Date().toISOString();
    weddingData.selected_theme = '';
    weddingData.theme_selected_at = '';

    // Add to master sheet
    addToMasterSheet(weddingData, CONFIG);

    // Trigger GitHub Actions to generate preview
    if (CONFIG.GITHUB_TOKEN && CONFIG.GITHUB_REPO) {
      const success = triggerGitHubAction(weddingData, CONFIG);

      if (success) {
        updateStatus(weddingData.slug, 'preview_generating', CONFIG);
        Logger.log('GitHub Action triggered for: ' + weddingData.slug);
      } else {
        updateStatus(weddingData.slug, 'generation_failed', CONFIG);
        Logger.log('Failed to trigger GitHub Action for: ' + weddingData.slug);
      }
    } else {
      Logger.log('GitHub not configured - manual generation required for: ' + weddingData.slug);

      // Send notification email for manual processing
      if (CONFIG.NOTIFY_EMAIL) {
        sendManualNotificationEmail(weddingData, CONFIG);
      }
    }

    Logger.log('Successfully processed wedding submission: ' + weddingData.slug);

  } catch (error) {
    Logger.log('Error processing form submission: ' + error.toString());
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
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();

    if (responseCode === 204 || responseCode === 200) {
      Logger.log('GitHub Action triggered successfully');
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
 * Add wedding data to master sheet
 */
function addToMasterSheet(data, CONFIG) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.MASTER_SHEET_NAME);

  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.MASTER_SHEET_NAME);

    const headers = [
      'Slug',
      'Bride Name',
      'Groom Name',
      'Wedding Date',
      'Ceremony Venue',
      'Ceremony Address',
      'Ceremony Time',
      'Reception Venue',
      'Reception Address',
      'Reception Time',
      'Contact Email',
      'Contact Phone',
      'Story',
      'Dress Code',
      'RSVP Deadline',
      'Hashtag',
      'Additional Info',
      'Status',
      'Submitted At',
      'Selected Theme',
      'Theme Selected At',
      'Preview URL',
      'Final URL'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  const row = [
    data.slug,
    data.bride_name,
    data.groom_name,
    data.wedding_date,
    data.ceremony_venue,
    data.ceremony_address,
    data.ceremony_time,
    data.reception_venue,
    data.reception_address,
    data.reception_time,
    data.contact_email,
    data.contact_phone,
    data.story_text,
    data.dress_code_text,
    data.rsvp_deadline,
    data.wedding_hashtag,
    data.additional_info,
    data.status,
    data.submitted_at,
    data.selected_theme,
    data.theme_selected_at,
    '', // Preview URL - filled later
    ''  // Final URL - filled later
  ];

  sheet.appendRow(row);
}

/**
 * Update wedding status in sheet
 */
function updateStatus(slug, newStatus, CONFIG) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.MASTER_SHEET_NAME);

  if (!sheet) return;

  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === slug) {
      sheet.getRange(i + 1, 18).setValue(newStatus); // Status column
      break;
    }
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
 * Test function
 */
function testSubmission() {
  const CONFIG = getConfig();

  const testData = {
    bride_name: 'Ана',
    groom_name: 'Марко',
    wedding_date: '2025-06-15',
    ceremony_venue: 'Храм Светог Саве',
    ceremony_address: 'Крушедолска 2а, Београд',
    ceremony_time: '14:00',
    ceremony_map_url: '',
    reception_venue: 'Ресторан Карабурма',
    reception_address: 'Мирјане Миочиновић 10, Београд',
    reception_time: '17:00',
    reception_map_url: '',
    contact_email: 'test@example.com',
    contact_phone: '+381641234567',
    story_text: 'Упознали смо се на факултету...',
    dress_code_text: 'Елегантна одећа',
    rsvp_deadline: '2025-06-01',
    wedding_hashtag: '#АнаИМарко2025',
    additional_info: '',
    invitation_intro: 'Са великом радошћу вас позивамо',
    invitation_text: 'да присуствујете нашем венчању.',
    invitation_signature: 'Са љубављу, младенци'
  };

  testData.slug = generateSlug(testData.bride_name, testData.groom_name);
  testData.status = 'test';
  testData.submitted_at = new Date().toISOString();
  testData.selected_theme = '';
  testData.theme_selected_at = '';

  // Test GitHub trigger
  if (CONFIG.GITHUB_TOKEN && CONFIG.GITHUB_REPO) {
    Logger.log('Testing GitHub Action trigger...');
    const success = triggerGitHubAction(testData, CONFIG);
    Logger.log('GitHub trigger result: ' + success);
  } else {
    Logger.log('GitHub not configured. Set GITHUB_TOKEN and GITHUB_REPO in Script Properties.');
  }
}

/**
 * Setup instructions - run this to see configuration steps
 */
function showSetupInstructions() {
  Logger.log(`
=== SETUP INSTRUCTIONS ===

1. Go to Project Settings (gear icon)
2. Click "Script Properties"
3. Add these properties:

   GITHUB_TOKEN = your_personal_access_token
   (Create at: https://github.com/settings/tokens with 'repo' scope)

   GITHUB_REPO = your-username/invitations
   (Your GitHub repository)

   NOTIFY_EMAIL = your-email@example.com
   (Optional: for notifications)

4. Set up trigger:
   - Click Triggers (clock icon)
   - Add Trigger
   - Function: onFormSubmit
   - Event source: From spreadsheet
   - Event type: On form submit

5. Authorize the script when prompted

=========================
  `);
}
