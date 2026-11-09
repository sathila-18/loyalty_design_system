/*
 * FinSnackbar classes (DESIGN.md §9, §3.11). Figma Snackbar: radius Radius-M, no padding of its own. Single line: 48
 * tall, the icon and message Space-XL from the left, Space-M apart; the buttons on the right, Space-XS from the edge.
 * Two lines: the icon and message with Space-XL above and at the sides, the buttons on a row below, Space-XS from the
 * right and bottom, Space-M between the rows. Neutral is bg-direct with inverse text and icons; the others are
 * bg-*-secondary with text-primary and the status icon. As wide as its content, up to the region's width (decided 27
 * Oct 2026; Figma 343). It slides in (animate-snackbar-in in tailwind.css), still when motion is reduced.
 */
import type { FinSnackbarTone } from './FinSnackbar';

type FinSnackbarLines = 'single' | 'two';

const snackbarBase =
  'fin:flex fin:gap-m fin:box-border fin:w-fit fin:max-w-full fin:min-h-48 fin:rounded-m fin:pointer-events-auto ' +
  'fin:animate-snackbar-in fin:motion-reduce:animate-none';

const layoutBase: Record<FinSnackbarLines, string> = {
  single: `${snackbarBase} fin:items-center`,
  two: `${snackbarBase} fin:flex-col fin:items-stretch`,
};

export const snackbar: Record<FinSnackbarLines, Record<FinSnackbarTone, string>> = {
  single: {
    neutral: `${layoutBase.single} fin:bg-direct fin:text-inverse`,
    success: `${layoutBase.single} fin:bg-success-secondary fin:text-primary`,
    warning: `${layoutBase.single} fin:bg-warning-secondary fin:text-primary`,
    error: `${layoutBase.single} fin:bg-error-secondary fin:text-primary`,
  },
  two: {
    neutral: `${layoutBase.two} fin:bg-direct fin:text-inverse`,
    success: `${layoutBase.two} fin:bg-success-secondary fin:text-primary`,
    warning: `${layoutBase.two} fin:bg-warning-secondary fin:text-primary`,
    error: `${layoutBase.two} fin:bg-error-secondary fin:text-primary`,
  },
};

/*
 * Icon and message. Space-L above and below keep a wrapped message clear of the edges (Figma: one line in 48). Without
 * buttons, the message keeps Space-XL from the right edge too (and, on two lines, from the bottom).
 */
const leadBase = 'fin:flex fin:flex-auto fin:gap-m fin:min-w-0';

export const lead: Record<FinSnackbarLines, { trailing: string; alone: string }> = {
  single: {
    trailing: `${leadBase} fin:items-center fin:py-l fin:ps-xl`,
    alone: `${leadBase} fin:items-center fin:py-l fin:px-xl`,
  },
  two: {
    trailing: `${leadBase} fin:items-start fin:pt-xl fin:px-xl fin:pb-none`,
    alone: `${leadBase} fin:items-start fin:p-xl`,
  },
};

/* FinIcon is already flex-none. */
export const message = 'fin:flex-auto fin:min-w-0 fin:m-none fin:wrap-break-word fin:font-body-medium';

const trailingBase = 'fin:flex fin:flex-none fin:items-center fin:pe-xs';

export const trailing: Record<FinSnackbarLines, string> = {
  single: trailingBase,
  two: `${trailingBase} fin:justify-end fin:pb-xs`,
};

/*
 * FinSnackbarRegion: the top right of the window, Space-3XL (the grid margin) from the top and right, 3 columns of the
 * layout grid wide but at least Size/343, Figma's width (decided 27 Oct 2026, §10 #73; snackbar-region-* in
 * tailwind.css). A manual popover, so it's in the top layer: the browser's popover styles are reset here. Clicks go
 * through it, except on the snackbars.
 */
export const region =
  'fin:snackbar-region-column fin:snackbar-region-place fin:snackbar-region-w fin:fixed fin:flex fin:flex-col-reverse ' +
  'fin:gap-m fin:items-end fin:box-border fin:h-auto fin:m-none fin:p-none fin:overflow-visible fin:border-none ' +
  'fin:border-current fin:bg-transparent fin:text-inherit fin:pointer-events-none';
