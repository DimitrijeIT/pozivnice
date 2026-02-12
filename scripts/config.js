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
  THEME_SELECTION_URL: process.env.THEME_SELECTION_URL || '',
  RSVP_SCRIPT_URL: process.env.RSVP_SCRIPT_URL || '',

  // Domain Configuration
  DOMAIN: process.env.DOMAIN || 'pozivnice.rs',

  // Preview Settings
  PREVIEW_EXPIRY_HOURS: parseInt(process.env.PREVIEW_EXPIRY_HOURS) || 24,

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

  // 2026 Layout Registry - Centralized theme definitions for all layouts
  // Includes both new 2026 layouts and original themes for unified generation
  LAYOUT_REGISTRY: {
    // === ORIGINAL THEMES (2025) ===
    // These use templates/base.html with templates/themes/{theme}/style.css
    classic: {
      name: 'Класичан',
      description: 'Традиционални елегантни дизајн са златним акцентима и орнаменталним детаљима',
      themes: ['default'],
      themeNames: { default: 'Класичан' },
      themeDescriptions: { default: 'Старински новац естетика са позлаћеним оквирима' },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Lato:wght@300;400&display=swap" rel="stylesheet">',
      isOriginal: true
    },
    modern: {
      name: 'Модеран',
      description: 'Савремени минималистички дизајн са чистим линијама и обиљем белог простора',
      themes: ['default'],
      themeNames: { default: 'Модеран' },
      themeDescriptions: { default: 'Чист и минималистички приступ' },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Lato:wght@300;400&display=swap" rel="stylesheet">',
      isOriginal: true
    },
    romantic: {
      name: 'Романтичан',
      description: 'Нежни романтични дизајн у розе тоновима са цветним мотивима',
      themes: ['default'],
      themeNames: { default: 'Романтичан' },
      themeDescriptions: { default: 'Розе тонови са цветним елементима' },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Lora:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">',
      isOriginal: true
    },
    minimal: {
      name: 'Минималистички',
      description: 'Ултра-чист дизајн фокусиран на типографију и садржај',
      themes: ['default'],
      themeNames: { default: 'Минималистички' },
      themeDescriptions: { default: 'Максимум белог простора, минимум украса' },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap" rel="stylesheet">',
      isOriginal: true
    },
    rustic: {
      name: 'Рустикални',
      description: 'Топли природни дизајн инспирисан природом и рустичном естетиком',
      themes: ['default'],
      themeNames: { default: 'Рустикални' },
      themeDescriptions: { default: 'Земљани тонови са природним текстурама' },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&family=Josefin+Sans:wght@300;400&display=swap" rel="stylesheet">',
      isOriginal: true
    },
    'botanical-original': {
      name: 'Ботанички',
      description: 'Елегантни зелени дизајн са еукалиптусом и лучним облицима - тренд 2025',
      themes: ['default'],
      themeNames: { default: 'Ботанички' },
      themeDescriptions: { default: 'Зелени тонови са ботаничким мотивима' },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Nunito:wght@300;400&display=swap" rel="stylesheet">',
      isOriginal: true,
      themePath: 'botanical' // Uses templates/themes/botanical/
    },
    moody: {
      name: 'Тамна Романса',
      description: 'Драматичан тамни дизајн у бордо тоновима са златним акцентима',
      themes: ['default'],
      themeNames: { default: 'Тамна Романса' },
      themeDescriptions: { default: 'Драматични бордо тонови' },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Josefin+Sans:wght@300;400&display=swap" rel="stylesheet">',
      isOriginal: true
    },
    gatsby: {
      name: 'Арт Деко',
      description: 'Ретро гламур 1920-их са геометријским узорцима и злато-навy палетом',
      themes: ['default'],
      themeNames: { default: 'Арт Деко' },
      themeDescriptions: { default: 'Гламур двадесетих година' },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Poiret+One&family=Josefin+Sans:wght@300;400;500&display=swap" rel="stylesheet">',
      isOriginal: true
    },
    editorial: {
      name: 'Едиторијал',
      description: 'Модерни часописни layout са смелом типографијом и асиметричним дизајном',
      themes: ['default'],
      themeNames: { default: 'Едиторијал' },
      themeDescriptions: { default: 'Модерна часописна естетика' },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:wght@300;400;500&display=swap" rel="stylesheet">',
      isOriginal: true
    },
    whimsical: {
      name: 'Илустровани',
      description: 'Играјући илустровани дизајн са акварел текстурама и пастелним бојама',
      themes: ['default'],
      themeNames: { default: 'Илустровани' },
      themeDescriptions: { default: 'Играјући акварел стил' },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600&family=Quicksand:wght@300;400;500&display=swap" rel="stylesheet">',
      isOriginal: true
    },

    // === 2026 LAYOUTS ===
    // These use templates/base-{layout}.html with templates/themes-{layout}/{theme}/style.css
    aurora: {
      name: 'Аурора',
      description: 'Северни сјај са космичким честицама',
      themes: ['northern'],
      themeNames: {
        northern: 'Северна светла'
      },
      themeDescriptions: {
        northern: 'Класична зелена аурора са хладним тоновима'
      },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400&family=Inter:wght@300;400&display=swap" rel="stylesheet">'
    },
    botanical: {
      name: 'Ботаника',
      description: 'Научни хербаријум са пресованим цвећем',
      themes: ['forest'],
      themeNames: {
        forest: 'Шума'
      },
      themeDescriptions: {
        forest: 'Дубоке шумске зелене боје са старинским папиром'
      },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display+SC&family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=EB+Garamond:ital,wght@0,400;1,400&family=Courier+Prime&family=Caveat:wght@400&display=swap" rel="stylesheet">'
    },
    filmnoir: {
      name: 'Филм Ноар',
      description: 'Холивудска драма у црно-белом',
      themes: ['classic'],
      themeNames: {
        classic: 'Класик'
      },
      themeDescriptions: {
        classic: 'Црно-бело са драматичним црвеним акцентима'
      },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Libre+Franklin:wght@300;400&display=swap" rel="stylesheet">'
    },
    glass: {
      name: 'Стаклена Галерија',
      description: 'Модерни гласморфизам са светлосним ефектима',
      themes: ['frost'],
      themeNames: {
        frost: 'Мраз'
      },
      themeDescriptions: {
        frost: 'Хладни ледени тонови са замрзнутим ефектима'
      },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500&display=swap" rel="stylesheet">'
    },
    kinetic: {
      name: 'Кинетичка Поезија',
      description: 'Динамична типографија са анимацијама',
      themes: ['editorial'],
      themeNames: {
        editorial: 'Едиторијал'
      },
      themeDescriptions: {
        editorial: 'Чисте линије и модерна типографија'
      },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;1,400&display=swap" rel="stylesheet">'
    },
    mediterranean: {
      name: 'Медитеран',
      description: 'Сунчана обала са керамичким мотивима',
      themes: ['amalfi'],
      themeNames: {
        amalfi: 'Амалфи'
      },
      themeDescriptions: {
        amalfi: 'Кобалт плава са лимун жутим акцентима'
      },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Libre+Franklin:wght@300;400;500&display=swap" rel="stylesheet">'
    },
    oldmoney: {
      name: 'Стари Новац',
      description: 'Класична елеганција наслеђеног богатства',
      themes: ['ivory'],
      themeNames: {
        ivory: 'Слоновача'
      },
      themeDescriptions: {
        ivory: 'Светли кремасти тонови са златним акцентима'
      },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet">'
    },
    scribble: {
      name: 'Шкрабање',
      description: 'Ручно цртани стил са играјућим илустрацијама',
      themes: ['watercolor'],
      themeNames: {
        watercolor: 'Акварел'
      },
      themeDescriptions: {
        watercolor: 'Меке акварел боје са нежним прелазима'
      },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Patrick+Hand&family=Inter:wght@400;500&display=swap" rel="stylesheet">'
    },
    velvet: {
      name: 'Поноћни Сомот',
      description: 'Луксузна тамна елеганција',
      themes: ['burgundy'],
      themeNames: {
        burgundy: 'Бордо'
      },
      themeDescriptions: {
        burgundy: 'Дубока бордо са златним акцентима'
      },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Montserrat:wght@200;300;400&display=swap" rel="stylesheet">'
    },
    wabisabi: {
      name: 'Ваби-Саби',
      description: 'Јапанска естетика несавршене лепоте',
      themes: ['paper'],
      themeNames: {
        paper: 'Васхи папир'
      },
      themeDescriptions: {
        paper: 'Светли природни папир са нежним текстурама'
      },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@200;300;400&family=Zen+Kaku+Gothic+New:wght@300;400&display=swap" rel="stylesheet">'
    },
    // Additional creative layouts
    cinema: {
      name: 'Биоскоп',
      description: 'Филмска премијера са драматичним постер дизајном',
      themes: ['noir'],
      themeNames: {
        noir: 'Филм ноар'
      },
      themeDescriptions: {
        noir: 'Драматичан црно-бели стил класичног филм ноара'
      },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">'
    },
    concert: {
      name: 'Концерт',
      description: 'Фестивалски постер стил са карта RSVP',
      themes: ['rock'],
      themeNames: {
        rock: 'Рок концерт'
      },
      themeDescriptions: {
        rock: 'Неон боје и драматичан контраст за велику забаву'
      },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">'
    },
    envelope: {
      name: 'Коверта',
      description: 'Интерактивна анимација отварања коверте',
      themes: ['velvet'],
      themeNames: {
        velvet: 'Плиш'
      },
      themeDescriptions: {
        velvet: 'Луксузни дизајн са дубоким бордо тоновима и златним акцентима'
      },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">'
    },
    gazette: {
      name: 'Газета',
      description: 'Новински стил са вестима о венчању',
      themes: ['broadsheet'],
      themeNames: {
        broadsheet: 'Класичне новине'
      },
      themeDescriptions: {
        broadsheet: 'Традиционални новински стил са елегантном serif типографијом'
      },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">'
    },
    letter: {
      name: 'Писмо',
      description: 'Рукописно љубавно писмо са печатом',
      themes: ['romantic'],
      themeNames: {
        romantic: 'Романтично'
      },
      themeDescriptions: {
        romantic: 'Нежне румене боје са калиграфијом'
      },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">'
    },
    magazine: {
      name: 'Магазин',
      description: 'Модни часопис са насловном страном',
      themes: ['vogue'],
      themeNames: {
        vogue: 'Vogue стил'
      },
      themeDescriptions: {
        vogue: 'Елегантан црно-бели модни едиторијал'
      },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:wght@400;500;600&display=swap" rel="stylesheet">'
    },
    passport: {
      name: 'Пасош',
      description: 'Путнички пасош са визама и печатима',
      themes: ['classic'],
      themeNames: {
        classic: 'Класични пасош'
      },
      themeDescriptions: {
        classic: 'Традиционални тамно плави стил са златним акцентима'
      },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Source+Sans+3:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">'
    },
    storybook: {
      name: 'Бајка',
      description: 'Књига прича са илустрацијама',
      themes: ['novel'],
      themeNames: {
        novel: 'Роман'
      },
      themeDescriptions: {
        novel: 'Топли, романтични дизајн попут књиге са елегантном типографијом'
      },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">'
    },
    telegram: {
      name: 'Телеграм',
      description: 'Винтаж телеграфска депеша',
      themes: ['western'],
      themeNames: {
        western: 'Вестерн Унион'
      },
      themeDescriptions: {
        western: 'Класични сепија стил са старинским папиром'
      },
      fonts: '<link href="https://fonts.googleapis.com/css2?family=Special+Elite&family=Courier+Prime:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">'
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

// ============================================
// TEMPLATE VISIBILITY MANAGEMENT
// ============================================

const path = require('path');
const fs = require('fs');

// Cache for visibility config
let visibilityCache = null;
let visibilityCacheTime = 0;
const VISIBILITY_CACHE_TTL = 5000; // 5 seconds

/**
 * Load template visibility configuration
 * @param {boolean} forceReload - Force reload from disk
 * @returns {object} Visibility configuration
 */
function loadVisibilityConfig(forceReload = false) {
  const now = Date.now();
  if (!forceReload && visibilityCache && (now - visibilityCacheTime) < VISIBILITY_CACHE_TTL) {
    return visibilityCache;
  }

  const configPath = path.join(__dirname, 'template-visibility.json');
  try {
    const content = fs.readFileSync(configPath, 'utf8');
    visibilityCache = JSON.parse(content);
    visibilityCacheTime = now;
    return visibilityCache;
  } catch (error) {
    console.warn('Could not load template-visibility.json, using defaults:', error.message);
    return { original: {}, layouts2026: {} };
  }
}

/**
 * Check if a template is visible (not hidden)
 * @param {string} templateName - Template/theme name
 * @param {string} type - 'original' or 'layouts2026'
 * @returns {boolean} True if visible
 */
function isTemplateVisible(templateName, type = 'original') {
  const visibility = loadVisibilityConfig();
  const section = visibility[type] || {};
  const templateConfig = section[templateName];

  // Default to visible if not configured
  if (!templateConfig) return true;
  return !templateConfig.hidden;
}

/**
 * Get visible original themes (2025)
 * @returns {string[]} Array of visible theme names
 */
function getVisibleOriginalThemes() {
  const visibility = loadVisibilityConfig();
  const section = visibility.original || {};

  return config.THEMES.filter(theme => {
    const conf = section[theme];
    return !conf || !conf.hidden;
  }).sort((a, b) => {
    const orderA = (section[a] && section[a].order) || 999;
    const orderB = (section[b] && section[b].order) || 999;
    return orderA - orderB;
  });
}

/**
 * Get visible 2026 layouts
 * @returns {string[]} Array of visible layout names
 */
function getVisible2026Layouts() {
  const visibility = loadVisibilityConfig();
  const section = visibility.layouts2026 || {};

  // Get all 2026 layouts (non-original entries in LAYOUT_REGISTRY)
  const layouts2026 = Object.keys(config.LAYOUT_REGISTRY)
    .filter(key => !config.LAYOUT_REGISTRY[key].isOriginal);

  return layouts2026.filter(layout => {
    const conf = section[layout];
    return !conf || !conf.hidden;
  }).sort((a, b) => {
    const orderA = (section[a] && section[a].order) || 999;
    const orderB = (section[b] && section[b].order) || 999;
    return orderA - orderB;
  });
}

/**
 * Get all visible templates (both original and 2026)
 * @returns {object} { original: string[], layouts2026: string[] }
 */
function getVisibleTemplates() {
  return {
    original: getVisibleOriginalThemes(),
    layouts2026: getVisible2026Layouts()
  };
}

/**
 * Get templates by tag
 * @param {string} tag - Tag to filter by (e.g., 'popular', 'trending', 'dark')
 * @returns {object} { original: string[], layouts2026: string[] }
 */
function getTemplatesByTag(tag) {
  const visibility = loadVisibilityConfig();

  const filterByTag = (section) => {
    return Object.entries(section)
      .filter(([key, conf]) => {
        if (key.startsWith('_')) return false; // Skip comments
        if (conf.hidden) return false;
        return conf.tags && conf.tags.includes(tag);
      })
      .sort((a, b) => (a[1].order || 999) - (b[1].order || 999))
      .map(([key]) => key);
  };

  return {
    original: filterByTag(visibility.original || {}),
    layouts2026: filterByTag(visibility.layouts2026 || {})
  };
}

/**
 * Update template visibility (programmatic update)
 * @param {string} templateName - Template name
 * @param {string} type - 'original' or 'layouts2026'
 * @param {boolean} hidden - True to hide, false to show
 */
function setTemplateVisibility(templateName, type, hidden) {
  const configPath = path.join(__dirname, 'template-visibility.json');
  const visibility = loadVisibilityConfig(true);

  if (!visibility[type]) visibility[type] = {};
  if (!visibility[type][templateName]) visibility[type][templateName] = {};

  visibility[type][templateName].hidden = hidden;
  visibility._updated = new Date().toISOString().split('T')[0];

  fs.writeFileSync(configPath, JSON.stringify(visibility, null, 2), 'utf8');
  visibilityCache = null; // Invalidate cache
}

// Export config and helper functions
module.exports = {
  ...config,
  validateConfig,
  getLayoutConfig,
  getAvailableLayouts,
  // Visibility management
  loadVisibilityConfig,
  isTemplateVisible,
  getVisibleOriginalThemes,
  getVisible2026Layouts,
  getVisibleTemplates,
  getTemplatesByTag,
  setTemplateVisibility
};
