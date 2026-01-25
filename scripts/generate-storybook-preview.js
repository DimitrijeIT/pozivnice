#!/usr/bin/env node

/**
 * Generate Storybook Layout Preview
 *
 * Creates preview pages using the split-screen, chapter-based layout.
 * Features:
 * - Split-screen design (visual left, content right)
 * - Chapter-based navigation (no scrolling)
 * - Keyboard and touch navigation
 * - Book-like reading experience
 *
 * Usage:
 *   node scripts/generate-storybook-preview.js <wedding-slug>
 */

const fs = require('fs-extra');
const path = require('path');
const config = require('./config');

// Paths
const ROOT_DIR = path.join(__dirname, '..');
const TEMPLATES_DIR = path.join(ROOT_DIR, 'templates');
const THEMES_DIR = path.join(TEMPLATES_DIR, 'themes-storybook');
const PREVIEW_DIR = path.join(ROOT_DIR, config.PATHS.preview);
const DATA_DIR = path.join(ROOT_DIR, config.PATHS.data);

// Storybook themes
const STORYBOOK_THEMES = ['novel', 'ink'];

const THEME_NAMES = {
  novel: 'Роман',
  ink: 'Мастило'
};

const THEME_DESCRIPTIONS = {
  novel: 'Топли, романтични дизајн попут књиге са елегантном serif типографијом',
  ink: 'Модеран, контрастан едиторијални стил са смелом типографијом'
};

const THEME_FONTS = {
  novel: `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
  `,
  ink: `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  `
};

/**
 * Load wedding data
 */
function loadWeddingData(slug) {
  const dataFile = path.join(DATA_DIR, `${slug}.json`);
  if (fs.existsSync(dataFile)) {
    return fs.readJsonSync(dataFile);
  }

  const sampleFile = path.join(DATA_DIR, 'sample-wedding.json');
  if (fs.existsSync(sampleFile)) {
    console.log('Using sample-wedding.json as data source');
    return fs.readJsonSync(sampleFile);
  }

  throw new Error(`No data found for wedding: ${slug}`);
}

/**
 * Format date for display
 */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const months = [
    'јануара', 'фебруара', 'марта', 'априла', 'маја', 'јуна',
    'јула', 'августа', 'септембра', 'октобра', 'новембра', 'децембра'
  ];
  return `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}.`;
}

/**
 * Generate timeline items HTML
 */
function generateTimelineItems(timeline) {
  if (!timeline || timeline.length === 0) return '';

  return timeline.slice(0, 5).map(item => `
    <div class="timeline-item">
      <div class="timeline-marker">${item.icon || '💫'}</div>
      <div class="timeline-info">
        <p class="timeline-date">${item.date}</p>
        <h4 class="timeline-title">${item.title}</h4>
      </div>
    </div>
  `).join('\n');
}

/**
 * Generate meal options HTML
 */
function generateMealOptions(options) {
  if (!options || options.length === 0) return '';
  return options.map(opt =>
    `<option value="${opt.value}">${opt.label}</option>`
  ).join('\n');
}

/**
 * Process conditionals in template
 */
function processConditionals(html, data) {
  const hasTimeline = data.timeline && data.timeline.length > 0;

  // IF_TIMELINE
  if (hasTimeline) {
    html = html.replace(/\{\{#IF_TIMELINE\}\}([\s\S]*?)\{\{\/IF_TIMELINE\}\}/g, '$1');
  } else {
    html = html.replace(/\{\{#IF_TIMELINE\}\}[\s\S]*?\{\{\/IF_TIMELINE\}\}/g, '');
  }

  // IF_HASHTAG
  if (data.wedding_hashtag) {
    html = html.replace(/\{\{#IF_HASHTAG\}\}([\s\S]*?)\{\{\/IF_HASHTAG\}\}/g, '$1');
  } else {
    html = html.replace(/\{\{#IF_HASHTAG\}\}[\s\S]*?\{\{\/IF_HASHTAG\}\}/g, '');
  }

  // IF_CEREMONY_MAP
  if (data.ceremony_map_url) {
    html = html.replace(/\{\{#IF_CEREMONY_MAP\}\}([\s\S]*?)\{\{\/IF_CEREMONY_MAP\}\}/g, '$1');
  } else {
    html = html.replace(/\{\{#IF_CEREMONY_MAP\}\}[\s\S]*?\{\{\/IF_CEREMONY_MAP\}\}/g, '');
  }

  // IF_RECEPTION_MAP
  if (data.reception_map_url) {
    html = html.replace(/\{\{#IF_RECEPTION_MAP\}\}([\s\S]*?)\{\{\/IF_RECEPTION_MAP\}\}/g, '$1');
  } else {
    html = html.replace(/\{\{#IF_RECEPTION_MAP\}\}[\s\S]*?\{\{\/IF_RECEPTION_MAP\}\}/g, '');
  }

  // IF_ADDITIONAL_INFO
  if (data.additional_info) {
    html = html.replace(/\{\{#IF_ADDITIONAL_INFO\}\}([\s\S]*?)\{\{\/IF_ADDITIONAL_INFO\}\}/g, '$1');
  } else {
    html = html.replace(/\{\{#IF_ADDITIONAL_INFO\}\}[\s\S]*?\{\{\/IF_ADDITIONAL_INFO\}\}/g, '');
  }

  // IF_MEAL_OPTIONS
  if (data.meal_options && data.meal_options.length > 0) {
    html = html.replace(/\{\{#IF_MEAL_OPTIONS\}\}([\s\S]*?)\{\{\/IF_MEAL_OPTIONS\}\}/g, '$1');
  } else {
    html = html.replace(/\{\{#IF_MEAL_OPTIONS\}\}[\s\S]*?\{\{\/IF_MEAL_OPTIONS\}\}/g, '');
  }

  return html;
}

/**
 * Replace placeholders in template
 */
function replacePlaceholders(html, data) {
  const hasTimeline = data.timeline && data.timeline.length > 0;

  // Calculate page numbers based on whether timeline exists
  const venuePage = hasTimeline ? 4 : 3;
  const rsvpPage = hasTimeline ? 5 : 4;
  const totalPages = hasTimeline ? 6 : 5;

  const replacements = {
    'BRIDE_NAME': data.bride_name || '',
    'GROOM_NAME': data.groom_name || '',
    'WEDDING_DATE_FORMATTED': formatDate(data.wedding_date),
    'WEDDING_DATE_ISO': new Date(data.wedding_date).toISOString(),
    'CEREMONY_VENUE': data.ceremony_venue || '',
    'CEREMONY_ADDRESS': data.ceremony_address || '',
    'CEREMONY_TIME': data.ceremony_time || '',
    'CEREMONY_MAP_URL': data.ceremony_map_url || '',
    'RECEPTION_VENUE': data.reception_venue || '',
    'RECEPTION_ADDRESS': data.reception_address || '',
    'RECEPTION_TIME': data.reception_time || '',
    'RECEPTION_MAP_URL': data.reception_map_url || '',
    'INVITATION_INTRO': data.invitation_intro || '',
    'INVITATION_TEXT': data.invitation_text || '',
    'INVITATION_SIGNATURE': data.invitation_signature || '',
    'STORY_TEXT': data.story_text || '',
    'TIMELINE_ITEMS': generateTimelineItems(data.timeline),
    'WEDDING_SLUG': data.slug || '',
    'WEDDING_HASHTAG': data.wedding_hashtag || '',
    'RSVP_DEADLINE': formatDate(data.rsvp_deadline),
    'MEAL_OPTIONS': generateMealOptions(data.meal_options),
    'ADDITIONAL_INFO': data.additional_info || '',
    'RSVP_SCRIPT_URL': config.RSVP_SCRIPT_URL || '',
    'THEME_FONTS': data._themeFonts || '',
    'THEME_CSS': data._themeCss || '',
    'VENUE_PAGE': venuePage,
    'RSVP_PAGE': rsvpPage,
    'VENUE_CHAPTER': hasTimeline ? 5 : 4,
    'VENUE_PAGE_NUM': venuePage + 1,
    'RSVP_PAGE_NUM': rsvpPage + 1,
    'TOTAL_PAGES': totalPages
  };

  let result = html;
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
  }

  return result;
}

/**
 * Generate themed page
 */
function generateThemedPage(data, theme) {
  // Load base template
  const baseTemplate = fs.readFileSync(
    path.join(TEMPLATES_DIR, 'base-storybook.html'),
    'utf8'
  );

  // Load theme CSS
  const themeCss = fs.readFileSync(
    path.join(THEMES_DIR, theme, 'style.css'),
    'utf8'
  );

  // Prepare data
  const templateData = {
    ...data,
    _themeCss: `<style>\n${themeCss}\n</style>`,
    _themeFonts: THEME_FONTS[theme] || ''
  };

  // Process conditionals
  let html = processConditionals(baseTemplate, templateData);

  // Replace placeholders
  html = replacePlaceholders(html, templateData);

  return html;
}

/**
 * Generate index page
 */
function generateIndexPage(data) {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30);

  const themeCards = STORYBOOK_THEMES.map(theme => `
    <div class="theme-card">
      <div class="theme-preview">
        <iframe src="${theme}.html" style="width:100%;height:100%;border:none;pointer-events:none;" loading="lazy"></iframe>
      </div>
      <div class="theme-info">
        <h3 class="theme-name">${THEME_NAMES[theme]}</h3>
        <p class="theme-description">${THEME_DESCRIPTIONS[theme]}</p>
        <div class="theme-actions">
          <a href="${theme}.html" target="_blank" class="btn btn-secondary">Преглед</a>
          <button class="btn btn-primary" data-select-theme="${theme}">Изабери</button>
        </div>
      </div>
    </div>
  `).join('\n');

  return `<!DOCTYPE html>
<html lang="sr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>Изаберите тему - ${data.bride_name} & ${data.groom_name}</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📖</text></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --color-primary: #3D3229;
      --color-primary-dark: #2A231C;
      --color-text: #1F2937;
      --color-text-light: #6B7280;
      --color-background: #F5EFE6;
      --color-white: #FFFFFF;
      --color-border: #E5E7EB;
      --font-family: 'Inter', -apple-system, sans-serif;
    }
    body {
      font-family: var(--font-family);
      background: var(--color-background);
      color: var(--color-text);
      line-height: 1.6;
      min-height: 100vh;
    }
    .container { max-width: 1000px; margin: 0 auto; padding: 0 1.5rem; }
    .header {
      background: var(--color-white);
      border-bottom: 1px solid var(--color-border);
      padding: 1.5rem 0;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .header-title { font-size: 1.25rem; font-weight: 600; }
    .header-title span { color: var(--color-primary); }
    .expiry-timer {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: #FEF3C7;
      border-radius: 8px;
      font-size: 0.875rem;
    }
    .main { padding: 3rem 0; }
    .intro { text-align: center; margin-bottom: 3rem; }
    .intro h1 { font-size: 2rem; font-weight: 600; margin-bottom: 0.75rem; }
    .intro p { color: var(--color-text-light); max-width: 600px; margin: 0 auto; }
    .badge { display: inline-block; background: var(--color-primary); color: white; padding: 0.25rem 0.75rem; border-radius: 50px; font-size: 0.75rem; margin-bottom: 1rem; }
    .theme-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 2rem; }
    .theme-card {
      background: var(--color-white);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .theme-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.12); }
    .theme-preview { aspect-ratio: 16/10; overflow: hidden; background: var(--color-background); }
    .theme-info { padding: 1.5rem; }
    .theme-name { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; }
    .theme-description { color: var(--color-text-light); margin-bottom: 1.25rem; }
    .theme-actions { display: flex; gap: 0.75rem; }
    .btn {
      padding: 0.75rem 1.25rem;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
      border: none;
      font-family: inherit;
      transition: all 0.2s;
    }
    .btn-primary { background: var(--color-primary); color: white; flex: 1; }
    .btn-primary:hover { background: var(--color-primary-dark); }
    .btn-secondary { background: transparent; color: var(--color-primary); border: 1px solid var(--color-border); }
    .btn-secondary:hover { border-color: var(--color-primary); }
    .success-message { display: none; text-align: center; padding: 4rem 2rem; }
    .success-message.active { display: block; }
    .success-icon { font-size: 4rem; margin-bottom: 1rem; }
    .modal-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 1000;
      align-items: center;
      justify-content: center;
    }
    .modal-overlay.active { display: flex; }
    .modal { background: white; border-radius: 16px; max-width: 400px; padding: 2rem; text-align: center; }
    .modal-icon { font-size: 3rem; margin-bottom: 1rem; }
    .modal h2 { margin-bottom: 0.75rem; }
    .modal p { color: var(--color-text-light); margin-bottom: 1.5rem; }
    .modal-actions { display: flex; gap: 1rem; }
    .modal-actions .btn { flex: 1; }
    @media (max-width: 768px) {
      .theme-grid { grid-template-columns: 1fr; }
      .header-content { flex-direction: column; text-align: center; }
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <h1 class="header-title">Позивница за <span>${data.bride_name} & ${data.groom_name}</span></h1>
        <div class="expiry-timer" id="expiry-timer" data-expiry="${expiryDate.toISOString()}">
          <span>⏱️</span>
          <span id="expiry-text">Преостало време: --:--:--</span>
        </div>
      </div>
    </div>
  </header>

  <main class="main" id="main-content">
    <div class="container">
      <div class="intro">
        <span class="badge">📖 Стил књиге</span>
        <h1>Изаберите тему позивнице</h1>
        <p>Позивница са навигацијом по поглављима — читајте вашу љубавну причу као књигу.</p>
      </div>
      <div class="theme-grid">
        ${themeCards}
      </div>
    </div>
  </main>

  <div class="success-message" id="success-message">
    <div class="container">
      <div class="success-icon">✅</div>
      <h2>Тема је успешно изабрана!</h2>
      <p>Ваша позивница ће ускоро бити спремна.</p>
    </div>
  </div>

  <div class="modal-overlay" id="modal-overlay">
    <div class="modal">
      <div class="modal-icon">📖</div>
      <h2>Потврдите избор</h2>
      <p>Да ли сте сигурни да желите ову тему?</p>
      <div class="modal-actions">
        <button class="btn btn-secondary" id="modal-cancel">Откажи</button>
        <button class="btn btn-primary" id="modal-confirm">Потврди</button>
      </div>
    </div>
  </div>

  <script>
    (function() {
      let selectedTheme = null;
      const CONFIG = {
        THEME_SELECTION_URL: '${config.THEME_SELECTION_URL}',
        WEDDING_SLUG: '${data.slug}'
      };

      // Timer
      const timerEl = document.getElementById('expiry-timer');
      const textEl = document.getElementById('expiry-text');
      const expiry = new Date(timerEl.dataset.expiry);
      function updateTimer() {
        const diff = expiry - new Date();
        if (diff <= 0) { textEl.textContent = 'Истекло'; return; }
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        textEl.textContent = 'Преостало: ' + [h,m,s].map(n => String(n).padStart(2,'0')).join(':');
      }
      updateTimer();
      setInterval(updateTimer, 1000);

      // Theme selection
      document.querySelectorAll('[data-select-theme]').forEach(btn => {
        btn.addEventListener('click', () => {
          selectedTheme = btn.dataset.selectTheme;
          document.getElementById('modal-overlay').classList.add('active');
        });
      });

      document.getElementById('modal-cancel').addEventListener('click', () => {
        document.getElementById('modal-overlay').classList.remove('active');
      });

      document.getElementById('modal-confirm').addEventListener('click', () => {
        const data = { slug: CONFIG.WEDDING_SLUG, theme: selectedTheme, layout: 'storybook' };
        if (CONFIG.THEME_SELECTION_URL.includes('{{')) {
          console.log('Demo:', data);
        } else {
          fetch(CONFIG.THEME_SELECTION_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(data) });
        }
        document.getElementById('modal-overlay').classList.remove('active');
        document.getElementById('main-content').style.display = 'none';
        document.getElementById('success-message').classList.add('active');
      });
    })();
  </script>
</body>
</html>`;
}

/**
 * Main function
 */
async function generateStorybookPreview(slug) {
  console.log(`\n📖 Generating storybook layout preview for: ${slug}\n`);

  // Load data
  const data = loadWeddingData(slug);
  data.slug = slug;

  // Create output directory
  const outputDir = path.join(PREVIEW_DIR, `${slug}-storybook`);
  await fs.ensureDir(outputDir);

  console.log(`📁 Output: ${outputDir}\n`);

  // Generate each theme
  for (const theme of STORYBOOK_THEMES) {
    console.log(`  🎨 Generating ${theme} theme...`);
    const html = generateThemedPage(data, theme);
    await fs.writeFile(path.join(outputDir, `${theme}.html`), html, 'utf8');
  }

  // Generate index
  console.log(`  📋 Generating theme selector...`);
  const indexHtml = generateIndexPage(data);
  await fs.writeFile(path.join(outputDir, 'index.html'), indexHtml, 'utf8');

  console.log(`\n✅ Storybook preview generated!`);
  console.log(`📍 URL: http://localhost:${config.DEV_SERVER_PORT}/preview/${slug}-storybook/\n`);

  return { success: true, outputDir };
}

// CLI
if (require.main === module) {
  const slug = process.argv[2] || 'demo';
  generateStorybookPreview(slug)
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Error:', err);
      process.exit(1);
    });
}

module.exports = { generateStorybookPreview };
