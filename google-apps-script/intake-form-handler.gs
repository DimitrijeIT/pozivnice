/**
 * Intake Form Handler
 *
 * This script handles new wedding intake form submissions.
 * It should be attached to a Google Form as an onFormSubmit trigger.
 *
 * Setup:
 * 1. Create a Google Form with the required fields
 * 2. Create a Google Sheet to store responses
 * 3. Open Script Editor (Extensions > Apps Script)
 * 4. Paste this code
 * 5. Set up a trigger: Triggers > Add Trigger > onFormSubmit
 *
 * Required Form Fields:
 * - Име младе (Bride's Name)
 * - Име младожење (Groom's Name)
 * - Датум венчања (Wedding Date)
 * - Место церемоније (Ceremony Venue)
 * - Адреса церемоније (Ceremony Address)
 * - Време церемоније (Ceremony Time)
 * - Место прославе (Reception Venue)
 * - Адреса прославе (Reception Address)
 * - Време прославе (Reception Time)
 * - Е-маил за контакт (Contact Email)
 */

// Configuration
const CONFIG = {
  MASTER_SHEET_NAME: 'Weddings',
  WEBHOOK_URL: '', // Optional: URL to notify when new wedding is submitted
  NOTIFY_EMAIL: '' // Optional: Email to notify on new submission
};

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
 * Main form submit handler
 */
function onFormSubmit(e) {
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
      bride_name: formData['Име младе'] || formData['Bride Name'] || '',
      groom_name: formData['Име младожење'] || formData['Groom Name'] || '',
      wedding_date: formData['Датум венчања'] || formData['Wedding Date'] || '',
      ceremony_venue: formData['Место церемоније'] || formData['Ceremony Venue'] || '',
      ceremony_address: formData['Адреса церемоније'] || formData['Ceremony Address'] || '',
      ceremony_time: formData['Време церемоније'] || formData['Ceremony Time'] || '',
      reception_venue: formData['Место прославе'] || formData['Reception Venue'] || '',
      reception_address: formData['Адреса прославе'] || formData['Reception Address'] || '',
      reception_time: formData['Време прославе'] || formData['Reception Time'] || '',
      contact_email: formData['Е-маил за контакт'] || formData['Contact Email'] || '',
      story_text: formData['Ваша прича'] || formData['Your Story'] || '',
      dress_code_text: formData['Дрес код'] || formData['Dress Code'] || '',
      additional_info: formData['Додатне информације'] || formData['Additional Info'] || ''
    };

    // Generate slug
    weddingData.slug = generateSlug(weddingData.bride_name, weddingData.groom_name);

    // Add metadata
    weddingData.status = 'pending_theme_selection';
    weddingData.submitted_at = new Date().toISOString();
    weddingData.selected_theme = '';
    weddingData.theme_selected_at = '';

    // Add to master sheet
    addToMasterSheet(weddingData);

    // Send notification if configured
    if (CONFIG.NOTIFY_EMAIL) {
      sendNotificationEmail(weddingData);
    }

    // Call webhook if configured
    if (CONFIG.WEBHOOK_URL) {
      callWebhook(weddingData);
    }

    Logger.log('Successfully processed wedding submission: ' + weddingData.slug);

  } catch (error) {
    Logger.log('Error processing form submission: ' + error.toString());
    throw error;
  }
}

/**
 * Add wedding data to master sheet
 */
function addToMasterSheet(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.MASTER_SHEET_NAME);

  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.MASTER_SHEET_NAME);

    // Add headers
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
      'Story',
      'Dress Code',
      'Additional Info',
      'Status',
      'Submitted At',
      'Selected Theme',
      'Theme Selected At'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }

  // Add data row
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
    data.story_text,
    data.dress_code_text,
    data.additional_info,
    data.status,
    data.submitted_at,
    data.selected_theme,
    data.theme_selected_at
  ];

  sheet.appendRow(row);
}

/**
 * Send notification email
 */
function sendNotificationEmail(data) {
  const subject = 'Нова пријава за позивницу: ' + data.bride_name + ' & ' + data.groom_name;
  const body = `
Примљена је нова пријава за венчање!

Младенци: ${data.bride_name} & ${data.groom_name}
Датум венчања: ${data.wedding_date}
Slug: ${data.slug}

Церемонија:
  Место: ${data.ceremony_venue}
  Адреса: ${data.ceremony_address}
  Време: ${data.ceremony_time}

Прослава:
  Место: ${data.reception_venue}
  Адреса: ${data.reception_address}
  Време: ${data.reception_time}

Контакт: ${data.contact_email}

---
Следећи корак: Генериши преглед и пошаљи линк младенцима.
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
    payload: JSON.stringify({
      event: 'new_wedding_submission',
      data: data
    })
  };

  try {
    UrlFetchApp.fetch(CONFIG.WEBHOOK_URL, options);
  } catch (error) {
    Logger.log('Webhook call failed: ' + error.toString());
  }
}

/**
 * Test function - manually trigger with sample data
 */
function testSubmission() {
  const testData = {
    bride_name: 'Ана',
    groom_name: 'Марко',
    wedding_date: '2025-06-15',
    ceremony_venue: 'Храм Светог Саве',
    ceremony_address: 'Крушедолска 2а, Београд',
    ceremony_time: '14:00',
    reception_venue: 'Ресторан Карабурма',
    reception_address: 'Мирјане Миочиновић 10, Београд',
    reception_time: '17:00',
    contact_email: 'test@example.com',
    story_text: 'Упознали смо се на факултету...',
    dress_code_text: 'Елегантна одећа',
    additional_info: ''
  };

  testData.slug = generateSlug(testData.bride_name, testData.groom_name);
  testData.status = 'pending_theme_selection';
  testData.submitted_at = new Date().toISOString();
  testData.selected_theme = '';
  testData.theme_selected_at = '';

  addToMasterSheet(testData);
  Logger.log('Test submission added: ' + testData.slug);
}
