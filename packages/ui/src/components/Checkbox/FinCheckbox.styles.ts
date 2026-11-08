/*
 * FinCheckbox classes (DESIGN.md §9, §3.11). The row only: checkbox on the left, the Text Box beside it, top-aligned
 * (the 24px checkbox lines up with the first 24px line). Fills its container; the text wraps. The focus ring is the
 * checkbox's own (decided 19 Oct 2026).
 */
export const checkbox = 'fin:flex fin:gap-l fin:items-start';

/* The text takes the rest of the row (flex 1 1 0) and toggles the checkbox when clicked. */
export const text = {
  enabled: 'fin:grow fin:shrink fin:basis-0 fin:min-w-0 fin:cursor-pointer',
  disabled: 'fin:grow fin:shrink fin:basis-0 fin:min-w-0 fin:cursor-default',
};
