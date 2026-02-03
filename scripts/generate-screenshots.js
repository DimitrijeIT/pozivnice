const { chromium } = require('playwright');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const VIEWPORT = { width: 1200, height: 1867 }; // 600x933 * 2 for retina

const templates = [
  { name: 'cinema', url: 'preview/demo-cinema/noir.html' },
  { name: 'passport', url: 'preview/demo-passport/classic.html' },
  { name: 'magazine', url: 'preview/demo-magazine/vogue.html' },
  { name: 'envelope', url: 'preview/demo-envelope/velvet.html' },
  { name: 'storybook', url: 'preview/demo-storybook/novel.html' },
  { name: 'glass', url: 'preview/demo-glass/frost.html' },
  { name: 'concert', url: 'preview/demo-concert/rock.html' },
  { name: 'gazette', url: 'preview/demo-gazette/broadsheet.html' },
  { name: 'letter', url: 'preview/demo-letter/romantic.html' },
  { name: 'telegram', url: 'preview/demo-telegram/western.html' },
  { name: 'botanical', url: 'preview/demo-botanical/forest.html' },
  { name: 'velvet', url: 'preview/demo-velvet/burgundy.html' },
  { name: 'aurora', url: 'preview/demo-aurora/northern.html' },
  { name: 'mediterranean', url: 'preview/demo-mediterranean/amalfi.html' },
  { name: 'oldmoney', url: 'preview/demo-oldmoney/ivory.html' },
  { name: 'filmnoir', url: 'preview/demo-filmnoir/classic.html' },
  { name: 'kinetic', url: 'preview/demo-kinetic/editorial.html' },
  { name: 'scribble', url: 'preview/demo-scribble/watercolor.html' },
  { name: 'wabisabi', url: 'preview/demo-wabisabi/paper.html' },
];

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'screenshots');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

async function generateScreenshots() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
  });

  for (const template of templates) {
    const filePath = path.join(PUBLIC_DIR, template.url);
    if (!fs.existsSync(filePath)) {
      console.warn(`Skipping ${template.name}: file not found at ${filePath}`);
      continue;
    }

    const page = await context.newPage();
    const fileUrl = 'file://' + filePath;

    try {
      await page.goto(fileUrl, { waitUntil: 'networkidle', timeout: 30000 });
      // Wait for fonts and initial animations to settle
      await page.waitForTimeout(2000);

      const pngPath = path.join(OUTPUT_DIR, `${template.name}.png`);
      const webpPath = path.join(OUTPUT_DIR, `${template.name}.webp`);
      await page.screenshot({
        path: pngPath,
        type: 'png',
        fullPage: false,
      });
      // Convert to webp using cwebp
      try {
        execSync(`cwebp -q 85 "${pngPath}" -o "${webpPath}"`, { stdio: 'pipe' });
        fs.unlinkSync(pngPath);
      } catch {
        console.warn(`  Could not convert ${template.name} to webp, keeping PNG`);
      }
      console.log(`Generated: ${template.name}.webp`);
    } catch (err) {
      console.error(`Error capturing ${template.name}:`, err.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log('\nDone! Screenshots saved to public/screenshots/');
}

generateScreenshots().catch(console.error);
