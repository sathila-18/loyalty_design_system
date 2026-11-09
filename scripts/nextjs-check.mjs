#!/usr/bin/env node
// Next.js check: does the packed library work in a real Next.js App Router app? Run by `pnpm release`; on its own:
// `pnpm nextjs-check`.
// 1. Builds and packs both packages (.tgz, as the release attaches them).
// 2. Copies apps/nextjs-check to a temp folder and installs the two .tgz files in one command, as NEXTJS-USAGE.md says
//    (no npm registry for our packages).
// 3. `next build`: must pass (the page imports the library in a Server Component).
// 4. Opens the page in Chrome twice: from `next start` (the production build) and from `next dev` (development, where
//    React reports hydration mismatches, attributes included). Each time: no console errors or warnings, no page
//    errors, no failed requests; the brand and theme are on <html>; the client part's button and the select field
//    rendered by the Server Component both work (they hydrated).
import { spawn, spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
// A hung step must not leave a server or browser running.
setTimeout(() => fail('time limit (15 min) reached'), 15 * 60_000).unref();

let server;
const stopServer = () => {
  if (!server?.pid) return;
  try {
    process.kill(-server.pid, 'SIGKILL');
  } catch {
    // Already gone.
  }
  server = undefined;
};
function fail(msg) {
  console.error(`\n✗ nextjs-check: ${msg}`);
  stopServer();
  process.exit(1);
}
const run = (label, cmd, args, cwd) => {
  console.log(`\n▶ nextjs-check: ${label}`);
  const r = spawnSync(cmd, args, { cwd, stdio: 'inherit', timeout: 8 * 60_000 });
  if (r.status !== 0) fail(`${label} failed (exit ${r.status ?? r.error?.code})`);
};

const tmp = mkdtempSync(join(tmpdir(), 'fin-nextjs-check-'));
const tgz = join(tmp, 'tgz');
const app = join(tmp, 'app');
console.log(`nextjs-check: working in ${tmp}`);

// ── 1. Pack ────────────────────────────────────────────────────────────────────────────────────────────────────
run('build tokens', 'pnpm', ['--filter', '@finspace-loyalty/tokens', 'build'], root);
run('build ui', 'pnpm', ['--filter', '@finspace-loyalty/ui', 'build'], root);
run('pack tokens', 'pnpm', ['--filter', '@finspace-loyalty/tokens', 'pack', '--pack-destination', tgz], root);
run('pack ui', 'pnpm', ['--filter', '@finspace-loyalty/ui', 'pack', '--pack-destination', tgz], root);
const files = readdirSync(tgz);
const tokensTgz = files.find((f) => f.includes('tokens'));
const uiTgz = files.find((f) => f.includes('-ui-'));
if (!tokensTgz || !uiTgz) fail(`packing gave ${files.join(', ')}`);

// ── 2. Install like an app ─────────────────────────────────────────────────────────────────────────────────────
cpSync(join(root, 'apps/nextjs-check'), app, { recursive: true, filter: (src) => !/node_modules|\.next/.test(src) });
run('install', 'pnpm', ['install', '--no-frozen-lockfile'], app);
run('add the two .tgz files (one command)', 'pnpm', ['add', join(tgz, tokensTgz), join(tgz, uiTgz)], app);

// ── 3. Build ───────────────────────────────────────────────────────────────────────────────────────────────────
process.env.NEXT_TELEMETRY_DISABLED = '1';
run('next build', 'pnpm', ['exec', 'next', 'build'], app);

// ── 4. Open the page: production, then development ─────────────────────────────────────────────────────────────
// The browser part (page.evaluate / waitForFunction callbacks run in the page).
/* global document */
const require = createRequire(join(root, 'apps/storybook/package.json'));
const { chromium } = require('playwright');

const freePort = () =>
  new Promise((ok) => {
    const s = createServer().listen(0, () => {
      const p = s.address().port;
      s.close(() => ok(p));
    });
  });

async function check(mode) {
  console.log(`\n▶ nextjs-check: open the page (next ${mode})`);
  const port = await freePort();
  server = spawn('pnpm', ['exec', 'next', mode, '-p', String(port)], { cwd: app, detached: true, stdio: ['ignore', 'pipe', 'pipe'] });
  await new Promise((ok, ko) => {
    const t = setTimeout(() => ko(new Error(`next ${mode} did not get ready`)), 90_000);
    server.stdout.on('data', (d) => {
      if (/ready|started|Local:/i.test(String(d))) {
        clearTimeout(t);
        ok();
      }
    });
  }).catch((e) => fail(e.message));

  const browser = await chromium.launch({ channel: 'chrome' });
  const problems = [];
  try {
    const page = await browser.newPage();
    page.on('console', (m) => {
      if (m.type() === 'error' || m.type() === 'warning') problems.push(`console ${m.type()}: ${m.text()}`);
    });
    page.on('pageerror', (e) => problems.push(`page error: ${e.message}`));
    page.on('response', (r) => {
      if (r.status() >= 400) problems.push(`HTTP ${r.status()}: ${r.url()}`);
    });
    // Development compiles the page on the first request: give it time.
    await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle', timeout: 120_000 });
    const html = await page.evaluate(() => [document.documentElement.dataset.brand, document.documentElement.dataset.theme]);
    if (html.join('/') !== 'sampath/light') problems.push(`<html> has data-brand/data-theme ${html.join('/')}`);
    // Hydrated: the client part's button works.
    await page.getByRole('button', { name: 'Add member' }).click();
    await page
      .waitForFunction(() => document.querySelector('[data-testid="clicks"]')?.textContent === '1', null, { timeout: 10_000 })
      .catch(() => problems.push('the button click did nothing (not hydrated?)'));
    // An interactive component rendered by the Server Component works too: the select field opens its menu.
    await page.getByLabel('Tier').click();
    await page
      .getByRole('option', { name: 'Gold' })
      .waitFor({ timeout: 10_000 })
      .catch(() => problems.push("the select field's menu didn't open"));
  } finally {
    await browser.close();
    stopServer();
  }
  if (problems.length) fail(`next ${mode}: ${problems.length} problem(s) in the browser:\n  ${problems.join('\n  ')}`);
  console.log(`✓ nextjs-check: next ${mode}: renders and hydrates, no console errors or warnings`);
}

await check('start');
await check('dev');
console.log('\n✓ nextjs-check: next build passed; production and development pages render and hydrate with no errors or warnings.');
// The temp folder is left for inspection; the OS clears it.
process.exit(0);
