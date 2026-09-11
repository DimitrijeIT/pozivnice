#!/usr/bin/env node

const { chromium } = require('playwright');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const VIEWPORT = { width: 1080, height: 1920 };
const START_WAIT_MS = 1200;
const END_WAIT_MS = 500;
const SCROLL_DURATION_MS = 5300;

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

const ROOT = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const TMP_DIR = path.join(ROOT, 'tmp', 'scroll-videos');
const OUT_DIR = path.join(ROOT, 'output', 'imagegen', 'scroll_animations_live');

function parseArgs() {
  const raw = process.argv.slice(2);
  const wanted = new Set();
  let listOnly = false;

  for (let i = 0; i < raw.length; i += 1) {
    const arg = raw[i];
    if (arg === '--list') {
      listOnly = true;
      continue;
    }
    if (arg === '--template') {
      const value = raw[i + 1];
      if (!value) {
        throw new Error('--template requires a value');
      }
      i += 1;
      value.split(',').map((v) => v.trim()).filter(Boolean).forEach((v) => wanted.add(v));
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  return { listOnly, wanted };
}

function ensureDirs() {
  fs.mkdirSync(TMP_DIR, { recursive: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

function toFileUrl(filePath) {
  return `file://${filePath}`;
}

function easeInOut(t) {
  return 0.5 - 0.5 * Math.cos(Math.PI * t);
}

async function recordTemplate(browser, template) {
  const htmlPath = path.join(PUBLIC_DIR, template.url);
  if (!fs.existsSync(htmlPath)) {
    console.warn(`Skipping ${template.name}: missing ${htmlPath}`);
    return;
  }

  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    recordVideo: {
      dir: TMP_DIR,
      size: VIEWPORT,
    },
  });

  const page = await context.newPage();
  const video = page.video();

  try {
    await page.goto(toFileUrl(htmlPath), { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(START_WAIT_MS);

    const maxScroll = await page.evaluate(() => {
      const doc = document.documentElement;
      const body = document.body;
      const scrollHeight = Math.max(
        doc ? doc.scrollHeight : 0,
        body ? body.scrollHeight : 0,
        doc ? doc.offsetHeight : 0,
        body ? body.offsetHeight : 0
      );
      return Math.max(0, scrollHeight - window.innerHeight);
    });

    const frameMs = 33;
    const steps = Math.max(1, Math.floor(SCROLL_DURATION_MS / frameMs));

    for (let i = 0; i <= steps; i += 1) {
      const progress = easeInOut(i / steps);
      const y = Math.round(maxScroll * progress);
      await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
      await page.waitForTimeout(frameMs);
    }

    await page.waitForTimeout(END_WAIT_MS);
  } finally {
    await page.close();
    await context.close();
  }

  const webmPath = await video.path();
  const outPath = path.join(OUT_DIR, `${template.name}-scroll-live.mp4`);
  const ffmpegArgs = [
    '-y',
    '-i', webmPath,
    '-vf', 'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920',
    '-r', '30',
    '-an',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    outPath,
  ];

  execSync(`ffmpeg ${ffmpegArgs.map((v) => `"${v}"`).join(' ')}`, { stdio: 'ignore' });
  fs.unlinkSync(webmPath);
  console.log(`Generated ${path.basename(outPath)}`);
}

async function main() {
  const { listOnly, wanted } = parseArgs();

  if (listOnly) {
    templates.forEach((t) => console.log(t.name));
    return;
  }

  const selected = wanted.size
    ? templates.filter((t) => wanted.has(t.name))
    : templates;

  if (selected.length === 0) {
    throw new Error('No matching templates selected.');
  }

  ensureDirs();

  const browser = await chromium.launch({ headless: true });
  try {
    for (const template of selected) {
      await recordTemplate(browser, template);
    }
  } finally {
    await browser.close();
  }

  console.log(`\nDone. Videos saved in ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
