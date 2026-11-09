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
/*
 * outline-none and an outline width on the same element (found in stage 3e-2, 9 Nov 2026): Tailwind's outline-none
 * sets --tw-outline-style: none, and outline-2 takes its style from that variable, so with both active (focus +
 * focus-visible) the focus ring disappears. Use focus:not-focus-visible:outline-none. A variant that moves the class to
 * another element (group-*, peer-*, after:, a range thumb…) doesn't count. Exported for packages/ui/test.
 */
const OTHER_ELEMENT_VARIANT = /^(group-|peer-|in-|inside-|after$|before$|range-|webkit-|\*|marker|placeholder|file$|selection|backdrop|first-)/;
const classParts = (cls) => cls.replace(/^fin:/, '').split(':');
const onSameElement = (cls) => classParts(cls).slice(0, -1).every((variant) => !OTHER_ELEMENT_VARIANT.test(variant));
export function outlineConflict(text) {
  const classes = text.split(/\s+/).filter(Boolean);
  const none = classes.some((c) => classParts(c).at(-1) === 'outline-none' && onSameElement(c) && !classParts(c).includes('not-focus-visible'));
  const width = classes.some((c) => /^outline(-\d+)?$/.test(classParts(c).at(-1)) && onSameElement(c));
  return none && width;
}

/*
 * The rule: each string (a literal, a template or a + chain, with the const strings it uses from the same file
 * filled in) is one element's classes. Lists joined in TSX from several exports are covered by
 * packages/ui/test/outline-focus.test.ts.
 */
const STRINGISH = new Set(['Literal', 'TemplateLiteral', 'BinaryExpression']);
const noOutlineNoneWithRing = {
  meta: {
    type: 'problem',
    messages: {
      conflict:
        'outline-none and an outline width on the same element: outline-none sets --tw-outline-style: none, so the focus ring disappears. Use focus:not-focus-visible:outline-none.',
    },
    schema: [],
  },
  create(context) {
    const source = context.sourceCode;
    const evaluate = (node, seen) => {
      if (!node) return '';
      if (node.type === 'Literal') return typeof node.value === 'string' ? node.value : '';
      if (node.type === 'TemplateLiteral')
        return node.quasis.map((q, i) => q.value.cooked + (node.expressions[i] ? ` ${evaluate(node.expressions[i], seen)} ` : '')).join('');
      if (node.type === 'BinaryExpression' && node.operator === '+') return evaluate(node.left, seen) + evaluate(node.right, seen);
      if (node.type === 'Identifier' && !seen.has(node.name)) {
        for (let scope = source.getScope(node); scope; scope = scope.upper) {
          const variable = scope.set.get(node.name);
          const def = variable?.defs[0];
          if (def?.node.type === 'VariableDeclarator' && def.parent?.kind === 'const')
            return evaluate(def.node.init, new Set([...seen, node.name]));
          if (variable) break;
        }
      }
      return '';
    };
    const check = (node) => {
      const parent = node.parent;
      // Only the outermost string: a part of a template or a + chain is checked with the whole.
      if (parent && (parent.type === 'TemplateLiteral' || (parent.type === 'BinaryExpression' && parent.operator === '+'))) return;
      if (node.type === 'BinaryExpression' && node.operator !== '+') return;
      if (outlineConflict(evaluate(node, new Set()))) context.report({ node, messageId: 'conflict' });
    };
    return Object.fromEntries([...STRINGISH].map((type) => [type, check]));
  },
};
const finPlugin = { rules: { 'no-outline-none-with-ring': noOutlineNoneWithRing } };

const TAILWIND_RULES = {
  'better-tailwindcss/no-unknown-classes': 'error',
  'better-tailwindcss/no-conflicting-classes': 'error',
  'better-tailwindcss/no-duplicate-classes': 'error',
  'better-tailwindcss/no-unnecessary-whitespace': 'error',
  'better-tailwindcss/no-restricted-classes': ['error', { restrict: TAILWIND_RESTRICTIONS }],
  'fin/no-outline-none-with-ring': 'error',
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
    plugins: { 'better-tailwindcss': betterTailwindcss, fin: finPlugin },
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
