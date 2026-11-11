/*
 * FinMultiSelectField classes (DESIGN.md §9.85, §3.11). The box, label, ring and helper text are FinInputBase's
 * (variant Select), as FinSelectField. The button fills the rest of the row and its ::after covers the whole box, so a
 * click anywhere opens the menu; the chips row lies over it (z-1), letting clicks through except on the ✕ buttons
 * (multi-select-chips in tailwind.css). One row: the chips that fit, then a "+N" chip for the rest.
 */
import type { FinInputBaseSize } from '../InputBase';

const triggerBase =
  'fin:group/trigger fin:flex fin:flex-1 fin:items-center fin:min-w-0 fin:h-24 fin:m-none fin:p-none fin:border-none ' +
  'fin:border-current fin:outline-none fin:bg-transparent fin:text-primary fin:text-start fin:cursor-pointer ' +
  'fin:disabled:text-disabled fin:disabled:cursor-default fin:after:absolute fin:after:inset-none';

export const trigger: Record<FinInputBaseSize, string> = {
  large: `${triggerBase} fin:font-body-large`,
  small: `${triggerBase} fin:font-body-medium`,
};

/* The placeholder, as FinSelectField's: hidden while the menu is open or the button has keyboard focus. */
export const placeholder =
  'fin:min-w-0 fin:truncate fin:text-placeholder fin:group-disabled/trigger:text-disabled fin:select-open:text-transparent';

/* The chosen values, read with the field's name; the chips show them. */
export const valueText = 'fin:sr-only';

/*
 * The visible chips and the "+N" chip, 8 (Space-M) apart, on one row. The row is the value's 24 tall, as Figma: the
 * 26 chips stand 1 into the padding, so the box stays 48 (Small 40). It can shrink, so a single long chip truncates.
 */
export const chips =
  'fin:relative fin:z-1 fin:flex fin:flex-initial fin:items-center fin:gap-m fin:min-w-0 fin:h-24 fin:multi-select-chips';

/* A chip may shrink (its label ends in "…") when even one doesn't fit; FinChipBase sets flex-none, so `placement:`. */
export const chip = 'fin:placement:shrink fin:min-w-0';

/* A copy of every chip, laid out but not shown, to measure how many fit (inert, hidden from screen readers). */
export const measure = 'fin:absolute fin:invisible fin:flex fin:items-center fin:gap-m fin:whitespace-nowrap fin:pointer-events-none';

/* The menu's checkbox: shown, not used (the row is the option). */
export const optionCheck = 'fin:inline-flex fin:flex-none';

/* The search's "No results" status, as FinSelectField's. */
export const empty = {
  found: 'fin:m-none fin:text-secondary fin:font-body-small',
  none: 'fin:mt-l fin:mx-none fin:mb-none fin:text-secondary fin:font-body-small',
};
