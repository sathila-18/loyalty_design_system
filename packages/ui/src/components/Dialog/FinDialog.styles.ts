/*
 * FinDialog classes (DESIGN.md §9, §3.11). A native modal <dialog> filling the window (top layer), with FinOverlay and
 * the panel centred on top. bg-primary, Radius-L, no shadow (it sits on the scrim). Width (decided 26 Oct 2026): N
 * columns of the window's layout grid, centred, N even so both edges are on column lines: 8 below 1280, 6 from 1280,
 * 4 from 1920 (643 / 604 / 684 / 608 at 1024 / 1280 / 1440 / 1920; Figma's 696 isn't on the grid). The height hugs
 * the content, at most the window less the grid margin above and below; past that the body scrolls (dialog-* in
 * tailwind.css).
 */

/* The <dialog> itself: the browser's dialog styles reset; it only holds the overlay and the panel. */
export const dialog =
  'fin:fixed fin:inset-none fin:w-full fin:h-full fin:modal-fill fin:m-none fin:p-none fin:overflow-hidden ' +
  'fin:border-none fin:border-current fin:bg-transparent fin:backdrop:bg-transparent';

/* Focused only by the dialog when it opens, never by Tab: a container, not a control, so no ring. */
export const panel =
  'fin:dialog-columns fin:bp-lg:dialog-columns-6 fin:bp-xxl:dialog-columns-4 fin:absolute fin:inset-none fin:flex ' +
  'fin:flex-col fin:box-border fin:dialog-w fin:h-fit fin:dialog-max-h fin:m-auto fin:rounded-l fin:bg-primary ' +
  'fin:focus:outline-none';

/*
 * The title and the close button: Space-XL above, Space-3XL at the sides, Space-3XL apart. Title only: Figma's
 * Space-3XL under the title row ends the dialog.
 */
const headerBase = 'fin:flex fin:flex-none fin:gap-3xl fin:items-center fin:pt-xl fin:px-3xl';

export const header = { more: `${headerBase} fin:pb-none`, last: `${headerBase} fin:pb-3xl` };

export const title = 'fin:flex-share fin:min-w-0';

/*
 * Figma `Slot`: Space-XL under the title row, Space-L between items. It scrolls when the dialog is as tall as the
 * window; the title and buttons stay. The Space-3XL above the buttons is the buttons' own padding, so it stays clear
 * while the body scrolls; with no buttons, the body ends with it. Only focusable while it scrolls (keyboard scrolling
 * of text-only content).
 */
const bodyBase =
  'fin:flex fin:flex-initial fin:flex-col fin:gap-l fin:min-h-0 fin:pt-xl fin:px-3xl fin:overflow-y-auto ' +
  'fin:focus-visible:outline-2 fin:focus-visible:-outline-offset-2 fin:focus-visible:outline-focused';

export const body = { more: `${bodyBase} fin:pb-none`, last: `${bodyBase} fin:pb-3xl` };

/* The buttons: the leading one on the left, the trailing ones on the right; Space-3XL around them. */
export const buttons = 'fin:flex fin:flex-none fin:gap-xl fin:items-center fin:p-3xl';

export const trailing = 'fin:flex fin:gap-l fin:ml-auto';
