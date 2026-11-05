/**
 * Visual check for the styling refactor (DESIGN.md §3.11): proves a branch looks and computes exactly like main.
 *
 *   node scripts/visual.ts snapshot --static <storybook-static> --out <dir> [--filter <id prefix,…>] [--states] [--chunk 20]
 *   node scripts/visual.ts compare  --a <dir> --b <dir> [--static-a <dir> --static-b <dir>] [--report <file>]
 *
 * snapshot: serves a built Storybook, opens every story (or those whose id starts with a --filter prefix) in every
 * brand × theme, and writes for each one a full-page screenshot and a hash of every element's computed style and box,
 * ::before / ::after included. --states also hovers, presses and keyboard-focuses each interactive element and hashes
 * the result. Stories run in chunks (--chunk stories per browser, then the browser is closed) so memory stays low,
 * and a run resumes where it stopped (finished stories are skipped). Animations are paused at their start.
 *
 * compare: every screenshot pixel by pixel (diff images go to <b>/diff/) and every hash. With both static builds,
 * it re-opens each story that differs and lists the properties that changed, element by element.
 *
 * Needs Google Chrome (as pnpm test:a11y). Stop the Storybook dev server first, to keep memory free.
 */
import { createServer, type Server } from 'node:http';
import { createReadStream, existsSync, mkdirSync, readFileSync, statSync, writeFileSync, appendFileSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { chromium, type Browser, type Page } from 'playwright';

const BRANDS = ['finspace', 'burgundy', 'sampath'];
const THEMES = ['light', 'dark'];
const COMBOS = BRANDS.flatMap((b) => THEMES.map((t) => `${b}-${t}`));
const WIDTH = 1440;
const HEIGHT = 900;

// ── Arguments ────────────────────────────────────────────────────────────────────────────────────────────────────
const [command, ...rest] = process.argv.slice(2);
const args = new Map<string, string>();
for (let i = 0; i < rest.length; i++) {
  const key = rest[i]!.replace(/^--/, '');
  const next = rest[i + 1];
  if (next && !next.startsWith('--')) {
    args.set(key, next);
    i++;
  } else args.set(key, 'true');
}
const need = (key: string) => {
  const v = args.get(key);
  if (!v) {
    console.error(`visual: --${key} is required`);
    process.exit(2);
  }
  return resolve(v);
};

// ── Static server ────────────────────────────────────────────────────────────────────────────────────────────────
const TYPES: Record<string, string> = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.map': 'application/json',
};

function serve(dir: string): Promise<{ server: Server; url: string }> {
  const server = createServer((req, res) => {
    const path = join(dir, decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname));
    if (!path.startsWith(dir) || !existsSync(path) || !statSync(path).isFile()) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { 'content-type': TYPES[extname(path)] ?? 'application/octet-stream' });
    createReadStream(path).pipe(res);
  });
  return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok({ server, url: `http://127.0.0.1:${(server.address() as { port: number }).port}` })));
}

// ── In the page ──────────────────────────────────────────────────────────────────────────────────────────────────
// Kept as source strings, so they run unchanged in the browser.

/** Waits until Storybook says the story (and its play function) finished. */
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

/**
 * Every element in the page (the story and anything portalled to <body>; not Storybook's own nodes), as
 * [path, hash of computed style + box, and of ::before / ::after]. With full = true, the styles themselves.
 */
const MEASURE = `(full) => {
  for (const a of document.getAnimations()) { a.pause(); a.currentTime = 0; }
  const hash = (s) => { let h1 = 0xdeadbeef, h2 = 0x41c6ce57; for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i); h1 = Math.imul(h1 ^ c, 2654435761); h2 = Math.imul(h2 ^ c, 1597334677); } h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909); h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909); return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36); };
  const style = (el, pseudo) => { const cs = getComputedStyle(el, pseudo); const o = {}; for (let i = 0; i < cs.length; i++) { const p = cs[i]; o[p] = cs.getPropertyValue(p); } return o; };
  const SKIP = new Set(['SCRIPT', 'STYLE', 'LINK', 'META', 'NOSCRIPT', 'TEMPLATE']);
  const out = [];
  const walk = (el, path) => {
    if (SKIP.has(el.tagName) || el.id === 'storybook-docs' || [...el.classList].some((c) => c.startsWith('sb-'))) return;
    const r = el.getBoundingClientRect();
    const own = style(el, null);
    const before = style(el, '::before');
    const after = style(el, '::after');
    const box = [r.x, r.y, r.width, r.height].map((n) => Math.round(n * 100) / 100).join(',');
    const pseudo = (s) => (s.content === 'none' || s.content === 'normal' ? '' : JSON.stringify(s));
    const key = JSON.stringify(own) + box + pseudo(before) + pseudo(after);
    out.push(full ? [path, { box, own, before: pseudo(before) && before, after: pseudo(after) && after }] : [path, hash(key)]);
    [...el.children].forEach((c, i) => walk(c, path + '>' + c.tagName.toLowerCase() + ':' + i));
  };
  [...document.body.children].forEach((c, i) => walk(c, 'body>' + c.tagName.toLowerCase() + ':' + i));
  return out;
}`;

/** The interactive elements' paths, for --states. */
const INTERACTIVE = `() => {
  const sel = 'button, a[href], input, select, textarea, summary, [role=button], [role=tab], [role=menuitem], [role=option], [role=switch], [role=checkbox], [role=radio], [tabindex]:not([tabindex="-1"])';
  return [...document.body.querySelectorAll(sel)].filter((el) => !el.closest('#storybook-docs') && el.getClientRects().length > 0).length;
}`;

// ── Snapshot ─────────────────────────────────────────────────────────────────────────────────────────────────────
interface Entry { id: string; name: string; title: string; type: string }

async function open(page: Page, base: string, id: string, combo: string, name: string) {
  const [brand, theme] = combo.split('-');
  // Stories named "At 1024" etc. are about that width (their viewport global isn't applied outside the manager).
  const width = Number(/^At (\d{4})$/.exec(name)?.[1] ?? WIDTH);
  await page.setViewportSize({ width, height: HEIGHT });
  await page.goto(`${base}/iframe.html?id=${id}&viewMode=story&globals=brand:${brand};theme:${theme}`);
  await page.waitForFunction('window.__finDone === true', null, { timeout: 30_000 });
  await page.evaluate('document.fonts.ready');
  await page.evaluate('new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))');
}

async function states(page: Page): Promise<Record<string, string>> {
  const count = (await page.evaluate(`(${INTERACTIVE})()`)) as number;
  const result: Record<string, string> = {};
  const digest = async () => {
    const all = (await page.evaluate(`(${MEASURE})(false)`)) as [string, string][];
    return all.map(([p, h]) => `${p}=${h}`).join('|');
  };
  const sel = 'button, a[href], input, select, textarea, summary, [role=button], [role=tab], [role=menuitem], [role=option], [role=switch], [role=checkbox], [role=radio], [tabindex]:not([tabindex="-1"])';
  for (let i = 0; i < count; i++) {
    const el = page.locator(sel).filter({ visible: true }).nth(i);
    const box = await el.boundingBox().catch(() => null);
    if (!box) continue;
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await page.mouse.move(x, y);
    result[`hover:${i}`] = await digest();
    await page.mouse.down();
    result[`active:${i}`] = await digest();
    // Release away from the element, so nothing is clicked and the story keeps its state.
    await page.mouse.move(0, 0);
    await page.mouse.up();
  }
  // Keyboard focus (focus-visible): Tab through the page from the top.
  await page.mouse.move(0, 0);
  await page.evaluate('document.activeElement && document.activeElement.blur()');
  for (let i = 0; i < count; i++) {
    await page.keyboard.press('Tab');
    result[`focus:${i}`] = await digest();
  }
  return result;
}

async function snapshot() {
  const dir = need('static');
  const out = need('out');
  const chunk = Number(args.get('chunk') ?? 20);
  const filters = args.get('filter')?.split(',');
  const withStates = args.has('states');
  const index = JSON.parse(readFileSync(join(dir, 'index.json'), 'utf8')) as { entries: Record<string, Entry> };
  const stories = Object.values(index.entries).filter((e) => e.type === 'story' && (!filters || filters.some((f) => e.id.startsWith(f))));
  for (const c of COMBOS) mkdirSync(join(out, c), { recursive: true });
  const hashes = join(out, 'hashes.jsonl');
  const done = new Set(existsSync(hashes) ? readFileSync(hashes, 'utf8').split('\n').filter(Boolean).map((l) => (JSON.parse(l) as { key: string }).key) : []);

  const { server, url } = await serve(dir);
  const total = stories.length * COMBOS.length;
  let count = done.size;
  console.log(`visual: ${stories.length} stories × ${COMBOS.length} = ${total}; ${done.size} already done; chunks of ${chunk}`);
  try {
    for (let s = 0; s < stories.length; s += chunk) {
      const batch = stories.slice(s, s + chunk);
      if (batch.every((e) => COMBOS.every((c) => done.has(`${c}/${e.id}`)))) continue;
      const browser: Browser = await chromium.launch({ channel: 'chrome' });
      try {
        const page = await browser.newPage({ deviceScaleFactor: 1, reducedMotion: 'no-preference' });
        await page.addInitScript(READY_INIT);
        for (const e of batch) {
          for (const combo of COMBOS) {
            const key = `${combo}/${e.id}`;
            if (done.has(key)) continue;
            let record: Record<string, unknown>;
            try {
              await open(page, url, e.id, combo, e.name);
              await page.screenshot({ path: join(out, combo, `${e.id}.png`), fullPage: true, animations: 'disabled', caret: 'hide' });
              const elements = (await page.evaluate(`(${MEASURE})(false)`)) as [string, string][];
              record = { key, elements: Object.fromEntries(elements) };
              if (withStates) record.states = await states(page);
            } catch (err) {
              record = { key, error: String(err).split('\n')[0] };
            }
            appendFileSync(hashes, JSON.stringify(record) + '\n');
            count++;
          }
        }
      } finally {
        await browser.close();
      }
      console.log(`visual: ${count} / ${total}`);
    }
  } finally {
    server.close();
  }
}

// ── Compare ──────────────────────────────────────────────────────────────────────────────────────────────────────
type Rec = { key: string; elements?: Record<string, string>; states?: Record<string, string>; error?: string };
const load = (dir: string) =>
  new Map(readFileSync(join(dir, 'hashes.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => {
    const r = JSON.parse(l) as Rec;
    return [r.key, r] as const;
  }));

/** Pixel diff of two PNGs, in the browser (no image library needed). Writes a diff image when they differ. */
async function pixels(page: Page, a: string, b: string, diffPath: string) {
  const bufA = readFileSync(a);
  const bufB = readFileSync(b);
  if (bufA.equals(bufB)) return { pixels: 0 };
  const result = (await page.evaluate(
    async ([da, db]) => {
      const img = async (src: string) => {
        const i = new Image();
        i.src = src;
        await i.decode();
        return i;
      };
      const [ia, ib] = await Promise.all([img(da!), img(db!)]);
      if (ia.width !== ib.width || ia.height !== ib.height) return { size: `${ia.width}×${ia.height} → ${ib.width}×${ib.height}`, pixels: -1, png: '' };
      const data = (i: HTMLImageElement) => {
        const c = document.createElement('canvas');
        c.width = i.width;
        c.height = i.height;
        const ctx = c.getContext('2d')!;
        ctx.drawImage(i, 0, 0);
        return ctx.getImageData(0, 0, i.width, i.height);
      };
      const pa = data(ia);
      const pb = data(ib);
      const c = document.createElement('canvas');
      c.width = ia.width;
      c.height = ia.height;
      const ctx = c.getContext('2d')!;
      ctx.drawImage(ib, 0, 0);
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fillRect(0, 0, c.width, c.height);
      const out = ctx.getImageData(0, 0, c.width, c.height);
      let n = 0;
      for (let p = 0; p < pa.data.length; p += 4) {
        if (pa.data[p] !== pb.data[p] || pa.data[p + 1] !== pb.data[p + 1] || pa.data[p + 2] !== pb.data[p + 2] || pa.data[p + 3] !== pb.data[p + 3]) {
          n++;
          out.data.set([255, 0, 0, 255], p);
        }
      }
      ctx.putImageData(out, 0, 0);
      return { pixels: n, png: n ? c.toDataURL('image/png') : '' };
    },
    [`data:image/png;base64,${bufA.toString('base64')}`, `data:image/png;base64,${bufB.toString('base64')}`],
  )) as { pixels: number; size?: string; png: string };
  if (result.png) writeFileSync(diffPath, Buffer.from(result.png.split(',')[1]!, 'base64'));
  return { pixels: result.pixels, size: result.size };
}

async function explain(page: Page, base: string, key: string, paths: string[]) {
  const [combo, id] = key.split('/') as [string, string];
  await open(page, base, id, combo, '');
  const all = (await page.evaluate(`(${MEASURE})(true)`)) as [string, Record<string, unknown>][];
  return new Map(all.filter(([p]) => paths.includes(p)));
}

async function compare() {
  const a = need('a');
  const b = need('b');
  const A = load(a);
  const B = load(b);
  const lines: string[] = [];
  const log = (s: string) => {
    lines.push(s);
    console.log(s);
  };
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage();
  await page.addInitScript(READY_INIT);
  mkdirSync(join(b, 'diff'), { recursive: true });
  let same = 0;
  const differing: { key: string; paths: string[] }[] = [];
  for (const [key, ra] of A) {
    const rb = B.get(key);
    const problems: string[] = [];
    if (!rb) problems.push('missing in b');
    else if (ra.error || rb.error) problems.push(`error: a ${ra.error ?? 'ok'}, b ${rb.error ?? 'ok'}`);
    else {
      const [combo, id] = key.split('/') as [string, string];
      const px = await pixels(page, join(a, combo, `${id}.png`), join(b, combo, `${id}.png`), join(b, 'diff', `${combo}--${id}.png`));
      if (px.pixels !== 0) problems.push(px.size ? `size ${px.size}` : `${px.pixels} pixels differ`);
      const pa = Object.keys(ra.elements!);
      const pb = Object.keys(rb.elements!);
      const paths = [...new Set([...pa, ...pb])].filter((p) => ra.elements![p] !== rb.elements![p]);
      if (paths.length) {
        problems.push(`${paths.length} elements' computed style or box differ`);
        differing.push({ key, paths });
      }
      if (ra.states || rb.states) {
        const sk = [...new Set([...Object.keys(ra.states ?? {}), ...Object.keys(rb.states ?? {})])].filter((k) => ra.states?.[k] !== rb.states?.[k]);
        if (sk.length) problems.push(`states differ: ${sk.slice(0, 8).join(', ')}${sk.length > 8 ? ' …' : ''}`);
      }
    }
    if (problems.length) log(`✗ ${key}: ${problems.join('; ')}`);
    else same++;
  }
  for (const key of B.keys()) if (!A.has(key)) log(`✗ ${key}: missing in a`);
  log(`\n${same} of ${A.size} identical (pixels and computed styles)${A.size === same ? '' : `; ${A.size - same} differ`}`);

  const sa = args.get('static-a');
  const sb = args.get('static-b');
  if (sa && sb && differing.length) {
    log('\nProperty differences (first 20 stories):');
    const servers = await Promise.all([serve(resolve(sa)), serve(resolve(sb))]);
    try {
      for (const { key, paths } of differing.slice(0, 20)) {
        const [ea, eb] = [await explain(page, servers[0].url, key, paths.slice(0, 50)), await explain(page, servers[1].url, key, paths.slice(0, 50))];
        log(`  ${key}`);
        for (const p of paths.slice(0, 50)) {
          const x = ea.get(p) as { box: string; own: Record<string, string> } | undefined;
          const y = eb.get(p) as { box: string; own: Record<string, string> } | undefined;
          if (!x || !y) {
            log(`    ${p}: only in ${x ? 'a' : 'b'}`);
            continue;
          }
          const props = [...new Set([...Object.keys(x.own), ...Object.keys(y.own)])].filter((k) => x.own[k] !== y.own[k]);
          const box = x.box !== y.box ? ` box ${x.box} → ${y.box}` : '';
          log(`    ${p}:${box} ${props.map((k) => `${k}: ${x.own[k]} → ${y.own[k]}`).join('; ') || '(::before/::after)'}`);
        }
      }
    } finally {
      for (const s of servers) s.server.close();
    }
  }
  await browser.close();
  const report = args.get('report');
  if (report) writeFileSync(resolve(report), lines.join('\n') + '\n');
  process.exitCode = A.size === same && B.size === A.size ? 0 : 1;
}

if (command === 'snapshot') await snapshot();
else if (command === 'compare') await compare();
else {
  console.error('visual: use `snapshot` or `compare` (see the comment at the top of scripts/visual.ts)');
  process.exit(2);
}
