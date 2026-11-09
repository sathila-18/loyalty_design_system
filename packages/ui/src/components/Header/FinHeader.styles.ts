/*
 * FinHeader classes (DESIGN.md §9, §3.11). Fills its container (Figma's 1368 is only a drawing frame); the height
 * comes from the padding and content. The bottom line's width is bound to Space-XS in Figma (header-line in
 * tailwind.css: a border width from a space token).
 */

export const header =
  'fin:flex fin:gap-xl fin:items-center fin:w-full fin:py-l fin:px-3xl fin:header-line fin:rounded-t-l fin:bg-primary';

/* The back button and the text. */
export const main = 'fin:flex fin:flex-share fin:gap-l fin:items-center fin:min-w-0';

/* The title, then the body content 4 below (Figma `text content`). */
export const text = 'fin:flex fin:flex-share fin:flex-col fin:gap-xs fin:justify-center fin:min-w-0';

/* Figma `body content` slot. */
export const body = 'fin:flex fin:flex-col fin:items-start fin:w-full';
