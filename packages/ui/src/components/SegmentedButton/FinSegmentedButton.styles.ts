/*
 * FinSegmentedButton classes (DESIGN.md §9, §3.11). The track only; every segment look and state is FinSegmentBase's.
 * Fills its container (Figma draws it 343 wide); the segments share the width equally. Icon only (code only, 2 Nov
 * 2026): as wide as the segments, not the container.
 */
import type { FinSegmentedButtonSize } from './FinSegmentedButton';

export const display = { fill: 'fin:flex', iconOnly: 'fin:inline-flex' };

/*
 * Sizes: medium is Figma's (gap Space-L, padding Space-XS, Radius-L). Small (code only, 2 Nov 2026): gap Space-XS,
 * Radius-M (the segment's Radius-S + the Space-XS padding). XSmall (code only): the segments flush, the track only
 * their background; Radius-S as the segments.
 */
export const size: Record<FinSegmentedButtonSize, string> = {
  medium: 'fin:gap-l fin:p-xs fin:rounded-l',
  small: 'fin:gap-xs fin:p-xs fin:rounded-m',
  xsmall: 'fin:gap-none fin:p-none fin:rounded-s',
};

/* Figma State=Disabled: no fill, a 1px border-disabled stroke inside. */
export const fill = { enabled: 'fin:bg-tertiary', disabled: 'fin:bg-transparent fin:inset-ring fin:inset-ring-disabled' };

/* Each segment's share of the width (flex 1 1 0), or its own width when icon only. */
export const segment = { fill: 'fin:grow fin:shrink fin:basis-0', iconOnly: 'fin:flex-none' };
