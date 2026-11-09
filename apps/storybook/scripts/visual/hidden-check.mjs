// Read-only check behind compare's "element only in b" group: for one combo of each differing story, takes every
// element path whose hash differs between two snapshot folders, opens the story in both builds, and classifies each
// path: missing on one side, visually hidden (sr-only: 1×1, clipped, absolute) on both sides, or other.
// visual.ts compare reports "element only in b" when a path is missing on either side or on both (hidden elements are
// skipped on both with --skip-hidden); this tells them apart.
// Usage (from apps/storybook): node scripts/visual/hidden-check.mjs <snap a> <snap b> <sb a> <sb b>
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

setTimeout(() => {
  console.error('hidden-check: time limit reached');
  process.exit(2);
}, 40 * 60_000).unref();

const [snapA, snapB, sbA, sbB] = process.argv.slice(2);
const load = (dir) => new Map(readFileSync(join(dir, 'hashes.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => { const j = JSON.parse(l); return [j.key, j.elements]; }));
const A = load(snapA);
const B = load(snapB);

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf' };
function serve(dir) {
  dir = resolve(dir);
  return new Promise((ok) => {
    const s = createServer((req, res) => {
      const p = join(dir, decodeURIComponent(new URL(req.url, 'http://x').pathname));
      if (!p.startsWith(dir) || !existsSync(p) || !statSync(p).isFile()) { res.writeHead(404).end(); return; }
      res.writeHead(200, { 'content-type': TYPES[extname(p)] ?? 'application/octet-stream' });
      createReadStream(p).pipe(res);
    }).listen(0, '127.0.0.1', () => ok({ s, url: `http://127.0.0.1:${s.address().port}` }));
  });
}

// For each path: null when missing, else whether it's visually hidden, plus its tag and text.
const INSPECT = `(paths) => {
  const find = (path) => {
    const parts = path.split('>');
    let el = document.body;
    for (const part of parts.slice(1)) {
      const i = Number(part.split(':')[1]);
      el = el && el.children[i];
    }
    return el || null;
  };
  return paths.map((p) => {
    const el = find(p);
    if (!el) return null;
    const cs = getComputedStyle(el);
    const hidden = cs.clipPath === 'inset(50%)' && cs.width === '1px' && cs.height === '1px' && cs.position === 'absolute';
    return { hidden, tag: el.tagName.toLowerCase(), text: (el.textContent || '').trim().slice(0, 40) };
  });
}`;

const servers = await Promise.all([serve(sbA), serve(sbB)]);
const browser = await chromium.launch({ channel: 'chrome', args: ['--disable-gpu', '--force-color-profile=srgb'] });
const page = await browser.newPage();
// visual.ts's ready signal: Storybook says the story (and its play function) finished.
await page.addInitScript(`
  window.__finDone = false;
  const attach = () => {
    const ch = window.__STORYBOOK_ADDONS_CHANNEL__;
    if (!ch) return setTimeout(attach, 20);
    for (const e of ['storyFinished', 'storyErrored', 'storyThrewException', 'storyMissing', 'playFunctionThrewException'])
      ch.on(e, () => { window.__finDone = true; });
  };
  attach();
`);
const open = async (base, key) => {
  const [combo, id] = key.split('/');
  const [brand, theme] = combo.split('-');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/iframe.html?id=${id}&viewMode=story&globals=brand:${brand};theme:${theme}`);
  await page.waitForFunction('window.__finDone === true', null, { timeout: 30_000 });
  await page.waitForLoadState('networkidle', { timeout: 5_000 }).catch(() => {});
  await page.evaluate('new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))');
};

const seen = new Set();
const counts = { missingA: 0, missingB: 0, hiddenBoth: 0, visible: 0 };
const examples = [];
for (const [key, ea] of A) {
  const eb = B.get(key);
  if (!eb) continue;
  const id = key.split('/')[1];
  if (seen.has(id)) continue;
  const paths = [...new Set([...Object.keys(ea), ...Object.keys(eb)])].filter((p) => ea[p] !== eb[p]);
  if (paths.length === 0) continue;
  seen.add(id);
  await open(servers[0].url, key);
  const ra = await page.evaluate(`(${INSPECT})(${JSON.stringify(paths)})`);
  await open(servers[1].url, key);
  const rb = await page.evaluate(`(${INSPECT})(${JSON.stringify(paths)})`);
  paths.forEach((p, i) => {
    const [x, y] = [ra[i], rb[i]];
    if (!x) counts.missingA++;
    else if (!y) counts.missingB++;
    else if (x.hidden && y.hidden) counts.hiddenBoth++;
    else {
      counts.visible++;
      if (examples.length < 40) examples.push(`${key} ${p} <${x.tag}> "${x.text}" hidden a=${x.hidden} b=${y.hidden}`);
    }
    if ((!x || !y) && examples.length < 40) examples.push(`${key} ${p} missing in ${x ? 'b' : 'a'}`);
  });
}
console.log(`${seen.size} stories; differing element paths: ${JSON.stringify(counts)}`);
console.log('(visible = the element is drawn on at least one side: compare explains those property by property)');
for (const e of examples) console.log(e);
await browser.close();
for (const s of servers) s.s.close();
