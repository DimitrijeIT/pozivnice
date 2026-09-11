#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const DEFAULT_SECONDS = 7;
const AUDIO_EXT = new Set(['.mp3', '.wav', '.m4a', '.aac', '.flac', '.ogg', '.opus']);

function fail(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

function run(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, {
    encoding: 'utf8',
    stdio: opts.capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
  });

  if (result.error) {
    fail(`${cmd} failed: ${result.error.message}`);
  }
  if (result.status !== 0) {
    if (opts.capture) {
      const details = [result.stdout, result.stderr].filter(Boolean).join('\n').trim();
      fail(`${cmd} exited with code ${result.status}${details ? `\n${details}` : ''}`);
    }
    fail(`${cmd} exited with code ${result.status}`);
  }
  return result;
}

function ensureBinaries() {
  run('ffmpeg', ['-version']);
  run('ffprobe', ['-version']);
}

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token.startsWith('--')) {
      const key = token.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith('--')) {
        out[key] = true;
        continue;
      }
      out[key] = next;
      i += 1;
      continue;
    }
    out._.push(token);
  }
  return out;
}

function toAbs(input, fallback) {
  if (!input) {
    return fallback;
  }
  return path.isAbsolute(input) ? input : path.join(ROOT, input);
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function listAudioFiles(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  return fs
    .readdirSync(dirPath)
    .map((name) => path.join(dirPath, name))
    .filter((fullPath) => fs.statSync(fullPath).isFile())
    .filter((fullPath) => AUDIO_EXT.has(path.extname(fullPath).toLowerCase()))
    .sort();
}

function ffprobeDuration(filePath) {
  const probe = run(
    'ffprobe',
    [
      '-v',
      'error',
      '-show_entries',
      'format=duration',
      '-of',
      'default=noprint_wrappers=1:nokey=1',
      filePath,
    ],
    { capture: true }
  );
  const raw = (probe.stdout || '').trim();
  const duration = Number(raw);
  if (!Number.isFinite(duration) || duration <= 0) {
    fail(`Cannot read duration for ${filePath}`);
  }
  return duration;
}

function ffprobeHasAudio(filePath) {
  const probe = run(
    'ffprobe',
    ['-v', 'error', '-select_streams', 'a:0', '-show_entries', 'stream=index', '-of', 'csv=p=0', filePath],
    { capture: true }
  );
  return (probe.stdout || '').trim().length > 0;
}

function measureSegment(filePath, start, seconds) {
  const probe = run(
    'ffmpeg',
    [
      '-hide_banner',
      '-v',
      'info',
      '-ss',
      String(start),
      '-t',
      String(seconds),
      '-i',
      filePath,
      '-af',
      'highpass=f=70,lowpass=f=14000,volumedetect',
      '-f',
      'null',
      '-',
    ],
    { capture: true }
  );

  const text = `${probe.stdout || ''}\n${probe.stderr || ''}`;
  const meanMatch = text.match(/mean_volume:\s*(-?\d+(\.\d+)?)\s*dB/i);
  const maxMatch = text.match(/max_volume:\s*(-?\d+(\.\d+)?)\s*dB/i);
  const mean = meanMatch ? Number(meanMatch[1]) : -99;
  const max = maxMatch ? Number(maxMatch[1]) : -99;
  return { mean, max };
}

function cmdSynthPack(args) {
  const outDir = toAbs(args['out-dir'], path.join(ROOT, 'output', 'audio_drops'));
  const seconds = Number(args.seconds || DEFAULT_SECONDS);
  if (!Number.isFinite(seconds) || seconds <= 0) {
    fail('--seconds must be > 0');
  }

  ensureDir(outDir);

  const recipes = [
    { name: 'drop-neon-punch', freq: 116, lowpass: 240, noiseVol: 0.08, echo: 140, decay: 0.20 },
    { name: 'drop-gold-rush', freq: 102, lowpass: 210, noiseVol: 0.07, echo: 170, decay: 0.23 },
    { name: 'drop-dark-club', freq: 88, lowpass: 190, noiseVol: 0.09, echo: 110, decay: 0.19 },
    { name: 'drop-vibe-shock', freq: 128, lowpass: 280, noiseVol: 0.06, echo: 150, decay: 0.20 },
    { name: 'drop-urban-snap', freq: 96, lowpass: 220, noiseVol: 0.08, echo: 180, decay: 0.24 },
    { name: 'drop-festival-hit', freq: 124, lowpass: 260, noiseVol: 0.07, echo: 130, decay: 0.18 },
  ];

  for (const r of recipes) {
    const outPath = path.join(outDir, `${r.name}-${seconds}s.m4a`);
    const fadeOutStart = Math.max(0, seconds - 0.30);
    const filter = [
      `[0:a]volume='if(lt(t,1.0),0.18+0.52*t,if(lt(mod(t,0.5),0.08),1.0,0.74))',lowpass=f=${r.lowpass},highpass=f=45[tone]`,
      `[1:a]highpass=f=4200,lowpass=f=12500,volume=${r.noiseVol}[noise]`,
      `[tone][noise]amix=inputs=2:normalize=0,aecho=0.65:0.45:${r.echo}|${r.echo * 2}:${r.decay}|${(r.decay * 0.7).toFixed(3)}`,
      'acompressor=threshold=-15dB:ratio=3:attack=12:release=120',
      'alimiter=limit=0.92',
      'afade=t=in:st=0:d=0.06',
      `afade=t=out:st=${fadeOutStart.toFixed(2)}:d=0.30`,
    ].join(',');

    run('ffmpeg', [
      '-y',
      '-f',
      'lavfi',
      '-i',
      `sine=frequency=${r.freq}:sample_rate=48000:duration=${seconds}`,
      '-f',
      'lavfi',
      '-i',
      `anoisesrc=color=white:sample_rate=48000:duration=${seconds}`,
      '-filter_complex',
      filter,
      '-ar',
      '48000',
      '-ac',
      '2',
      '-c:a',
      'aac',
      '-b:a',
      '192k',
      outPath,
    ]);
    console.log(`Generated ${path.basename(outPath)}`);
  }

  console.log(`\nPack ready: ${outDir}`);
}

function cmdBest7(args) {
  const inDir = toAbs(args['in-dir'], path.join(ROOT, 'output', 'audio_sources'));
  const outDir = toAbs(args['out-dir'], path.join(ROOT, 'output', 'audio_drops'));
  const seconds = Number(args.seconds || DEFAULT_SECONDS);
  const step = Number(args.step || 1);

  if (!Number.isFinite(seconds) || seconds <= 0) {
    fail('--seconds must be > 0');
  }
  if (!Number.isFinite(step) || step <= 0) {
    fail('--step must be > 0');
  }

  const files = listAudioFiles(inDir);
  if (files.length === 0) {
    fail(`No audio files found in ${inDir}`);
  }

  ensureDir(outDir);
  const manifest = [];

  for (const filePath of files) {
    const duration = ffprobeDuration(filePath);
    if (duration <= seconds + 0.05) {
      console.log(`Skipping ${path.basename(filePath)} (shorter than ${seconds}s)`);
      continue;
    }

    let best = { start: 0, mean: -999, max: -999 };
    for (let start = 0; start <= duration - seconds; start += step) {
      const score = measureSegment(filePath, start, seconds);
      if (score.mean > best.mean || (score.mean === best.mean && score.max > best.max)) {
        best = { start, mean: score.mean, max: score.max };
      }
    }

    const base = path.parse(filePath).name;
    const outPath = path.join(outDir, `${base}-best${seconds}s.m4a`);
    const fadeOutStart = Math.max(0, seconds - 0.25);

    run('ffmpeg', [
      '-y',
      '-ss',
      String(best.start.toFixed(3)),
      '-t',
      String(seconds),
      '-i',
      filePath,
      '-af',
      `loudnorm=I=-14:TP=-1.5:LRA=9,afade=t=in:st=0:d=0.05,afade=t=out:st=${fadeOutStart.toFixed(2)}:d=0.25`,
      '-ar',
      '48000',
      '-ac',
      '2',
      '-c:a',
      'aac',
      '-b:a',
      '192k',
      outPath,
    ]);

    manifest.push({
      source: filePath,
      output: outPath,
      start_seconds: Number(best.start.toFixed(3)),
      mean_volume_db: Number(best.mean.toFixed(2)),
      max_volume_db: Number(best.max.toFixed(2)),
      segment_seconds: seconds,
    });

    console.log(
      `Cut ${path.basename(outPath)} from ${path.basename(filePath)} @ ${best.start.toFixed(2)}s (mean ${best.mean.toFixed(2)} dB)`
    );
  }

  if (manifest.length === 0) {
    fail('No segments generated.');
  }

  const manifestPath = path.join(outDir, 'best7-manifest.json');
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(`\nDone. Manifest: ${manifestPath}`);
}

function cmdAttach(args) {
  const video = toAbs(args.video, null);
  const audio = toAbs(args.audio, null);
  if (!video || !audio) {
    fail('Usage: attach --video <path> --audio <path> [--out <path>] [--seconds 7]');
  }
  if (!fs.existsSync(video)) {
    fail(`Video not found: ${video}`);
  }
  if (!fs.existsSync(audio)) {
    fail(`Audio not found: ${audio}`);
  }

  const seconds = Number(args.seconds || DEFAULT_SECONDS);
  const videoStart = Number(args['video-start'] || 0);
  const audioStart = Number(args['audio-start'] || 0);
  const duck = Number(args.duck || 0.24);
  const musicVolume = Number(args['music-volume'] || 1.0);
  const keepOriginal = args['no-mix'] ? false : true;

  if (!Number.isFinite(seconds) || seconds <= 0) {
    fail('--seconds must be > 0');
  }
  if (!Number.isFinite(videoStart) || videoStart < 0) {
    fail('--video-start must be >= 0');
  }
  if (!Number.isFinite(audioStart) || audioStart < 0) {
    fail('--audio-start must be >= 0');
  }

  const outDefault = `${path.parse(video).name}-with-drop.mp4`;
  const out = toAbs(args.out, path.join(ROOT, 'output', 'reels_with_audio', outDefault));
  ensureDir(path.dirname(out));

  const hasVideoAudio = ffprobeHasAudio(video);
  const audioTrimEnd = (audioStart + seconds).toFixed(3);
  const maps = ['-map', '0:v:0'];

  let filterComplex;
  if (hasVideoAudio && keepOriginal) {
    filterComplex = [
      `[0:a]volume=${duck.toFixed(3)}[orig]`,
      `[1:a]atrim=start=${audioStart.toFixed(3)}:end=${audioTrimEnd},asetpts=N/SR/TB,volume=${musicVolume.toFixed(3)}[music]`,
      '[orig][music]amix=inputs=2:duration=first:normalize=0[aout]',
    ].join(';');
    maps.push('-map', '[aout]');
  } else {
    filterComplex = `[1:a]atrim=start=${audioStart.toFixed(3)}:end=${audioTrimEnd},asetpts=N/SR/TB,volume=${musicVolume.toFixed(3)}[aout]`;
    maps.push('-map', '[aout]');
  }

  run('ffmpeg', [
    '-y',
    '-ss',
    videoStart.toFixed(3),
    '-i',
    video,
    '-stream_loop',
    '-1',
    '-i',
    audio,
    '-t',
    seconds.toFixed(3),
    '-filter_complex',
    filterComplex,
    ...maps,
    '-c:v',
    'libx264',
    '-preset',
    'veryfast',
    '-crf',
    '18',
    '-pix_fmt',
    'yuv420p',
    '-c:a',
    'aac',
    '-b:a',
    '192k',
    '-movflags',
    '+faststart',
    out,
  ]);

  console.log(`Saved: ${out}`);
}

function printHelp() {
  console.log(`
Reel Audio Tool

Commands:
  synth-pack [--out-dir output/audio_drops] [--seconds 7]
  best7      [--in-dir output/audio_sources] [--out-dir output/audio_drops] [--seconds 7] [--step 1]
  attach     --video <clip.mp4> --audio <drop.m4a> [--out output/reels_with_audio/out.mp4]
             [--seconds 7] [--video-start 0] [--audio-start 0] [--duck 0.24] [--music-volume 1.0] [--no-mix]

Examples:
  node scripts/reel-audio-tool.js synth-pack
  node scripts/reel-audio-tool.js best7 --in-dir output/audio_sources --out-dir output/audio_drops
  node scripts/reel-audio-tool.js attach --video output/imagegen/scroll_animations_live/concert-scroll-live.mp4 --audio output/audio_drops/drop-festival-hit-7s.m4a
`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const command = args._[0];

  if (!command || command === 'help' || command === '--help' || command === '-h') {
    printHelp();
    return;
  }

  ensureBinaries();

  if (command === 'synth-pack') {
    cmdSynthPack(args);
    return;
  }
  if (command === 'best7') {
    cmdBest7(args);
    return;
  }
  if (command === 'attach') {
    cmdAttach(args);
    return;
  }

  fail(`Unknown command: ${command}`);
}

main();
