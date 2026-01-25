/**
 * Wedding Invitation System Configuration
 *
 * Replace placeholder values with your actual Google Apps Script URLs
 * and other configuration values.
 */

// Configuration object
const config = {
  // Google Sheets Configuration
  GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID || 'YOUR_GOOGLE_SHEET_ID_HERE',

  // Google Apps Script Web App URLs
  // These URLs are obtained after deploying each Apps Script as a web app
  THEME_SELECTION_URL: process.env.THEME_SELECTION_URL || 'https://script.google.com/macros/s/AKfycby3TKfusf7c36I09L_RZJwuY90GlKsoaKBNU9PUPshUB61pIzEaL-330RVjOhJTJ0ywUg/exec',
  RSVP_SCRIPT_URL: process.env.RSVP_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbxKyXmfLk5LdcB3PYy2QVo_SHe31aHaaZRb6Cqoo_mUHKQ3WE7HKkuw_GmP12eo3B0fjg/exec',
  RSVP_COUNT_SCRIPT_URL: process.env.RSVP_COUNT_SCRIPT_URL || '',

  // Domain Configuration
  DOMAIN: process.env.DOMAIN || 'pozivnice.rs',

  // Preview Settings
  PREVIEW_EXPIRY_HOURS: parseInt(process.env.PREVIEW_EXPIRY_HOURS) || 24,
  PREVIEW_EXPIRY_DAYS: parseInt(process.env.PREVIEW_EXPIRY_DAYS) || 30,

  // Available Themes (original set)
  THEMES: ['classic', 'modern', 'romantic', 'minimal', 'rustic', 'botanical', 'moody', 'gatsby', 'editorial', 'whimsical'],

  // Theme Display Names (Serbian)
  THEME_NAMES: {
    classic: 'Класичан',
    modern: 'Модеран',
    romantic: 'Романтичан',
    minimal: 'Минималистички',
    rustic: 'Рустикални',
    botanical: 'Ботанички',
    moody: 'Тамна Романса',
    gatsby: 'Арт Деко',
    editorial: 'Едиторијал',
    whimsical: 'Илустровани'
  },

  // Theme Descriptions (Serbian)
  THEME_DESCRIPTIONS: {
    classic: 'Традиционални елегантни дизајн са златним акцентима и орнаменталним детаљима',
    modern: 'Савремени минималистички дизајн са чистим линијама и обиљем белог простора',
    romantic: 'Нежни романтични дизајн у розе тоновима са цветним мотивима',
    minimal: 'Ултра-чист дизајн фокусиран на типографију и садржај',
    rustic: 'Топли природни дизајн инспирисан природом и рустичном естетиком',
    botanical: 'Елегантни зелени дизајн са еукалиптусом и лучним облицима - тренд 2025',
    moody: 'Драматичан тамни дизајн у бордо тоновима са златним акцентима',
    gatsby: 'Ретро гламур 1920-их са геометријским узорцима и злато-навy палетом',
    editorial: 'Модерни часописни layout са смелом типографијом и асиметричним дизајном',
    whimsical: 'Играјући илустровани дизајн са акварел текстурама и пастелним бојама'
  },

  // 2026 Layout Registry - Centralized theme definitions for new layouts
  LAYOUT_REGISTRY: {
    aurora: {
      name: 'Аурора',
      description: 'Северни сјај са космичким честицама',
      themes: ['northern', 'cosmic'],
      themeNames: {
        northern: 'Северна светла',
        cosmic: 'Космос'
      },
      themeDescriptions: {
        northern: 'Класична зелена аурора са хладним тоновима',
        cosmic: 'Ружичасто-љубичаста космичка аурора'
      },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400&family=Inter:wght@300;400&display=swap" rel="stylesheet">'
    },
    botanical: {
      name: 'Ботаника',
      description: 'Научни хербаријум са пресованим цвећем',
      themes: ['forest', 'pressed'],
      themeNames: {
        forest: 'Шума',
        pressed: 'Хербаријум'
      },
      themeDescriptions: {
        forest: 'Дубоке шумске зелене боје са старинским папиром',
        pressed: 'Топли сепија тонови попут сушеног цвећа'
      },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display+SC&family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=EB+Garamond:ital,wght@0,400;1,400&family=Courier+Prime&family=Caveat:wght@400&display=swap" rel="stylesheet">'
    },
    filmnoir: {
      name: 'Филм Ноар',
      description: 'Холивудска драма у црно-белом',
      themes: ['classic', 'golden'],
      themeNames: {
        classic: 'Класик',
        golden: 'Златно доба'
      },
      themeDescriptions: {
        classic: 'Црно-бело са драматичним црвеним акцентима',
        golden: 'Топли сепија тонови холивудског гламура'
      },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Libre+Franklin:wght@300;400&display=swap" rel="stylesheet">'
    },
    glass: {
      name: 'Стаклена Галерија',
      description: 'Модерни гласморфизам са светлосним ефектима',
      themes: ['frost', 'aurora'],
      themeNames: {
        frost: 'Мраз',
        aurora: 'Аурора'
      },
      themeDescriptions: {
        frost: 'Хладни ледени тонови са замрзнутим ефектима',
        aurora: 'Топли градијенти са северним сјајем'
      },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500&display=swap" rel="stylesheet">'
    },
    kinetic: {
      name: 'Кинетичка Поезија',
      description: 'Динамична типографија са анимацијама',
      themes: ['editorial', 'moody'],
      themeNames: {
        editorial: 'Едиторијал',
        moody: 'Мрачни'
      },
      themeDescriptions: {
        editorial: 'Чисте линије и модерна типографија',
        moody: 'Тамни тонови са драматичним акцентима'
      },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;1,400&display=swap" rel="stylesheet">'
    },
    mediterranean: {
      name: 'Медитеран',
      description: 'Сунчана обала са керамичким мотивима',
      themes: ['amalfi', 'santorini'],
      themeNames: {
        amalfi: 'Амалфи',
        santorini: 'Санторини'
      },
      themeDescriptions: {
        amalfi: 'Кобалт плава са лимун жутим акцентима',
        santorini: 'Бела и плава са топлим залазним тоновима'
      },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Libre+Franklin:wght@300;400;500&display=swap" rel="stylesheet">'
    },
    oldmoney: {
      name: 'Стари Новац',
      description: 'Класична елеганција наслеђеног богатства',
      themes: ['ivory', 'estate'],
      themeNames: {
        ivory: 'Слоновача',
        estate: 'Имање'
      },
      themeDescriptions: {
        ivory: 'Светли кремасти тонови са златним акцентима',
        estate: 'Тамнији земљани тонови са бронзаним детаљима'
      },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet">'
    },
    scribble: {
      name: 'Шкрабање',
      description: 'Ручно цртани стил са играјућим илустрацијама',
      themes: ['watercolor', 'pencil'],
      themeNames: {
        watercolor: 'Акварел',
        pencil: 'Оловка'
      },
      themeDescriptions: {
        watercolor: 'Меке акварел боје са нежним прелазима',
        pencil: 'Графитни тонови са скицираним линијама'
      },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Patrick+Hand&family=Inter:wght@400;500&display=swap" rel="stylesheet">'
    },
    velvet: {
      name: 'Поноћни Сомот',
      description: 'Луксузна тамна елеганција',
      themes: ['burgundy', 'navy'],
      themeNames: {
        burgundy: 'Бордо',
        navy: 'Тегет'
      },
      themeDescriptions: {
        burgundy: 'Дубока бордо са златним акцентима',
        navy: 'Елегантна тегет са сребрним детаљима'
      },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Montserrat:wght@200;300;400&display=swap" rel="stylesheet">'
    },
    wabisabi: {
      name: 'Ваби-Саби',
      description: 'Јапанска естетика несавршене лепоте',
      themes: ['paper', 'ink'],
      themeNames: {
        paper: 'Васхи папир',
        ink: 'Суми мастило'
      },
      themeDescriptions: {
        paper: 'Светли природни папир са нежним текстурама',
        ink: 'Тамни мастило тонови са калиграфским акцентима'
      },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@200;300;400&family=Zen+Kaku+Gothic+New:wght@300;400&display=swap" rel="stylesheet">'
    }
  },

  // Paths
  PATHS: {
    templates: 'templates',
    public: 'public',
    preview: 'public/preview',
    site: 'public/site',
    data: 'data',
    themes: 'templates/themes'
  },

  // Server Settings (for local development)
  DEV_SERVER_PORT: parseInt(process.env.DEV_SERVER_PORT) || 3000
};

/**
 * Validate that required configuration is set
 * @returns {object} { valid: boolean, errors: string[], warnings: string[] }
 */
function validateConfig() {
  const errors = [];
  const warnings = [];

  // Check for placeholder values
  if (config.GOOGLE_SHEET_ID === 'YOUR_GOOGLE_SHEET_ID_HERE') {
    warnings.push('GOOGLE_SHEET_ID is not configured. RSVP functionality will not work.');
  }

  // Check for required URLs
  if (!config.RSVP_SCRIPT_URL) {
    warnings.push('RSVP_SCRIPT_URL is not configured. RSVP submissions will fail.');
  }

  if (!config.THEME_SELECTION_URL) {
    warnings.push('THEME_SELECTION_URL is not configured. Theme selection will not be saved.');
  }

  // Validate port number
  if (config.DEV_SERVER_PORT < 1 || config.DEV_SERVER_PORT > 65535) {
    errors.push('DEV_SERVER_PORT must be between 1 and 65535');
  }

  // Validate expiry hours
  if (config.PREVIEW_EXPIRY_HOURS < 1) {
    errors.push('PREVIEW_EXPIRY_HOURS must be at least 1');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Get layout configuration by name
 * @param {string} layoutName - Layout name (e.g., 'aurora', 'botanical')
 * @returns {object|null} Layout configuration or null if not found
 */
function getLayoutConfig(layoutName) {
  return config.LAYOUT_REGISTRY[layoutName] || null;
}

/**
 * Get all available layouts
 * @returns {string[]} Array of layout names
 */
function getAvailableLayouts() {
  return Object.keys(config.LAYOUT_REGISTRY);
}

// Export config and helper functions
module.exports = {
  ...config,
  validateConfig,
  getLayoutConfig,
  getAvailableLayouts
};
