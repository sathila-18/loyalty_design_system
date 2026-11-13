/*
 * FinDatePicker / FinDateRangePicker classes (DESIGN.md §9, §3.11). The box, label, ring and helper text are
 * FinInputBase's (variant Select), as FinSelectField; these style the button in place of the input: the date in
 * Body/Large text-primary (Body/Medium when Small), or the placeholder in text-placeholder. The whole box opens the
 * calendar (the ::after covers it).
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

const valueBase = 'fin:min-w-0 fin:truncate';

export const value = {
  chosen: valueBase,
  placeholder: `${valueBase} fin:text-placeholder fin:group-disabled/trigger:text-disabled fin:select-open:text-transparent`,
};
