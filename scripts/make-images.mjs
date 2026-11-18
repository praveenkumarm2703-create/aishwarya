// Generates public/og-image.png (link preview), favicon-32.png and apple-touch-icon.png.
// Usage: node scripts/make-images.mjs   (needs Playwright + Chromium installed)
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import config from '../src/config.js';

// require() also finds a globally installed Playwright
const { chromium } = createRequire(import.meta.url)('playwright');

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out = (f) => path.join(root, 'public', f);

const HEART = 'M16 29S0 19.5 0 9.2C0 3.9 4 0 8.9 0 12 0 14.6 1.6 16 4c1.4-2.4 4-4 7.1-4C28 0 32 3.9 32 9.2 32 19.5 16 29 16 29z';
const heart = (x, y, s, c, o, r = 0) =>
  `<svg style="position:absolute;left:${x}px;top:${y}px;width:${s}px;opacity:${o};transform:rotate(${r}deg)" viewBox="0 0 32 29"><path fill="${c}" d="${HEART}"/></svg>`;

const title = config.site.title.replace(/\s*❤️\s*/g, '').trim();

const og = `<!doctype html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Nunito:wght@800&family=Playfair+Display:wght@800&display=block" rel="stylesheet">
<style>
body{margin:0;width:1200px;height:630px;overflow:hidden;font-family:'Nunito',sans-serif;
background:radial-gradient(circle at 15% 20%,#ff9ac6 0,transparent 45%),radial-gradient(circle at 85% 85%,#c4a6ff 0,transparent 50%),linear-gradient(125deg,#ffd6e7,#ffc9b9 40%,#e9d8ff);}
.wrap{position:absolute;inset:0;display:flex;align-items:center;padding:0 90px;gap:60px}
.text{flex:1}
.eyebrow{font-family:'Dancing Script';font-size:44px;color:#ff3d7f}
h1{margin:8px 0 18px;font-family:'Playfair Display';font-size:84px;line-height:1.05;
background:linear-gradient(120deg,#c2185b,#ff3d7f 45%,#9b5cff);-webkit-background-clip:text;color:transparent}
p{margin:0;font-size:32px;color:#7a4a6c;line-height:1.35;max-width:600px}
.env{position:relative;width:330px;height:230px;flex-shrink:0;transform:rotate(-6deg);filter:drop-shadow(0 30px 40px rgba(176,58,117,.45))}
.back{position:absolute;inset:0;border-radius:16px;background:linear-gradient(160deg,#e2397a,#a1206a)}
.letter{position:absolute;left:8%;right:8%;top:-34%;height:90%;border-radius:10px;background:#fff;display:grid;place-items:center;font-family:'Playfair Display';font-size:34px;color:#ff3d7f}
.front{position:absolute;inset:0;border-radius:16px;background:linear-gradient(to top right,#ff6fa5 49.6%,transparent 50%) left/50.5% 100% no-repeat,linear-gradient(to top left,#ff6fa5 49.6%,transparent 50%) right/50.5% 100% no-repeat}
.front:after{content:'';position:absolute;left:0;right:0;bottom:0;height:58%;border-radius:0 0 16px 16px;background:linear-gradient(to top,#ff5c97,#ff7aae);clip-path:polygon(0 100%,50% 8%,100% 100%)}
.seal{position:absolute;left:50%;top:50%;width:64px;height:64px;margin:-10px 0 0 -32px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ff6f9e,#c3124f);display:grid;place-items:center;box-shadow:0 0 0 5px rgba(255,255,255,.3)}
</style></head><body>
${heart(40, 40, 60, '#ff5e9c', 0.5, -15)}${heart(1080, 50, 80, '#fff', 0.7, 12)}${heart(560, 520, 50, '#c084fc', 0.5, 8)}
${heart(980, 470, 40, '#ff3d7f', 0.6, -10)}${heart(40, 560, 34, '#fff', 0.8, 20)}${heart(700, 40, 30, '#ff9a8b', 0.7, 0)}
<div class="wrap"><div class="text">
<div class="eyebrow">For ${config.herName}</div>
<h1>${title}</h1>
<p>${config.site.description}</p>
</div>
<div class="env"><div class="back"></div><div class="letter">I love you</div><div class="front"></div>
<div class="seal"><svg width="30" viewBox="0 0 32 29"><path fill="#fff" d="${HEART}"/></svg></div></div>
</div></body></html>`;

const icon = (size) => `<!doctype html><html><body style="margin:0;width:${size}px;height:${size}px;
background:linear-gradient(135deg,#ffd6e7,#e9d8ff);display:grid;place-items:center">
<svg width="${size * 0.72}" viewBox="0 0 32 29"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#ff9a8b"/><stop offset=".5" stop-color="#ff5e9c"/><stop offset="1" stop-color="#a56cff"/></linearGradient></defs>
<path fill="url(#g)" d="${HEART}"/></svg></body></html>`;

const browser = await chromium.launch();
const shot = async (html, w, h, file, opts = {}) => {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'networkidle' }).catch(() => page.setContent(html));
  await page.evaluate(() => document.fonts?.ready);
  await page.screenshot({ path: out(file), ...opts });
  await page.close();
  console.log('wrote', file);
};
await shot(og, 1200, 630, 'og-image.jpg', { type: 'jpeg', quality: 86 });
await shot(icon(180), 180, 180, 'apple-touch-icon.png');
await shot(icon(32), 32, 32, 'favicon-32.png');
await browser.close();
