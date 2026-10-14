import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import stylelint from 'stylelint';
import { describe, expect, it } from 'vitest';

// Proves the component CSS rules in stylelint.config.js work: bad.css must fail every rule,
// good.css must pass. Both are linted as if they were a component's CSS Module.
const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '../../..');

async function lint(sample: 'bad' | 'good') {
  const { results } = await stylelint.lint({
    code: readFileSync(join(here, `stylelint/${sample}.css`), 'utf8'),
    codeFilename: join(root, 'packages/ui/src/components/Sample/FinSample.module.css'),
    cwd: root,
  });
  return results[0]!.warnings.map((w) => ({ line: w.line, rule: w.rule, text: w.text }));
}

describe('Stylelint rules for component CSS', () => {
  it('passes good.css', async () => {
    expect(await lint('good')).toEqual([]);
  });

  it('fails every rule in bad.css', async () => {
    const warnings = await lint('bad');
    const count = (rule: string) => warnings.filter((w) => w.rule === rule).length;
    const texts = warnings.map((w) => w.text).join('\n');

    expect(count('color-no-hex')).toBe(1);
    expect(count('color-named')).toBe(1);
    // rgb, rgba, hsl, hwb, lab, lch, oklab, oklch, color + color-mix
    expect(count('function-disallowed-list')).toBe(10);
    // palette, alias, palette in a custom property, and the four typography parts
    expect(count('declaration-property-value-disallowed-list')).toBe(7);

    expect(texts).toContain('No color-mix(). Use an alpha token (--fin-alpha-*)');
    expect(texts).toContain('--fin-palette-electric-indigo-500)" uses a palette or alias color');
    expect(texts).toContain('--fin-color-primary-500)" uses a palette or alias color');
    expect(texts).toContain('--fin-palette-gray-500)" uses a palette or alias color');
    for (const part of ['size', 'weight', 'line-height', 'family']) {
      expect(texts).toContain(`--fin-font-body-large-${part})" uses a typography part`);
    }
  });
});
