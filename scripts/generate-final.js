#!/usr/bin/env node

/**
 * Generate Final Site Script
 *
 * Generates the final wedding invitation site with the selected theme.
 *
 * Usage:
 *   node scripts/generate-final.js <wedding-slug> <theme>
 *
 * Output:
 *   public/site/<slug>/
 *   └── index.html
 *
 * After generation:
 *   - Deletes the preview folder (optional, with --cleanup flag)
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
const SITE_DIR = path.join(ROOT_DIR, config.PATHS.site);
const DATA_DIR = path.join(ROOT_DIR, config.PATHS.data);

/**
 * Load wedding data from file
 */
function loadWeddingData(slug) {
  // Try to load from preview metadata first
  const previewMetadata = path.join(PREVIEW_DIR, slug, 'metadata.json');
  if (fs.existsSync(previewMetadata)) {
    const metadata = fs.readJsonSync(previewMetadata);
    // Load full data from data file
    const dataFile = path.join(DATA_DIR, `${slug}.json`);
    if (fs.existsSync(dataFile)) {
      return fs.readJsonSync(dataFile);
    }
  }

  // Try direct data file
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
  process.exit(1);
}

/**
 * Generate the final themed page
 */
function generateFinalPage(rawData, theme) {
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

  // Prepare template data with theme
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

  // Add theme class to body
  html = html.replace('<body>', `<body class="theme-${theme}">`);

  return html;
}

/**
 * Main generation function
 */
async function generateFinal(slug, theme, options = {}) {
  console.log(`\n💒 Generating final site for: ${slug}`);
  console.log(`🎨 Theme: ${theme}\n`);

  // Validate theme
  if (!config.THEMES.includes(theme)) {
    console.error(`Invalid theme: ${theme}`);
    console.error(`Available themes: ${config.THEMES.join(', ')}`);
    process.exit(1);
  }

  // Load wedding data
  const rawData = loadWeddingData(slug);
  rawData.slug = slug;

  // Validate data
  const validation = utils.validateWeddingData(rawData);
  if (!validation.valid) {
    console.error('Validation errors:');
    validation.errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }

  // Create output directory
  const outputDir = path.join(SITE_DIR, slug);
  await fs.ensureDir(outputDir);

  console.log(`📁 Output directory: ${outputDir}`);

  // Generate the final page
  console.log(`  📄 Generating final invitation...`);
  const html = generateFinalPage(rawData, theme);
  await fs.writeFile(path.join(outputDir, 'index.html'), html, 'utf8');

  // Create site metadata
  const siteMetadata = {
    slug,
    bride_name: rawData.bride_name,
    groom_name: rawData.groom_name,
    theme,
    generated_at: new Date().toISOString(),
    wedding_date: rawData.wedding_date
  };
  await fs.writeJson(
    path.join(outputDir, 'site-info.json'),
    siteMetadata,
    { spaces: 2 }
  );

  // Cleanup preview folder if requested
  if (options.cleanup) {
    const previewDir = path.join(PREVIEW_DIR, slug);
    if (fs.existsSync(previewDir)) {
      console.log(`  🗑️  Cleaning up preview folder...`);
      await fs.remove(previewDir);
    }
  }

  console.log(`\n✅ Final site generated successfully!`);
  console.log(`\n📍 Site URL: https://${config.DOMAIN}/${slug}/`);
  console.log(`📍 Local: http://localhost:${config.DEV_SERVER_PORT}/site/${slug}/\n`);

  return {
    success: true,
    outputDir,
    slug,
    theme,
    url: `https://${config.DOMAIN}/${slug}/`
  };
}

// CLI handling
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('Usage: node scripts/generate-final.js <wedding-slug> <theme> [--cleanup]\n');
    console.log('Available themes:');
    config.THEMES.forEach(theme => {
      console.log(`  - ${theme}: ${config.THEME_NAMES[theme]}`);
    });
    console.log('\nExamples:');
    console.log('  node scripts/generate-final.js marko-ana classic');
    console.log('  node scripts/generate-final.js test-wedding modern --cleanup');
    process.exit(1);
  }

  const slug = args[0];
  const theme = args[1];
  const cleanup = args.includes('--cleanup');

  generateFinal(slug, theme, { cleanup })
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Error generating final site:', err);
      process.exit(1);
    });
}

module.exports = { generateFinal };
