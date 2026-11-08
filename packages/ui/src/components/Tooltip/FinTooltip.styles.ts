/*
 * FinTooltip classes (DESIGN.md §9, §3.11). Figma Plain Tooltip, Look=Black: bg-direct, text-inverse, Radius-S (8),
 * no arrow, no shadow, at least 24 tall. Shown in the top layer (popover) where Floating UI places it (tooltip-place
 * in tailwind.css, which also holds the --tooltip-gap / --tooltip-edge FinTooltip.tsx reads), never past the window.
 * Until Floating UI has placed it (one frame) it's kept out of sight. No animation (§5).
 */
import type { FinTooltipType } from './FinTooltip';

const tooltip =
  'fin:fixed fin:tooltip-place fin:flex fin:flex-col fin:justify-center fin:box-border fin:min-h-24 fin:m-none ' +
  'fin:px-xl fin:overflow-visible fin:border-none fin:border-current fin:rounded-s fin:bg-direct fin:text-inverse ' +
  'fin:font-caption-large fin:wrap-break-word fin:hidden-attr:hidden fin:not-data-positioned:invisible';

/*
 * Single line: 8 (Space-M) above and below, 16 (Space-XL) at the sides, Caption L; one line up to 343 (Size-343) of
 * text, then it wraps (decided 3 Nov 2026). Rich: 12 (Space-L) above and below, a 343 wide Text Box (H6, inverse).
 */
export const type: Record<FinTooltipType, string> = {
  'single-line': `${tooltip} fin:w-max fin:tooltip-max-w fin:py-m`,
  rich: `${tooltip} fin:tooltip-rich-w fin:tooltip-max-w fin:py-l`,
};

export const textBox = 'fin:w-full';
