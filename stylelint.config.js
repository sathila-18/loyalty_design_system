// Stylelint (DESIGN.md §2, §3.8; CLAUDE.md "Tokens and styling").
// Base rules apply to all CSS. The token rules apply to every CSS Module: component CSS in
// packages/ui and the Storybook pages. Token files, fonts.css and reset.css are global CSS and
// aren't CSS Modules, so they're not covered (styles.css uses rgb() for the Figma shadows).

const PALETTE_OR_ALIAS = /--fin-(palette|color)-/;
const FONT_PART = /--fin-font-[a-z0-9-]+-(size|weight|line-height|family)(?![a-z0-9-])/;

/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard', 'stylelint-config-css-modules'],
  ignoreFiles: ['**/dist/**', '**/node_modules/**', '**/storybook-static/**', 'packages/ui/test/stylelint/**'],
  rules: {
    // The icon font must not fall back to a text font: the ligature names would show as words.
    'font-family-no-missing-generic-family-keyword': [true, { ignoreFontFamilies: ['Material Symbols Rounded'] }],
    'selector-class-pattern': [
      '^[a-z][a-zA-Z0-9]*$',
      { message: 'Use camelCase class names (CSS Modules: styles.sectionTitle)' },
    ],
  },
  overrides: [
    {
      files: ['**/*.module.css'],
      rules: {
        'color-no-hex': [true, { message: 'No hex colors. Use a semantic color (--fin-bg-*, --fin-text-*, --fin-border-*, --fin-fg-*, --fin-alpha-*)' }],
        'color-named': ['never', { message: 'No named colors. Use a semantic color (--fin-bg-*, --fin-text-*, --fin-border-*, --fin-fg-*, --fin-alpha-*)' }],
        'function-disallowed-list': [
          ['rgb', 'rgba', 'hsl', 'hsla', 'hwb', 'lab', 'lch', 'oklab', 'oklch', 'color', 'color-mix'],
          {
            message: (fn) =>
              fn === 'color-mix'
                ? 'No color-mix(). Use an alpha token (--fin-alpha-*); components never mix their own colors'
                : `No ${fn}() colors. Use a semantic color (--fin-bg-*, --fin-text-*, --fin-border-*, --fin-fg-*, --fin-alpha-*)`,
          },
        ],
        'declaration-property-value-disallowed-list': [
          { '/.*/': [PALETTE_OR_ALIAS, FONT_PART] },
          {
            message: (property, value) =>
              FONT_PART.test(value)
                ? `"${property}: ${value}" uses a typography part. Use the text style shorthand: font: var(--fin-font-<style>)`
                : `"${property}: ${value}" uses a palette or alias color. Use a semantic color (--fin-bg-*, --fin-text-*, --fin-border-*, --fin-fg-*, --fin-alpha-*)`,
          },
        ],
      },
    },
  ],
};
