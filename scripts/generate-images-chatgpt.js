#!/usr/bin/env node

/**
 * ChatGPT Image Generator — Browser Automation
 *
 * Connects to your already-logged-in Chrome browser via CDP,
 * pastes prompts into ChatGPT, waits for DALL-E image generation,
 * and saves images to marketing/images/.
 *
 * SETUP (one-time):
 *   1. Quit Chrome completely
 *   2. Relaunch Chrome with debugging:
 *      /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222
 *   3. Log into chatgpt.com in that Chrome window
 *   4. Run this script
 *
 * Or use: npm run images:chatgpt
 */

const { chromium } = require('playwright');
const fs = require('fs-extra');
const path = require('path');
const https = require('https');
const http = require('http');

// ─── Config ──────────────────────────────────────────────────────────
const MARKETING_DIR = path.join(__dirname, '..', 'marketing');
const PROMPTS_FILE = path.join(MARKETING_DIR, 'image-prompts.md');
const OUTPUT_DIR = path.join(MARKETING_DIR, 'images');
const CDP_URL = process.env.CDP_URL || 'http://localhost:9222';
const CHATGPT_URL = 'https://chatgpt.com';
const IMAGE_WAIT_TIMEOUT = 180000; // 3 min max wait for image generation
const DELAY_BETWEEN_PROMPTS = 5000; // 5s between prompts

// Aspect ratios
const DIMENSIONS = {
  '4:5':  { width: 1080, height: 1350 },
  '9:16': { width: 1080, height: 1920 },
  '1:1':  { width: 1080, height: 1080 },
};

const CATEGORIES = {
  'Layout Showcase': 'layout-heroes',
  'Lifestyle': 'lifestyle',
  'Comparison': 'comparison',
  'Story & Reel': 'story-covers',
  'Seasonal': 'seasonal',
  'Brand Identity': 'brand',
  'Ad Creative': 'ads',
  'Highlight': 'highlights',
  'Video B-Roll': 'video-broll',
};

// ─── Parse prompts (same as generate-images.js) ─────────────────────
function parsePrompts() {
  const content = fs.readFileSync(PROMPTS_FILE, 'utf-8');
  const prompts = [];
  let currentSection = '';
  const lines = content.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('## ')) currentSection = line.replace('## ', '').trim();

    const headerMatch = line.match(/^### (\d+(?:-\d+)?)\.\s+(.+)/);
    if (headerMatch) {
      const num = headerMatch[1];
      const title = headerMatch[2].trim();
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) i++;
      i++;
      let promptText = '';
      while (i < lines.length && !lines[i].startsWith('```')) {
        promptText += lines[i] + '\n';
        i++;
      }
      promptText = promptText.trim();

      let category = 'other';
      for (const [key, folder] of Object.entries(CATEGORIES)) {
        if (currentSection.includes(key)) { category = folder; break; }
      }

      if (num === '32-37') {
        const items = [
          { item: 'multiple phone screens', name: 'stilovi' },
          { item: 'magic wand and play button', name: 'kako' },
          { item: 'five stars in a row', name: 'recenzije' },
          { item: 'question mark in circle', name: 'faq' },
          { item: 'price tag with diamond', name: 'cene' },
          { item: 'light bulb with heart', name: 'saveti' },
        ];
        const templateLine = promptText.split('\n')[0];
        items.forEach((entry, idx) => {
          const expanded = templateLine.replace('[ITEM]', entry.item);
          prompts.push({
            num: String(32 + idx), title: `Highlight — ${entry.name}`,
            prompt: expanded, aspect: '1:1', category,
            filename: `${32 + idx}-highlight-${entry.name}`, isVideo: false,
          });
        });
      } else {
        let aspect = '4:5';
        if (promptText.includes('9:16')) aspect = '9:16';
        else if (promptText.includes('1:1')) aspect = '1:1';
        const isVideo = promptText.includes('--video') || currentSection.includes('Video');
        const cleanPrompt = promptText
          .replace(/--v \d+/g, '').replace(/--ar \d+:\d+/g, '')
          .replace(/--style \w+/g, '').replace(/--video/g, '')
          .replace(/\s+/g, ' ').trim();
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        prompts.push({
          num, title, prompt: cleanPrompt, aspect, category,
          filename: `${num}-${slug}`, isVideo,
        });
      }
    }
    i++;
  }
  return prompts;
}

// ─── Download from URL ───────────────────────────────────────────────
function downloadUrl(url, filepath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const doRequest = (currentUrl, redirects = 0) => {
      if (redirects > 5) return reject(new Error('Too many redirects'));
      client.get(currentUrl, { timeout: 60000 }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return doRequest(res.headers.location, redirects + 1);
        }
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => {
          const buf = Buffer.concat(chunks);
          fs.writeFileSync(filepath, buf);
          resolve(buf.length);
        });
        res.on('error', reject);
      }).on('error', reject);
    };
    doRequest(url);
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms));
function formatBytes(b) {
  if (b < 1024) return b + ' B';
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
  return (b / 1048576).toFixed(1) + ' MB';
}

// ─── Core: Send prompt and get image from ChatGPT ────────────────────
async function generateWithChatGPT(page, prompt, dims, filepath) {
  // Count existing images before sending prompt
  const imageCountBefore = await page.evaluate(() => {
    return document.querySelectorAll('article img[src], [data-message-author-role="assistant"] img[src]').length;
  });

  // Find and focus the prompt input
  // ChatGPT uses a ProseMirror contenteditable div with id="prompt-textarea"
  const inputSelector = '#prompt-textarea, div.ProseMirror[contenteditable="true"], textarea[data-id="root"]';
  const input = page.locator(inputSelector).first();
  await input.waitFor({ state: 'visible', timeout: 10000 });
  await input.click();
  await sleep(300);

  // Clear any existing text
  await page.keyboard.press('Meta+a');
  await sleep(100);
  await page.keyboard.press('Backspace');
  await sleep(200);

  // Augment prompt with size instructions for DALL-E
  const sizeHint = `Generate this image at ${dims.width}x${dims.height} pixels, ${dims.width > dims.height ? 'landscape' : dims.height > dims.width ? 'portrait' : 'square'} orientation. `;
  const fullPrompt = sizeHint + prompt;

  // Type the prompt using clipboard (faster and more reliable than keystroke)
  await page.evaluate((text) => {
    navigator.clipboard.writeText(text);
  }, fullPrompt);
  await page.keyboard.press('Meta+v');
  await sleep(500);

  // Click send button
  const sendBtn = page.locator('button[data-testid="send-button"], button[aria-label="Send prompt"], button[aria-label*="Send"]').first();
  try {
    await sendBtn.waitFor({ state: 'visible', timeout: 3000 });
    await sendBtn.click();
  } catch {
    // Fallback: press Enter
    await page.keyboard.press('Enter');
  }

  console.log(' sent, waiting for image...');

  // Wait for a new image to appear in the conversation
  // Strategy: poll for new images until count increases
  const startTime = Date.now();
  let imageUrl = null;

  while (Date.now() - startTime < IMAGE_WAIT_TIMEOUT) {
    await sleep(3000);

    // Check for new images
    const result = await page.evaluate((prevCount) => {
      const allImages = document.querySelectorAll('article img[src], [data-message-author-role="assistant"] img[src]');
      if (allImages.length <= prevCount) return null;

      // Get the newest image
      const newImg = allImages[allImages.length - 1];
      const src = newImg.src || '';

      // Check if it's a real generated image (not a UI icon)
      if (src.includes('blob:') || src.includes('oaidalleapiprodscus') ||
          src.includes('openai') || src.includes('dall-e') ||
          (newImg.width > 200 && newImg.height > 200)) {
        return { src, width: newImg.naturalWidth, height: newImg.naturalHeight, isBlobUrl: src.startsWith('blob:') };
      }
      return null;
    }, imageCountBefore);

    if (result) {
      imageUrl = result;
      break;
    }

    // Also check if ChatGPT is still generating (look for stop button or loading indicator)
    const isGenerating = await page.evaluate(() => {
      const stopBtn = document.querySelector('button[aria-label="Stop generating"], button[data-testid="stop-button"]');
      const thinking = document.querySelector('[data-testid*="thinking"], .result-thinking');
      return !!(stopBtn || thinking);
    });

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    process.stdout.write(`\r         Waiting... ${elapsed}s ${isGenerating ? '(generating)' : '(checking)'}   `);
  }

  if (!imageUrl) {
    // Last resort: try to find any large image in the last assistant message
    imageUrl = await page.evaluate(() => {
      const messages = document.querySelectorAll('[data-message-author-role="assistant"]');
      if (messages.length === 0) return null;
      const lastMsg = messages[messages.length - 1];
      const imgs = lastMsg.querySelectorAll('img');
      for (const img of imgs) {
        if (img.naturalWidth > 100 || img.src.includes('blob:') || img.src.includes('oaidalleapiprodscus')) {
          return { src: img.src, isBlobUrl: img.src.startsWith('blob:') };
        }
      }
      return null;
    });
  }

  if (!imageUrl) {
    throw new Error('No image detected after timeout');
  }

  process.stdout.write('\r         Image detected! Saving...                    \n');

  // Save the image
  let size;
  if (imageUrl.isBlobUrl) {
    // Extract blob URL via page context
    const base64Data = await page.evaluate(async (src) => {
      const response = await fetch(src);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }, imageUrl.src);

    // Parse data URL: data:image/png;base64,xxxxx
    const matches = base64Data.match(/^data:image\/\w+;base64,(.+)$/);
    if (!matches) throw new Error('Failed to parse blob image data');
    const buffer = Buffer.from(matches[1], 'base64');
    fs.writeFileSync(filepath, buffer);
    size = buffer.length;
  } else {
    // Regular URL — download directly
    size = await downloadUrl(imageUrl.src, filepath);
  }

  // Also try the download button if available
  if (size < 1000) {
    throw new Error(`Image too small (${size} bytes)`);
  }

  return size;
}

// ─── Main ────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const listOnly = args.includes('--list');
  const skipVideo = !args.includes('--include-video');
  const newChat = args.includes('--new-chat');

  let onlyNums = null;
  const onlyIdx = args.indexOf('--only');
  if (onlyIdx !== -1 && args[onlyIdx + 1]) {
    const spec = args[onlyIdx + 1];
    onlyNums = new Set();
    spec.split(',').forEach(part => {
      if (part.includes('-')) {
        const [s, e] = part.split('-').map(Number);
        for (let n = s; n <= e; n++) onlyNums.add(String(n));
      } else onlyNums.add(part);
    });
  }

  let onlyCategory = null;
  const catIdx = args.indexOf('--category');
  if (catIdx !== -1 && args[catIdx + 1]) onlyCategory = args[catIdx + 1];

  console.log('');
  console.log('  Digitalne Pozivnice — ChatGPT Image Generator');
  console.log('  Uses your ChatGPT subscription (DALL-E) via browser automation');
  console.log('  ──────────────────────────────────────────────────');
  console.log('');

  // Parse and filter prompts
  let prompts = parsePrompts();
  if (onlyNums) prompts = prompts.filter(p => onlyNums.has(p.num));
  if (onlyCategory) prompts = prompts.filter(p => p.category === onlyCategory);
  if (skipVideo) prompts = prompts.filter(p => !p.isVideo);

  if (listOnly) {
    const grouped = {};
    prompts.forEach(p => { if (!grouped[p.category]) grouped[p.category] = []; grouped[p.category].push(p); });
    for (const [cat, items] of Object.entries(grouped)) {
      console.log(`  ${cat}/`);
      items.forEach(p => console.log(`    #${p.num.padEnd(3)} ${p.title} (${p.aspect})`));
      console.log('');
    }
    return;
  }

  // Filter out already-generated
  const pending = [];
  for (const p of prompts) {
    const filepath = path.join(OUTPUT_DIR, p.category, `${p.filename}.png`);
    if (await fs.pathExists(filepath)) {
      console.log(`  SKIP  #${p.num} ${p.title} (already exists)`);
    } else {
      pending.push(p);
    }
  }

  if (pending.length === 0) {
    console.log('  All images already generated! Use --only to regenerate specific ones.');
    return;
  }

  console.log(`  ${pending.length} images to generate\n`);

  if (dryRun) {
    pending.forEach((p, i) => {
      console.log(`  [${i + 1}/${pending.length}] WOULD #${p.num} ${p.title}`);
      console.log(`         ${p.prompt.substring(0, 80)}...`);
    });
    return;
  }

  // Connect to Chrome via CDP
  console.log(`  Connecting to Chrome at ${CDP_URL}...`);
  let browser;
  try {
    browser = await chromium.connectOverCDP(CDP_URL);
  } catch (err) {
    console.error('');
    console.error('  ERROR: Cannot connect to Chrome.');
    console.error('');
    console.error('  Start Chrome with remote debugging:');
    console.error('');
    console.error('    # macOS:');
    console.error('    /Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome \\');
    console.error('      --remote-debugging-port=9222');
    console.error('');
    console.error('    # Then log into chatgpt.com and run this script again.');
    console.error('');
    process.exit(1);
  }

  const context = browser.contexts()[0];
  let page;

  // Find existing ChatGPT tab or open new one
  const pages = context.pages();
  page = pages.find(p => p.url().includes('chatgpt.com'));

  if (!page) {
    console.log('  No ChatGPT tab found, opening one...');
    page = await context.newPage();
    await page.goto(CHATGPT_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await sleep(3000);
  } else {
    console.log(`  Found ChatGPT tab: ${page.url()}`);
    await page.bringToFront();
  }

  // Verify we're logged in
  try {
    await page.waitForSelector('#prompt-textarea, div.ProseMirror[contenteditable="true"]', { timeout: 10000 });
    console.log('  Logged in and ready!\n');
  } catch {
    console.error('  ERROR: ChatGPT prompt input not found. Make sure you are logged in.');
    process.exit(1);
  }

  // Create output directories
  for (const cat of [...new Set(pending.map(p => p.category))]) {
    await fs.ensureDir(path.join(OUTPUT_DIR, cat));
  }

  // Generate images
  let success = 0;
  let failed = 0;

  for (let i = 0; i < pending.length; i++) {
    const p = pending[i];
    const dims = DIMENSIONS[p.aspect];
    const filepath = path.join(OUTPUT_DIR, p.category, `${p.filename}.png`);
    const relPath = path.relative(MARKETING_DIR, filepath);

    // Start new chat for each image to avoid context pollution
    if (newChat || i > 0) {
      try {
        // Click "New chat" button
        const newChatBtn = page.locator('a[href="/"], button[data-testid="new-chat-button"], nav a[aria-label*="New chat"]').first();
        await newChatBtn.click({ timeout: 3000 });
        await sleep(2000);
      } catch {
        // Navigate directly to new chat
        await page.goto(CHATGPT_URL, { waitUntil: 'networkidle', timeout: 15000 });
        await sleep(2000);
      }
    }

    process.stdout.write(`  [${i + 1}/${pending.length}] #${p.num} ${p.title} —`);

    try {
      const size = await generateWithChatGPT(page, p.prompt, dims, filepath);
      console.log(`         Saved: ${relPath} (${formatBytes(size)})`);
      success++;
    } catch (err) {
      console.log(`\n         FAILED: ${err.message}`);
      failed++;
    }

    // Delay between prompts
    if (i < pending.length - 1) {
      console.log(`         Waiting ${DELAY_BETWEEN_PROMPTS / 1000}s before next...`);
      await sleep(DELAY_BETWEEN_PROMPTS);
    }
  }

  console.log('');
  console.log('  ──────────────────────────────────────────────────');
  console.log(`  Done! ${success} generated, ${failed} failed`);
  console.log(`  Output: ${path.relative(process.cwd(), OUTPUT_DIR)}/`);
  console.log('');

  // Don't close browser — user might still be using it
}

// ─── Help ────────────────────────────────────────────────────────────
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
  ChatGPT Image Generator — Automates DALL-E via your ChatGPT subscription

  SETUP (one-time):
    1. Quit Chrome completely (Cmd+Q)
    2. Relaunch with debugging:

       /Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome \\
         --remote-debugging-port=9222

    3. Log into chatgpt.com in that Chrome window
    4. Run this script

  USAGE:
    npm run images:chatgpt                              Generate all images
    npm run images:chatgpt -- --list                    List prompts
    npm run images:chatgpt -- --dry-run                 Preview without generating
    npm run images:chatgpt -- --only 1-10               Layout heroes only
    npm run images:chatgpt -- --category ads            Ad creatives only
    npm run images:chatgpt -- --new-chat                Start new chat per image

  OPTIONS:
    --list             List prompts
    --dry-run          Preview without generating
    --only 1,2,3       Specific prompt numbers
    --only 1-10        Range of prompts
    --category NAME    Filter by category
    --new-chat         New ChatGPT conversation per image (cleaner, slower)
    --include-video    Include video prompts (still frame)
    --help, -h         Show this help

  ENV VARS:
    CDP_URL            Chrome DevTools Protocol URL (default: http://localhost:9222)
  `);
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
