// Keyboard focus check (written for the stage 3e-2 focus fix, 9 Nov 2026). For every story (Finspace Light and Sampath
// Dark), in two builds, focuses each target element two ways and reads its outline:
//   keyboard: element.focus({ focusVisible: true }) (what the arrow keys do in a menu; options aren't in the tab order)
//   pointer:  element.focus({ focusVisible: false })
// and, for `main`, also by pressing Tab until it has focus. Reports every element whose outline differs between the
// builds, by kind. The targets are FinAppShell's `main` and every [role=option]; change TARGETS for other elements.
// Usage (from apps/storybook): node scripts/visual/focus-check.mjs <sb a> <sb b> [id prefix,…]
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';

const TARGETS = 'main, [role=option]';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

setTimeout(() => {
  console.error('focus-check: time limit reached');
  process.exit(2);
}, 45 * 60_000).unref();

const [sbA, sbB] = process.argv.slice(2, 4).map((d) => resolve(d));
// Optional third argument: story id prefixes (comma separated) to check instead of every story.
const prefixes = process.argv[4] ? process.argv[4].split(',') : null;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf' };
const serve = (dir) =>
  new Promise((ok) => {
    const s = createServer((req, res) => {
      const p = join(dir, decodeURIComponent(new URL(req.url, 'http://x').pathname));
      if (!p.startsWith(dir) || !existsSync(p) || !statSync(p).isFile()) { res.writeHead(404).end(); return; }
      res.writeHead(200, { 'content-type': TYPES[extname(p)] ?? 'application/octet-stream' });
      createReadStream(p).pipe(res);
    }).listen(0, '127.0.0.1', () => ok({ s, url: `http://127.0.0.1:${s.address().port}` }));
  });

const READY = `
  window.__finDone = false;
  const attach = () => {
    const ch = window.__STORYBOOK_ADDONS_CHANNEL__;
    if (!ch) return setTimeout(attach, 20);
    for (const e of ['storyFinished', 'storyErrored', 'storyThrewException', 'storyMissing', 'playFunctionThrewException'])
      ch.on(e, () => { window.__finDone = true; });
  };
  attach();
`;

// Each target's outline after keyboard-style and pointer-style focus.
const PROBE = `(() => {
  const read = (el) => { const cs = getComputedStyle(el); return [cs.outlineStyle, cs.outlineWidth, cs.outlineColor, cs.outlineOffset].join(' '); };
  const targets = [...document.querySelectorAll(${JSON.stringify(TARGETS)})];
  return targets.map((el, i) => {
    el.focus({ focusVisible: true, preventScroll: true });
    const keyboard = document.activeElement === el ? read(el) : 'not focusable';
    el.blur();
    el.focus({ focusVisible: false, preventScroll: true });
    const pointer = document.activeElement === el ? read(el) : 'not focusable';
    el.blur();
    return { key: el.tagName.toLowerCase() + (el.getAttribute('role') ? '[role=option]' : '') + '#' + i, keyboard, pointer };
  });
})()`;

const tabToMain = async (page) => {
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press('Tab');
    const out = await page.evaluate(`(() => { const el = document.activeElement; if (!el || el.tagName !== 'MAIN') return null; const cs = getComputedStyle(el); return [cs.outlineStyle, cs.outlineWidth, cs.outlineColor, cs.outlineOffset].join(' '); })()`);
    if (out) return out;
  }
  return 'not reached';
};

const index = JSON.parse(readFileSync(join(sbB, 'index.json'), 'utf8'));
const stories = Object.values(index.entries)
  .filter((e) => e.type === 'story' && (!prefixes || prefixes.some((p) => e.id.startsWith(p))))
  .map((e) => e.id);
console.error(`focus-check: ${stories.length} stories`);
const servers = await Promise.all([serve(sbA), serve(sbB)]);
const browser = await chromium.launch({ channel: 'chrome', args: ['--disable-gpu'] });
const results = [{}, {}];
for (const [side, srv] of servers.entries()) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.addInitScript(READY);
  for (const id of stories) {
    for (const combo of ['finspace-light', 'sampath-dark']) {
      const [brand, theme] = combo.split('-');
      try {
        await page.goto(`${srv.url}/iframe.html?id=${id}&viewMode=story&globals=brand:${brand};theme:${theme}`);
        await page.waitForFunction('window.__finDone === true', null, { timeout: 30_000 });
        const found = await page.evaluate(PROBE);
        if (found.length === 0) continue;
        const entry = Object.fromEntries(found.map((f) => [f.key, f]));
        if (found.some((f) => f.key.startsWith('main#'))) {
          await page.reload();
          await page.waitForFunction('window.__finDone === true', null, { timeout: 30_000 });
          entry.tab = { key: 'main via Tab', keyboard: await tabToMain(page), pointer: '' };
        }
        results[side][`${combo}/${id}`] = entry;
      } catch (err) {
        results[side][`${combo}/${id}`] = { error: { key: 'error', keyboard: String(err).split('\n')[0], pointer: '' } };
      }
    }
  }
  await page.close();
}

let checked = 0;
const diffs = [];
const ringsB = { main: 0, option: 0, tab: 0 };
for (const [story, b] of Object.entries(results[1])) {
  const a = results[0][story] ?? {};
  for (const [k, vb] of Object.entries(b)) {
    checked++;
    const va = a[k];
    if (!va || va.keyboard !== vb.keyboard || va.pointer !== vb.pointer)
      diffs.push(`${story} ${vb.key}: keyboard ${va?.keyboard} → ${vb.keyboard}; pointer ${va?.pointer} → ${vb.pointer}`);
    if (/^solid 2px/.test(vb.keyboard)) ringsB[k === 'tab' ? 'tab' : k.startsWith('main') ? 'main' : 'option']++;
  }
}
// Kinds: the keyboard outline differs (a real change), or only the pointer outline's width with style none on both
// sides (nothing is drawn: main's `outline: 0` set the width to 0, Tailwind's outline-none leaves it), or other.
const noneWidth = (s) => (s ?? '').replace(/^none \d+px/, 'none');
const kinds = { keyboard: 0, pointerWidthOnly: 0, other: 0 };
for (const [story, b] of Object.entries(results[1])) {
  const a = results[0][story] ?? {};
  for (const [k, vb] of Object.entries(b)) {
    const va = a[k];
    if (va && va.keyboard === vb.keyboard && va.pointer === vb.pointer) continue;
    if (!va || va.keyboard !== vb.keyboard) kinds.keyboard++;
    else if (noneWidth(va.pointer) === noneWidth(vb.pointer)) kinds.pointerWidthOnly++;
    else kinds.other++;
  }
}
console.log(`Differences by kind: ${JSON.stringify(kinds)}`);
const stories2 = Object.keys(results[1]).length;
console.log(`${stories2} story × combo with targets; ${checked} focus targets checked; ${diffs.length} differ between the builds.`);
console.log(`In build b, 2px rings with keyboard focus: main ${ringsB.main}, options ${ringsB.option}, main via Tab ${ringsB.tab}.`);
const sample = Object.entries(results[1]).find(([, e]) => Object.keys(e).some((k) => k.includes('option')));
if (sample) {
  const [story, e] = sample;
  const opt = Object.values(e).find((f) => f.key.includes('option'));
  console.log(`e.g. ${story} ${opt.key}: keyboard "${opt.keyboard}", pointer "${opt.pointer}"`);
}
for (const d of diffs.slice(0, 40)) console.log(d);
await browser.close();
for (const s of servers) s.s.close();
