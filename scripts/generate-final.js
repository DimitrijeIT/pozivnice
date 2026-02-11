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
const layoutPreview = require('./generate-layout-preview');

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

  // Load mobile optimizations CSS
  let mobileCss = '';
  try {
    mobileCss = fs.readFileSync(path.join(TEMPLATES_DIR, 'mobile.css'), 'utf8');
  } catch (error) {
    // mobile.css is optional
  }

  // Load client-side script
  const clientScript = fs.readFileSync(
    path.join(TEMPLATES_DIR, 'script.js'),
    'utf8'
  );

  // Prepare template data with theme
  const templateData = utils.prepareWeddingData(rawData, theme);

  // Pre-process inline script to replace template variables (e.g., RSVP_SCRIPT_URL, WEDDING_SLUG)
  let processedScript = utils.processConditionals(clientScript, templateData);
  processedScript = utils.replacePlaceholders(processedScript, templateData);

  // Prepare theme-specific data
  const themeData = {
    ...templateData,
    THEME_CSS: `<style>\n${themeCss}\n</style>`,
    ANIMATIONS_CSS: `<style>\n${animationsCss}\n${componentsCss}\n${backgroundsCss}\n${decorationsCss}\n${mobileCss}\n</style>`,
    THEME_FONTS: utils.getThemeFonts(theme),
    INLINE_SCRIPT: processedScript
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
 * Parse theme identifier into layout and theme parts.
 * Original themes: "classic" → { layout: null, theme: "classic", isLayout: false }
 * 2026 layouts:    "envelope/velvet" → { layout: "envelope", theme: "velvet", isLayout: true }
 */
function parseThemeIdentifier(themeStr) {
  if (themeStr.includes('/')) {
    const [layout, theme] = themeStr.split('/', 2);
    return { layout, theme, isLayout: true };
  }
  // Check if it's a 2026 layout key with a single default theme
  const layoutConfig = config.LAYOUT_REGISTRY[themeStr];
  if (layoutConfig && !layoutConfig.isOriginal) {
    return { layout: themeStr, theme: layoutConfig.themes[0], isLayout: true };
  }
  return { layout: null, theme: themeStr, isLayout: false };
}

/**
 * Main generation function
 */
async function generateFinal(slug, themeStr, options = {}) {
  console.log(`\n💒 Generating final site for: ${slug}`);
  console.log(`🎨 Theme: ${themeStr}\n`);

  const { layout, theme, isLayout } = parseThemeIdentifier(themeStr);

  // Validate theme
  if (isLayout) {
    const layoutConfig = config.LAYOUT_REGISTRY[layout];
    if (!layoutConfig) {
      console.error(`Invalid layout: ${layout}`);
      console.error(`Available layouts: ${Object.keys(config.LAYOUT_REGISTRY).filter(k => !config.LAYOUT_REGISTRY[k].isOriginal).join(', ')}`);
      process.exit(1);
    }
    if (!layoutConfig.themes.includes(theme)) {
      console.error(`Invalid theme "${theme}" for layout "${layout}"`);
      console.error(`Available themes: ${layoutConfig.themes.join(', ')}`);
      process.exit(1);
    }
  } else {
    if (!config.THEMES.includes(theme)) {
      console.error(`Invalid theme: ${theme}`);
      console.error(`Available themes: ${config.THEMES.join(', ')}`);
      console.error(`\nFor 2026 layouts, use: layout/theme (e.g., envelope/velvet)`);
      process.exit(1);
    }
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
  let html;
  if (isLayout) {
    const layoutConfig = config.LAYOUT_REGISTRY[layout];
    html = layoutPreview.generateThemedPage(rawData, layout, theme, layoutConfig);
  } else {
    html = generateFinalPage(rawData, theme);
  }
  await fs.writeFile(path.join(outputDir, 'index.html'), html, 'utf8');

  // Create site metadata
  const siteMetadata = {
    slug,
    bride_name: rawData.bride_name,
    groom_name: rawData.groom_name,
    theme: themeStr,
    layout: layout || null,
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
    // Clean up both possible preview directory patterns
    const previewDirs = [
      path.join(PREVIEW_DIR, slug),
      path.join(PREVIEW_DIR, `${slug}-${layout}`)
    ].filter(Boolean);
    for (const previewDir of previewDirs) {
      if (fs.existsSync(previewDir)) {
        console.log(`  🗑️  Cleaning up preview folder: ${path.basename(previewDir)}`);
        await fs.remove(previewDir);
      }
    }
  }

  console.log(`\n✅ Final site generated successfully!`);
  console.log(`\n📍 Site URL: https://${config.DOMAIN}/site/${slug}/`);
  console.log(`📍 Local: http://localhost:${config.DEV_SERVER_PORT}/site/${slug}/\n`);

  return {
    success: true,
    outputDir,
    slug,
    theme: themeStr,
    url: `https://${config.DOMAIN}/site/${slug}/`
  };
}

// CLI handling
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('Usage: node scripts/generate-final.js <wedding-slug> <theme> [--cleanup]\n');
    console.log('Original themes:');
    config.THEMES.forEach(theme => {
      console.log(`  - ${theme}: ${config.THEME_NAMES[theme]}`);
    });
    console.log('\n2026 layouts (use layout/theme format):');
    Object.entries(config.LAYOUT_REGISTRY).forEach(([key, cfg]) => {
      if (!cfg.isOriginal) {
        console.log(`  - ${key}: ${cfg.name} (themes: ${cfg.themes.join(', ')})`);
      }
    });
    console.log('\nExamples:');
    console.log('  node scripts/generate-final.js marko-ana classic');
    console.log('  node scripts/generate-final.js marko-ana envelope/velvet');
    console.log('  node scripts/generate-final.js test-wedding aurora/northern --cleanup');
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
