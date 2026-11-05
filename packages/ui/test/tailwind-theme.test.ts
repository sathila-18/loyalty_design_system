import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compile } from 'tailwindcss';
import { describe, expect, it } from 'vitest';
import { NOT_IN_THEME, proofCases } from './tailwind-proof';

// The Tailwind theme (DESIGN.md §3.11), compiled with the real Tailwind compiler from the library's own entry
// (src/styles/tailwind.css): every utility is var(--fin-*) of its token, Tailwind's defaults are gone, and the
// output stays in the fin layer without variables of its own. The browser half of the proof (computed values in
// every brand × theme) is the Storybook page Foundations/Tailwind utilities.
const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const styles = join(here, '../src/styles');
const themeCss = readFileSync(join(styles, 'theme.css'), 'utf8');
const cases = proofCases(themeCss);

async function build(candidates: string[]) {
  const compiler = await compile(readFileSync(join(styles, 'tailwind.css'), 'utf8'), {
    base: styles,
    async loadStylesheet(id, base) {
      const path = id.startsWith('.') ? resolve(base, id) : require.resolve(id);
      return { path, base: dirname(path), content: readFileSync(path, 'utf8') };
    },
  });
  return compiler.build(candidates);
}

/** The declarations of one prefixed utility's rule. */
function rule(css: string, utility: string) {
  const selector = `.fin\\:${utility.replace(/[^a-z0-9-]/g, (c) => `\\${c}`)} {`;
  const start = css.indexOf(selector);
  return start === -1 ? null : css.slice(start + selector.length, css.indexOf('}', start)).trim();
}

describe('Tailwind theme', () => {
  it('is up to date with the tokens', () => {
    expect(() => execFileSync('node', [join(here, '../scripts/tailwind-theme.ts'), '--check'], { stdio: 'pipe' })).not.toThrow();
  });

  it(`maps every token to its utility (${cases.length} utilities)`, async () => {
    const css = await build(cases.map((c) => `fin:${c.utility}`));
    const wrong = cases.filter((c) => !rule(css, c.utility)?.includes(`var(${c.token})`)).map((c) => `${c.utility} → ${rule(css, c.utility)}`);
    expect(wrong).toEqual([]);
  });

  it('covers every semantic colour, space, size, radius, shadow and text style token', () => {
    const tokens = readFileSync(require.resolve('@finspace-loyalty/tokens/tokens.css'), 'utf8');
    const shadows = readFileSync(require.resolve('@finspace-loyalty/tokens/styles.css'), 'utf8');
    const expected = [...new Set([...`${tokens}\n${shadows}`.matchAll(/^\s*(--fin-(?:bg|text|border|fg|alpha|space|size|radius|shadow)-[a-z0-9-]+|--fin-font-[a-z0-9-]+):/gm)].map((m) => m[1]!))].filter(
      (t) => !/^--fin-font-.+-(size|weight|line-height|family|letter-spacing)$/.test(t),
    );
    const mapped = new Set(cases.map((c) => c.token));
    expect(expected.filter((t) => !mapped.has(t))).toEqual([]);
  });

  it("gives nothing for Tailwind's defaults, palette or alias names", async () => {
    const css = await build(NOT_IN_THEME.map((c) => `fin:${c}`));
    expect(NOT_IN_THEME.filter((c) => rule(css, c) !== null)).toEqual([]);
  });

  it('gives nothing without the fin: prefix', async () => {
    const css = await build(['bg-primary', 'p-m', 'font-body-medium']);
    expect(css).not.toContain('var(--fin-bg-primary)');
    expect(css).not.toContain('var(--fin-space-m)');
  });

  it('writes no variables of its own, and keeps the utilities in the fin.utilities layer', async () => {
    const css = await build(cases.map((c) => `fin:${c.utility}`));
    expect(css.match(/^\s*--fin-[a-z0-9-]+\s*:/gm)).toBeNull();
    expect(css).toMatch(/@layer fin\.utilities \{\s*\.fin\\:/);
  });

  it('has the breakpoint variants from the tokens, and no others', async () => {
    const css = await build(['fin:bp-md:p-m', 'fin:bp-lg:p-m', 'fin:bp-xl:p-m', 'fin:bp-xxl:p-m']);
    for (const width of ['1024px', '1280px', '1440px', '1920px']) expect(css).toContain(`@media (min-width: ${width})`);
  });
});
