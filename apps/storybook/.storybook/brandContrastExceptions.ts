import type { FinBrand, FinTheme } from '@finspace-loyalty/tokens';

/**
 * Brand contrast exceptions (DESIGN.md §3.10 rule, §10): each one is a token pair for one brand and theme, accepted by
 * design, listed here with the elements that show it. They switch off **only** axe's `color-contrast` rule, **only** on
 * those elements, and **only** under `html[data-brand][data-theme]` for that brand and theme. Every other rule still
 * runs on them, and every other element, brand and theme is checked as before; a new failure still fails `test:a11y`.
 *
 * Non-text contrast (WCAG 1.4.11, the 3:1 rule for `fg-*` icons and borders) and hover states aren't checked by axe,
 * so their accepted exceptions are in DESIGN.md §10 only.
 *
 * A brand's list must be empty before it goes live (§3.10).
 */
interface BrandContrastException {
  brand: FinBrand;
  themes: FinTheme[];
  /** The token pair, as in DESIGN.md §10. */
  pair: string;
  /** The elements that show the pair; each is matched with its descendants (a button's label span). */
  elements: string[];
}

export const BRAND_CONTRAST_EXCEPTIONS: BrandContrastException[] = [
  {
    brand: 'sampath',
    themes: ['light'],
    pair: 'text-action on bg-primary, 2.76:1 (§10 #83)',
    elements: [
      // Secondary and Tertiary buttons (FinButtonBase), without a content tone.
      'button:is([data-variant="secondary"], [data-variant="tertiary"]):not([data-content-tone])',
      'a:is([data-variant="secondary"], [data-variant="tertiary"]):not([data-content-tone])',
      // Table link cells (FinTableCell `link`).
      'td[data-type="link"] a',
      // The side nav's current page (on bg-primary): a section without pages (FinSideNavItem), or a page
      // (FinSideNavSubItem: the only `a` with both attributes; pagination's current page is a button, and a list
      // link has no data-selected). axe's selectors don't support `~` or `+` (see below).
      'button[data-selected="item"]',
      'a[data-selected="item"]',
      'a[data-selected=""][aria-current="page"]',
      // The current step (FinStepper).
      'li[data-state="current"]',
      // The app shell's "Skip to content" link (FinAppShell); it has no data attribute of its own.
      'a[class*="_skip_"]',
    ],
  },
  {
    brand: 'sampath',
    themes: ['light'],
    pair: 'text-warning on bg-primary 2.57:1 and on bg-warning_secondary 2.51:1 (§10 #87)',
    // Warning badges (FinBadgeBase), helper text and banners, and a banner's Tertiary button (contentTone warning).
    // Matched by each component's hook (data-part, or its class until it's converted to Tailwind) as well as the
    // tone: Snackbar, IconContainer and the number badges (FinBadgeIndicator, `data-shape`) have warning tones on
    // other token pairs, and stay checked.
    elements: [
      '[data-part="badge"][data-tone="warning"]:not([data-shape])',
      '[data-part="helper"][data-tone="warning"]',
      '[data-part="banner"][data-tone="warning"]',
      'button[data-content-tone="warning"]',
    ],
  },
  {
    brand: 'sampath',
    themes: ['light', 'dark'],
    pair: 'text-white_both on bg-action-primary 2.76:1 (§10 #89), bg-brand 2.76:1 (§10 #90), bg-action-primary_hovered 3.30:1 (§10 #91)',
    // Primary buttons (FinButtonBase) and Primary badges (FinBadgeBase, on bg-brand).
    elements: ['button[data-variant="primary"]', 'a[data-variant="primary"]', '[data-part="badge"][data-tone="primary"]:not([data-shape])'],
  },
  {
    brand: 'sampath',
    themes: ['light'],
    pair: 'text-info on bg-info_secondary, 4.27:1 (§10 #97; clears when info moves to Violet, §10 #81)',
    // Info banners (title, text, the Focus areas rule list) and badges, and a banner's Tertiary button.
    elements: [
      '[data-part="badge"][data-tone="info"]:not([data-shape])',
      '[data-part="banner"][data-tone="info"]',
      'button[data-content-tone="info"]',
    ],
  },
  {
    brand: 'sampath',
    themes: ['dark'],
    pair: 'text-white_both on bg-action-destructive, 4.28:1 (§10 #98)',
    // Destructive buttons (FinButtonBase), in every remove dialog.
    elements: ['button[data-variant="destructive"]', 'a[data-variant="destructive"]'],
  },
  {
    brand: 'sampath',
    themes: ['light'],
    pair: 'text-action on bg-secondary, 2.50:1 (§10 #99)',
    // The side nav section that holds the current page (FinSideNavItem).
    elements: ['button[data-selected="sub-item"]', 'a[data-selected="sub-item"]'],
  },
  {
    brand: 'sampath',
    themes: ['light', 'dark'],
    pair: 'text-action on bg-active, Light 2.31:1 (§10 #100), Dark 3.71:1 (§10 #101)',
    // Selected chips (FinChipBase: assist, filter, input chips; the toolbar and Duration filters), the current page
    // in the pagination (FinPaginationItem), and a link in a selected table row (FinTableRow).
    elements: ['[data-variant="selected"]', 'button[data-selected][aria-current="page"]', 'tr[data-selected] a'],
  },
  {
    brand: 'sampath',
    themes: ['dark'],
    pair: 'text-tertiary on bg-tertiary, 4.00:1 (§10 #102, cross-brand: Finspace 4.09:1 under §10 #3)',
    // Grey table header titles (FinTableHeaderCell `grey`), as Finspace's exclusion.
    elements: ['th[data-type="grey"] [data-size]'],
  },
  // Number badges (FinBadgeIndicator `circle` / `pill`; the dot has no number). Same pairs as Finspace (§10 #3).
  {
    brand: 'sampath',
    themes: ['light'],
    pair: 'text-inverse on fg-warning, 1.56:1 (§10 #103, HIGH PRIORITY: fix before Sampath goes live)',
    elements: ['[data-tone="warning"]:is([data-shape="circle"], [data-shape="pill"])'],
  },
  {
    brand: 'sampath',
    themes: ['light'],
    pair: 'text-inverse on fg-success, 3.64:1 (§10 #104, cross-brand: §10 #3)',
    elements: ['[data-tone="success"]:is([data-shape="circle"], [data-shape="pill"])'],
  },
  {
    brand: 'sampath',
    themes: ['dark'],
    pair: 'text-inverse on fg-error, 3.98:1 (§10 #105, cross-brand: §10 #3)',
    elements: ['[data-tone="error"]:is([data-shape="circle"], [data-shape="pill"])'],
  },
  // Burgundy: the §10 #3 pairs Finspace accepted, hidden until 4 Nov 2026 because Finspace's story exclusions applied
  // to every brand (§10 #106–#109, cross-brand).
  {
    brand: 'burgundy',
    themes: ['light'],
    pair: 'text-inverse on fg-warning, 3.24:1 (§10 #106)',
    elements: ['[data-tone="warning"]:is([data-shape="circle"], [data-shape="pill"])'],
  },
  {
    brand: 'burgundy',
    themes: ['light'],
    pair: 'text-inverse on fg-success, 3.63:1 (§10 #107)',
    elements: ['[data-tone="success"]:is([data-shape="circle"], [data-shape="pill"])'],
  },
  {
    brand: 'burgundy',
    themes: ['dark'],
    pair: 'text-tertiary on bg-tertiary, 4.08:1 (§10 #108)',
    elements: ['th[data-type="grey"] [data-size]'],
  },
  {
    brand: 'burgundy',
    themes: ['dark'],
    pair: 'text-inverse on fg-error, 3.96:1 (§10 #109)',
    elements: ['[data-tone="error"]:is([data-shape="circle"], [data-shape="pill"])'],
  },
];

/** axe's `color-contrast` rule, run on every element except this brand's accepted exceptions. */
export const colorContrastSelector = (): string => {
  const excluded = BRAND_CONTRAST_EXCEPTIONS.flatMap(({ brand, themes, elements }) =>
    themes.flatMap((theme) =>
      elements.flatMap((element) => {
        const scoped = `html[data-brand="${brand}"][data-theme="${theme}"] ${element}`;
        return [scoped, `${scoped} *`];
      }),
    ),
  );
  // axe supports only part of CSS (no `~` or `+`): an unsupported selector matches nothing, which would switch the
  // rule off everywhere without an error. Fail loudly instead.
  if (excluded.some((s) => /[~+]/.test(s))) throw new Error('brandContrastExceptions: axe selectors cannot use ~ or +');
  return `*:not(${excluded.join(', ')})`;
};
