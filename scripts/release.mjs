#!/usr/bin/env node
// Release: `pnpm release patch|minor|major [--dry-run]` (CLAUDE.md "Releasing").
// 1. Checks: on main, nothing uncommitted, exactly origin/main (fetched), both packages at the same version, the new
//    tag doesn't exist (here or on GitHub), CHANGELOG.md has entries under "## Unreleased", Storybook dev server off.
// 2. Generates the token files and icon font, then runs lint, lint:css, typecheck, test, build, build-storybook, and the
//    a11y check one brand × theme at a time.
// 3. Bumps packages/tokens and packages/ui to the same new version; CHANGELOG.md "## Unreleased" becomes
//    "## vX.Y.Z — date" (with a fresh empty Unreleased above); adds a "Released vX.Y.Z" line to DESIGN.md §11.
// 4. Commits "Release vX.Y.Z" (only those four files) and creates the annotated tag vX.Y.Z.
// It never pushes: after review and approval, push main and the tag (the tag starts the GitHub release workflow).
// --dry-run: steps 1 and 2 only; prints the new version and the changelog entry, changes nothing.
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const [bump, ...flags] = process.argv.slice(2);
const dryRun = flags.includes('--dry-run');
const PACKAGES = ['packages/tokens/package.json', 'packages/ui/package.json'];
const A11Y = ['finspace-light', 'finspace-dark', 'burgundy-light', 'burgundy-dark', 'sampath-light', 'sampath-dark'];

const fail = (msg) => {
  console.error(`\n✗ release stopped: ${msg}`);
  process.exit(1);
};
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
const read = (p) => readFileSync(join(root, p), 'utf8');
// A step with a time limit; its output is shown; a failure stops the release.
const run = (label, cmd, args, opts = {}) => {
  console.log(`\n▶ ${label}`);
  const r = spawnSync(cmd, args, { cwd: opts.cwd ?? root, stdio: 'inherit', timeout: (opts.minutes ?? 15) * 60_000 });
  if (r.error?.code === 'ETIMEDOUT') fail(`${label}: time limit reached`);
  if (r.status !== 0) fail(`${label} failed (exit ${r.status})`);
  console.log(`✓ ${label}`);
};

if (!['patch', 'minor', 'major'].includes(bump)) fail('usage: pnpm release patch|minor|major [--dry-run]');

// ── 1. Checks ──────────────────────────────────────────────────────────────────────────────────────────────────
if (git('branch', '--show-current') !== 'main') fail('not on main');
if (git('status', '--porcelain') !== '') fail('uncommitted changes:\n' + git('status', '--short'));
git('fetch', 'origin', '--tags');
if (git('rev-parse', 'HEAD') !== git('rev-parse', 'origin/main'))
  fail(`main isn't exactly origin/main (ahead ${git('rev-list', '--count', 'origin/main..HEAD')}, behind ${git('rev-list', '--count', 'HEAD..origin/main')})`);

const versions = PACKAGES.map((p) => JSON.parse(read(p)).version);
if (versions[0] !== versions[1]) fail(`the packages' versions differ: tokens ${versions[0]}, ui ${versions[1]}`);
const [major, minor, patch] = versions[0].split('.').map(Number);
const next = bump === 'major' ? `${major + 1}.0.0` : bump === 'minor' ? `${major}.${minor + 1}.0` : `${major}.${minor}.${patch + 1}`;
const tag = `v${next}`;
if (git('tag', '-l', tag) !== '') fail(`tag ${tag} already exists here`);
if (git('ls-remote', '--tags', 'origin', tag) !== '') fail(`tag ${tag} already exists on GitHub`);

// The Unreleased section, without its empty headings; it must hold at least one "- " line.
const changelog = read('CHANGELOG.md');
const section = /^## Unreleased\n([\s\S]*?)(?=^## |(?![\s\S]))/m.exec(changelog);
const entry = section?.[1].replace(/^### [\w ]+\n+(?=### |(?![\s\S]))/gm, '').trim();
if (!entry || !/^- /m.test(entry)) fail('CHANGELOG.md has no entries under "## Unreleased": write them first');

try {
  execFileSync('lsof', ['-tiTCP:6006', '-sTCP:LISTEN'], { stdio: 'pipe' });
  fail('the Storybook dev server is running (port 6006): stop it for the a11y check, and restart it after');
} catch (e) {
  if (e.status !== 1) throw e; // lsof exits 1 when nothing listens: the good case
}

console.log(`Release ${versions[0]} → ${next} (${bump}). Changelog entry:\n\n${entry}\n`);

// ── 2. Checks run ──────────────────────────────────────────────────────────────────────────────────────────────
// The generated files the checks need (token dist, icon font subset): a clean checkout doesn't have them.
run('prepare: tokens build', 'pnpm', ['--filter', '@finspace-loyalty/tokens', 'build']);
run('prepare: icons', 'pnpm', ['icons']);
run('lint', 'pnpm', ['lint']);
run('lint:css', 'pnpm', ['lint:css']);
run('typecheck', 'pnpm', ['typecheck']);
run('test', 'pnpm', ['test']);
run('build', 'pnpm', ['build']);
run('build-storybook', 'pnpm', ['build-storybook']);
for (const project of A11Y)
  run(`a11y ${project}`, './node_modules/.bin/vitest', ['run', '--project', `a11y-${project}`], { cwd: join(root, 'apps/storybook'), minutes: 10 });

if (dryRun) {
  console.log(`\n✓ dry run: every check passed; ${tag} would be released. Nothing was changed.`);
  process.exit(0);
}

// ── 3. Version, changelog, DESIGN.md ───────────────────────────────────────────────────────────────────────────
const now = new Date();
const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
const day = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
for (const p of PACKAGES) writeFileSync(join(root, p), read(p).replace(/"version":\s*"[^"]+"/, `"version": "${next}"`));
const fresh = '## Unreleased\n\n### Added\n\n### Changed\n\n### Fixed\n\n### Breaking\n\n### Known issues\n\n';
writeFileSync(
  join(root, 'CHANGELOG.md'),
  changelog.replace(/^## Unreleased\n[\s\S]*?(?=^## |(?![\s\S]))/m, `${fresh}## ${tag} — ${iso}\n\n${entry}\n\n`),
);
const design = read('DESIGN.md').replace(/\n*$/, '\n');
writeFileSync(join(root, 'DESIGN.md'), `${design}| ${day} | 0.2 | **Released ${tag}** (both packages; what's in it: CHANGELOG.md). |\n`);

// ── 4. Commit and tag (no push) ────────────────────────────────────────────────────────────────────────────────
git('add', ...PACKAGES, 'CHANGELOG.md', 'DESIGN.md');
git('commit', '-m', `Release ${tag}`);
git('tag', '-a', tag, '-m', `Release ${tag}`);
console.log(`\n✓ ${tag} committed and tagged locally. Nothing was pushed.
Review:  git show
After approval:  git push origin main && git push origin ${tag}   (the tag starts the GitHub release workflow)
Undo before pushing:  git tag -d ${tag} && git reset --hard HEAD~1`);
