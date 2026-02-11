#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SCREENSHOTS_DIR = path.join(ROOT, 'public', 'screenshots');
const OUT_DIR = path.join(ROOT, 'marketing', 'campaign-10-days', 'assets');
const IMAGE_DIR = path.join(OUT_DIR, 'images');
const VIDEO_DIR = path.join(OUT_DIR, 'videos');

const DAYS = [
  { day: 1, layout: 'cinema' },
  { day: 2, layout: 'passport' },
  { day: 3, layout: 'magazine' },
  { day: 4, layout: 'envelope' },
  { day: 5, layout: 'storybook' },
  { day: 6, layout: 'glass' },
  { day: 7, layout: 'concert' },
  { day: 8, layout: 'telegram' },
  { day: 9, layout: 'letter' },
  { day: 10, layout: 'gazette' },
];

function runFfmpeg(args) {
  const result = spawnSync('ffmpeg', args, { stdio: 'inherit' });
  if (result.status !== 0) {
    throw new Error(`ffmpeg failed with status ${result.status}`);
  }
}

function ensureDirs() {
  fs.mkdirSync(IMAGE_DIR, { recursive: true });
  fs.mkdirSync(VIDEO_DIR, { recursive: true });
}

function generateImage(inputPath, outputPath) {
  runFfmpeg([
    '-y',
    '-i', inputPath,
    '-vf', 'scale=1080:1350:force_original_aspect_ratio=increase,crop=1080:1350',
    '-update', '1',
    '-frames:v', '1',
    outputPath,
  ]);
}

function generateVideo(inputPath, outputPath) {
  runFfmpeg([
    '-y',
    '-loop', '1',
    '-t', '6',
    '-i', inputPath,
    '-vf', "scale=1280:1992,crop=1080:1920:x='(in_w-1080)/2+24*sin(t*0.9)':y='(in_h-1920)/2+18*cos(t*0.7)'",
    '-r', '25',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    outputPath,
  ]);
}

function main() {
  ensureDirs();
  console.log('Generating 10-day Instagram assets from real template screenshots...');

  for (const item of DAYS) {
    const inputPath = path.join(SCREENSHOTS_DIR, `${item.layout}.webp`);
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Missing screenshot: ${inputPath}`);
    }

    const imagePath = path.join(IMAGE_DIR, `day-${item.day.toString().padStart(2, '0')}-${item.layout}.jpg`);
    const videoPath = path.join(VIDEO_DIR, `day-${item.day.toString().padStart(2, '0')}-${item.layout}.mp4`);

    console.log(`\nDay ${item.day}: ${item.layout}`);
    generateImage(inputPath, imagePath);
    generateVideo(inputPath, videoPath);
  }

  console.log('\nDone.');
  console.log(`Images: ${IMAGE_DIR}`);
  console.log(`Videos: ${VIDEO_DIR}`);
}

main();
