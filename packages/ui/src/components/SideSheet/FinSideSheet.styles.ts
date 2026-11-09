/*
 * FinSideSheet classes (DESIGN.md §9, §3.11). A native modal <dialog> filling the window (top layer), with FinOverlay
 * and the panel on the right edge. No shadow: the scrim separates it from the page (decided 26 Oct 2026). Width
 * (decided 26 Oct 2026): the last N columns of the window's layout grid plus the right margin, N stepping down as the
 * window grows (7 below 1280, 6, 5 from 1440, 4 from 1920), so it stays about 600 wide and its left edge is on a
 * column line (side-sheet-* in tailwind.css).
 */

/* The <dialog> itself: the browser's dialog styles reset; it only holds the overlay and the panel. */
export const dialog =
  'fin:fixed fin:inset-none fin:w-full fin:h-full fin:modal-fill fin:m-none fin:p-none fin:overflow-hidden ' +
  'fin:border-none fin:border-current fin:bg-transparent fin:backdrop:bg-transparent';

/* Focused only by the sheet when it opens, never by Tab: a container, not a control, so no ring. */
export const panel =
  'fin:side-sheet-columns fin:bp-lg:side-sheet-columns-6 fin:bp-xl:side-sheet-columns-5 fin:bp-xxl:side-sheet-columns-4 ' +
  'fin:absolute fin:inset-y-none fin:right-none fin:flex fin:flex-col fin:box-border fin:side-sheet-w fin:bg-primary ' +
  'fin:focus:outline-none';

/*
 * Back button, title, close button: Space-4XL above, Space-3XL at the sides, Space-XS apart. The buttons sit at the
 * top; a title as tall as a button or shorter is centred against them, a taller one (a heading and a description)
 * starts at the top with them (decided 26 Oct 2026, §10 #69).
 */
export const header = 'fin:flex fin:flex-none fin:gap-xs fin:items-start fin:pt-4xl fin:px-3xl fin:pb-none';

/* Figma `Title` slot: fills the row. */
export const title = 'fin:grid fin:flex-share fin:grid-cols-1 fin:items-center fin:min-w-0 fin:min-h-48';

/* Space-3XL above the line, over FinDivider's own margin: `placement:` (both in @layer fin). FinDivider is already flex-none. */
export const divider = 'fin:placement:mt-3xl';

/*
 * Figma `Body content slot`: Space-3XL at the sides and between items. The Space-3XL above and below are padding
 * inside the scrolling area, so content scrolls right up to the header and under the dock. Only focusable while it
 * scrolls (keyboard scrolling of text-only content).
 */
export const body =
  'fin:flex fin:flex-share fin:flex-col fin:gap-3xl fin:min-h-0 fin:p-3xl fin:overflow-y-auto ' +
  'fin:focus-visible:outline-2 fin:focus-visible:-outline-offset-2 fin:focus-visible:outline-focused';
