/*
 * FinSideNavSubItem classes (DESIGN.md §9, §3.11). Figma: padding 8 (Space-M) / 16 (Space-XL) / 8 / 40 (Space-6XL),
 * radius M, Label/Medium text-secondary. Default fill is the nav's own (Figma bg-secondary; transparent here, decided
 * 20 Oct 2026); Hovered bg-tertiary, Pressed bg-neutral, Selected bg-primary + text-action (no hover change). No
 * Focused design: a 2px border-focused ring inside the item (§10 #6).
 */

const item =
  'fin:flex fin:items-center fin:py-m fin:pr-xl fin:pl-6xl fin:rounded-m fin:font-label-medium fin:no-underline ' +
  'fin:focus-visible:outline-2 fin:focus-visible:-outline-offset-2 fin:focus-visible:outline-focused';

export const look = {
  default: `${item} fin:bg-transparent fin:text-secondary fin:hover:bg-tertiary fin:active:bg-neutral`,
  selected: `${item} fin:bg-primary fin:text-action`,
};

/* Tree (code only, 2 Nov 2026; the side nav's `variant="tree"`): the connected tree lines (sidenav-tree-lines in tailwind.css). */
export const tree = 'fin:sidenav-tree-lines';

/* One line, ending in "…" when it doesn't fit (decided 20 Oct 2026). */
export const label = 'fin:min-w-0 fin:truncate';
