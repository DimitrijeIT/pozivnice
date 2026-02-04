/**
 * RSVP Count Handler
 *
 * This script provides RSVP statistics for wedding invitation pages.
 * Returns the count of attendees and non-attendees.
 *
 * Setup:
 * 1. Create a Google Sheet (or use existing one with RSVP sheets)
 * 2. Open Script Editor (Extensions > Apps Script)
 * 3. Paste this code
 * 4. Deploy as web app:
 *    - Deploy > New deployment
 *    - Select type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the web app URL to your config.js
 *
 * Usage:
 *   GET https://script.google.com/.../exec?slug=wedding-slug
 */

// Configuration
const CONFIG = {
  MASTER_SPREADSHEET_ID: PropertiesService.getScriptProperties().getProperty('MASTER_SPREADSHEET_ID') || '',
  CACHE_DURATION_SECONDS: 60 // Cache results for this many seconds
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
 * Handle GET requests for RSVP counts
 */
function doGet(e) {
  try {
    const slug = e.parameter.slug;

    if (!slug) {
      return createResponse(false, 'Missing slug parameter');
    }

    // Check cache first
    const cache = CacheService.getScriptCache();
    const cacheKey = 'rsvp_count_' + slug;
    const cached = cache.get(cacheKey);

    if (cached) {
      return ContentService
        .createTextOutput(cached)
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Get counts from sheet
    const counts = getRSVPCounts(slug);

    if (counts.success) {
      const response = createResponse(true, 'Counts retrieved', counts.data);
      const responseText = response.getContent();

      // Cache the result
      cache.put(cacheKey, responseText, CONFIG.CACHE_DURATION_SECONDS);

      return response;
    } else {
      return createResponse(false, counts.error);
    }

  } catch (error) {
    Logger.log('Error in doGet: ' + error.toString());
    return createResponse(false, 'Server error: ' + error.toString());
  }
}

/**
 * Handle POST requests (alternative method)
 */
function doPost(e) {
  // Redirect to doGet with same parameters
  return doGet(e);
}

/**
 * Get RSVP counts from per-couple spreadsheet
 */
function getRSVPCounts(slug) {
  var spreadsheetId = lookupSpreadsheetId(slug);
  if (!spreadsheetId) {
    // No spreadsheet registered yet - return zeros (graceful fallback)
    return {
      success: true,
      data: {
        attending: 0,
        notAttending: 0,
        totalGuests: 0,
        responses: 0
      }
    };
  }

  var ss;
  try {
    ss = SpreadsheetApp.openById(spreadsheetId);
  } catch (error) {
    Logger.log('Failed to open RSVP spreadsheet ' + spreadsheetId + ': ' + error.toString());
    return {
      success: true,
      data: {
        attending: 0,
        notAttending: 0,
        totalGuests: 0,
        responses: 0
      }
    };
  }

  var sheet = ss.getSheets()[0];
  const data = sheet.getDataRange().getValues();

  let attending = 0;
  let notAttending = 0;
  let totalGuests = 0;
  let responses = 0;

  // Skip header row
  for (let i = 1; i < data.length; i++) {
    // Check if row has data
    if (!data[i][0] || data[i][0].toString().trim() === '') {
      continue;
    }

    responses++;

    // Column index 3 is "Attending" (Да/Не or yes/no)
    const attendingValue = data[i][3];
    const isAttending = attendingValue === 'Да' ||
                        attendingValue === 'да' ||
                        attendingValue === 'yes' ||
                        attendingValue === 'Yes' ||
                        attendingValue === true;

    // Column index 4 is "Guests Count"
    const guestCount = parseInt(data[i][4]) || 1;

    if (isAttending) {
      attending++;
      totalGuests += guestCount;
    } else {
      notAttending++;
    }
  }

  return {
    success: true,
    data: {
      attending: attending,
      notAttending: notAttending,
      totalGuests: totalGuests,
      responses: responses
    }
  };
}

/**
 * Create JSON response with CORS headers
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
 * Clear cache for a specific wedding (call this after manual edits)
 */
function clearCache(slug) {
  const cache = CacheService.getScriptCache();
  const cacheKey = 'rsvp_count_' + slug;
  cache.remove(cacheKey);
  Logger.log('Cache cleared for: ' + slug);
}

/**
 * Clear all caches
 */
function clearAllCaches() {
  // Note: CacheService doesn't have a clearAll method
  // This is a placeholder - you'd need to track all slugs and clear them individually
  Logger.log('Note: Clear individual caches using clearCache(slug)');
}

/**
 * Test function
 */
function testGetCounts() {
  const testEvent = {
    parameter: {
      slug: 'test-wedding'
    }
  };

  const result = doGet(testEvent);
  Logger.log(result.getContent());
}

/**
 * Debug function - list all registered RSVP spreadsheets
 */
function listRSVPSpreadsheets() {
  var ss = CONFIG.MASTER_SPREADSHEET_ID
    ? SpreadsheetApp.openById(CONFIG.MASTER_SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();

  var lookupSheet = ss.getSheetByName('RSVP_Lookup');
  if (!lookupSheet) {
    Logger.log('No RSVP_Lookup tab found');
    return [];
  }

  var data = lookupSheet.getDataRange().getValues();
  var slugs = [];
  for (var i = 1; i < data.length; i++) {
    slugs.push(data[i][0]);
  }

  Logger.log('Registered RSVP spreadsheets: ' + slugs.join(', '));
  return slugs;
}
