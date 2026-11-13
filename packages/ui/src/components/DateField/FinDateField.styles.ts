/*
 * FinDateField classes (DESIGN.md §9.79, §3.11). The field is FinInputBase (with its mask); this is the calendar
 * button in its trailing slot, which opens FinCalendar in a FinMenu.
 * The button: no native look, the slot's icon colour; no hover or pressed design: cursor only; the default focus ring,
 * 2px border-focused, 2px out (§10 #6).
 */
export const button =
  'fin:flex fin:items-center fin:justify-center fin:m-none fin:p-none fin:border-none fin:border-current fin:rounded-xs ' +
  'fin:bg-transparent fin:text-inherit fin:cursor-pointer fin:disabled:cursor-default ' +
  'fin:focus-visible:outline-2 fin:focus-visible:outline-offset-2 fin:focus-visible:outline-focused';
