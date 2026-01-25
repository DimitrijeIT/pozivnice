#!/usr/bin/env node

/**
 * Generate Botanical Press Layout Preview
 * Scientific herbarium style with pressed flower aesthetic
 */

const fs = require('fs-extra');
const path = require('path');
const config = require('./config');

const ROOT_DIR = path.join(__dirname, '..');
const TEMPLATES_DIR = path.join(ROOT_DIR, 'templates');
const THEMES_DIR = path.join(TEMPLATES_DIR, 'themes-botanical');
const PREVIEW_DIR = path.join(ROOT_DIR, config.PATHS.preview);
const DATA_DIR = path.join(ROOT_DIR, config.PATHS.data);

const THEMES = ['forest', 'pressed'];

const THEME_NAMES = {
  forest: 'Шума',
  pressed: 'Хербаријум'
};

const THEME_DESCRIPTIONS = {
  forest: 'Дубоке шумске зелене боје са старинским папиром',
  pressed: 'Топли сепија тонови попут сушеног цвећа'
};

const THEME_FONTS = {
  forest: `<link href="https://fonts.googleapis.com/css2?family=Playfair+Display+SC&family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=EB+Garamond:ital,wght@0,400;1,400&family=Courier+Prime&family=Caveat:wght@400&display=swap" rel="stylesheet">`,
  pressed: `<link href="https://fonts.googleapis.com/css2?family=Playfair+Display+SC&family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=EB+Garamond:ital,wght@0,400;1,400&family=Courier+Prime&family=Caveat:wght@400&display=swap" rel="stylesheet">`
};

function loadWeddingData(slug) {
  const dataFile = path.join(DATA_DIR, `${slug}.json`);
  if (fs.existsSync(dataFile)) return fs.readJsonSync(dataFile);
  const sampleFile = path.join(DATA_DIR, 'sample-wedding.json');
  if (fs.existsSync(sampleFile)) return fs.readJsonSync(sampleFile);
  throw new Error(`No data found for: ${slug}`);
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const months = ['јануар', 'фебруар', 'март', 'април', 'мај', 'јун', 'јул', 'август', 'септембар', 'октобар', 'новембар', 'децембар'];
  return `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function processConditionals(html, data) {
  const conditionals = [
    { key: 'STORY', check: data.story_text },
    { key: 'HASHTAG', check: data.wedding_hashtag },
    { key: 'CEREMONY_MAP', check: data.ceremony_map_url },
    { key: 'RECEPTION_MAP', check: data.reception_map_url },
    { key: 'MEAL_OPTIONS', check: data.meal_options?.length }
  ];

  conditionals.forEach(({ key, check }) => {
    const regex = new RegExp(`\\{\\{#IF_${key}\\}\\}([\\s\\S]*?)\\{\\{\\/IF_${key}\\}\\}`, 'g');
    html = check ? html.replace(regex, '$1') : html.replace(regex, '');
  });

  return html;
}

function generateMealOptions(options) {
  if (!options?.length) return '';
  return options.map(o => `<option value="${o.value}">${o.label}</option>`).join('');
}

function replacePlaceholders(html, data) {
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
    'RSVP_DEADLINE': formatDate(data.rsvp_deadline),
    'MEAL_OPTIONS': generateMealOptions(data.meal_options),
    'RSVP_SCRIPT_URL': config.RSVP_SCRIPT_URL || '',
    'THEME_FONTS': data._themeFonts || '',
    'THEME_CSS': data._themeCss || ''
  };

  let result = html;
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
  }
  return result;
}

function generateThemedPage(data, theme) {
  const baseTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'base-botanical.html'), 'utf8');
  const themeCss = fs.readFileSync(path.join(THEMES_DIR, theme, 'style.css'), 'utf8');

  const templateData = {
    ...data,
    _themeCss: `<style>${themeCss}</style>`,
    _themeFonts: THEME_FONTS[theme] || ''
  };

  let html = processConditionals(baseTemplate, templateData);
  html = replacePlaceholders(html, templateData);
  return html;
}

function generateIndexPage(data) {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30);

  const themeCards = THEMES.map(theme => `
    <div class="theme-card">
      <div class="theme-preview">
        <iframe src="${theme}.html" style="width:100%;height:100%;border:none;pointer-events:none;transform:scale(0.8);transform-origin:top left;width:125%;height:125%;" loading="lazy"></iframe>
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
  `).join('');

  return `<!DOCTYPE html>
<html lang="sr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Изаберите тему - ${data.bride_name} & ${data.groom_name}</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌿</text></svg>">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    :root{--primary:#2D4A3E;--primary-dark:#1E352B;--bg:#F5F0E8;--white:#FAF7F2;--border:#C9B8A6;--muted:#5A7A6E;--accent:#8B4513}
    body{font-family:'Inter',sans-serif;background:var(--bg);color:#2D4A3E;line-height:1.6;min-height:100vh}
    .container{max-width:900px;margin:0 auto;padding:0 1rem}
    .header{background:var(--white);border-bottom:2px solid var(--border);padding:1.5rem 0;position:sticky;top:0;z-index:100}
    .header-content{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem}
    .header-title{font-family:'Playfair Display',serif;font-size:1.25rem;font-weight:500}
    .header-title span{color:var(--primary)}
    .expiry-timer{display:flex;align-items:center;gap:0.5rem;padding:0.5rem 1rem;background:rgba(45,74,62,0.1);border-radius:8px;font-size:0.875rem;color:var(--primary)}
    .main{padding:3rem 0}
    .intro{text-align:center;margin-bottom:3rem}
    .intro h1{font-family:'Playfair Display',serif;font-size:2rem;font-weight:400;margin-bottom:0.75rem}
    .intro p{color:var(--muted);max-width:600px;margin:0 auto}
    .badge{display:inline-block;background:var(--primary);color:var(--bg);padding:0.25rem 0.75rem;border-radius:50px;font-size:0.75rem;margin-bottom:1rem}
    .theme-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(350px,1fr));gap:2rem}
    .theme-card{background:var(--white);border:1px solid var(--border);border-radius:8px;overflow:hidden;transition:transform 0.3s}
    .theme-card:hover{transform:translateY(-4px)}
    .theme-preview{aspect-ratio:3/4;overflow:hidden;background:var(--bg)}
    .theme-info{padding:1.5rem}
    .theme-name{font-family:'Playfair Display',serif;font-size:1.25rem;font-weight:500;margin-bottom:0.5rem}
    .theme-description{color:var(--muted);margin-bottom:1.25rem;font-size:0.9rem}
    .theme-actions{display:flex;gap:0.75rem}
    .btn{padding:0.75rem 1.25rem;border-radius:6px;font-size:0.9rem;font-weight:500;cursor:pointer;text-decoration:none;border:none;font-family:inherit;transition:all 0.2s}
    .btn-primary{background:var(--primary);color:var(--bg);flex:1}
    .btn-primary:hover{background:var(--accent)}
    .btn-secondary{background:transparent;color:var(--primary);border:1px solid var(--border)}
    .btn-secondary:hover{border-color:var(--primary)}
    .success-message{display:none;text-align:center;padding:4rem 2rem}
    .success-message.active{display:block}
    .modal-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.3);z-index:1000;align-items:center;justify-content:center}
    .modal-overlay.active{display:flex}
    .modal{background:var(--white);border:1px solid var(--border);border-radius:12px;max-width:400px;padding:2rem;text-align:center}
    .modal h2{font-family:'Playfair Display',serif;margin-bottom:0.75rem}
    .modal p{color:var(--muted);margin-bottom:1.5rem}
    .modal-actions{display:flex;gap:1rem}
    .modal-actions .btn{flex:1}
  </style>
</head>
<body>
  <header class="header"><div class="container"><div class="header-content">
    <h1 class="header-title">🌿 <span>${data.bride_name} & ${data.groom_name}</span></h1>
    <div class="expiry-timer" id="expiry-timer" data-expiry="${expiryDate.toISOString()}"><span>⏱️</span><span id="expiry-text">--:--:--</span></div>
  </div></div></header>
  <main class="main"><div class="container">
    <div class="intro">
      <span class="badge">🌿 Ботаника</span>
      <h1>Изаберите тему позивнице</h1>
      <p>Хербаријум љубави — научне илустрације, пресовано цвеће и романтика природе.</p>
    </div>
    <div class="theme-grid">${themeCards}</div>
  </div></main>
  <div class="success-message" id="success-message"><div class="container"><h2>✅ Тема изабрана!</h2></div></div>
  <div class="modal-overlay" id="modal-overlay"><div class="modal"><h2>Потврдите избор</h2><p>Да ли желите ову тему?</p><div class="modal-actions"><button class="btn btn-secondary" id="modal-cancel">Откажи</button><button class="btn btn-primary" id="modal-confirm">Потврди</button></div></div></div>
  <script>
    (function(){
      const timerEl=document.getElementById('expiry-timer'),textEl=document.getElementById('expiry-text'),expiry=new Date(timerEl.dataset.expiry);
      function updateTimer(){const d=expiry-new Date();if(d<=0){textEl.textContent='Истекло';return}const h=Math.floor(d/3600000),m=Math.floor((d%3600000)/60000),s=Math.floor((d%60000)/1000);textEl.textContent=[h,m,s].map(n=>String(n).padStart(2,'0')).join(':')}
      updateTimer();setInterval(updateTimer,1000);
      document.querySelectorAll('[data-select-theme]').forEach(b=>b.addEventListener('click',()=>{document.getElementById('modal-overlay').classList.add('active')}));
      document.getElementById('modal-cancel').addEventListener('click',()=>document.getElementById('modal-overlay').classList.remove('active'));
      document.getElementById('modal-confirm').addEventListener('click',()=>{document.getElementById('modal-overlay').classList.remove('active');document.querySelector('.main').style.display='none';document.getElementById('success-message').classList.add('active')});
    })();
  </script>
</body>
</html>`;
}

async function generatePreview(slug) {
  console.log(`\n🌿 Generating botanical press layout for: ${slug}\n`);

  const data = loadWeddingData(slug);
  data.slug = slug;

  const outputDir = path.join(PREVIEW_DIR, `${slug}-botanical`);
  await fs.ensureDir(outputDir);

  console.log(`📁 Output: ${outputDir}\n`);

  for (const theme of THEMES) {
    console.log(`  🎨 Generating ${theme}...`);
    const html = generateThemedPage(data, theme);
    await fs.writeFile(path.join(outputDir, `${theme}.html`), html, 'utf8');
  }

  console.log(`  📋 Generating index...`);
  await fs.writeFile(path.join(outputDir, 'index.html'), generateIndexPage(data), 'utf8');

  console.log(`\n✅ Done! URL: http://localhost:${config.DEV_SERVER_PORT}/preview/${slug}-botanical/\n`);
}

if (require.main === module) {
  generatePreview(process.argv[2] || 'demo').catch(console.error);
}

module.exports = { generateBotanicalPreview: generatePreview };
