// @vitest-environment node
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { Blob, Buffer, Face, Font, Variation, shape } from 'harfbuzzjs';
import { describe, expect, it } from 'vitest';
import { finIcons } from '../src/icons/finIcons';

// Checks the generated subset (scripts/subset-icons.ts) against the full Material Symbols font.
const require = createRequire(import.meta.url);
const wawoff2 = require('wawoff2') as { decompress(data: Uint8Array): Promise<Uint8Array> };

async function load(path: string) {
  return new Font(new Face(new Blob(await wawoff2.decompress(readFileSync(path)))));
}
function glyphs(font: Font, text: string, fill: number) {
  font.setVariations([new Variation('FILL', fill)]);
  const buffer = new Buffer();
  buffer.addText(text);
  buffer.guessSegmentProperties();
  shape(font, buffer);
  return buffer.getGlyphInfos().map((g) => g.codepoint);
}

const subset = await load(join(__dirname, '../src/styles/generated/material-symbols-rounded.woff2'));
const full = await load(require.resolve('material-symbols/material-symbols-rounded.woff2'));

describe('icon font subset', () => {
  it.each(finIcons)('renders %s as one icon glyph', (name) => {
    const [glyph, ...rest] = glyphs(subset, name, 0);
    expect(rest).toEqual([]);
    expect(glyph).not.toBe(0);
  });

  it('keeps the filled glyph for every icon that has one in the full font', () => {
    const fullSwaps = finIcons.filter((n) => glyphs(full, n, 1)[0] !== glyphs(full, n, 0)[0]);
    const subsetSwaps = finIcons.filter((n) => glyphs(subset, n, 1)[0] !== glyphs(subset, n, 0)[0]);
    expect(fullSwaps.length).toBeGreaterThan(0);
    expect(subsetSwaps).toEqual(fullSwaps);
  });

  it('leaves out icons that are not in the registry', () => {
    expect(glyphs(subset, 'bolt', 0).length).toBeGreaterThan(1);
  });
});
