/**
 * Love Story Handler
 *
 * This script generates AI-powered love stories for wedding invitations
 * using Google's Gemini 2.5 Flash API via Google Apps Script.
 *
 * Setup:
 * 1. Open Google Apps Script (script.google.com)
 * 2. Create a new project
 * 3. Paste this code
 * 4. Add your Gemini API key:
 *    - Project Settings > Script Properties
 *    - Add property: GEMINI_API_KEY = your_api_key
 *    - Get a free key at https://aistudio.google.com/app/apikey
 * 5. Deploy as web app:
 *    - Deploy > New deployment
 *    - Select type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the web app URL to form.html CONFIG.STORY_HANDLER_URL
 */

/**
 * Handle POST requests for story generation
 */
function doPost(e) {
  try {
    var data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      return createResponse({ success: false, error: 'Nisu primljeni podaci' });
    }

    var howMet = (data.how_met || '').trim();
    var firstDate = (data.first_date || '').trim();
    var proposal = (data.proposal || '').trim();
    var tone = (data.tone || 'romantican').trim();

    if (!howMet && !firstDate && !proposal) {
      return createResponse({ success: false, error: 'Unesite bar jedan detalj' });
    }

    var apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    if (!apiKey) {
      return createResponse({ success: false, error: 'API kljuc nije konfigurisan' });
    }

    var prompt = buildPrompt(howMet, firstDate, proposal, tone);
    var story = callGemini(apiKey, prompt);

    return createResponse({ success: true, story: story });

  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return createResponse({ success: false, error: 'Greska na serveru' });
  }
}

/**
 * Handle GET requests (health check)
 */
function doGet(e) {
  return createResponse({ status: 'ok', message: 'Love Story Handler is running' });
}

/**
 * Build the Serbian-language prompt for Gemini
 */
function buildPrompt(howMet, firstDate, proposal, tone) {
  var toneDescriptions = {
    'romantican': 'romantican i nezan, sa toplim emocijama',
    'duhovit': 'duhovit i zabavan, sa lakim humorom',
    'poetican': 'poetican i lirski, sa lepim opisima',
    'jednostavan': 'jednostavan i iskren, bez preterivanja'
  };

  var toneDesc = toneDescriptions[tone] || toneDescriptions['romantican'];

  var prompt = 'Napisi kratku ljubavnu pricu za svadbenu pozivnicu na srpskom jeziku (latinica). ';
  prompt += 'Prica treba da bude ' + toneDesc + '. ';
  prompt += 'Prica treba da ima 3-5 recenica, da bude topla i licna. ';
  prompt += 'Ne koristi klikse poput "sudjeno im je bilo" ili "ljubav na prvi pogled" osim ako to zaista odgovara. ';
  prompt += 'Pisi u trecem licu. ';
  prompt += '\n\nDetalji o paru:\n';

  if (howMet) {
    prompt += '- Kako su se upoznali: ' + howMet + '\n';
  }
  if (firstDate) {
    prompt += '- Prvi sastanak: ' + firstDate + '\n';
  }
  if (proposal) {
    prompt += '- Prosidba: ' + proposal + '\n';
  }

  prompt += '\nVrati SAMO tekst price, bez naslova, bez navodnika, bez dodatnih objasnjenja.';

  return prompt;
}

/**
 * Call Gemini 2.5 Flash API
 */
function callGemini(apiKey, prompt) {
  var url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey;

  var payload = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 300,
      topP: 0.9
    }
  };

  var options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(url, options);
  var json = JSON.parse(response.getContentText());

  if (json.error) {
    throw new Error('Gemini API error: ' + json.error.message);
  }

  if (json.candidates && json.candidates[0] && json.candidates[0].content) {
    return json.candidates[0].content.parts[0].text.trim();
  }

  throw new Error('Unexpected Gemini response format');
}

/**
 * Create a JSON response
 */
function createResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function — run from Apps Script editor
 */
function testStoryGeneration() {
  var testEvent = {
    postData: {
      contents: JSON.stringify({
        how_met: 'Upoznali smo se na fakultetu, u istoj grupi za vezbe iz matematike',
        first_date: 'Otisli smo na kafu u centru grada, pricali satima o svemu',
        proposal: 'Na putovanju u Grckoj, na zalazak sunca pored mora',
        tone: 'romantican'
      })
    }
  };

  var result = doPost(testEvent);
  Logger.log(result.getContent());
}
