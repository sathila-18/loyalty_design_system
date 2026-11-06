/*
 * FinSegmentBase classes (DESIGN.md §9, §3.11). The icon sits in its own span colored with the fg-* token (FinIcon
 * has no color, so it inherits it) and follows the button's state through group-*\/segment:; the label uses the
 * text-* token, as in Figma. No animation (§5). Disabled: never focusable, no hover or pressed.
 */
import type { FinSegmentBaseSize } from './FinSegmentBase';

/* No Focused design: the default ring, 2px border-focused, 2px out (§10 #6). */
export const segment =
  'fin:group/segment fin:inline-flex fin:items-center fin:justify-center fin:min-w-0 fin:max-w-full fin:m-none ' +
  'fin:border-none fin:border-current fin:cursor-pointer fin:disabled:cursor-default ' +
  'fin:focus-visible:outline-2 fin:focus-visible:outline-offset-2 fin:focus-visible:outline-focused';

/*
 * Sizes: medium is Figma's (padding Space-M / Space-3XL, Button/Medium, Radius-M, 40 tall). Code only (2 Nov 2026):
 * small (Space-XS / Space-L, Button/Small, Radius-S, 32 tall) and xsmall (0 / Space-M, Button/Small, Radius-S, 24
 * tall, for a menu row). Icon only: a square, the icon with Space-M all round (36), or Space-XS for small (28) and
 * xsmall (24, with a 16 icon).
 */
export const size: Record<FinSegmentBaseSize, { text: string; iconOnly: string }> = {
  medium: {
    text: 'fin:gap-m fin:py-m fin:px-3xl fin:rounded-m fin:font-button-medium',
    iconOnly: 'fin:relative fin:gap-m fin:p-m fin:rounded-m fin:font-button-medium',
  },
  small: {
    text: 'fin:gap-xs fin:py-xs fin:px-l fin:rounded-s fin:font-button-small',
    iconOnly: 'fin:relative fin:gap-xs fin:p-xs fin:rounded-s fin:font-button-small',
  },
  xsmall: {
    text: 'fin:gap-xs fin:py-none fin:px-m fin:rounded-s fin:font-button-small',
    iconOnly: 'fin:relative fin:gap-xs fin:p-xs fin:rounded-s fin:font-button-small',
  },
};

/*
 * Colours (Figma, 19 Oct 2026). Unselected: text-secondary; Hovered and Pressed only darken its text. Selected, the
 * white segment: bg-primary, text-primary; Hovered and Pressed darken its fill.
 */
export const look = {
  unselected: {
    segment:
      'fin:bg-transparent fin:text-secondary fin:enabled:hover:text-tertiary fin:enabled:active:text-primary fin:disabled:text-disabled',
    icon: 'fin:inline-flex fin:flex-none fin:fg-secondary fin:group-disabled/segment:fg-disabled',
  },
  selected: {
    segment:
      'fin:bg-primary fin:text-primary fin:enabled:hover:bg-secondary fin:enabled:active:bg-tertiary ' +
      'fin:disabled:bg-disabled fin:disabled:text-disabled-on-bg',
    icon: 'fin:inline-flex fin:flex-none fin:fg-secondary fin:group-disabled/segment:fg-disabled-on-bg',
  },
};

/* One line, no fixed max width; "…" when the segment is narrower. Icon only: the label stays, hidden, as its name. */
export const label = { shown: 'fin:min-w-0 fin:truncate', hidden: 'fin:sr-only' };
