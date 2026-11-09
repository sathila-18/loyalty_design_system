/*
 * FinAppShell classes (DESIGN.md §9, §3.11). Code only: the screens draw it each time (Programme Configuration,
 * 1920 × 1080). The page is bg-secondary (the side nav's); the side nav on the left, full height; the content panel 8
 * (Space-M) from the top, right and bottom, bg-primary, Radius-L, clipped. In the panel the header stays at the top
 * and only the content scrolls (decided 22 Oct 2026), padding 24 (Space-3XL) all round (36 above until 3 Nov 2026).
 * The content area is a column, so a page's content can fill the height left (a table's empty state, 27 Oct 2026).
 */

export const shell = 'fin:relative fin:flex fin:h-dvh fin:bg-secondary';

export const panel =
  'fin:flex fin:flex-auto fin:flex-col fin:min-w-0 fin:mt-m fin:mr-m fin:mb-m fin:ml-none fin:overflow-hidden fin:rounded-l fin:bg-primary';

/*
 * The content area is a tab stop (it scrolls on its own, so keyboard users must reach it to scroll it). Its ring shows
 * only with the keyboard, inside the panel.
 */
export const main =
  'fin:flex fin:flex-auto fin:flex-col fin:min-h-0 fin:p-3xl fin:overflow-auto fin:focus:outline-none ' +
  'fin:focus-visible:outline-2 fin:focus-visible:-outline-offset-2 fin:focus-visible:outline-focused';

/*
 * "Skip to content" (code first, §10 #63): the first thing Tab reaches. Hidden until focused (a clip, so it still
 * takes focus; skip-hidden in tailwind.css), then shown at the top left over the side nav: a bg-primary pill,
 * Label/Medium text-action, Shadow/Menu, the standard focus ring 2px out.
 */
export const skip =
  'fin:absolute fin:z-2 fin:top-m fin:left-m fin:py-m fin:px-xl fin:rounded-full fin:bg-primary fin:text-action ' +
  'fin:font-label-medium fin:no-underline fin:shadow-menu fin:skip-hidden ' +
  'fin:focus-visible:outline-2 fin:focus-visible:outline-offset-2 fin:focus-visible:outline-focused';
