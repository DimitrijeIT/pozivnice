#!/usr/bin/env node

/**
 * Unified Layout Preview Generator
 *
 * Single parameterized generator that can generate previews for all 2026 layouts.
 * Uses centralized configuration from config.js for theme definitions.
 * Replaces the need for individual generate-*-preview.js scripts.
 *
 * Usage:
 *   node scripts/generate-layout-preview.js <layout> [slug]
 *   node scripts/generate-layout-preview.js aurora demo
 *   node scripts/generate-layout-preview.js botanical sample-wedding
 *   node scripts/generate-layout-preview.js --list  # List all available layouts
 *   node scripts/generate-layout-preview.js --all demo  # Generate all layouts
 *
 * Supported layouts: aurora, botanical, filmnoir, glass, kinetic,
 *                    mediterranean, oldmoney, scribble, velvet, wabisabi
 */

const fs = require('fs-extra');
const path = require('path');
const config = require('./config');
const utils = require('./utils');

// Paths
const ROOT_DIR = path.join(__dirname, '..');
const TEMPLATES_DIR = path.join(ROOT_DIR, 'templates');
const PREVIEW_DIR = path.join(ROOT_DIR, config.PATHS.preview);
const DATA_DIR = path.join(ROOT_DIR, config.PATHS.data);

/**
 * Load wedding data from JSON file
 * @param {string} slug - Wedding data slug
 * @returns {object} Wedding data
 * @throws {Error} If no data found
 */
function loadWeddingData(slug) {
  const dataFile = path.join(DATA_DIR, `${slug}.json`);

  if (fs.existsSync(dataFile)) {
    try {
      return fs.readJsonSync(dataFile);
    } catch (error) {
      throw new Error(`Failed to parse ${slug}.json: ${error.message}`);
    }
  }

  // Fall back to sample data
  const sampleFile = path.join(DATA_DIR, 'sample-wedding.json');
  if (fs.existsSync(sampleFile)) {
    console.log(`  ℹ️  Using sample-wedding.json (${slug}.json not found)`);
    return fs.readJsonSync(sampleFile);
  }

  throw new Error(`No wedding data found for: ${slug}`);
}

/**
 * Format date in Serbian
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const months = [
    'јануар', 'фебруар', 'март', 'април', 'мај', 'јун',
    'јул', 'август', 'септембар', 'октобар', 'новембар', 'децембар'
  ];
  return `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Process conditional blocks in template
 * @param {string} html - Template HTML
 * @param {object} data - Data object
 * @returns {string} Processed HTML
 */
function processConditionals(html, data) {
  const conditionals = [
    { key: 'STORY', check: data.story_text },
    { key: 'HASHTAG', check: data.wedding_hashtag },
    { key: 'CEREMONY_MAP', check: data.ceremony_map_url },
    { key: 'RECEPTION_MAP', check: data.reception_map_url },
    { key: 'MEAL_OPTIONS', check: data.meal_options?.length },
    { key: 'MUSIC', check: data.music_url },
    { key: 'TIMELINE', check: data.timeline?.length },
    { key: 'GALLERY', check: data.gallery?.length }
  ];

  conditionals.forEach(({ key, check }) => {
    const regex = new RegExp(`\\{\\{#IF_${key}\\}\\}([\\s\\S]*?)\\{\\{\\/IF_${key}\\}\\}`, 'g');
    html = check ? html.replace(regex, '$1') : html.replace(regex, '');
  });

  return html;
}

/**
 * Generate meal options HTML with XSS protection
 * @param {object[]} options - Meal options array
 * @returns {string} HTML string
 */
function generateMealOptions(options) {
  if (!options?.length) return '';
  return options.map(o =>
    `<option value="${utils.escapeAttribute(o.value)}">${utils.escapeHtml(o.label)}</option>`
  ).join('');
}

/**
 * Replace placeholders in template with data
 * @param {string} html - Template HTML
 * @param {object} data - Data object
 * @returns {string} Processed HTML
 */
function replacePlaceholders(html, data) {
  // Fields that should not be HTML escaped (contain trusted HTML/URLs)
  const rawFields = new Set([
    '_themeCss', '_themeFonts', 'THEME_CSS', 'THEME_FONTS',
    'MEAL_OPTIONS', 'RSVP_SCRIPT_URL', 'CEREMONY_MAP_URL',
    'RECEPTION_MAP_URL', 'WEDDING_DATE_ISO'
  ]);

  const replacements = {
    'BRIDE_NAME': data.bride_name || '',
    'GROOM_NAME': data.groom_name || '',
    'WEDDING_DATE_FORMATTED': formatDate(data.wedding_date),
    'WEDDING_DATE_ISO': new Date(data.wedding_date).toISOString(),
    'WEDDING_YEAR': new Date(data.wedding_date).getFullYear(),
    'CEREMONY_VENUE': data.ceremony_venue || '',
    'CEREMONY_ADDRESS': data.ceremony_address || '',
    'CEREMONY_TIME': data.ceremony_time || '',
    'CEREMONY_MAP_URL': data.ceremony_map_url || '',
    'RECEPTION_VENUE': data.reception_venue || '',
    'RECEPTION_ADDRESS': data.reception_address || '',
    'RECEPTION_TIME': data.reception_time || '',
    'RECEPTION_MAP_URL': data.reception_map_url || '',
    'INVITATION_INTRO': data.invitation_intro || 'Са радошћу вас позивамо',
    'INVITATION_TEXT': data.invitation_text || '',
    'STORY_TEXT': data.story_text || '',
    'WEDDING_SLUG': data.slug || '',
    'WEDDING_HASHTAG': data.wedding_hashtag || '',
    'RSVP_DEADLINE': data.rsvp_deadline ? formatDate(data.rsvp_deadline) : '',
    'MEAL_OPTIONS': generateMealOptions(data.meal_options),
    'RSVP_SCRIPT_URL': config.RSVP_SCRIPT_URL || '',
    'THEME_FONTS': data._themeFonts || '',
    'THEME_CSS': data._themeCss || ''
  };

  let result = html;
  for (const [key, value] of Object.entries(replacements)) {
    const safeValue = rawFields.has(key) ? String(value) : utils.escapeHtml(String(value));
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), safeValue);
  }
  return result;
}

/**
 * Generate themed invitation page
 * @param {object} data - Wedding data
 * @param {string} layout - Layout name
 * @param {string} theme - Theme name
 * @param {object} layoutConfig - Layout configuration
 * @returns {string} Generated HTML
 */
function generateThemedPage(data, layout, theme, layoutConfig) {
  const baseTemplatePath = path.join(TEMPLATES_DIR, `base-${layout}.html`);
  const themeCssPath = path.join(TEMPLATES_DIR, `themes-${layout}`, theme, 'style.css');

  if (!fs.existsSync(baseTemplatePath)) {
    throw new Error(`Base template not found: base-${layout}.html`);
  }

  if (!fs.existsSync(themeCssPath)) {
    throw new Error(`Theme CSS not found: themes-${layout}/${theme}/style.css`);
  }

  const baseTemplate = fs.readFileSync(baseTemplatePath, 'utf8');
  const themeCss = fs.readFileSync(themeCssPath, 'utf8');

  const templateData = {
    ...data,
    _themeCss: `<style>${themeCss}</style>`,
    _themeFonts: layoutConfig.fonts || ''
  };

  let html = processConditionals(baseTemplate, templateData);
  html = replacePlaceholders(html, templateData);
  return html;
}

/**
 * Generate theme selection index page
 * @param {object} data - Wedding data
 * @param {string} layout - Layout name
 * @param {object} layoutConfig - Layout configuration
 * @returns {string} Generated HTML
 */
function generateIndexPage(data, layout, layoutConfig) {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + config.PREVIEW_EXPIRY_DAYS);

  // Get layout-specific styling
  const layoutStyles = getLayoutStyles(layout);

  const themeCards = layoutConfig.themes.map(theme => `
    <div class="theme-card">
      <div class="theme-preview">
        <iframe src="${theme}.html" style="width:100%;height:100%;border:none;pointer-events:none;transform:scale(0.8);transform-origin:top left;width:125%;height:125%;" loading="lazy"></iframe>
      </div>
      <div class="theme-info">
        <h3 class="theme-name">${utils.escapeHtml(layoutConfig.themeNames[theme])}</h3>
        <p class="theme-description">${utils.escapeHtml(layoutConfig.themeDescriptions[theme])}</p>
        <div class="theme-actions">
          <a href="${theme}.html" target="_blank" class="btn btn-secondary">Преглед</a>
          <button class="btn btn-primary" data-select-theme="${utils.escapeAttribute(theme)}">Изабери</button>
        </div>
      </div>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="sr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Изаберите тему - ${utils.escapeHtml(data.bride_name)} & ${utils.escapeHtml(data.groom_name)}</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${layoutStyles.emoji}</text></svg>">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    ${layoutStyles.cssVars}
    body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);line-height:1.6;min-height:100vh}
    .container{max-width:900px;margin:0 auto;padding:0 1rem}
    .header{background:var(--surface);border-bottom:2px solid var(--border);padding:1.5rem 0;position:sticky;top:0;z-index:100}
    .header-content{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem}
    .header-title{font-size:1.25rem;font-weight:500}
    .header-title span{color:var(--primary)}
    .expiry-timer{display:flex;align-items:center;gap:0.5rem;padding:0.5rem 1rem;background:var(--timer-bg);border-radius:8px;font-size:0.875rem;color:var(--primary)}
    .main{padding:3rem 0}
    .intro{text-align:center;margin-bottom:3rem}
    .intro h1{font-size:2rem;font-weight:500;margin-bottom:0.75rem}
    .intro p{color:var(--muted);max-width:600px;margin:0 auto}
    .badge{display:inline-block;background:var(--primary);color:var(--badge-text);padding:0.25rem 0.75rem;border-radius:50px;font-size:0.75rem;margin-bottom:1rem}
    .theme-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(350px,1fr));gap:2rem}
    .theme-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;overflow:hidden;transition:transform 0.3s}
    .theme-card:hover{transform:translateY(-4px)}
    .theme-preview{aspect-ratio:3/4;overflow:hidden;background:var(--bg)}
    .theme-info{padding:1.5rem}
    .theme-name{font-size:1.25rem;font-weight:500;margin-bottom:0.5rem}
    .theme-description{color:var(--muted);margin-bottom:1.25rem;font-size:0.9rem}
    .theme-actions{display:flex;gap:0.75rem}
    .btn{padding:0.75rem 1.25rem;border-radius:8px;font-size:0.9rem;font-weight:500;cursor:pointer;text-decoration:none;border:none;font-family:inherit;transition:all 0.2s}
    .btn-primary{background:var(--primary);color:var(--btn-text);flex:1}
    .btn-primary:hover{opacity:0.9;transform:translateY(-1px)}
    .btn-secondary{background:transparent;color:var(--text);border:1px solid var(--border)}
    .btn-secondary:hover{border-color:var(--primary)}
    .success-message{display:none;text-align:center;padding:4rem 2rem}
    .success-message.active{display:block}
    .modal-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;align-items:center;justify-content:center}
    .modal-overlay.active{display:flex}
    .modal{background:var(--surface);border:1px solid var(--border);border-radius:12px;max-width:400px;padding:2rem;text-align:center}
    .modal h2{margin-bottom:0.75rem}
    .modal p{color:var(--muted);margin-bottom:1.5rem}
    .modal-actions{display:flex;gap:1rem}
    .modal-actions .btn{flex:1}
  </style>
</head>
<body>
  <header class="header"><div class="container"><div class="header-content">
    <h1 class="header-title">${layoutStyles.emoji} <span>${utils.escapeHtml(data.bride_name)} & ${utils.escapeHtml(data.groom_name)}</span></h1>
    <div class="expiry-timer" id="expiry-timer" data-expiry="${expiryDate.toISOString()}"><span>⏱️</span><span id="expiry-text">--:--:--</span></div>
  </div></div></header>
  <main class="main"><div class="container">
    <div class="intro">
      <span class="badge">${layoutStyles.emoji} ${utils.escapeHtml(layoutConfig.name)}</span>
      <h1>Изаберите тему позивнице</h1>
      <p>${utils.escapeHtml(layoutConfig.description)}</p>
    </div>
    <div class="theme-grid">${themeCards}</div>
  </div></main>
  <div class="success-message" id="success-message"><div class="container"><h2>✅ Тема изабрана!</h2></div></div>
  <div class="modal-overlay" id="modal-overlay"><div class="modal"><h2>Потврдите избор</h2><p>Да ли желите ову тему?</p><div class="modal-actions"><button class="btn btn-secondary" id="modal-cancel">Откажи</button><button class="btn btn-primary" id="modal-confirm">Потврди</button></div></div></div>
  <script>
    (function(){
      var timerEl=document.getElementById('expiry-timer'),textEl=document.getElementById('expiry-text'),expiry=new Date(timerEl.dataset.expiry);
      function updateTimer(){var d=expiry-new Date();if(d<=0){textEl.textContent='Истекло';return}var h=Math.floor(d/3600000),m=Math.floor((d%3600000)/60000),s=Math.floor((d%60000)/1000);textEl.textContent=[h,m,s].map(function(n){return String(n).padStart(2,'0')}).join(':')}
      updateTimer();setInterval(updateTimer,1000);
      var selectedTheme='';
      document.querySelectorAll('[data-select-theme]').forEach(function(b){b.addEventListener('click',function(){selectedTheme=this.dataset.selectTheme;document.getElementById('modal-overlay').classList.add('active')})});
      document.getElementById('modal-cancel').addEventListener('click',function(){document.getElementById('modal-overlay').classList.remove('active')});
      document.getElementById('modal-confirm').addEventListener('click',function(){document.getElementById('modal-overlay').classList.remove('active');document.querySelector('.main').style.display='none';document.getElementById('success-message').classList.add('active')});
    })();
  </script>
</body>
</html>`;
}

/**
 * Get layout-specific styling for index page
 * @param {string} layout - Layout name
 * @returns {object} Styling configuration
 */
function getLayoutStyles(layout) {
  const styles = {
    aurora: {
      emoji: '✨',
      cssVars: `:root{--primary:#9B4DCA;--bg:#0B0B1A;--surface:rgba(20,20,40,0.9);--text:#E0E0E0;--border:rgba(155,77,202,0.3);--muted:#8888AA;--timer-bg:rgba(155,77,202,0.2);--btn-text:#fff;--badge-text:#0B0B1A}`
    },
    botanical: {
      emoji: '🌿',
      cssVars: `:root{--primary:#2D4A3E;--bg:#F5F0E8;--surface:#FAF7F2;--text:#2D4A3E;--border:#C9B8A6;--muted:#5A7A6E;--timer-bg:rgba(45,74,62,0.1);--btn-text:#F5F0E8;--badge-text:#F5F0E8}`
    },
    filmnoir: {
      emoji: '🎬',
      cssVars: `:root{--primary:#D4AF37;--bg:#000;--surface:#111;--text:#FFF;--border:rgba(212,175,55,0.3);--muted:#999;--timer-bg:#D4AF37;--btn-text:#000;--badge-text:#000}`
    },
    glass: {
      emoji: '💎',
      cssVars: `:root{--primary:#6366F1;--bg:#0F172A;--surface:rgba(30,41,59,0.8);--text:#E2E8F0;--border:rgba(99,102,241,0.3);--muted:#94A3B8;--timer-bg:rgba(99,102,241,0.2);--btn-text:#fff;--badge-text:#0F172A}`
    },
    kinetic: {
      emoji: '⚡',
      cssVars: `:root{--primary:#F59E0B;--bg:#18181B;--surface:#27272A;--text:#FAFAFA;--border:rgba(245,158,11,0.3);--muted:#A1A1AA;--timer-bg:rgba(245,158,11,0.2);--btn-text:#18181B;--badge-text:#18181B}`
    },
    mediterranean: {
      emoji: '🍋',
      cssVars: `:root{--primary:#0047AB;--bg:#FFFEF7;--surface:#FFF;--text:#1C3D5C;--border:#D4D0C8;--muted:#5A7A94;--timer-bg:rgba(0,71,171,0.1);--btn-text:#FFFEF7;--badge-text:#FFFEF7}`
    },
    oldmoney: {
      emoji: '🏛️',
      cssVars: `:root{--primary:#8B7355;--bg:#FAF8F5;--surface:#FFFDF9;--text:#3D3428;--border:#D4C5B0;--muted:#7A6F5D;--timer-bg:rgba(139,115,85,0.1);--btn-text:#FAF8F5;--badge-text:#FAF8F5}`
    },
    scribble: {
      emoji: '✏️',
      cssVars: `:root{--primary:#E91E63;--bg:#FFFBF0;--surface:#FFF;--text:#333;--border:#DDD;--muted:#666;--timer-bg:rgba(233,30,99,0.1);--btn-text:#fff;--badge-text:#fff}`
    },
    velvet: {
      emoji: '🌙',
      cssVars: `:root{--primary:#C9A962;--bg:#1A1520;--surface:rgba(30,25,35,0.95);--text:#F5F0E8;--border:rgba(201,169,98,0.3);--muted:#9A8F99;--timer-bg:rgba(201,169,98,0.2);--btn-text:#1A1520;--badge-text:#1A1520}`
    },
    wabisabi: {
      emoji: '🍵',
      cssVars: `:root{--primary:#5C4033;--bg:#F5F2ED;--surface:#FDFBF7;--text:#3A3530;--border:#D4CEC5;--muted:#7A756D;--timer-bg:rgba(92,64,51,0.1);--btn-text:#F5F2ED;--badge-text:#F5F2ED}`
    }
  };

  return styles[layout] || styles.botanical;
}

/**
 * Generate preview for a layout
 * @param {string} layout - Layout name
 * @param {string} slug - Wedding data slug
 */
async function generatePreview(layout, slug) {
  // Get layout configuration
  const layoutConfig = config.getLayoutConfig(layout);
  if (!layoutConfig) {
    const available = config.getAvailableLayouts().join(', ');
    throw new Error(`Unknown layout: ${layout}. Available: ${available}`);
  }

  console.log(`\n${getLayoutStyles(layout).emoji} Generating ${layoutConfig.name} layout for: ${slug}\n`);

  // Load wedding data
  let data;
  try {
    data = loadWeddingData(slug);
  } catch (error) {
    throw new Error(`Failed to load wedding data: ${error.message}`);
  }

  // Validate wedding data
  const validation = utils.validateWeddingData(data);
  if (!validation.valid) {
    console.warn('  ⚠️  Validation errors:');
    validation.errors.forEach(err => console.warn(`      - ${err}`));
  }
  if (validation.warnings?.length) {
    validation.warnings.forEach(warn => console.warn(`      ℹ️  ${warn}`));
  }

  data.slug = slug;

  // Create output directory
  const outputDir = path.join(PREVIEW_DIR, `${slug}-${layout}`);
  try {
    await fs.ensureDir(outputDir);
  } catch (error) {
    throw new Error(`Failed to create output directory: ${error.message}`);
  }

  console.log(`📁 Output: ${outputDir}\n`);

  // Generate themed pages
  for (const theme of layoutConfig.themes) {
    console.log(`  🎨 Generating ${theme}...`);
    try {
      const html = generateThemedPage(data, layout, theme, layoutConfig);
      await fs.writeFile(path.join(outputDir, `${theme}.html`), html, 'utf8');
    } catch (error) {
      throw new Error(`Failed to generate ${theme} theme: ${error.message}`);
    }
  }

  // Generate index page
  console.log(`  📋 Generating index...`);
  try {
    const indexHtml = generateIndexPage(data, layout, layoutConfig);
    await fs.writeFile(path.join(outputDir, 'index.html'), indexHtml, 'utf8');
  } catch (error) {
    throw new Error(`Failed to generate index page: ${error.message}`);
  }

  console.log(`\n✅ Done! URL: http://localhost:${config.DEV_SERVER_PORT}/preview/${slug}-${layout}/\n`);
}

/**
 * Generate all layouts for a wedding
 * @param {string} slug - Wedding data slug
 */
async function generateAllLayouts(slug) {
  const layouts = config.getAvailableLayouts();
  console.log(`\n🎨 Generating all ${layouts.length} layouts for: ${slug}\n`);

  let successCount = 0;
  let failCount = 0;

  for (const layout of layouts) {
    try {
      await generatePreview(layout, slug);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to generate ${layout}: ${error.message}`);
      failCount++;
    }
  }

  console.log(`\n✅ Generation complete: ${successCount} succeeded, ${failCount} failed`);
}

/**
 * List available layouts
 */
function listLayouts() {
  console.log('\n📋 Available 2026 Layouts:\n');

  const layouts = config.getAvailableLayouts();
  layouts.forEach(layout => {
    const cfg = config.getLayoutConfig(layout);
    const styles = getLayoutStyles(layout);
    console.log(`  ${styles.emoji} ${layout.padEnd(15)} - ${cfg.name} (${cfg.themes.join(', ')})`);
  });

  console.log(`\nUsage:`);
  console.log(`  node scripts/generate-layout-preview.js <layout> [slug]`);
  console.log(`  node scripts/generate-layout-preview.js --all [slug]   # Generate all layouts`);
  console.log(`  node scripts/generate-layout-preview.js --list         # List layouts\n`);
}

// CLI handling
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    listLayouts();
    process.exit(0);
  }

  if (args[0] === '--list' || args[0] === '-l') {
    listLayouts();
    process.exit(0);
  }

  if (args[0] === '--all') {
    const slug = args[1] || 'demo';
    generateAllLayouts(slug).catch(error => {
      console.error(`\n❌ Error: ${error.message}\n`);
      process.exit(1);
    });
  } else {
    const layout = args[0];
    const slug = args[1] || 'demo';

    generatePreview(layout, slug).catch(error => {
      console.error(`\n❌ Error: ${error.message}\n`);
      process.exit(1);
    });
  }
}

module.exports = {
  generatePreview,
  generateAllLayouts,
  loadWeddingData,
  formatDate,
  processConditionals,
  replacePlaceholders,
  generateThemedPage,
  generateIndexPage,
  getLayoutStyles
};
