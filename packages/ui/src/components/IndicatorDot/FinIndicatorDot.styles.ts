/* FinIndicatorDot classes (DESIGN.md §9, §3.11). Internal base of FinPageIndicator. */

/*
 * Type=Default: 6 × 6 fg-placeholder (Figma's raw radius 8 on a 6px shape is a full pill). Type=Selected: fg-brand
 * pill, 24 wide (22 in Figma; no Size-22, decided 15 Oct 2026). Focus ring on the visible dot, when it's clickable:
 * 2px, 2px offset (§10 #6).
 */
const focus = 'fin:group-focus-visible/hit:outline-2 fin:group-focus-visible/hit:outline-offset-2 fin:group-focus-visible/hit:outline-focused';
export const dot = {
  default: `fin:block fin:size-6 fin:rounded-full fin:bg-fg-placeholder ${focus}`,
  selected: `fin:block fin:w-24 fin:h-6 fin:rounded-full fin:bg-fg-brand ${focus}`,
};

export const still = 'fin:block fin:flex-none';

/*
 * Clickable: a 24px-tall hit area, as wide as the dot plus the 2px either side that the set's 4px gap leaves. Hover
 * and pressed have no design yet: cursor only (decided 15 Oct 2026, like the Profile image badge).
 */
export const hit =
  'fin:group/hit fin:flex fin:flex-none fin:items-center fin:justify-center fin:h-24 fin:py-none fin:px-xxs ' +
  'fin:border-none fin:border-current fin:bg-transparent fin:cursor-pointer fin:focus-visible:outline-none';
