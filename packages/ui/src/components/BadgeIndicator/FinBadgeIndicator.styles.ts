/* FinBadgeIndicator classes (DESIGN.md §9, §3.11). */
import type { FinBadgeIndicatorSize, FinBadgeIndicatorTone } from './FinBadgeIndicator';

export const badge = 'fin:inline-flex fin:flex-none fin:items-center fin:justify-center fin:rounded-full fin:text-inverse fin:whitespace-nowrap';

export const tone: Record<FinBadgeIndicatorTone, string> = {
  error: 'fin:bg-fg-error',
  warning: 'fin:bg-fg-warning',
  success: 'fin:bg-fg-success',
};

/*
 * Shape × size. Digits=None: a dot. Digits=Single: a fixed circle, number centered. Digits=Double: a pill that fits
 * the number (Figma padding 2/4, raw, mapped to spacing).
 */
export const shape: Record<'dot' | 'circle' | 'pill', Record<FinBadgeIndicatorSize, string>> = {
  dot: { small: 'fin:font-caption-small fin:size-6', large: 'fin:font-caption-large fin:size-12' },
  circle: { small: 'fin:font-caption-small fin:size-16', large: 'fin:font-caption-large fin:size-20' },
  pill: { small: 'fin:font-caption-small fin:py-xxs fin:px-xs', large: 'fin:font-caption-large fin:py-xxs fin:px-xs' },
};
