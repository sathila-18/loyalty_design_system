import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

// Proves the Tailwind class rules in eslint.config.js (DESIGN.md §3.11): each banned class is reported, and the
// classes a component is meant to use pass. Linted as if it were a component file.
const root = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const eslint = new ESLint({ cwd: root });

async function lint(classes: string, file = 'packages/ui/src/components/Sample/FinSample.tsx') {
  const code = `export const Sample = () => <div className="${classes}" />;\n`;
  const [result] = await eslint.lintText(code, { filePath: join(root, file) });
  return result!.messages.filter((m) => m.ruleId?.startsWith('better-tailwindcss/')).map((m) => `${m.ruleId}: ${m.message}`);
}

describe('Tailwind class rules', () => {
  // Each string is one element's classes, so they don't conflict with each other. Zero is the space token none
  // (p-none, inset-none): there's no p-0.
  it.each([
    'fin:flex fin:gap-m fin:p-xl fin:px-3xl fin:rounded-m fin:w-24 fin:size-40 fin:min-w-120',
    'fin:bg-primary fin:text-secondary fin:border-default fin:stroke-fg-brand',
    'fin:font-button-large fin:shadow-menu fin:outline-focused fin:outline-2 fin:-outline-offset-1 fin:border',
    'fin:data-[variant=primary]:bg-action-primary fin:data-icon-only:p-m fin:enabled:hover:bg-action-primary-hovered',
    'fin:active:bg-action-primary-pressed fin:focus-visible:outline-focused fin:disabled:text-disabled fin:aria-disabled:text-disabled',
    'fin:motion-reduce:transition-none fin:after:absolute fin:before:inset-none fin:group-hover:fg-hovered fin:bp-lg:p-3xl',
    'fin:text-secondary fin:bg-fg-active',
    'fin:fg-action fin:border-2',
  ])('passes %s', async (classes) => {
    expect(await lint(classes)).toEqual([]);
  });

  it.each([
    ['bg-primary', 'fin: prefix'],
    ['fin:bg-[#ffffff]', 'No arbitrary values'],
    ['fin:p-[13px]', 'No arbitrary values'],
    ['fin:w-(--progress)', 'No arbitrary values'],
    ['fin:[--button-bg:red]', 'No arbitrary values'],
    ['fin:dark:bg-primary', 'No dark: variant'],
    ['fin:bg-primary!', 'No !important'],
    ['fin:p-px', 'No 1px utilities'],
    ['fin:p-24', 'space names'],
    ['fin:gap-x-8', 'space names'],
    ['fin:bg-red-500', 'unknown class'],
    ['fin:p-4', 'unknown class'],
    ['fin:text-sm', 'unknown class'],
    ['fin:rounded-lg', 'unknown class'],
    ['fin:shadow-md', 'unknown class'],
    ['fin:p-0', 'unknown class'],
    ['fin:bg-primary fin:bg-secondary', 'conflict'],
    ['fin:p-m fin:p-m', 'duplicate'],
    // Names our theme takes over or changes (audit of 6 Nov 2026 against standard Tailwind 4.3.4).
    ['fin:leading-none', 'No leading-'],
    ['fin:max-w-none', 'Sizes use the size numbers'],
    ['fin:max-h-none', 'Sizes use the size numbers'],
    ['fin:max-inline-none', 'Sizes use the size numbers'],
    ['fin:max-block-none', 'Sizes use the size numbers'],
    ['fin:w-xs', 'Sizes use the size numbers'],
    ['fin:max-w-xl', 'Sizes use the size numbers'],
    ['fin:min-w-2xl', 'Sizes use the size numbers'],
    ['fin:basis-xs', 'Sizes use the size numbers'],
    ['fin:inline-7xl', 'Sizes use the size numbers'],
    ['fin:h-m', 'Sizes use the size numbers'],
    ['fin:translate-none', 'No translate-none'],
    ['fin:transition', 'No transitions yet'],
    ['fin:transition-colors', 'No transitions yet'],
    ['fin:container', 'No container'],
  ])('reports %s', async (classes, expected) => {
    const messages = await lint(classes);
    expect(messages.join('\n')).toMatch(new RegExp(expected, 'i'));
  });

  it('checks every string in a component class file (Fin<Name>.styles.ts)', async () => {
    const code = "export const button = 'fin:bg-[#fff]';\nexport const size = { large: { padding: 'fin:p-[3px]' } };\n";
    const [result] = await eslint.lintText(code, { filePath: join(root, 'packages/ui/src/components/Sample/FinSample.styles.ts') });
    // Both: the top-level string and the one inside an object.
    expect(result!.messages.filter((m) => /No arbitrary values/.test(m.message))).toHaveLength(2);
  });
});
