// Render tools/og-card.html -> assets/img/og-cover.jpg
//
//   node tools/render-og.mjs
//
// Screenshots the card in headless Chromium (Edge or Chrome, whichever is
// installed) at 2x, then downscales to a flat 1200x630 JPEG with sharp.
// 2x-then-down is what keeps the hairline ink borders and the Bodoni
// wordmark from crawling; a straight 1x grab renders them soft.
//
// sharp is not a dependency of the site — it is only needed to regenerate
// this one image. Install it on demand:  npm i -D sharp
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');

const W = 1200;
const H = 630;
const SCALE = 2;

const CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);

const browser = CANDIDATES.find((p) => fs.existsSync(p));
if (!browser) {
  console.error('No Chromium-based browser found. Set CHROME_PATH.');
  process.exit(1);
}

const shot = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'og-')), 'card.png');

execFileSync(
  browser,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    // file:// documents get an opaque origin, so @font-face and the <img>
    // both need this or the card renders in Times with a broken photo.
    '--allow-file-access-from-files',
    `--force-device-scale-factor=${SCALE}`,
    `--window-size=${W},${H}`,
    `--screenshot=${shot}`,
    pathToFileURL(path.join(HERE, 'og-card.html')).href,
  ],
  { stdio: 'inherit' },
);

const { default: sharp } = await import('sharp');
const out = path.join(ROOT, 'assets/img/og-cover.jpg');

const meta = await sharp(shot).metadata();
if (meta.width !== W * SCALE || meta.height !== H * SCALE) {
  console.warn(`warning: grabbed ${meta.width}x${meta.height}, expected ${W * SCALE}x${H * SCALE}`);
}

await sharp(shot)
  .resize(W, H, { fit: 'cover', kernel: 'lanczos3' })
  .flatten({ background: '#F7F2E7' })
  .jpeg({ quality: 90, chromaSubsampling: '4:4:4', mozjpeg: true })
  .toFile(out);

fs.rmSync(path.dirname(shot), { recursive: true, force: true });
console.log(`${path.relative(ROOT, out)}  ${W}x${H}  ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
