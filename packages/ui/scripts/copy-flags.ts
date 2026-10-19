/**
 * Flag artwork (DESIGN.md §6.1, §8.5): copies the open-source `flag-icons` SVGs (lipis, MIT) for the countries in
 * src/flags/finFlags.ts, plus the neutral `xx` fallback, to src/assets/generated/flags/ (not committed):
 *   rectangle/<code>.svg  ← flags/4x3 (4:3, as Figma's rectangles)
 *   circle/<code>.svg     ← flags/1x1 (square; FinFlag rounds it)
 * and keeps the library's licence beside them. Fails if the registry and the library's ISO list no longer match, so
 * a library update can't silently drop or add a country.
 *
 * Run: node scripts/copy-flags.ts (part of `pnpm icons`, so of build, storybook and test).
 */
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { finFlags } from '../src/flags/finFlags.ts';

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const LIB = dirname(require.resolve('flag-icons/country.json'));
const OUT = join(here, '../src/assets/generated/flags');

interface Entry {
  code: string;
  iso: boolean;
  name: string;
}

const library = (JSON.parse(readFileSync(join(LIB, 'country.json'), 'utf8')) as Entry[]).filter((e) => e.iso);
const libraryCodes = new Set(library.map((e) => e.code.toUpperCase()));
const registryCodes = new Set(Object.keys(finFlags));

const missing = [...libraryCodes].filter((c) => !registryCodes.has(c));
const extra = [...registryCodes].filter((c) => !libraryCodes.has(c));
if (missing.length || extra.length) {
  console.error(`flags: src/flags/finFlags.ts is out of date with flag-icons (not in the registry: ${missing.join(', ') || '-'}; not in the library: ${extra.join(', ') || '-'})`);
  process.exit(1);
}

const SHAPES = { rectangle: '4x3', circle: '1x1' } as const;
for (const [shape, folder] of Object.entries(SHAPES)) {
  mkdirSync(join(OUT, shape), { recursive: true });
  for (const code of [...registryCodes, 'XX']) {
    const file = `${code.toLowerCase()}.svg`;
    copyFileSync(join(LIB, 'flags', folder, file), join(OUT, shape, file));
  }
}
copyFileSync(join(LIB, 'LICENSE'), join(OUT, 'LICENSE.txt'));

console.log(`flags: ${registryCodes.size} countries + fallback, rectangle and circle (flag-icons, MIT)`);
