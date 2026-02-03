#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const https = require('https');
const http = require('http');

// ─── Config ──────────────────────────────────────────────────────────
const MARKETING_DIR = path.join(__dirname, '..', 'marketing');
const PROMPTS_FILE = path.join(MARKETING_DIR, 'image-prompts.md');
const OUTPUT_DIR = path.join(MARKETING_DIR, 'images');
const DELAY_MS = 3000; // Delay between requests to be respectful

// Aspect ratio → pixel dimensions (Instagram-optimized)
const DIMENSIONS = {
  '4:5':  { width: 1080, height: 1350 },
  '9:16': { width: 1080, height: 1920 },
  '1:1':  { width: 1080, height: 1080 },
};

// Category folders based on prompt sections
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

// ─── Parse prompts from markdown ─────────────────────────────────────
function parsePrompts() {
  const content = fs.readFileSync(PROMPTS_FILE, 'utf-8');
  const prompts = [];
  let currentSection = '';

  const lines = content.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Track current section
    if (line.startsWith('## ')) {
      currentSection = line.replace('## ', '').trim();
    }

    // Find numbered prompt headers like "### 1. Cinema Layout Hero"
    const headerMatch = line.match(/^### (\d+(?:-\d+)?)\.\s+(.+)/);
    if (headerMatch) {
      const num = headerMatch[1];
      const title = headerMatch[2].trim();
      i++;

      // Find the code block
      while (i < lines.length && !lines[i].startsWith('```')) i++;
      i++; // skip opening ```

      // Collect prompt text
      let promptText = '';
      while (i < lines.length && !lines[i].startsWith('```')) {
        promptText += lines[i] + '\n';
        i++;
      }
      promptText = promptText.trim();

      // Determine category folder
      let category = 'other';
      for (const [key, folder] of Object.entries(CATEGORIES)) {
        if (currentSection.includes(key)) {
          category = folder;
          break;
        }
      }

      // Handle highlight icons (32-37) — expand into 6 prompts
      if (num === '32-37') {
        const items = [
          { item: 'multiple phone screens', name: 'stilovi' },
          { item: 'magic wand and play button', name: 'kako' },
          { item: 'five stars in a row', name: 'recenzije' },
          { item: 'question mark in circle', name: 'faq' },
          { item: 'price tag with diamond', name: 'cene' },
          { item: 'light bulb with heart', name: 'saveti' },
        ];
        // Extract the template line (first line before "Generate 6 variations")
        const templateLine = promptText.split('\n')[0];
        items.forEach((entry, idx) => {
          const expanded = templateLine.replace('[ITEM]', entry.item);
          prompts.push({
            num: String(32 + idx),
            title: `Highlight — ${entry.name}`,
            prompt: expanded,
            aspect: '1:1',
            category,
            filename: `${32 + idx}-highlight-${entry.name}`,
            isVideo: false,
          });
        });
      } else {
        // Detect aspect ratio from prompt
        let aspect = '4:5'; // default
        if (promptText.includes('--ar 9:16') || promptText.includes('9:16')) aspect = '9:16';
        else if (promptText.includes('--ar 1:1') || promptText.includes('1:1')) aspect = '1:1';

        // Detect video prompts
        const isVideo = promptText.includes('--video') || currentSection.includes('Video');

        // Clean prompt: remove Midjourney-specific flags
        const cleanPrompt = promptText
          .replace(/--v \d+/g, '')
          .replace(/--ar \d+:\d+/g, '')
          .replace(/--style \w+/g, '')
          .replace(/--video/g, '')
          .replace(/\s+/g, ' ')
          .trim();

        // Generate filename
        const slug = title.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        const filename = `${num}-${slug}`;

        prompts.push({
          num,
          title,
          prompt: cleanPrompt,
          aspect,
          category,
          filename,
          isVideo,
        });
      }
    }
    i++;
  }

  return prompts;
}

// ─── Download image from URL ─────────────────────────────────────────
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;

    const request = (currentUrl, redirectCount = 0) => {
      if (redirectCount > 5) {
        reject(new Error('Too many redirects'));
        return;
      }

      client.get(currentUrl, { timeout: 120000 }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          request(res.headers.location, redirectCount + 1);
          return;
        }

        if (res.statusCode !== 200) {
          const errChunks = [];
          res.on('data', c => errChunks.push(c));
          res.on('end', () => {
            const body = Buffer.concat(errChunks).toString().substring(0, 200);
            reject(new Error(`HTTP ${res.statusCode}: ${body}`));
          });
          return;
        }

        const contentType = res.headers['content-type'] || '';
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          const buffer = Buffer.concat(chunks);
          // Validate it's actually an image
          if (buffer.length < 1000) {
            reject(new Error(`Response too small (${buffer.length} bytes) — API may be down`));
            return;
          }
          if (contentType.includes('text/') || contentType.includes('application/json')) {
            reject(new Error(`Got ${contentType} instead of image: ${buffer.toString().substring(0, 100)}`));
            return;
          }
          fs.writeFileSync(filepath, buffer);
          resolve(buffer.length);
        });
        res.on('error', reject);
      }).on('error', reject);
    };

    request(url);
  });
}

// ─── Providers ───────────────────────────────────────────────────────
const PROVIDERS = {
  pollinations: {
    name: 'Pollinations.ai',
    model: 'FLUX',
    auth: false,
    generate(prompt, dims) {
      const seed = Date.now() + Math.floor(Math.random() * 10000);
      const encoded = encodeURIComponent(prompt);
      return `https://image.pollinations.ai/prompt/${encoded}?width=${dims.width}&height=${dims.height}&model=flux&nologo=true&enhance=true&seed=${seed}`;
    },
  },
  together: {
    name: 'Together AI',
    model: 'FLUX.1-schnell',
    auth: true,
    async generate(prompt, dims, filepath) {
      const apiKey = process.env.TOGETHER_API_KEY;
      if (!apiKey) throw new Error('Set TOGETHER_API_KEY env var (free at together.ai)');
      const body = JSON.stringify({
        model: 'black-forest-labs/FLUX.1-schnell',
        prompt,
        width: Math.min(dims.width, 1024),
        height: Math.min(dims.height, 1024),
        steps: 4,
        n: 1,
        response_format: 'b64_json',
      });
      return new Promise((resolve, reject) => {
        const req = https.request({
          hostname: 'api.together.xyz',
          path: '/v1/images/generations',
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
          },
          timeout: 120000,
        }, (res) => {
          const chunks = [];
          res.on('data', c => chunks.push(c));
          res.on('end', () => {
            if (res.statusCode !== 200) {
              reject(new Error(`HTTP ${res.statusCode}: ${Buffer.concat(chunks).toString().substring(0, 200)}`));
              return;
            }
            try {
              const json = JSON.parse(Buffer.concat(chunks).toString());
              const b64 = json.data[0].b64_json;
              const buf = Buffer.from(b64, 'base64');
              fs.writeFileSync(filepath, buf);
              resolve(buf.length);
            } catch (e) {
              reject(new Error(`Parse error: ${e.message}`));
            }
          });
          res.on('error', reject);
        });
        req.on('error', reject);
        req.write(body);
        req.end();
      });
    },
  },
};

// ─── Generate one image ──────────────────────────────────────────────
async function generateImage(prompt, dimensions, filepath, providerName) {
  const provider = PROVIDERS[providerName];

  // Together AI handles everything internally
  if (providerName === 'together') {
    return provider.generate(prompt, dimensions, filepath);
  }

  // URL-based providers (Pollinations)
  const url = provider.generate(prompt, dimensions);
  const size = await downloadImage(url, filepath);
  return size;
}

// ─── Sleep helper ────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Format bytes ────────────────────────────────────────────────────
function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

// ─── Main ────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const skipVideo = !args.includes('--include-video');
  const listOnly = args.includes('--list');

  // Provider selection
  const provIdx = args.indexOf('--provider');
  const providerName = (provIdx !== -1 && args[provIdx + 1]) ? args[provIdx + 1] : 'pollinations';
  if (!PROVIDERS[providerName]) {
    console.error(`  Unknown provider: ${providerName}`);
    console.error(`  Available: ${Object.keys(PROVIDERS).join(', ')}`);
    process.exit(1);
  }
  const provider = PROVIDERS[providerName];

  // Filter specific prompts: --only 1,2,3 or --only 1-10
  let onlyNums = null;
  const onlyIdx = args.indexOf('--only');
  if (onlyIdx !== -1 && args[onlyIdx + 1]) {
    const spec = args[onlyIdx + 1];
    onlyNums = new Set();
    spec.split(',').forEach(part => {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        for (let n = start; n <= end; n++) onlyNums.add(String(n));
      } else {
        onlyNums.add(part);
      }
    });
  }

  // Category filter: --category layout-heroes
  let onlyCategory = null;
  const catIdx = args.indexOf('--category');
  if (catIdx !== -1 && args[catIdx + 1]) {
    onlyCategory = args[catIdx + 1];
  }

  console.log('');
  console.log('  Digitalne Pozivnice — Image Generator');
  console.log(`  Provider: ${provider.name} (${provider.model}${provider.auth ? ', needs API key' : ', free'})`);
  console.log('  ─────────────────────────────────────────');
  console.log('');

  // Parse prompts
  const allPrompts = parsePrompts();

  // Apply filters
  let prompts = allPrompts;
  if (onlyNums) {
    prompts = prompts.filter(p => onlyNums.has(p.num));
  }
  if (onlyCategory) {
    prompts = prompts.filter(p => p.category === onlyCategory);
  }
  if (skipVideo) {
    prompts = prompts.filter(p => !p.isVideo);
  }

  if (listOnly) {
    console.log(`  Found ${allPrompts.length} total prompts:\n`);
    const grouped = {};
    allPrompts.forEach(p => {
      if (!grouped[p.category]) grouped[p.category] = [];
      grouped[p.category].push(p);
    });
    for (const [cat, items] of Object.entries(grouped)) {
      console.log(`  ${cat}/`);
      items.forEach(p => {
        const flag = p.isVideo ? ' [VIDEO]' : '';
        console.log(`    #${p.num.padEnd(3)} ${p.title} (${p.aspect})${flag}`);
      });
      console.log('');
    }
    console.log(`  Categories: ${Object.keys(grouped).join(', ')}`);
    console.log(`  Use --category <name> to filter by category`);
    console.log(`  Use --only 1,2,3 or --only 1-10 to select specific prompts`);
    return;
  }

  console.log(`  Prompts to generate: ${prompts.length}`);
  if (dryRun) console.log('  Mode: DRY RUN (no images will be generated)\n');
  else console.log('');

  // Create output directories
  const categories = [...new Set(prompts.map(p => p.category))];
  for (const cat of categories) {
    await fs.ensureDir(path.join(OUTPUT_DIR, cat));
  }

  // Generate images
  let success = 0;
  let failed = 0;
  let skipped = 0;

  for (let i = 0; i < prompts.length; i++) {
    const p = prompts[i];
    const dims = DIMENSIONS[p.aspect];
    const filepath = path.join(OUTPUT_DIR, p.category, `${p.filename}.png`);
    const relPath = path.relative(MARKETING_DIR, filepath);
    const progress = `[${i + 1}/${prompts.length}]`;

    // Skip if already exists
    if (await fs.pathExists(filepath)) {
      console.log(`  ${progress} SKIP  ${relPath} (already exists)`);
      skipped++;
      continue;
    }

    if (p.isVideo) {
      console.log(`  ${progress} SKIP  #${p.num} ${p.title} (video — use --include-video)`);
      skipped++;
      continue;
    }

    if (dryRun) {
      console.log(`  ${progress} WOULD ${relPath}`);
      console.log(`         ${dims.width}x${dims.height} | ${p.prompt.substring(0, 80)}...`);
      continue;
    }

    process.stdout.write(`  ${progress} GEN   ${relPath} ...`);

    try {
      const size = await generateImage(p.prompt, dims, filepath, providerName);
      console.log(` ${formatBytes(size)}`);
      success++;
    } catch (err) {
      console.log(` FAILED: ${err.message}`);
      failed++;

      // Retry once after delay
      console.log(`         Retrying in 5s...`);
      await sleep(5000);
      try {
        const size = await generateImage(p.prompt, dims, filepath, providerName);
        console.log(`         Retry OK: ${formatBytes(size)}`);
        success++;
        failed--;
      } catch (retryErr) {
        console.log(`         Retry FAILED: ${retryErr.message}`);
      }
    }

    // Delay between requests
    if (i < prompts.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  console.log('');
  console.log('  ─────────────────────────────────────────');
  console.log(`  Done! ${success} generated, ${skipped} skipped, ${failed} failed`);
  console.log(`  Output: ${path.relative(process.cwd(), OUTPUT_DIR)}/`);
  console.log('');
}

// ─── Help ────────────────────────────────────────────────────────────
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
  Usage: node scripts/generate-images.js [options]

  Providers:
    pollinations     Pollinations.ai — free, no API key needed (default)
    together         Together AI — free 3 months, needs TOGETHER_API_KEY

  Options:
    --list             List all prompts without generating
    --dry-run          Show what would be generated without calling API
    --only 1,2,3       Generate only specific prompt numbers
    --only 1-10        Generate a range of prompts
    --category NAME    Generate only one category (e.g. layout-heroes)
    --provider NAME    Use a specific provider (default: pollinations)
    --include-video    Include video prompts (generates still frame)
    --help, -h         Show this help

  Examples:
    npm run images                                      Generate all images
    npm run images -- --list                             List all prompts
    npm run images -- --dry-run                          Preview without generating
    npm run images -- --only 1-10                        Layout heroes only
    npm run images -- --category ads                     Ad creatives only
    npm run images -- --only 32-37                       Highlight icons
    npm run images -- --provider together                Use Together AI
    npm run images -- --provider together --only 1-5     Together AI, first 5 only

  Environment Variables:
    TOGETHER_API_KEY   API key for Together AI (free at together.ai)
  `);
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
