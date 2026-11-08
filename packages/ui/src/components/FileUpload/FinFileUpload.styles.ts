/*
 * FinFileUpload classes (DESIGN.md §9.80, §3.11; Figma File uploads `775:4280`). A dashed 1px box on bg-primary,
 * Radius-L, Space-XL padding and gaps (the border comes out of the padding: upload-padding in tailwind.css). Large: a
 * centred column (icon, progress bar when uploading, Text Box at most Size-343 wide, button). Small: a row (icon and
 * Text Box, the button on the right), the progress bar under it.
 *   enabled:   border-default     uploading: border-active
 *   complete:  border-strong      error:     border-error
 *   a file dragged over it (code first, decided 28 Oct 2026): border-active, bg-active
 *   disabled (code only): border-disabled
 */
import type { FinFileUploadSize } from './FinFileUpload';

const uploadBase = 'fin:flex fin:box-border fin:flex-col fin:gap-xl fin:w-full fin:upload-padding fin:border fin:border-dashed fin:rounded-l';

export const size: Record<FinFileUploadSize, string> = {
  large: `${uploadBase} fin:items-center`,
  small: `${uploadBase} fin:items-stretch`,
};

/* The border: disabled, else a file dragged over it, else the state. */
export const border = {
  enabled: 'fin:border-default',
  uploading: 'fin:border-active',
  complete: 'fin:border-strong',
  error: 'fin:border-error',
  dragging: 'fin:border-active',
  disabled: 'fin:border-disabled',
};

/* The fill: bg-active while a file is dragged over it. */
export const fill = { resting: 'fin:bg-primary', dragging: 'fin:bg-active' };

export const text = 'fin:w-full';

/* The Text Box's box: Large at most Size-343 wide; Small, beside the icon, takes the rest of the row. */
export const status: Record<FinFileUploadSize, string> = {
  large: 'fin:w-full fin:min-w-0 fin:max-w-343 fin:wrap-anywhere',
  small: 'fin:w-full fin:min-w-0 fin:wrap-anywhere fin:flex-1',
};

export const bar = 'fin:w-full';

export const row = 'fin:flex fin:gap-xl fin:items-center';

export const leading = 'fin:flex fin:flex-1 fin:gap-xl fin:items-start fin:min-w-0';

/* The picker behind Upload: hidden, as the button names and opens it. */
export const input = 'fin:sr-only';
