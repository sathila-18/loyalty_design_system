/*
 * FinSearchField classes (DESIGN.md §9.61, §3.11). The field is FinInputBase; this is only the clear button (cancel,
 * filled) in its trailing slot: no native look, the slot's icon colour. No hover or pressed design: cursor only. No
 * Focused design: the default ring, 2px border-focused, 2px out (§10 #6).
 */
export const clear =
  'fin:flex fin:items-center fin:justify-center fin:m-none fin:p-none fin:border-none fin:border-current fin:rounded-full ' +
  'fin:bg-transparent fin:text-inherit fin:cursor-pointer ' +
  'fin:focus-visible:outline-2 fin:focus-visible:outline-offset-2 fin:focus-visible:outline-focused';
