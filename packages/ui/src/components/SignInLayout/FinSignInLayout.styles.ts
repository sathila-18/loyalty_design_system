/*
 * FinSignInLayout classes (DESIGN.md §9.84, §3.11). Code first: the sign-in screens (Figma screens file, Login Option
 * 02, 1920 × 1080) draw it each time. Two halves from 1024 (bp-md): the image panel on the left, inset 24 (Space-3XL,
 * the grid margin; Figma 28) from the top, left and bottom, Radius-XL (24); the form column on the right, centred.
 * Below 1024 the panel is hidden and the form is centred, up to Size-343, with a 16 (Space-XL) gutter.
 * The root is a size container, so the form's grid width (sign-in-form-width) is measured on the layout, not the window.
 */

export const layout = 'fin:@container fin:grid fin:min-h-dvh fin:bg-primary fin:bp-md:grid-cols-2';

export const panel =
  'fin:relative fin:hidden fin:flex-col fin:justify-end fin:overflow-hidden fin:rounded-xl ' +
  'fin:mt-3xl fin:mb-3xl fin:ml-3xl fin:mr-none fin:bp-md:flex';

/* The artwork fills the panel, cropped to cover it (the app's <img> or next/image `fill`). */
export const image = 'fin:absolute fin:inset-none fin:*:size-full fin:*:object-cover';

/* Figma `Rectangle 3`: a gradient up from the bottom, behind the text, so it reads on any artwork (raw in Figma). */
export const scrim = 'fin:absolute fin:inset-x-none fin:bottom-none fin:h-1/2 fin:sign-in-scrim';

/* Figma `Text Block - Dark` (another library): 48 (Space-7XL) from the panel's left, bottom and right edges, gap 8. */
export const text = 'fin:relative fin:flex fin:flex-col fin:gap-m fin:p-7xl';

export const title = 'fin:font-display-medium-h2 fin:text-white-both';

export const description = 'fin:font-body-large fin:text-white-both';

export const main = 'fin:flex fin:min-w-0 fin:items-center fin:justify-center fin:py-3xl fin:px-xl';

/* 4 of the 12 grid columns from 1024, never under Size-343 (decided 10 Nov 2026); below 1024, up to Size-343. */
export const form = 'fin:w-full fin:max-w-343 fin:bp-md:sign-in-form-width fin:bp-md:max-w-full';
