/*
 * FinSelectField classes (DESIGN.md §9.72, §3.11). The box, label, ring and helper text are FinInputBase's (variant
 * Select); these style the button in place of the input. The value is Body/Large text-primary, the placeholder
 * text-placeholder, as the input (Body/Medium when Small); the whole box opens the menu (the ::after covers it).
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

/*
 * The chosen option, one line with "…"; or the placeholder: text-placeholder (disabled text-disabled), hidden while the
 * menu is open or the trigger has keyboard focus, as the input's (select-open in tailwind.css).
 */
const valueBase = 'fin:min-w-0 fin:truncate';

export const value = {
  selected: valueBase,
  placeholder: `${valueBase} fin:text-placeholder fin:group-disabled/trigger:text-disabled fin:select-open:text-transparent`,
};

/* The search's "No results" status: there even when empty (for screen readers), Space-L below the search when shown. */
export const empty = {
  found: 'fin:m-none fin:text-secondary fin:font-body-small',
  none: 'fin:mt-l fin:mx-none fin:mb-none fin:text-secondary fin:font-body-small',
};
