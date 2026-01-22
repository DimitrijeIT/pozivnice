#!/usr/bin/env node

/**
 * Generate Preview Script
 *
 * Generates preview pages for all themes for a specific wedding.
 *
 * Usage:
 *   node scripts/generate-preview.js <wedding-slug>
 *   node scripts/generate-preview.js <wedding-slug> --data '{"bride_name":"Ана",...}'
 *
 * Output:
 *   public/preview/<slug>/
 *   ├── index.html      (theme selector)
 *   ├── classic.html    (classic theme preview)
 *   ├── modern.html     (modern theme preview)
 *   ├── romantic.html   (romantic theme preview)
 *   ├── minimal.html    (minimal theme preview)
 *   ├── rustic.html     (rustic theme preview)
 *   └── metadata.json   (preview metadata)
 */

const fs = require('fs-extra');
const path = require('path');
const config = require('./config');
const utils = require('./utils');

// Paths
const ROOT_DIR = path.join(__dirname, '..');
const TEMPLATES_DIR = path.join(ROOT_DIR, 'templates');
const THEMES_DIR = path.join(TEMPLATES_DIR, 'themes');
const PREVIEW_DIR = path.join(ROOT_DIR, config.PATHS.preview);
const DATA_DIR = path.join(ROOT_DIR, config.PATHS.data);

/**
 * Load wedding data from file or command line
 */
function loadWeddingData(slug, cliData) {
  // If data provided via command line, parse it
  if (cliData) {
    try {
      return JSON.parse(cliData);
    } catch (e) {
      console.error('Error parsing command line data:', e.message);
      process.exit(1);
    }
  }

  // Try to load from data file
  const dataFile = path.join(DATA_DIR, `${slug}.json`);
  if (fs.existsSync(dataFile)) {
    return fs.readJsonSync(dataFile);
  }

  // Try weddings.json
  const weddingsFile = path.join(DATA_DIR, 'weddings.json');
  if (fs.existsSync(weddingsFile)) {
    const weddings = fs.readJsonSync(weddingsFile);
    const wedding = weddings.find(w => w.slug === slug);
    if (wedding) return wedding;
  }

  // Try sample-wedding.json as fallback
  const sampleFile = path.join(DATA_DIR, 'sample-wedding.json');
  if (fs.existsSync(sampleFile)) {
    console.log('Using sample-wedding.json as data source');
    return fs.readJsonSync(sampleFile);
  }

  console.error(`No data found for wedding: ${slug}`);
  console.error('Please provide data via:');
  console.error('  1. data/<slug>.json file');
  console.error('  2. data/weddings.json with matching slug');
  console.error('  3. --data command line argument');
  process.exit(1);
}

/**
 * Generate a single themed invitation page
 */
function generateThemedPage(rawData, theme) {
  // Load base template
  const baseTemplate = fs.readFileSync(
    path.join(TEMPLATES_DIR, 'base.html'),
    'utf8'
  );

  // Load theme CSS
  const themeCss = fs.readFileSync(
    path.join(THEMES_DIR, theme, 'style.css'),
    'utf8'
  );

  // Load animations CSS
  const animationsCss = fs.readFileSync(
    path.join(TEMPLATES_DIR, 'animations.css'),
    'utf8'
  );

  // Load components CSS
  const componentsCss = fs.readFileSync(
    path.join(TEMPLATES_DIR, 'components.css'),
    'utf8'
  );

  // Load backgrounds CSS (modern gradients, textures, glassmorphism)
  const backgroundsCss = fs.readFileSync(
    path.join(TEMPLATES_DIR, 'backgrounds.css'),
    'utf8'
  );

  // Load decorations CSS (SVG decorative elements)
  const decorationsCss = fs.readFileSync(
    path.join(TEMPLATES_DIR, 'decorations.css'),
    'utf8'
  );

  // Load client-side script
  const clientScript = fs.readFileSync(
    path.join(TEMPLATES_DIR, 'script.js'),
    'utf8'
  );

  // Prepare template data with theme-specific settings
  const templateData = utils.prepareWeddingData(rawData, theme);

  // Prepare theme-specific data
  const themeData = {
    ...templateData,
    THEME_CSS: `<style>\n${themeCss}\n</style>`,
    ANIMATIONS_CSS: `<style>\n${animationsCss}\n${componentsCss}\n${backgroundsCss}\n${decorationsCss}\n</style>`,
    THEME_FONTS: utils.getThemeFonts(theme),
    INLINE_SCRIPT: clientScript
  };

  // Process conditionals first
  let html = utils.processConditionals(baseTemplate, themeData);

  // Then replace placeholders
  html = utils.replacePlaceholders(html, themeData);

  // Add theme class to body for theme-specific decorations
  html = html.replace('<body>', `<body class="theme-${theme}">`);

  return html;
}

/**
 * Generate theme selector index page
 */
function generateIndexPage(templateData) {
  // Load preview-index template
  const indexTemplate = fs.readFileSync(
    path.join(TEMPLATES_DIR, 'preview-index.html'),
    'utf8'
  );

  // Calculate expiry date
  const expiryDate = utils.calculateExpiryDate();

  // Generate theme cards HTML
  const themeCards = utils.generateThemeCards(templateData);

  // Prepare data for index page
  const indexData = {
    ...templateData,
    EXPIRY_DATE_ISO: expiryDate.toISOString(),
    THEME_CARDS: themeCards
  };

  // Replace placeholders
  let html = utils.replacePlaceholders(indexTemplate, indexData);

  return html;
}

/**
 * Main generation function
 */
async function generatePreview(slug, cliData) {
  console.log(`\n🎊 Generating preview for: ${slug}\n`);

  // Load wedding data
  const rawData = loadWeddingData(slug, cliData);
  rawData.slug = slug;

  // Validate data
  const validation = utils.validateWeddingData(rawData);
  if (!validation.valid) {
    console.error('Validation errors:');
    validation.errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }

  // Create output directory
  const outputDir = path.join(PREVIEW_DIR, slug);
  await fs.ensureDir(outputDir);

  console.log(`📁 Output directory: ${outputDir}\n`);

  // Generate each theme
  for (const theme of config.THEMES) {
    console.log(`  🎨 Generating ${theme} theme...`);

    const html = generateThemedPage(rawData, theme);
    const outputFile = path.join(outputDir, `${theme}.html`);

    await fs.writeFile(outputFile, html, 'utf8');
  }

  // Prepare template data for index page (using default theme)
  const templateData = utils.prepareWeddingData(rawData, 'classic');

  // Generate index page (theme selector)
  console.log(`  📋 Generating theme selector...`);
  const indexHtml = generateIndexPage(templateData);
  await fs.writeFile(path.join(outputDir, 'index.html'), indexHtml, 'utf8');

  // Create metadata file
  const metadata = utils.createPreviewMetadata({ ...rawData, slug });
  await fs.writeJson(
    path.join(outputDir, 'metadata.json'),
    metadata,
    { spaces: 2 }
  );

  console.log(`\n✅ Preview generated successfully!`);
  console.log(`\n📍 Preview URL: http://localhost:${config.DEV_SERVER_PORT}/preview/${slug}/`);
  console.log(`⏰ Expires: ${metadata.expires_at}\n`);

  return {
    success: true,
    outputDir,
    slug,
    expiresAt: metadata.expires_at
  };
}

// CLI handling
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node scripts/generate-preview.js <wedding-slug> [--data \'{"..."}\']\n');
    console.log('Examples:');
    console.log('  node scripts/generate-preview.js marko-ana');
    console.log('  node scripts/generate-preview.js test-wedding');
    console.log('  node scripts/generate-preview.js custom --data \'{"bride_name":"Ана",...}\'');
    process.exit(1);
  }

  const slug = args[0];
  let cliData = null;

  // Check for --data argument
  const dataIndex = args.indexOf('--data');
  if (dataIndex !== -1 && args[dataIndex + 1]) {
    cliData = args[dataIndex + 1];
  }

  generatePreview(slug, cliData)
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Error generating preview:', err);
      process.exit(1);
    });
}

module.exports = { generatePreview };
