/*
 * FinPasswordField classes (DESIGN.md §9.60, §3.11). The field is FinInputBase; this is only the eye button in its
 * trailing slot: no native look, it takes the slot's icon colour. No hover or pressed design: cursor only. No Focused
 * design: the default ring, 2px border-focused, 2px out (§10 #6); reaching it doesn't make the field Focused.
 */
export const toggle =
  'fin:flex fin:items-center fin:justify-center fin:m-none fin:p-none fin:border-none fin:border-current fin:rounded-xs ' +
  'fin:bg-transparent fin:text-inherit fin:cursor-pointer fin:disabled:cursor-default ' +
  'fin:focus-visible:outline-2 fin:focus-visible:outline-offset-2 fin:focus-visible:outline-focused';
