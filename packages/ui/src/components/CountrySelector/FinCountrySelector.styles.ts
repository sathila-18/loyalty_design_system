/*
 * FinCountrySelector classes (DESIGN.md §9, §3.11). The trigger only: a Small flag and a 24px down arrow. Figma binds
 * the gap to another library (Mobile/Component/icon-text, 8); code uses Space-M. 48 tall on its own, as Figma;
 * `size="small"` (code only, for the Small input field) has 8 above and below and a 20 arrow. Hover and focus design
 * come with the input field.
 */

/*
 * Temporary focus: the default ring, drawn inside so it won't clash with the field's border, until the input field's
 * focus design (CLAUDE.md: every interactive element shows focus).
 */
const selector =
  'fin:group/selector fin:inline-flex fin:flex-none fin:gap-m fin:items-center fin:m-none fin:pr-m fin:pl-xl ' +
  'fin:border-none fin:border-current fin:bg-transparent fin:cursor-pointer fin:disabled:cursor-default ' +
  'fin:focus-visible:outline-2 fin:focus-visible:-outline-offset-2 fin:focus-visible:outline-focused';

export const size: Record<'large' | 'small', string> = {
  large: `${selector} fin:py-l`,
  small: `${selector} fin:py-m`,
};

export const chevron = 'fin:inline-flex fin:fg-secondary fin:group-disabled/selector:fg-disabled';

/* The menu's "No countries found", under the search field (code first, 22 Oct 2026). Empty (no height) otherwise. */
export const empty = {
  found: 'fin:m-none fin:text-secondary fin:font-body-small',
  none: 'fin:mt-l fin:mx-none fin:mb-none fin:text-secondary fin:font-body-small',
};
