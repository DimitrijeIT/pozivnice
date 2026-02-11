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
    'јануара', 'фебруара', 'марта', 'априла', 'маја', 'јуна',
    'јула', 'августа', 'септембра', 'октобра', 'новембра', 'децембра'
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
    { key: 'PULL_QUOTE', check: data.pull_quote || data.story_text },
    { key: 'HASHTAG', check: data.wedding_hashtag },
    { key: 'DRESS_CODE', check: data.dress_code_text },
    { key: 'ADDITIONAL_INFO', check: data.additional_info },
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
 * Generate story cards HTML for envelope template
 */
function generateStoryCards(timeline) {
  if (!timeline?.length) return '';
  return timeline.map(item =>
    `<div class="story-card fade-in">
      <div class="story-card-icon">${utils.escapeHtml(item.icon || '💫')}</div>
      <p class="story-card-date">${utils.escapeHtml(item.date || '')}</p>
      <h3 class="story-card-title">${utils.escapeHtml(item.title || '')}</h3>
      <p class="story-card-text">${utils.escapeHtml(item.description || '')}</p>
    </div>`
  ).join('\n');
}

/**
 * Generate timeline items HTML for storybook template
 */
function generateTimelineItems(timeline) {
  if (!timeline?.length) return '';
  return timeline.map(item =>
    `<div class="timeline-item">
      <div class="timeline-icon">${utils.escapeHtml(item.icon || '💫')}</div>
      <div class="timeline-content">
        <p class="timeline-date">${utils.escapeHtml(item.date || '')}</p>
        <h3 class="timeline-title">${utils.escapeHtml(item.title || '')}</h3>
        <p class="timeline-text">${utils.escapeHtml(item.description || '')}</p>
      </div>
    </div>`
  ).join('\n');
}

function calculateTotalPages(data) {
  let pages = 4; // intro, countdown, venue, rsvp
  if (data.timeline?.length) pages++;
  return String(pages);
}

function calculateVenuePage(data) {
  return data.timeline?.length ? '4' : '3';
}

function calculateRsvpPage(data) {
  return data.timeline?.length ? '5' : '4';
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
    'RECEPTION_MAP_URL', 'WEDDING_DATE_ISO',
    'STORY_CARDS', 'TIMELINE_ITEMS', 'CALENDAR_BUTTONS'
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
    'INVITATION_TEXT': data.invitation_text || 'Молимо вас да нам се придружите у прослави најважнијег дана у нашим животима.',
    'PULL_QUOTE': data.pull_quote || (data.story_text ? 'Свака љубавна прича је лепа, али наша је омиљена' : ''),
    'STORY_TEXT': data.story_text || '',
    'DRESS_CODE_TEXT': data.dress_code_text || 'Елегантна одећа',
    'ADDITIONAL_INFO': data.additional_info || '',
    'INVITATION_SIGNATURE': data.invitation_signature || `${data.bride_name || ''} & ${data.groom_name || ''}`,
    'WEDDING_SLUG': data.slug || '',
    'WEDDING_HASHTAG': data.wedding_hashtag || '',
    'RSVP_DEADLINE': data.rsvp_deadline ? formatDate(data.rsvp_deadline) : '',
    'MEAL_OPTIONS': generateMealOptions(data.meal_options),
    'RSVP_SCRIPT_URL': config.RSVP_SCRIPT_URL || '',
    'THEME_FONTS': data._themeFonts || '',
    'THEME_CSS': data._themeCss || '',
    'BRIDE_NAME_INITIAL': (data.bride_name || '')[0] || '',
    'GROOM_NAME_INITIAL': (data.groom_name || '')[0] || '',
    'STORY_CARDS': generateStoryCards(data.timeline),
    'TIMELINE_ITEMS': generateTimelineItems(data.timeline),
    'TOTAL_PAGES': calculateTotalPages(data),
    'VENUE_PAGE': calculateVenuePage(data),
    'VENUE_PAGE_NUM': calculateVenuePage(data),
    'VENUE_CHAPTER': data.timeline?.length ? '4' : '3',
    'RSVP_PAGE': calculateRsvpPage(data),
    'RSVP_PAGE_NUM': calculateRsvpPage(data),
    'CALENDAR_BUTTONS': (() => {
      const calendarLinks = utils.generateCalendarLinks(data);
      return utils.generateCalendarButtons(calendarLinks);
    })()
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
  let baseTemplatePath, themeCssPath;

  if (layoutConfig.isOriginal) {
    // Original themes use base.html and templates/themes/{theme}/style.css
    baseTemplatePath = path.join(TEMPLATES_DIR, 'base.html');
    const themePath = layoutConfig.themePath || layout;
    themeCssPath = path.join(TEMPLATES_DIR, 'themes', themePath, 'style.css');
  } else {
    // 2026 layouts use base-{layout}.html and themes-{layout}/{theme}/style.css
    baseTemplatePath = path.join(TEMPLATES_DIR, `base-${layout}.html`);
    themeCssPath = path.join(TEMPLATES_DIR, `themes-${layout}`, theme, 'style.css');
  }

  if (!fs.existsSync(baseTemplatePath)) {
    const templateName = layoutConfig.isOriginal ? 'base.html' : `base-${layout}.html`;
    throw new Error(`Base template not found: ${templateName}`);
  }

  if (!fs.existsSync(themeCssPath)) {
    const cssPath = layoutConfig.isOriginal
      ? `themes/${layoutConfig.themePath || layout}/style.css`
      : `themes-${layout}/${theme}/style.css`;
    throw new Error(`Theme CSS not found: ${cssPath}`);
  }

  const baseTemplate = fs.readFileSync(baseTemplatePath, 'utf8');
  const themeCss = fs.readFileSync(themeCssPath, 'utf8');

  // Load shared CSS tokens, form styles, and mobile optimizations if they exist
  let sharedCss = '';
  const tokensCssPath = path.join(TEMPLATES_DIR, 'tokens.css');
  if (fs.existsSync(tokensCssPath)) {
    sharedCss += fs.readFileSync(tokensCssPath, 'utf8') + '\n';
  }
  const mobileCssPath = path.join(TEMPLATES_DIR, 'mobile.css');
  if (fs.existsSync(mobileCssPath)) {
    sharedCss += fs.readFileSync(mobileCssPath, 'utf8') + '\n';
  }

  const templateData = {
    ...data,
    _themeCss: `<style>${sharedCss}${themeCss}</style>`,
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
    .success-message h2{font-size:1.75rem;margin-bottom:0.75rem}
    .success-message p{color:var(--muted);max-width:500px;margin:0 auto}
    .success-notice{display:flex;align-items:flex-start;gap:0.75rem;background:rgba(var(--primary-rgb,184,134,11),0.08);border:1px solid var(--border);border-radius:10px;padding:1rem 1.25rem;max-width:480px;margin:1.5rem auto;text-align:left;font-size:0.875rem;color:var(--muted);line-height:1.6}
    .success-notice-icon{font-size:1.25rem;flex-shrink:0;margin-top:0.125rem}
    .success-notice.ready{background:rgba(16,185,129,0.1);border-color:rgba(16,185,129,0.3)}
    .success-notice.ready strong{color:#10B981}
    .poll-spinner{display:inline-block;width:14px;height:14px;border:2px solid var(--border);border-top-color:var(--primary);border-radius:50%;animation:spin 0.8s linear infinite;vertical-align:middle;margin-right:0.375rem}
    @keyframes spin{to{transform:rotate(360deg)}}
    .success-site-link{display:inline-flex;align-items:center;gap:0.5rem;padding:0.875rem 2rem;background:var(--primary);color:var(--btn-text);border-radius:8px;font-family:inherit;font-size:1rem;font-weight:500;text-decoration:none;transition:opacity 0.2s,transform 0.15s;margin-top:0.5rem}
    .success-site-link:hover{opacity:0.9;transform:translateY(-1px)}
    .success-site-link.disabled{opacity:0.4;pointer-events:none}
    .success-site-link.ready{animation:readyPulse 0.6s ease}
    @keyframes readyPulse{0%{transform:scale(1)}50%{transform:scale(1.05)}100%{transform:scale(1)}}
    .success-detail{font-size:0.8125rem;color:var(--muted);max-width:440px;margin:1rem auto 0}
    @media(prefers-reduced-motion:reduce){.poll-spinner{animation:none}.success-site-link.ready{animation:none}}
    .modal-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;align-items:center;justify-content:center}
    .modal-overlay.active{display:flex}
    .modal{background:var(--surface);border:1px solid var(--border);border-radius:12px;max-width:400px;padding:2rem;text-align:center}
    .modal h2{margin-bottom:0.75rem}
    .modal p{color:var(--muted);margin-bottom:1.5rem}
    .modal-actions{display:flex;gap:1rem}
    .modal-actions .btn{flex:1}
    .correction-section{max-width:600px;margin:3rem auto 0;text-align:center;padding:0 1rem}
    .correction-toggle{background:none;border:none;color:var(--muted);font-family:inherit;font-size:0.875rem;cursor:pointer;padding:0.5rem 1rem;transition:color 0.2s}
    .correction-toggle:hover{color:var(--primary)}
    .correction-form{display:none;margin-top:1rem;padding:1.5rem;background:var(--surface);border:1px solid var(--border);border-radius:12px;text-align:left}
    .correction-form.open{display:block}
    .correction-form label{display:block;font-size:0.8125rem;font-weight:600;margin-bottom:0.375rem}
    .correction-form textarea{width:100%;min-height:100px;padding:0.75rem;border:1px solid var(--border);border-radius:8px;font-family:inherit;font-size:0.9375rem;color:var(--text);background:var(--bg);resize:vertical;margin-bottom:1rem}
    .correction-form textarea:focus{outline:none;border-color:var(--primary)}
    .correction-sent{display:none;padding:1rem;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:8px;color:#10B981;font-size:0.875rem;text-align:center;margin-top:1rem}
    .correction-sent.visible{display:block}
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
  <div class="correction-section" id="correction-section">
    <button class="correction-toggle" id="correction-toggle">Нешто није тачно? Јавите нам →</button>
    <div class="correction-form" id="correction-form">
      <label for="correction-text">Опишите шта треба исправити:</label>
      <textarea id="correction-text" placeholder="нпр. Погрешно сам унео/ла адресу прославе, треба да буде..."></textarea>
      <button class="btn btn-primary" id="correction-submit" style="width:100%;">Пошаљите исправку</button>
    </div>
    <div class="correction-sent" id="correction-sent">&#10003; Хвала! Примили смо вашу поруку и јавићемо вам када исправимо податке.</div>
  </div>
  <div class="success-message" id="success-message"><div class="container">
    <h2>✅ Тема је успешно изабрана!</h2>
    <p>Ваша позивница се управо креира у изабраном дизајну.</p>
    <div class="success-notice" id="siteStatusNotice"><span class="success-notice-icon" id="siteStatusIcon">⏳</span><div id="siteStatusText"><strong><span class="poll-spinner"></span> Позивница се креира...</strong> Сачекајте пар минута. Страница ће се аутоматски активирати.</div></div>
    <a href="#" class="success-site-link disabled" id="siteLink" target="_blank">Отворите вашу позивницу →</a>
    <div class="success-detail">Линк ће радити чим се позивница заврши са креирањем.</div>
  </div></div>
  <div class="modal-overlay" id="modal-overlay"><div class="modal"><h2>Потврдите избор</h2><p>Да ли желите ову тему?</p><div class="modal-actions"><button class="btn btn-secondary" id="modal-cancel">Откажи</button><button class="btn btn-primary" id="modal-confirm">Потврди</button></div></div></div>
  <script>
    (function(){
      var SLUG='${utils.escapeAttribute(data.slug || '')}';
      var SELECTION_URL='${config.THEME_SELECTION_URL}';
      var SITE_URL='/site/'+SLUG+'/';

      // Expiry timer
      var timerEl=document.getElementById('expiry-timer'),textEl=document.getElementById('expiry-text'),expiry=new Date(timerEl.dataset.expiry);
      function updateTimer(){var d=expiry-new Date();if(d<=0){textEl.textContent='Истекло';return}var h=Math.floor(d/3600000),m=Math.floor((d%3600000)/60000),s=Math.floor((d%60000)/1000);textEl.textContent=[h,m,s].map(function(n){return String(n).padStart(2,'0')}).join(':')}
      updateTimer();setInterval(updateTimer,1000);

      // Theme selection
      var selectedTheme='';
      document.querySelectorAll('[data-select-theme]').forEach(function(b){b.addEventListener('click',function(){selectedTheme=this.dataset.selectTheme;document.getElementById('modal-overlay').classList.add('active')})});
      document.getElementById('modal-cancel').addEventListener('click',function(){document.getElementById('modal-overlay').classList.remove('active')});
      document.getElementById('modal-confirm').addEventListener('click',function(){
        var btn=this;btn.disabled=true;btn.textContent='Шаљем...';
        var d={slug:SLUG,theme:selectedTheme,selected_at:new Date().toISOString()};
        if(!SELECTION_URL||SELECTION_URL.indexOf('{')!==-1){
          console.log('Theme selection (demo):',d);
          setTimeout(showSuccess,1000);
          return;
        }
        fetch(SELECTION_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(d)}).then(showSuccess).catch(showSuccess);
      });

      function showSuccess(){
        document.getElementById('modal-overlay').classList.remove('active');
        document.querySelector('.main').style.display='none';
        document.getElementById('correction-section').style.display='none';
        document.getElementById('success-message').classList.add('active');
        document.getElementById('siteLink').href=SITE_URL;
        pollSite(SITE_URL);
      }

      function pollSite(url){
        var notice=document.getElementById('siteStatusNotice');
        var icon=document.getElementById('siteStatusIcon');
        var text=document.getElementById('siteStatusText');
        var link=document.getElementById('siteLink');
        var attempts=0,max=40,interval=15000;
        var pollUrl=url+(url.endsWith('/')?'index.html':'/index.html');
        function check(){
          attempts++;
          text.querySelector('strong').innerHTML='<span class="poll-spinner"></span> Позивница се креира... ('+attempts+'/'+max+')';
          fetch(pollUrl+'?_='+Date.now(),{method:'GET',cache:'no-store',redirect:'follow'}).then(function(r){
            if(r.ok){r.text().then(function(b){if(b.indexOf('<!DOCTYPE')!==-1&&b.indexOf('pozivnic')!==-1){onReady()}else if(attempts<max){setTimeout(check,interval)}else{onTimeout()}})}
            else if(attempts<max){setTimeout(check,interval)}else{onTimeout()}
          }).catch(function(){if(attempts<max){setTimeout(check,interval)}else{onTimeout()}});
        }
        function onReady(){
          notice.classList.add('ready');icon.textContent='\\u2713';
          text.innerHTML='<strong>Позивница је спремна!</strong> Кликните испод да видите вашу позивницу.';
          link.classList.remove('disabled');link.classList.add('ready');
        }
        function onTimeout(){
          icon.textContent='\\u2709';
          text.innerHTML='<strong>Позивница још није спремна.</strong> Послаћемо вам емаил са линком чим буде готова.';
          link.classList.remove('disabled');
        }
        setTimeout(check,45000);
      }

      // Correction form
      document.getElementById('correction-toggle').addEventListener('click',function(){document.getElementById('correction-form').classList.toggle('open')});
      document.getElementById('correction-submit').addEventListener('click',function(){var t=document.getElementById('correction-text').value.trim();if(!t){document.getElementById('correction-text').focus();return}this.disabled=true;this.textContent='Шаљем...';var d={action:'correction',slug:SLUG,correction:t,submitted_at:new Date().toISOString()};fetch(SELECTION_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(d)}).then(done).catch(done);function done(){document.getElementById('correction-form').classList.remove('open');document.getElementById('correction-toggle').style.display='none';document.getElementById('correction-sent').classList.add('visible')}});
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
    },
    cinema: {
      emoji: '🎥',
      cssVars: `:root{--primary:#D4AF37;--bg:#0A0A0A;--surface:#1A1A1A;--text:#F5F5F5;--border:rgba(212,175,55,0.3);--muted:#888;--timer-bg:rgba(212,175,55,0.2);--btn-text:#0A0A0A;--badge-text:#0A0A0A}`
    },
    concert: {
      emoji: '🎸',
      cssVars: `:root{--primary:#FF6B6B;--bg:#1A1A2E;--surface:#16213E;--text:#EAEAEA;--border:rgba(255,107,107,0.3);--muted:#888;--timer-bg:rgba(255,107,107,0.2);--btn-text:#1A1A2E;--badge-text:#1A1A2E}`
    },
    envelope: {
      emoji: '✉️',
      cssVars: `:root{--primary:#8B4557;--bg:#FDF8F5;--surface:#FFFFFF;--text:#3D2C2E;--border:#E8D5D5;--muted:#7A6365;--timer-bg:rgba(139,69,87,0.1);--btn-text:#FDF8F5;--badge-text:#FDF8F5}`
    },
    gazette: {
      emoji: '📰',
      cssVars: `:root{--primary:#1A1A1A;--bg:#F5F1EB;--surface:#FFFEF9;--text:#1A1A1A;--border:#D4D0C8;--muted:#666;--timer-bg:rgba(26,26,26,0.1);--btn-text:#F5F1EB;--badge-text:#F5F1EB}`
    },
    letter: {
      emoji: '💌',
      cssVars: `:root{--primary:#C9A07A;--bg:#FBF7F4;--surface:#FFFFFF;--text:#4A3F35;--border:#E8DDD4;--muted:#8B7D6B;--timer-bg:rgba(201,160,122,0.1);--btn-text:#FBF7F4;--badge-text:#FBF7F4}`
    },
    magazine: {
      emoji: '📖',
      cssVars: `:root{--primary:#1A1A1A;--bg:#FFFFFF;--surface:#F8F8F8;--text:#1A1A1A;--border:#E5E5E5;--muted:#666;--timer-bg:rgba(26,26,26,0.1);--btn-text:#FFFFFF;--badge-text:#FFFFFF}`
    },
    passport: {
      emoji: '🛂',
      cssVars: `:root{--primary:#1B3A5F;--bg:#F5F5F0;--surface:#FFFFFF;--text:#1B3A5F;--border:#C9D4DC;--muted:#5A7A94;--timer-bg:rgba(27,58,95,0.1);--btn-text:#F5F5F0;--badge-text:#F5F5F0}`
    },
    storybook: {
      emoji: '📚',
      cssVars: `:root{--primary:#8B6F47;--bg:#FAF6F1;--surface:#FFFDF8;--text:#3D3428;--border:#DDD4C6;--muted:#7A6F5D;--timer-bg:rgba(139,111,71,0.1);--btn-text:#FAF6F1;--badge-text:#FAF6F1}`
    },
    telegram: {
      emoji: '📨',
      cssVars: `:root{--primary:#8B7355;--bg:#F5EFE6;--surface:#FFFEF7;--text:#3D3428;--border:#D4C5B0;--muted:#7A6F5D;--timer-bg:rgba(139,115,85,0.1);--btn-text:#F5EFE6;--badge-text:#F5EFE6}`
    },
    // Original themes (2025)
    classic: {
      emoji: '👑',
      cssVars: `:root{--primary:#B8956B;--bg:#FFFEF9;--surface:#FFF;--text:#1C1C1C;--border:#B8956B;--muted:#4A4A4A;--timer-bg:rgba(184,149,107,0.1);--btn-text:#FFF;--badge-text:#FFF}`
    },
    modern: {
      emoji: '◼️',
      cssVars: `:root{--primary:#2C3E50;--bg:#FFF;--surface:#F8F9FA;--text:#2C3E50;--border:#E9ECEF;--muted:#6C757D;--timer-bg:rgba(44,62,80,0.1);--btn-text:#FFF;--badge-text:#FFF}`
    },
    romantic: {
      emoji: '🌸',
      cssVars: `:root{--primary:#E8B4B8;--bg:#FFF5F6;--surface:#FFF;--text:#4A3637;--border:#E8B4B8;--muted:#8B6E6E;--timer-bg:rgba(232,180,184,0.15);--btn-text:#4A3637;--badge-text:#4A3637}`
    },
    minimal: {
      emoji: '○',
      cssVars: `:root{--primary:#1A1A1A;--bg:#FFF;--surface:#FAFAFA;--text:#1A1A1A;--border:#E5E5E5;--muted:#757575;--timer-bg:rgba(26,26,26,0.05);--btn-text:#FFF;--badge-text:#FFF}`
    },
    rustic: {
      emoji: '🌾',
      cssVars: `:root{--primary:#8B7355;--bg:#FAF8F5;--surface:#FFFDF9;--text:#3D3428;--border:#D4C5B0;--muted:#6B5B4F;--timer-bg:rgba(139,115,85,0.1);--btn-text:#FFF;--badge-text:#FFF}`
    },
    'botanical-original': {
      emoji: '🌿',
      cssVars: `:root{--primary:#5A7A5E;--bg:#F7FAF7;--surface:#FFF;--text:#2D3B2D;--border:#B8C9B8;--muted:#5A6B5A;--timer-bg:rgba(90,122,94,0.1);--btn-text:#FFF;--badge-text:#FFF}`
    },
    moody: {
      emoji: '🍷',
      cssVars: `:root{--primary:#722F37;--bg:#1A1216;--surface:#2A1F24;--text:#F5E6E8;--border:rgba(114,47,55,0.3);--muted:#B39EA3;--timer-bg:rgba(114,47,55,0.2);--btn-text:#F5E6E8;--badge-text:#1A1216}`
    },
    gatsby: {
      emoji: '✨',
      cssVars: `:root{--primary:#D4AF37;--bg:#0A1628;--surface:#152238;--text:#F5F0E0;--border:rgba(212,175,55,0.3);--muted:#A8A090;--timer-bg:rgba(212,175,55,0.2);--btn-text:#0A1628;--badge-text:#0A1628}`
    },
    editorial: {
      emoji: '📰',
      cssVars: `:root{--primary:#1A1A1A;--bg:#FFF;--surface:#FAFAFA;--text:#1A1A1A;--border:#E5E5E5;--muted:#666;--timer-bg:rgba(26,26,26,0.08);--btn-text:#FFF;--badge-text:#FFF}`
    },
    whimsical: {
      emoji: '🎨',
      cssVars: `:root{--primary:#E8B4BC;--bg:#FFFAF5;--surface:#FFF;--text:#5A4A4D;--border:#E8D5D8;--muted:#8B7A7D;--timer-bg:rgba(232,180,188,0.15);--btn-text:#5A4A4D;--badge-text:#5A4A4D}`
    }
  };

  return styles[layout] || styles.classic;
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

  // Check if this is a single-theme layout (original themes)
  const isSingleTheme = layoutConfig.themes.length === 1 && layoutConfig.themes[0] === 'default';

  // Generate themed pages
  for (const theme of layoutConfig.themes) {
    const displayName = isSingleTheme ? layoutConfig.name : theme;
    console.log(`  🎨 Generating ${displayName}...`);
    try {
      const html = generateThemedPage(data, layout, theme, layoutConfig);
      await fs.writeFile(path.join(outputDir, `${theme}.html`), html, 'utf8');
    } catch (error) {
      throw new Error(`Failed to generate ${displayName} theme: ${error.message}`);
    }
  }

  // For single-theme layouts, use the theme directly as index.html
  // For multi-theme layouts, generate the theme selection page
  if (isSingleTheme) {
    console.log(`  📋 Creating index (single theme)...`);
    try {
      // Copy default.html as index.html for direct access
      await fs.copyFile(
        path.join(outputDir, 'default.html'),
        path.join(outputDir, 'index.html')
      );
    } catch (error) {
      throw new Error(`Failed to create index: ${error.message}`);
    }
  } else {
    console.log(`  📋 Generating theme selector...`);
    try {
      const indexHtml = generateIndexPage(data, layout, layoutConfig);
      await fs.writeFile(path.join(outputDir, 'index.html'), indexHtml, 'utf8');
    } catch (error) {
      throw new Error(`Failed to generate index page: ${error.message}`);
    }
  }

  // Create metadata file for cleanup-expired.js compatibility
  const metadata = {
    slug,
    layout,
    bride_name: data.bride_name,
    groom_name: data.groom_name,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + (config.PREVIEW_EXPIRY_DAYS || 30) * 24 * 60 * 60 * 1000).toISOString()
  };
  await fs.writeJson(path.join(outputDir, 'metadata.json'), metadata, { spaces: 2 });

  console.log(`\n✅ Done! URL: http://localhost:${config.DEV_SERVER_PORT}/preview/${slug}-${layout}/\n`);
}

/**
 * Generate all layouts for a wedding
 * @param {string} slug - Wedding data slug
 */
async function generateAllLayouts(slug, includeHidden = false) {
  // Use visibility-filtered layouts unless includeHidden is true
  let layouts;
  if (includeHidden) {
    layouts = config.getAvailableLayouts();
  } else {
    const visible = config.getVisibleTemplates ? config.getVisibleTemplates() : { original: [], layouts2026: [] };
    layouts = [...visible.original, ...visible.layouts2026];
  }

  const allLayouts = config.getAvailableLayouts();
  const hiddenCount = allLayouts.length - layouts.length;

  console.log(`\n🎨 Generating ${layouts.length} layouts for: ${slug}`);
  if (hiddenCount > 0 && !includeHidden) {
    console.log(`  ℹ️  ${hiddenCount} layout(s) hidden via template-visibility.json`);
    console.log(`  💡 Use --all --include-hidden to generate all layouts\n`);
  } else {
    console.log('');
  }

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
 * List available layouts with visibility status
 */
function listLayouts() {
  const layouts = config.getAvailableLayouts();
  const visible = config.getVisibleTemplates ? config.getVisibleTemplates() : { original: config.THEMES, layouts2026: [] };

  // Separate original themes from 2026 layouts
  const originalThemes = [];
  const layouts2026 = [];

  layouts.forEach(layout => {
    const cfg = config.getLayoutConfig(layout);
    if (cfg.isOriginal) {
      originalThemes.push(layout);
    } else {
      layouts2026.push(layout);
    }
  });

  console.log('\n📋 Available Layouts\n');

  if (originalThemes.length > 0) {
    console.log('  Original Themes (2025):');
    originalThemes.forEach(layout => {
      const cfg = config.getLayoutConfig(layout);
      const styles = getLayoutStyles(layout);
      const isVisible = visible.original.includes(layout) || visible.original.includes(layout.replace('-original', ''));
      const status = isVisible ? '' : ' [HIDDEN]';
      console.log(`    ${styles.emoji} ${layout.padEnd(20)} - ${cfg.name}${status}`);
    });
    console.log('');
  }

  if (layouts2026.length > 0) {
    console.log('  2026 Layouts (standalone):');
    layouts2026.forEach(layout => {
      const cfg = config.getLayoutConfig(layout);
      const styles = getLayoutStyles(layout);
      const isVisible = visible.layouts2026.includes(layout);
      const status = isVisible ? '' : ' [HIDDEN]';
      console.log(`    ${styles.emoji} ${layout.padEnd(20)} - ${cfg.name}${status}`);
    });
    console.log('');
  }

  const visibleCount = visible.original.length + visible.layouts2026.length;
  const hiddenCount = layouts.length - visibleCount;
  console.log(`Total: ${layouts.length} layouts (${visibleCount} visible, ${hiddenCount} hidden)\n`);

  console.log(`Usage:`);
  console.log(`  node scripts/generate-layout-preview.js <layout> [slug]`);
  console.log(`  node scripts/generate-layout-preview.js --all [slug]            # Generate visible layouts`);
  console.log(`  node scripts/generate-layout-preview.js --all --include-hidden  # Generate all layouts`);
  console.log(`  node scripts/generate-layout-preview.js --list                  # List layouts\n`);
  console.log(`Visibility: Edit scripts/template-visibility.json to show/hide templates\n`);
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
    const includeHidden = args.includes('--include-hidden');
    const slug = args.find(a => !a.startsWith('--') && a !== '--all') || 'demo';
    generateAllLayouts(slug, includeHidden).catch(error => {
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
