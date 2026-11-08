/*
 * FinInputChip classes (DESIGN.md §9, §3.11). Only the ✕ button: no native look, it takes the chip's trailing color.
 * Its hit area reaches Space-XS past the icon on every side (24 for the 16px icon). No hover or pressed design:
 * cursor only. No Focused design: a 2px border-focused ring on the icon's edge (no offset), so it clears the label
 * even with the XSmall chip's 4px gap.
 */
export const remove =
  'fin:relative fin:inline-flex fin:m-none fin:p-none fin:border-none fin:border-current fin:rounded-full fin:bg-transparent fin:text-inherit ' +
  'fin:cursor-pointer fin:disabled:cursor-default fin:after:absolute fin:after:-inset-xs ' +
  'fin:focus-visible:outline-2 fin:focus-visible:outline-focused';
