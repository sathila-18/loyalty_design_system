/*
 * FinPaginationItem classes (DESIGN.md §9, §3.11). A 32 × 32 square (at least 32 wide: longer numbers widen it),
 * padding Space-XS, Radius-S, a 1px stroke drawn inside (an inset ring, so it never changes the size). No animation (§5).
 */

export const item =
  'fin:inline-flex fin:flex-none fin:items-center fin:justify-center fin:min-w-32 fin:h-32 fin:m-none fin:p-xs ' +
  'fin:border-none fin:border-current fin:rounded-s';

/* No Focused design: the default ring, 2px border-focused, 2px out (§10 #6). */
const focus = 'fin:focus-visible:outline-2 fin:focus-visible:outline-offset-2 fin:focus-visible:outline-focused';

export const look = {
  // A page, Figma State=Default; State=Hovered on hover (press keeps the hover look, decided 19 Oct 2026).
  page:
    'fin:font-label-medium fin:bg-secondary fin:inset-ring fin:inset-ring-subtle fin:text-secondary fin:cursor-pointer ' +
    `fin:hover:bg-tertiary fin:hover:inset-ring-default fin:hover:text-primary ${focus}`,
  // Figma State=Selected, hovered or not (text-action on bg-active, 4.13:1 Light / 3.95:1 Dark: accepted by design, §10 #3).
  selected: `fin:font-label-medium fin:bg-active fin:inset-ring fin:inset-ring-active fin:text-action fin:cursor-pointer ${focus}`,
  // Figma State=Dots: "…" (one character, decided 19 Oct 2026), Label L, no fill or stroke.
  dots: 'fin:font-label-large fin:bg-transparent fin:text-secondary',
};
