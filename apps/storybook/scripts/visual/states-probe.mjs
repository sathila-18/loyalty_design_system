// States probe (written in the Tailwind migration, DESIGN.md §3.11): for each story, opens it in two Storybook builds
// side by side, does the same hover / press / keyboard-focus steps as visual.ts --states, and compares every computed
// property of each state's scope, element by element (visual.ts --states only hashes them). The same normalisations
// as the comparison's switches are applied, and known-invisible differences are counted separately, not reported:
//   --ignore-props '^--(?!fin-)'  component-private variables and Tailwind's --tw-* are left out
//   --normalize-shadows           empty box-shadow layers are dropped, so Tailwind's layered shadow equals the same shadow
//   --skip-hidden                 visually hidden (sr-only) elements are skipped
//   outline-*                     when outline-style is none on both sides (no outline is drawn)
//   background-position           when background-image is none on both sides (nothing is positioned)
// Usage (from apps/storybook): node scripts/visual/states-probe.mjs <sb a> <sb b> <out dir> <combo,combo> <id prefix,…>
//   e.g. node scripts/visual/states-probe.mjs /tmp/sb-main /tmp/sb-branch /tmp/probe finspace-light,sampath-dark components-menu-
// Resumable: <out>/results.jsonl, one line per combo/story. Ends with a summary of what's left, grouped by change.
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { appendFileSync, createReadStream, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

// A hung page must not leave a browser running (run rules): at most 2 hours.
setTimeout(() => {
  console.error('states-probe: time limit reached');
  process.exit(2);
}, 120 * 60_000).unref();

const [sa, sb, out, combosArg, filterArg] = process.argv.slice(2);
if (!sa || !sb || !out || !combosArg || !filterArg) {
  console.error('Usage: node scripts/visual/states-probe.mjs <sb a> <sb b> <out dir> <combo,combo> <id prefix,…>');
  process.exit(1);
}
const combos = combosArg.split(',');
const filters = filterArg.split(',');
mkdirSync(out, { recursive: true });
const resultsFile = join(out, 'results.jsonl');
const done = new Set(existsSync(resultsFile) ? readFileSync(resultsFile, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l).key) : []);

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

const STABLE_RENDERING = ['--disable-gpu', '--disable-gpu-rasterization', '--disable-partial-raster', '--force-color-profile=srgb'];
const READY_INIT = `
  window.__finDone = false;
  const attach = () => {
    const ch = window.__STORYBOOK_ADDONS_CHANNEL__;
    if (!ch) return setTimeout(attach, 20);
    for (const e of ['storyFinished', 'storyErrored', 'storyThrewException', 'storyMissing', 'playFunctionThrewException'])
      ch.on(e, () => { window.__finDone = true; });
  };
  attach();
`;
const INTERACTIVE = 'button, a[href], input, select, textarea, summary, [role=button], [role=tab], [role=menuitem], [role=option], [role=switch], [role=checkbox], [role=radio], [tabindex]:not([tabindex="-1"])';
const IGNORE = /^--(?!fin-)/;

// Full styles of the scope (as visual.ts picks it) and of every ancestor, keyed by path from the scope root. Runs in
// the page (passed as source), so it uses the browser's globals.
/* global document, getComputedStyle */
const MEASURE = (el, ignoreSrc) => {
  const ignore = new RegExp(ignoreSrc);
  for (const a of document.getAnimations()) { a.pause(); a.currentTime = 0; }
  let s = el;
  for (let i = 0; i < 3 && s.parentElement && s.parentElement.getElementsByTagName('*').length <= 80; i++) s = s.parentElement;
  const hidden = (e) => { const cs = getComputedStyle(e); return cs.clipPath === 'inset(50%)' && cs.width === '1px' && cs.height === '1px' && cs.position === 'absolute'; };
  const style = (e, pseudo) => { const cs = getComputedStyle(e, pseudo); const o = {}; for (const p of [...cs].sort()) if (!p.startsWith('--tw-') && !ignore.test(p)) o[p] = cs.getPropertyValue(p); return o; };
  const result = {};
  const walk = (e, path) => {
    if (hidden(e)) return;
    const r = e.getBoundingClientRect();
    result[path] = { box: [r.x, r.y, r.width, r.height].map((n) => Math.round(n * 100) / 100).join(','), own: style(e, null) };
    for (const w of ['::before', '::after']) { const c = getComputedStyle(e, w).content; if (c !== 'none' && c !== 'normal') result[path + w] = { box: '', own: style(e, w) }; }
    [...e.children].forEach((c, i) => walk(c, path + '>' + c.tagName.toLowerCase() + ':' + i));
  };
  walk(s, 'scope');
  let a = s.parentElement, up = 0;
  while (a && a !== document.documentElement) { result[`ancestor:${++up}`] = { box: '', own: style(a, null) }; a = a.parentElement; }
  return result;
};

// --normalize-shadows: drop empty layers (transparent, all zero), as visual.ts does.
const shadow = (v) =>
  (v ?? '')
    .split(/,(?![^(]*\))/)
    .map((s) => s.trim())
    .filter((s) => s !== 'none' && !/^rgba\(0, 0, 0, 0\) 0px 0px 0px 0px$/.test(s) && !/^rgba\(0, 0, 0, 0\) 0px 0px 0px \d+px inset$/.test(s))
    .join(', ') || 'none';

// Differences that remain after the normalisations and the known-invisible ones are taken out.
function diff(A, B, invisible) {
  const real = [];
  const count = (k) => { invisible[k] = (invisible[k] ?? 0) + 1; };
  for (const p of new Set([...Object.keys(A), ...Object.keys(B)])) {
    const x = A[p], y = B[p];
    if (!x || !y) { real.push(`${p}: element only in ${x ? 'a' : 'b'}`); continue; }
    if (x.box !== y.box) real.push(`${p}: box ${x.box} → ${y.box}`);
    const noOutline = x.own['outline-style'] === 'none' && y.own['outline-style'] === 'none';
    const noImage = x.own['background-image'] === 'none' && y.own['background-image'] === 'none';
    for (const k of new Set([...Object.keys(x.own), ...Object.keys(y.own)])) {
      if (x.own[k] === y.own[k]) continue;
      if (k === 'box-shadow' && shadow(x.own[k]) === shadow(y.own[k])) { count('box-shadow (empty layers)'); continue; }
      if (noOutline && k.startsWith('outline-')) { count(`${k} (outline-style none)`); continue; }
      if (noImage && k === 'background-position') { count('background-position (no image)'); continue; }
      real.push(`${p}: ${k}: ${x.own[k] ?? '(none)'} → ${y.own[k] ?? '(none)'}`);
    }
  }
  return real;
}

async function open(page, base, id, combo) {
  const [brand, theme] = combo.split('-');
  await page.goto(`${base}/iframe.html?id=${id}&viewMode=story&globals=brand:${brand};theme:${theme}`);
  await page.waitForFunction('window.__finDone === true', null, { timeout: 30_000 });
  await page.waitForLoadState('networkidle', { timeout: 5_000 }).catch(() => {});
  await page.evaluate('document.fonts.ready');
  await page.evaluate('new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))');
}

async function handlesOf(page) {
  const hs = [];
  for (const h of await page.$$(INTERACTIVE)) {
    if (!(await h.evaluate((e) => !!e.closest('#storybook-docs'))) && (await h.isVisible())) hs.push(h);
    else await h.dispose();
  }
  return hs;
}
const measure = (page, el) => page.evaluate(([e, src, fn]) => (0, eval)(`(${fn})`)(e, src), [el, IGNORE.source, MEASURE.toString()]);

async function probe(pages, urls, id, combo) {
  await Promise.all(pages.map((p, i) => open(p, urls[i], id, combo)));
  const hs = await Promise.all(pages.map(handlesOf));
  const invisible = {};
  const real = [];
  if (hs[0].length !== hs[1].length) real.push(`interactive elements: ${hs[0].length} in a, ${hs[1].length} in b`);
  const n = Math.min(hs[0].length, hs[1].length);
  for (let i = 0; i < n; i++) {
    const shots = { hover: [], active: [] };
    for (const [k, page] of pages.entries()) {
      const box = await hs[k][i].boundingBox();
      if (!box) { shots.hover.push(null); shots.active.push(null); continue; }
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      shots.hover.push(await measure(page, hs[k][i]));
      await page.mouse.down();
      shots.active.push(await measure(page, hs[k][i]));
      await page.mouse.move(0, 0);
      await page.mouse.up();
    }
    for (const st of ['hover', 'active']) if (shots[st][0] && shots[st][1]) for (const d of diff(shots[st][0], shots[st][1], invisible)) real.push(`${st}:${i} ${d}`);
  }
  await Promise.all(pages.map((p) => p.evaluate('document.activeElement && document.activeElement.blur()')));
  for (let i = 0; i < n; i++) {
    const m = [];
    for (const page of pages) {
      await page.keyboard.press('Tab');
      const a = (await page.evaluateHandle('document.activeElement')).asElement();
      m.push(a ? await measure(page, a) : null);
      if (a) await a.dispose();
    }
    if (m[0] && m[1]) for (const d of diff(m[0], m[1], invisible)) real.push(`focus:${i} ${d}`);
  }
  for (const h of hs.flat()) await h.dispose();
  return { real, invisible };
}

const index = JSON.parse(readFileSync(join(sa, 'index.json'), 'utf8'));
const stories = Object.values(index.entries).filter((e) => e.type === 'story' && filters.some((f) => e.id.startsWith(f)));
const jobs = combos.flatMap((c) => stories.map((s) => ({ combo: c, id: s.id, key: `${c}/${s.id}` }))).filter((j) => !done.has(j.key));
console.log(`states-probe: ${stories.length} stories × ${combos.length} = ${stories.length * combos.length}; ${done.size} already done`);

const servers = [await serve(sa), await serve(sb)];
const urls = servers.map((s) => s.url);
let count = done.size;
try {
  // A fresh browser every 10 stories keeps memory low.
  for (let j = 0; j < jobs.length; j += 10) {
    const browser = await chromium.launch({ channel: 'chrome', args: STABLE_RENDERING });
    try {
      const pages = [];
      for (let k = 0; k < 2; k++) {
        const p = await browser.newPage({ deviceScaleFactor: 1, reducedMotion: 'no-preference', viewport: { width: 1440, height: 900 } });
        await p.addInitScript(READY_INIT);
        pages.push(p);
      }
      for (const job of jobs.slice(j, j + 10)) {
        let rec;
        try { rec = { key: job.key, ...(await probe(pages, urls, job.id, job.combo)) }; }
        catch (err) { rec = { key: job.key, error: String(err).split('\n')[0] }; }
        appendFileSync(resultsFile, JSON.stringify(rec) + '\n');
        count++;
      }
    } finally { await browser.close(); }
    console.log(`states-probe: ${count} / ${stories.length * combos.length}  ${new Date().toLocaleTimeString('en-GB')}`);
  }
} finally { servers.forEach(({ s }) => s.close()); }

// Summary of the whole results file (resumed runs included): what's left, grouped by change, and the invisible counts.
const groups = new Map();
const invisibleTotal = {};
let errors = 0;
const records = readFileSync(resultsFile, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
for (const r of records) {
  if (r.error) { errors++; continue; }
  for (const [k, v] of Object.entries(r.invisible ?? {})) invisibleTotal[k] = (invisibleTotal[k] ?? 0) + v;
  for (const d of r.real) {
    const change = d.replace(/^\S+ \S+?: /, '');
    groups.set(change, [...(groups.get(change) ?? []), r.key]);
  }
}
console.log(`\n${records.length} story × combo probed, ${errors} errors (re-run to retry: delete their lines first).`);
console.log(`Invisible, not reported: ${JSON.stringify(invisibleTotal)}`);
console.log(groups.size === 0 ? 'No other differences.' : 'Differences left:');
for (const [change, keys] of [...groups].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`  ${keys.length} × ${change.slice(0, 200)}  (${new Set(keys).size} stories; e.g. ${keys[0]})`);
}
