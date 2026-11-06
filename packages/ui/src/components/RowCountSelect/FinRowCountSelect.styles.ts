/*
 * FinRowCountSelect classes (DESIGN.md §9, §3.11). A pill: the label (Body S, text-tertiary), the value (Label S,
 * text-primary) and a 24px down arrow (fg-secondary). Figma's 1px stroke is an inset ring, so it never changes the
 * size. Padding 4 / 12, 32 tall (was 8 / 12, 40; 29 Oct 2026). Hovered (Figma Property 1=Hovered): bg-tertiary;
 * press keeps the hover look (decided 19 Oct 2026). No Focused design: the default ring, 2px border-focused, 2px
 * out (§10 #6).
 */

export const select =
  'fin:inline-flex fin:flex-none fin:gap-m fin:items-center fin:m-none fin:py-xs fin:px-l fin:border-none fin:border-current ' +
  'fin:rounded-full fin:bg-secondary fin:whitespace-nowrap fin:inset-ring fin:inset-ring-subtle fin:cursor-pointer fin:hover:bg-tertiary ' +
  'fin:focus-visible:outline-2 fin:focus-visible:outline-offset-2 fin:focus-visible:outline-focused';

export const label = 'fin:text-tertiary fin:font-body-small';

export const value = 'fin:text-primary fin:font-label-small';

export const chevron = 'fin:inline-flex fin:fg-secondary';
