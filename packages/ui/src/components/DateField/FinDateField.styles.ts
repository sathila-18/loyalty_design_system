/*
 * FinDateField classes (DESIGN.md §9.79, §3.11). The field is FinInputBase (with its mask); these are the calendar
 * button in its trailing slot and the browser's date input behind it, which opens the picker (invisible, no pointer).
 * The button: no native look, the slot's icon colour; no hover or pressed design: cursor only; the default focus ring,
 * 2px border-focused, 2px out (§10 #6).
 */
export const trailing = 'fin:relative fin:flex';

export const button =
  'fin:flex fin:items-center fin:justify-center fin:m-none fin:p-none fin:border-none fin:border-current fin:rounded-xs ' +
  'fin:bg-transparent fin:text-inherit fin:cursor-pointer fin:disabled:cursor-default ' +
  'fin:focus-visible:outline-2 fin:focus-visible:outline-offset-2 fin:focus-visible:outline-focused';

export const picker =
  'fin:absolute fin:inset-none fin:w-full fin:h-full fin:m-none fin:p-none fin:border-none fin:border-current fin:opacity-0 ' +
  'fin:pointer-events-none';
