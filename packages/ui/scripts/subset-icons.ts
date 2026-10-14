/**
 * Icon font subset (DESIGN.md §6, §10 #14): Material Symbols Rounded, cut down to the icons in
 * src/icons/finIcons.ts, written to src/styles/generated/ (not committed).
 *
 * Icons render by ligature: the text "home" in this font becomes the home glyph. The subset keeps:
 *   - each registry icon's glyph, and its filled alternate: when FILL reaches 1 the font swaps
 *     about two thirds of its icons to a separate `.fill` glyph (GSUB FeatureVariations, `rclt`);
 *   - the letters that spell the names, and only the ligature rules that build registry icons
 *     (no layout closure, otherwise every icon spelled with the same letters would be kept).
 * wght 300, opsz 24 and GRAD 0 are fixed (§6.2); FILL stays variable (0–1).
 *
 * Run: node scripts/subset-icons.ts (part of build, storybook and test; also `pnpm icons`).
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Blob, Buffer, Face, Font, Variation, shape } from 'harfbuzzjs';
import { finIcons } from '../src/icons/finIcons.ts';

const require = createRequire(import.meta.url);
const wawoff2 = require('wawoff2') as {
  decompress(data: Uint8Array): Promise<Uint8Array>;
  compress(data: Uint8Array): Promise<Uint8Array>;
};

const here = dirname(fileURLToPath(import.meta.url));
const SOURCE = require.resolve('material-symbols/material-symbols-rounded.woff2');
const OUT = join(here, '../src/styles/generated/material-symbols-rounded.woff2');
const PINNED = { wght: 300, opsz: 24, GRAD: 0 } as const;
const FEATURES = ['rlig', 'rclt']; // ligatures, and the FILL glyph swap

const ttf = await wawoff2.decompress(readFileSync(SOURCE));

// 1. Shape every name at FILL 0 and FILL 1 to find its glyphs.
const font = new Font(new Face(new Blob(ttf)));
function glyphsFor(name: string, fill: number): number[] {
  font.setVariations([new Variation('FILL', fill)]);
  const buffer = new Buffer();
  buffer.addText(name);
  buffer.guessSegmentProperties();
  shape(font, buffer);
  return buffer.getGlyphInfos().map((g) => g.codepoint);
}

const glyphs = new Set<number>();
const missing: string[] = [];
let filled = 0;
for (const name of finIcons) {
  const [outlined, ...rest] = glyphsFor(name, 0);
  const [fill] = glyphsFor(name, 1);
  if (rest.length || !outlined) {
    missing.push(name); // not a single ligature glyph: the name isn't in the font
    continue;
  }
  glyphs.add(outlined);
  if (fill !== undefined && fill !== outlined) {
    glyphs.add(fill);
    filled++;
  }
}
if (missing.length) throw new Error(`Not in Material Symbols Rounded: ${missing.join(', ')}`);

// 2. Subset with HarfBuzz (the same engine as above, its subsetter build).
const { instance } = await WebAssembly.instantiate(readFileSync(require.resolve('harfbuzzjs/dist/harfbuzz-subset.wasm')));
const hb = instance.exports as Record<string, (...args: number[]) => number> & { memory: WebAssembly.Memory };
hb._initialize!();
const heap = () => new Uint8Array(hb.memory.buffer);
const tag = (s: string) => [...s].reduce((a, c) => (a << 8) + c.charCodeAt(0), 0);
const SETS = { glyphs: 0, unicodes: 1, features: 6 };
const NO_LAYOUT_CLOSURE = 0x200;

const fontPtr = hb.malloc!(ttf.byteLength);
heap().set(ttf, fontPtr);
const blob = hb.hb_blob_create!(fontPtr, ttf.byteLength, 2, 0, 0);
const face = hb.hb_face_create!(blob, 0);
hb.hb_blob_destroy!(blob);

const input = hb.hb_subset_input_create_or_fail!();
const add = (set: number, values: Iterable<number>) => {
  for (const v of values) hb.hb_set_add!(set, v);
};
add(hb.hb_subset_input_set!(input, SETS.glyphs), glyphs);
add(hb.hb_subset_input_set!(input, SETS.unicodes), new Set([...finIcons.join('')].map((c) => c.codePointAt(0)!)));
const features = hb.hb_subset_input_set!(input, SETS.features);
hb.hb_set_clear!(features);
add(features, FEATURES.map(tag));
hb.hb_subset_input_set_flags!(input, hb.hb_subset_input_get_flags!(input) | NO_LAYOUT_CLOSURE);
for (const [axis, value] of Object.entries(PINNED)) {
  if (!hb.hb_subset_input_pin_axis_location!(input, face, tag(axis), value)) throw new Error(`Couldn't pin ${axis}`);
}

const subset = hb.hb_subset_or_fail!(face, input);
hb.hb_subset_input_destroy!(input);
if (!subset) throw new Error('HarfBuzz subsetting failed');
const result = hb.hb_face_reference_blob!(subset);
const data = heap().slice(hb.hb_blob_get_data!(result, 0), hb.hb_blob_get_data!(result, 0) + hb.hb_blob_get_length!(result));
hb.hb_blob_destroy!(result);
hb.hb_face_destroy!(subset);
hb.hb_face_destroy!(face);
hb.free!(fontPtr);

// 3. Write woff2.
const woff2 = await wawoff2.compress(data);
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, woff2);
console.log(`icons: ${finIcons.length} icons (${filled} with a filled glyph), ${(woff2.byteLength / 1024).toFixed(1)} KB`);
