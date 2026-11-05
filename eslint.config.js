import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import betterTailwindcss from 'eslint-plugin-better-tailwindcss';
import { getDefaultSelectors } from 'eslint-plugin-better-tailwindcss/defaults';

/**
 * Tailwind class rules (CLAUDE.md "Tokens and styling", DESIGN.md §3.11). The plugin reads our real theme
 * (packages/ui/src/styles/tailwind.css), so a class that isn't one of our tokens is unknown. The restrictions add
 * what Tailwind itself would still allow. Tests aren't linted for classes (they pass made-up ones like "extra").
 */
const TAILWIND_RESTRICTIONS = [
  { pattern: '^(?!fin:)', message: 'Every class needs the fin: prefix (fin:bg-primary).' },
  { pattern: '(\\]|\\))(\\/[\\w.]+)?$', message: 'No arbitrary values ([…] or (--var)). Use a token utility; for a value set from TSX, use a named utility.' },
  { pattern: '(^|:)dark:', message: 'No dark: variant. Brand and theme come from the tokens (data-theme, data-brand).' },
  { pattern: '(^|:)!|!$', message: 'No !important (the ! modifier).' },
  { pattern: '-px$', message: 'No 1px utilities (-px). Use a token, or a border/outline width (border, border-2).' },
  {
    pattern: '(^|:)-?(p[xytrblse]?|m[xytrblse]?|gap(-[xy])?|space-[xy])-\\d+$',
    message: 'Padding, margin and gap use the space names (p-xl, gap-m), not size numbers.',
  },
  // Names our theme takes over or changes (audit of 6 Nov 2026 against standard Tailwind 4.3.4, DESIGN.md §3.11).
  {
    pattern: '(^|:)leading-',
    message:
      'No leading-*: line height comes with the text style (font-<style>). leading-none would be 0px here: our space token "none" takes the name over.',
  },
  {
    pattern: '(^|:)-?(w|h|size|min-w|max-w|min-h|max-h|basis|inline|min-inline|max-inline|block|min-block|max-block)-(none|xxs|xs|s|m|l|xl|\\d+xl)$',
    message:
      'Sizes use the size numbers (w-24, max-w-343), not space names. Here max-w-none would be 0px and w-xs / max-w-xl 4px / 16px (space tokens), not standard Tailwind\'s "no limit" and container widths.',
  },
  {
    pattern: '(^|:)-?translate-none$',
    message: 'No translate-none: our space token "none" turns it into translate: 0 0. Leave translate unset.',
  },
  {
    // transition-none stays allowed: it's the motion-reduce: counterpart (CLAUDE.md rule 7).
    pattern: '(^|:)transition(-(?!none$)|$)',
    message: 'No transitions yet: motion is deferred (DESIGN.md §5), and without Tailwind\'s default duration transition-* would do nothing.',
  },
  {
    pattern: '(^|:)container$',
    message: 'No container: with our theme it is only width: 100% (standard Tailwind adds a max-width per breakpoint).',
  },
];
const TAILWIND_RULES = {
  'better-tailwindcss/no-unknown-classes': 'error',
  'better-tailwindcss/no-conflicting-classes': 'error',
  'better-tailwindcss/no-duplicate-classes': 'error',
  'better-tailwindcss/no-unnecessary-whitespace': 'error',
  'better-tailwindcss/no-restricted-classes': ['error', { restrict: TAILWIND_RESTRICTIONS }],
};
const TAILWIND_FILES = ['packages/ui/src/**/*.{ts,tsx}', 'apps/storybook/src/**/*.{ts,tsx}', 'apps/storybook/.storybook/**/*.{ts,tsx}'];
// Tailwind is installed in the packages, not at the root: resolve it (and the entry point) from packages/ui.
const TAILWIND_SETTINGS = { cwd: 'packages/ui', entryPoint: 'src/styles/tailwind.css' };

export default tseslint.config(
  { ignores: ['**/dist/**', '**/storybook-static/**', '**/node_modules/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    files: TAILWIND_FILES,
    ignores: ['**/*.test.{ts,tsx}'],
    plugins: { 'better-tailwindcss': betterTailwindcss },
    settings: { 'better-tailwindcss': TAILWIND_SETTINGS },
    rules: TAILWIND_RULES,
  },
  {
    // A component's class lists (Fin<Name>.styles.ts): every string in the file is classes.
    files: ['packages/ui/src/**/*.styles.ts'],
    settings: {
      'better-tailwindcss': {
        ...TAILWIND_SETTINGS,
        // Strings, and strings inside objects (size.large.padding.none).
        selectors: [...getDefaultSelectors(), { kind: 'variable', name: '^.*$', match: [{ type: 'strings' }, { type: 'objectValues' }] }],
      },
    },
  },
  {
    files: ['**/*.config.{js,ts}', '**/scripts/**/*.ts', 'packages/tokens/build.ts'],
    languageOptions: { globals: globals.node },
  },
);
