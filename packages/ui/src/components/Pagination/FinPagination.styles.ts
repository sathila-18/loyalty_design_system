/*
 * FinPagination classes (DESIGN.md §9, §3.11). The row (gap Space-M) and the previous / next arrows. Figma draws the
 * arrows as all-button (XSmall, Only Icon) with a grey 1px outline override, a look FinButton doesn't have; they're
 * drawn here (decided 19 Oct 2026: code only, no change to the approved buttons or to Figma).
 */
export const pagination = 'fin:inline-flex';

/* The list, each item a flex box. */
export const list = 'fin:flex fin:gap-m fin:items-center fin:m-none fin:p-none fin:list-none fin:*:flex';

/*
 * An arrow: 32 square, a 1px border-strong stroke inside, fg-primary. At the first / last page (Figma "Only one" and
 * the ends) it's disabled: fg-disabled with a border-disabled stroke. No hover or pressed design: cursor only. No
 * Focused design: the default ring, 2px border-focused, 2px out (§10 #6).
 */
export const arrow =
  'fin:inline-flex fin:items-center fin:justify-center fin:size-32 fin:m-none fin:p-s fin:border-none fin:border-current ' +
  'fin:rounded-s fin:bg-transparent fin:fg-primary fin:inset-ring fin:inset-ring-strong fin:cursor-pointer ' +
  'fin:disabled:fg-disabled fin:disabled:inset-ring-disabled fin:disabled:cursor-default ' +
  'fin:focus-visible:outline-2 fin:focus-visible:outline-offset-2 fin:focus-visible:outline-focused';
