/**
 * Wedding Invitation System Configuration
 *
 * Replace placeholder values with your actual Google Apps Script URLs
 * and other configuration values.
 */

module.exports = {
  // Google Sheets Configuration
  GOOGLE_SHEET_ID: 'YOUR_GOOGLE_SHEET_ID_HERE',

  // Google Apps Script Web App URLs
  // These URLs are obtained after deploying each Apps Script as a web app
  THEME_SELECTION_URL: 'https://script.google.com/macros/s/AKfycby3TKfusf7c36I09L_RZJwuY90GlKsoaKBNU9PUPshUB61pIzEaL-330RVjOhJTJ0ywUg/exec',
  RSVP_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxKyXmfLk5LdcB3PYy2QVo_SHe31aHaaZRb6Cqoo_mUHKQ3WE7HKkuw_GmP12eo3B0fjg/exec'
  
  // Domain Configuration
  DOMAIN: 'pozivnice.rs',

  // Preview Settings
  PREVIEW_EXPIRY_HOURS: 24,

  // Available Themes
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
  DEV_SERVER_PORT: 3000
};
