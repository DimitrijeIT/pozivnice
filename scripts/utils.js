/**
 * Utility functions for wedding invitation generation
 */

const config = require('./config');

/**
 * Escape HTML special characters to prevent XSS attacks
 * @param {string} str - String to escape
 * @returns {string} HTML-escaped string
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  const stringValue = String(str);
  const htmlEscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return stringValue.replace(/[&<>"']/g, char => htmlEscapeMap[char]);
}

/**
 * Escape string for use in HTML attributes
 * @param {string} str - String to escape
 * @returns {string} Attribute-safe string
 */
function escapeAttribute(str) {
  if (str === null || str === undefined) return '';
  return escapeHtml(String(str)).replace(/\n/g, '&#10;').replace(/\r/g, '&#13;');
}

/**
 * Generate URL-safe slug from bride and groom names
 * @param {string} brideName - Bride's name
 * @param {string} groomName - Groom's name
 * @returns {string} URL-safe slug
 */
function slugify(brideName, groomName, weddingDate) {
  const combined = `${brideName}-${groomName}`;

  // Transliteration map for Serbian Cyrillic to Latin
  const cyrillicToLatin = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'ђ': 'dj', 'е': 'e',
    'ж': 'z', 'з': 'z', 'и': 'i', 'ј': 'j', 'к': 'k', 'л': 'l', 'љ': 'lj',
    'м': 'm', 'н': 'n', 'њ': 'nj', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's',
    'т': 't', 'ћ': 'c', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'c',
    'џ': 'dz', 'ш': 's',
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Ђ': 'Dj', 'Е': 'E',
    'Ж': 'Z', 'З': 'Z', 'И': 'I', 'Ј': 'J', 'К': 'K', 'Л': 'L', 'Љ': 'Lj',
    'М': 'M', 'Н': 'N', 'Њ': 'Nj', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S',
    'Т': 'T', 'Ћ': 'C', 'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'C', 'Ч': 'C',
    'Џ': 'Dz', 'Ш': 'S'
  };

  let slug = combined;

  // Transliterate Cyrillic characters
  slug = slug.split('').map(char => cyrillicToLatin[char] || char).join('');

  // Convert to lowercase
  slug = slug.toLowerCase();

  // Replace spaces and special characters with hyphens
  slug = slug.replace(/[^a-z0-9]+/g, '-');

  // Remove leading/trailing hyphens
  slug = slug.replace(/^-+|-+$/g, '');

  // Append wedding year
  let year = '';
  if (weddingDate) {
    const parsed = new Date(weddingDate);
    if (!isNaN(parsed.getTime())) {
      year = parsed.getFullYear().toString();
    }
  }
  if (!year) {
    year = new Date().getFullYear().toString();
  }
  slug = slug + '-' + year;

  return slug;
}

/**
 * Replace placeholders in template with data
 * @param {string} template - Template string with {{PLACEHOLDER}} syntax
 * @param {object} data - Data object with values
 * @param {object} options - Options for replacement
 * @param {string[]} options.rawFields - Fields that should not be HTML-escaped (contain trusted HTML)
 * @returns {string} Processed template
 */
function replacePlaceholders(template, data, options = {}) {
  let result = template;

  // Fields that contain trusted HTML and should not be escaped
  const rawFields = new Set(options.rawFields || [
    'THEME_CSS',
    'THEME_FONTS',
    'ANIMATIONS_CSS',
    'CALENDAR_BUTTONS',
    'TIMELINE_ITEMS',
    'GALLERY_ITEMS',
    'MEAL_OPTIONS',
    'MEAL_OPTIONS_HTML',
    'DRESS_CODE_COLOR_SWATCHES',
    '_themeCss',
    '_themeFonts'
  ]);

  // Replace simple placeholders {{VARIABLE}}
  for (const [key, value] of Object.entries(data)) {
    const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    let safeValue = '';

    if (value !== undefined && value !== null) {
      // Skip escaping for raw HTML fields and URL fields
      if (rawFields.has(key) || key.endsWith('_URL') || key.endsWith('_ISO')) {
        safeValue = String(value);
      } else {
        safeValue = escapeHtml(String(value));
      }
    }

    result = result.replace(placeholder, safeValue);
  }

  return result;
}

/**
 * Process conditional blocks in template
 * Syntax: {{#IF_CONDITION}}...content...{{/IF_CONDITION}}
 * @param {string} template - Template with conditional blocks
 * @param {object} data - Data object (truthy values show content)
 * @returns {string} Processed template
 */
function processConditionals(template, data) {
  let result = template;

  // Match {{#IF_SOMETHING}}...{{/IF_SOMETHING}}
  const conditionalRegex = /\{\{#IF_(\w+)\}\}([\s\S]*?)\{\{\/IF_\1\}\}/g;

  // Loop to handle nested conditionals (inner ones exposed after outer ones resolve)
  let previous;
  do {
    previous = result;
    result = result.replace(conditionalRegex, (match, condition, content) => {
      const key = condition;
      const value = data[key];

      // Check if the value is truthy
      if (value && value !== '' && value !== 'false' && value !== '0') {
        return content;
      }
      return '';
    });
  } while (result !== previous);

  return result;
}

/**
 * Format date in Serbian
 * @param {Date|string} date - Date object or ISO string
 * @param {string} format - Format type: 'full', 'short', 'time'
 * @returns {string} Formatted date string
 */
function formatDate(date, format = 'full') {
  const d = typeof date === 'string' ? new Date(date) : date;

  const months = [
    'јануара', 'фебруара', 'марта', 'априла', 'маја', 'јуна',
    'јула', 'августа', 'септембра', 'октобра', 'новембра', 'децембра'
  ];

  const days = [
    'недеља', 'понедељак', 'уторак', 'среда', 'четвртак', 'петак', 'субота'
  ];

  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const dayName = days[d.getDay()];
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  switch (format) {
    case 'full':
      return `${dayName}, ${day}. ${month} ${year}.`;
    case 'short':
      return `${day}. ${month} ${year}.`;
    case 'date-only':
      return `${day}.${d.getMonth() + 1}.${year}.`;
    case 'time':
      return `${hours}:${minutes}`;
    case 'datetime':
      return `${day}. ${month} ${year}. у ${hours}:${minutes}`;
    default:
      return d.toLocaleDateString('sr-RS');
  }
}

/**
 * Generate font links based on theme
 * @param {string} theme - Theme name
 * @returns {string} HTML link tags for fonts
 */
function getThemeFonts(theme) {
  const fontLinks = {
    classic: `
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
    `,
    modern: `
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500&display=swap" rel="stylesheet">
    `,
    romantic: `
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Raleway:wght@300;400;500;600&display=swap" rel="stylesheet">
    `,
    minimal: `<!-- Minimal theme uses system fonts - no external fonts needed -->`,
    rustic: `
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&family=Josefin+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
    `,
    botanical: `
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet">
    `,
    moody: `
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Raleway:wght@300;400;500;600&display=swap" rel="stylesheet">
    `,
    gatsby: `
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Poiret+One&family=Josefin+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
    `,
    editorial: `
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    `,
    whimsical: `
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Quicksand:wght@400;500;600&display=swap" rel="stylesheet">
    `
  };

  return fontLinks[theme] || '';
}

/**
 * Generate color swatches HTML from array of colors
 * @param {string[]} colors - Array of color hex codes
 * @returns {string} HTML for color swatches
 */
function generateColorSwatches(colors) {
  if (!colors || !Array.isArray(colors) || colors.length === 0) {
    return '';
  }

  // Validate color format (only allow valid CSS color values)
  const validColorRegex = /^#[0-9A-Fa-f]{3,8}$|^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$|^[a-zA-Z]+$/;

  return colors
    .filter(color => validColorRegex.test(color))
    .map(color =>
      `<div class="color-swatch" style="background-color: ${escapeAttribute(color)};" title="${escapeAttribute(color)}"></div>`
    ).join('\n');
}

/**
 * Generate meal options HTML
 * @param {object[]} options - Array of meal option objects {value, label}
 * @returns {string} HTML options for select
 */
function generateMealOptions(options) {
  if (!options || !Array.isArray(options) || options.length === 0) {
    return '';
  }

  return options.map(opt =>
    `<option value="${escapeAttribute(opt.value)}">${escapeHtml(opt.label)}</option>`
  ).join('\n');
}

/**
 * Generate timeline items HTML for love story section
 * @param {object[]} events - Array of timeline event objects {date, title, description, icon}
 * @returns {string} HTML for timeline items
 */
function generateTimelineItems(events) {
  if (!events || !Array.isArray(events) || events.length === 0) {
    return '';
  }

  return events.map(event => `
    <div class="timeline-item">
      ${event.icon ? `<div class="timeline-icon">${escapeHtml(event.icon)}</div>` : ''}
      <div class="timeline-date">${escapeHtml(event.date)}</div>
      <h3 class="timeline-title">${escapeHtml(event.title)}</h3>
      <p class="timeline-description">${escapeHtml(event.description)}</p>
    </div>
  `).join('\n');
}

/**
 * Generate gallery items HTML for photo gallery section
 * @param {object[]} photos - Array of photo objects {url, thumbnail, caption}
 * @returns {string} HTML for gallery items
 */
function generateGalleryItems(photos) {
  if (!photos || !Array.isArray(photos) || photos.length === 0) {
    return '';
  }

  return photos.map((photo, index) => {
    const safeUrl = escapeAttribute(photo.url);
    const safeThumbnail = escapeAttribute(photo.thumbnail || photo.url);
    const safeCaption = escapeHtml(photo.caption || '');
    const safeAlt = escapeAttribute(photo.caption || `Фотографија ${index + 1}`);

    return `
    <button type="button" class="gallery-item" data-full-src="${safeUrl}" data-caption="${escapeAttribute(photo.caption || '')}" aria-label="Отвори фотографију ${index + 1}">
      <img src="${safeThumbnail}" alt="${safeAlt}" loading="lazy">
      <div class="gallery-item-overlay">
        <p class="gallery-item-caption">${safeCaption}</p>
      </div>
    </button>`;
  }).join('\n');
}

/**
 * Get floating decoration icons based on theme
 * @param {string} theme - Theme name
 * @returns {object} Object with FLOATING_ICON_1 through FLOATING_ICON_8
 */
function getFloatingIcons(theme) {
  const themeIcons = {
    classic: ['💍', '✨', '💐', '🕊️', '💒', '🥂', '💝', '🌹'],
    modern: ['◆', '○', '□', '△', '◇', '●', '■', '▲'],
    romantic: ['💕', '🌸', '💗', '🌷', '💖', '🌺', '💘', '🌼'],
    minimal: ['·', '·', '·', '·', '·', '·', '·', '·'],
    rustic: ['🌿', '🍃', '🌾', '🌻', '🌲', '🍂', '🌱', '🌳'],
    botanical: ['🌿', '🍃', '🌱', '🪻', '🌾', '🪴', '🌿', '🍃'],
    moody: ['✦', '◆', '✧', '❧', '✦', '◇', '✧', '❧'],
    gatsby: ['◆', '✦', '◇', '★', '◆', '✧', '◇', '☆'],
    editorial: ['●', '■', '▲', '◆', '○', '□', '△', '◇'],
    whimsical: ['✿', '❀', '♡', '☆', '✿', '❀', '♥', '★']
  };

  const icons = themeIcons[theme] || themeIcons.classic;

  return {
    FLOATING_ICON_1: icons[0],
    FLOATING_ICON_2: icons[1],
    FLOATING_ICON_3: icons[2],
    FLOATING_ICON_4: icons[3],
    FLOATING_ICON_5: icons[4],
    FLOATING_ICON_6: icons[5],
    FLOATING_ICON_7: icons[6],
    FLOATING_ICON_8: icons[7]
  };
}

/**
 * Generate calendar links for the wedding event
 * @param {object} data - Wedding data with date, time, venue, address
 * @returns {object} Object with Google, Outlook, and ICS calendar links
 */
function generateCalendarLinks(data) {
  const weddingDate = new Date(data.wedding_date);
  const [hours, minutes] = (data.ceremony_time || '14:00').split(':');

  // Set ceremony start time
  const startDate = new Date(weddingDate);
  startDate.setHours(parseInt(hours), parseInt(minutes), 0);

  // End time (assume 8 hours for wedding)
  const endDate = new Date(startDate);
  endDate.setHours(startDate.getHours() + 8);

  // Format for Google Calendar (YYYYMMDDTHHmmss) in local time (no Z suffix)
  const formatGoogleDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${y}${m}${d}T${h}${min}${s}`;
  };

  // Event details
  const title = encodeURIComponent(`Венчање: ${data.bride_name} & ${data.groom_name}`);
  const ceremonyLocation = encodeURIComponent(`${data.ceremony_venue}, ${data.ceremony_address}`);
  const receptionInfo = data.reception_venue ?
    `Прослава: ${data.reception_venue}, ${data.reception_address} у ${data.reception_time}` : '';
  const description = encodeURIComponent(
    `Венчање: ${data.ceremony_venue} у ${data.ceremony_time}\n${receptionInfo}`.trim()
  );

  // Google Calendar link
  const googleStart = formatGoogleDate(startDate);
  const googleEnd = formatGoogleDate(endDate);
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${googleStart}/${googleEnd}&location=${ceremonyLocation}&details=${description}`;

  // Outlook Web Calendar link (use local ISO format without Z)
  const formatOutlookDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${y}-${m}-${d}T${h}:${min}:${s}`;
  };
  const outlookStart = formatOutlookDate(startDate);
  const outlookEnd = formatOutlookDate(endDate);
  const outlookCalendarUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&startdt=${outlookStart}&enddt=${outlookEnd}&location=${ceremonyLocation}&body=${description}`;

  // ICS file content (for Apple Calendar and others)
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wedding Invitation//SR',
    'BEGIN:VEVENT',
    `DTSTART:${formatGoogleDate(startDate)}`,
    `DTEND:${formatGoogleDate(endDate)}`,
    `SUMMARY:Венчање: ${data.bride_name} & ${data.groom_name}`,
    `LOCATION:${data.ceremony_venue}, ${data.ceremony_address}`,
    `DESCRIPTION:${description.replace(/%0A/g, '\\n')}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\n');

  // Data URI for ICS download
  const icsDataUri = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;

  return {
    google: googleCalendarUrl,
    outlook: outlookCalendarUrl,
    ics: icsDataUri,
    icsFilename: `${data.slug || 'wedding'}.ics`
  };
}

/**
 * Generate calendar buttons HTML
 * @param {object} calendarLinks - Calendar links object from generateCalendarLinks
 * @returns {string} HTML for calendar buttons
 */
function generateCalendarButtons(calendarLinks) {
  return `
    <div class="calendar-buttons">
      <a href="${calendarLinks.google}" target="_blank" rel="noopener" class="calendar-btn calendar-btn-google">
        <span class="calendar-icon">📅</span>
        <span>Google Calendar</span>
      </a>
      <a href="${calendarLinks.outlook}" target="_blank" rel="noopener" class="calendar-btn calendar-btn-outlook">
        <span class="calendar-icon">📆</span>
        <span>Outlook</span>
      </a>
      <a href="${calendarLinks.ics}" download="${calendarLinks.icsFilename}" class="calendar-btn calendar-btn-ics">
        <span class="calendar-icon">🗓️</span>
        <span>Apple / iCal</span>
      </a>
    </div>
  `;
}

/**
 * Calculate expiry date from now
 * @param {number} hours - Hours until expiry
 * @returns {Date} Expiry date
 */
function calculateExpiryDate(hours = config.PREVIEW_EXPIRY_HOURS) {
  const now = new Date();
  return new Date(now.getTime() + hours * 60 * 60 * 1000);
}

/**
 * Generate theme cards HTML for preview selector
 * Uses visibility config to only show non-hidden themes
 * @param {object} weddingData - Wedding data object
 * @returns {string} HTML for theme cards
 */
function generateThemeCards(weddingData) {
  // Use visibility-filtered themes instead of full list
  const themes = config.getVisibleOriginalThemes ? config.getVisibleOriginalThemes() : config.THEMES;
  const themeNames = config.THEME_NAMES;
  const themeDescriptions = config.THEME_DESCRIPTIONS;

  return themes.map(theme => `
    <div class="theme-card">
      <div class="theme-preview">
        <img src="${theme}.html" alt="${themeNames[theme]}" style="display:none;">
        <iframe src="${theme}.html" style="width:100%;height:100%;border:none;pointer-events:none;" loading="lazy"></iframe>
      </div>
      <div class="theme-info">
        <h3 class="theme-name">${themeNames[theme]}</h3>
        <p class="theme-description">${themeDescriptions[theme]}</p>
        <div class="theme-actions">
          <a href="${theme}.html" target="_blank" class="btn btn-secondary">Преглед</a>
          <button class="btn btn-primary" data-select-theme="${theme}">Изабери</button>
        </div>
      </div>
    </div>
  `).join('\n');
}

/**
 * Create metadata object for a preview
 * @param {object} weddingData - Wedding data
 * @returns {object} Metadata object
 */
function createPreviewMetadata(weddingData) {
  return {
    slug: weddingData.slug,
    bride_name: weddingData.bride_name,
    groom_name: weddingData.groom_name,
    created_at: new Date().toISOString(),
    expires_at: calculateExpiryDate().toISOString(),
    themes: config.THEMES
  };
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  // Simple but effective email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate phone number format (Serbian format support)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  // Allow common phone formats: +381..., 06..., with optional spaces/dashes
  const phoneRegex = /^[\+]?[(]?[0-9]{2,4}[)]?[-\s\.]?[0-9]{2,4}[-\s\.]?[0-9]{2,8}$/;
  return phoneRegex.test(phone.trim().replace(/\s/g, ''));
}

/**
 * Validate date string format
 * @param {string} dateStr - Date string to validate
 * @returns {boolean} True if valid date
 */
function isValidDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

/**
 * Validate time format (HH:MM)
 * @param {string} timeStr - Time string to validate
 * @returns {boolean} True if valid
 */
function isValidTime(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return false;
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(timeStr.trim());
}

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid
 */
function isValidUrl(url) {
  if (!url || typeof url !== 'string') return true; // URLs are optional
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate wedding data has required fields
 * @param {object} data - Wedding data object
 * @param {object} options - Validation options
 * @param {boolean} options.strict - Enable strict validation (default: false)
 * @returns {object} { valid: boolean, errors: string[], warnings: string[] }
 */
function validateWeddingData(data, options = {}) {
  const { strict = false } = options;

  // Only names and date are truly required — everything else gets defaults
  const required = [
    'bride_name',
    'groom_name',
    'wedding_date'
  ];

  // These fields are recommended but will use defaults if missing
  const recommended = [
    'ceremony_venue',
    'ceremony_address',
    'ceremony_time',
    'reception_venue',
    'reception_address',
    'reception_time'
  ];

  const errors = [];
  const warnings = [];

  // Check required fields (hard fail)
  for (const field of required) {
    const value = data[field];
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Check recommended fields (warn and apply defaults)
  const defaults = {
    ceremony_venue: '',
    ceremony_address: '',
    ceremony_time: '14:00',
    reception_venue: '',
    reception_address: '',
    reception_time: '18:00'
  };
  for (const field of recommended) {
    const value = data[field];
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      if (defaults[field]) {
        warnings.push(`Missing ${field}, using default: ${defaults[field]}`);
        data[field] = defaults[field];
      } else {
        warnings.push(`Missing recommended field: ${field}`);
      }
    }
  }

  // Validate date format
  if (data.wedding_date && !isValidDate(data.wedding_date)) {
    errors.push('Invalid wedding_date format. Use ISO 8601 format (YYYY-MM-DD)');
  }

  // Validate RSVP deadline if provided
  if (data.rsvp_deadline && !isValidDate(data.rsvp_deadline)) {
    errors.push('Invalid rsvp_deadline format. Use ISO 8601 format (YYYY-MM-DD)');
  }

  // Validate time formats
  if (data.ceremony_time && !isValidTime(data.ceremony_time)) {
    errors.push('Invalid ceremony_time format. Use HH:MM format (e.g., 14:00)');
  }
  if (data.reception_time && !isValidTime(data.reception_time)) {
    errors.push('Invalid reception_time format. Use HH:MM format (e.g., 18:00)');
  }

  // Validate URLs
  const urlFields = ['ceremony_map_url', 'reception_map_url', 'music_url', 'story_photo_url'];
  for (const field of urlFields) {
    if (data[field] && !isValidUrl(data[field])) {
      if (strict) {
        errors.push(`Invalid URL format for ${field}`);
      } else {
        warnings.push(`Invalid URL format for ${field}`);
      }
    }
  }

  // Validate meal options structure
  if (data.meal_options) {
    if (!Array.isArray(data.meal_options)) {
      errors.push('meal_options must be an array');
    } else {
      data.meal_options.forEach((opt, i) => {
        if (!opt.value || !opt.label) {
          errors.push(`meal_options[${i}] must have value and label properties`);
        }
      });
    }
  }

  // Validate gallery structure
  if (data.gallery) {
    if (!Array.isArray(data.gallery)) {
      errors.push('gallery must be an array');
    } else {
      data.gallery.forEach((photo, i) => {
        if (!photo.url) {
          errors.push(`gallery[${i}] must have url property`);
        }
      });
    }
  }

  // Validate timeline structure
  if (data.timeline) {
    if (!Array.isArray(data.timeline)) {
      errors.push('timeline must be an array');
    } else {
      data.timeline.forEach((event, i) => {
        if (!event.title || !event.date) {
          warnings.push(`timeline[${i}] should have title and date properties`);
        }
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Prepare wedding data with computed fields
 * @param {object} rawData - Raw wedding data
 * @param {string} theme - Optional theme name for theme-specific settings
 * @returns {object} Prepared data with all computed fields
 */
function prepareWeddingData(rawData, theme = 'classic') {
  const data = { ...rawData };

  // Generate slug if not provided
  if (!data.slug) {
    data.slug = slugify(data.bride_name, data.groom_name, data.wedding_date);
  }

  // Format dates
  const weddingDate = new Date(data.wedding_date);
  data.WEDDING_DATE_ISO = weddingDate.toISOString();
  data.WEDDING_DATE_FORMATTED = formatDate(weddingDate, 'full');

  // Get floating icons for theme
  const floatingIcons = getFloatingIcons(theme);

  // Map data to template variables
  const templateData = {
    // Names
    BRIDE_NAME: data.bride_name,
    GROOM_NAME: data.groom_name,
    WEDDING_SLUG: data.slug,

    // Dates
    WEDDING_DATE_ISO: data.WEDDING_DATE_ISO,
    WEDDING_DATE_FORMATTED: data.WEDDING_DATE_FORMATTED,

    // Ceremony
    CEREMONY_TIME: data.ceremony_time,
    CEREMONY_VENUE: data.ceremony_venue,
    CEREMONY_ADDRESS: data.ceremony_address,
    CEREMONY_MAP_URL: data.ceremony_map_url || '',

    // Reception
    RECEPTION_TIME: data.reception_time,
    RECEPTION_VENUE: data.reception_venue,
    RECEPTION_ADDRESS: data.reception_address,
    RECEPTION_MAP_URL: data.reception_map_url || '',

    // Invitation text
    INVITATION_INTRO: data.invitation_intro || 'Са великом радошћу вас позивамо на наше венчање',
    INVITATION_TEXT: data.invitation_text || 'Молимо вас да нам се придружите у прослави нашег венчања.',
    INVITATION_SIGNATURE: data.invitation_signature || 'Са љубављу, младенци',

    // Optional sections
    STORY_TEXT: data.story_text || '',
    STORY_PHOTO_URL: data.story_photo_url || '',
    DRESS_CODE_TEXT: data.dress_code_text || '',
    ADDITIONAL_INFO: data.additional_info || '',
    WEDDING_HASHTAG: data.wedding_hashtag || '',

    // RSVP
    RSVP_DEADLINE: data.rsvp_deadline ? formatDate(data.rsvp_deadline, 'short') : '',

    // Music player (Trend #3)
    MUSIC_URL: data.music_url || '',
    MUSIC_TITLE: data.music_title || 'Наша песма',
    MUSIC_ARTIST: data.music_artist || '',

    // Timeline (Trend #4)
    TIMELINE_ITEMS: generateTimelineItems(data.timeline),

    // Gallery (Trend #2)
    GALLERY_ITEMS: generateGalleryItems(data.gallery),

    // Floating icons (Trend #1)
    ...floatingIcons,

    // Conditional flags
    STORY: data.story_text ? 'true' : '',
    STORY_PHOTO: data.story_photo_url ? 'true' : '',
    DRESS_CODE: data.dress_code_text ? 'true' : '',
    DRESS_CODE_COLORS: data.dress_code_colors && data.dress_code_colors.length > 0 ? 'true' : '',
    ADDITIONAL_INFO: data.additional_info ? 'true' : '',
    CEREMONY_MAP: data.ceremony_map_url ? 'true' : '',
    RECEPTION_MAP: data.reception_map_url ? 'true' : '',
    HASHTAG: data.wedding_hashtag ? 'true' : '',
    MEAL_OPTIONS: data.meal_options && data.meal_options.length > 0 ? 'true' : '',

    // New conditional flags for trends
    MUSIC: data.music_url ? 'true' : '',
    TIMELINE: data.timeline && data.timeline.length > 0 ? 'true' : '',
    GALLERY: data.gallery && data.gallery.length > 0 ? 'true' : '',

    // Generated HTML
    DRESS_CODE_COLOR_SWATCHES: generateColorSwatches(data.dress_code_colors),
    MEAL_OPTIONS_HTML: generateMealOptions(data.meal_options),

    // Script URLs
    RSVP_SCRIPT_URL: config.RSVP_SCRIPT_URL,
    THEME_SELECTION_URL: config.THEME_SELECTION_URL
  };

  // Rename MEAL_OPTIONS_HTML to MEAL_OPTIONS for template
  templateData.MEAL_OPTIONS = templateData.MEAL_OPTIONS_HTML;

  // Generate calendar links and buttons
  const calendarLinks = generateCalendarLinks(data);
  templateData.CALENDAR_BUTTONS = generateCalendarButtons(calendarLinks);
  templateData.GOOGLE_CALENDAR_URL = calendarLinks.google;
  templateData.OUTLOOK_CALENDAR_URL = calendarLinks.outlook;
  templateData.ICS_CALENDAR_URL = calendarLinks.ics;
  templateData.ICS_FILENAME = calendarLinks.icsFilename;

  return templateData;
}

module.exports = {
  // Security utilities
  escapeHtml,
  escapeAttribute,

  // Validation utilities
  isValidEmail,
  isValidPhone,
  isValidDate,
  isValidTime,
  isValidUrl,
  validateWeddingData,

  // Core utilities
  slugify,
  replacePlaceholders,
  processConditionals,
  formatDate,
  getThemeFonts,
  generateColorSwatches,
  generateMealOptions,
  generateTimelineItems,
  generateGalleryItems,
  getFloatingIcons,
  generateCalendarLinks,
  generateCalendarButtons,
  calculateExpiryDate,
  generateThemeCards,
  createPreviewMetadata,
  prepareWeddingData
};
