/*
 * FinBadgeBase classes (DESIGN.md §9, §3.11). Icons are FinIcon with no color, so they inherit the label color. Tones
 * are the Badge-primary `State` colors (§9.10); FinBadge only passes `tone` and has no styles of its own. Figma's
 * inside stroke is an inset ring, so it never changes the size (no stroke on toneless fills).
 */
import type { FinBadgeTone } from './badgeTones';
import type { FinBadgeBaseSize } from './FinBadgeBase';

export const badge =
  'fin:inline-flex fin:flex-none fin:gap-xs fin:items-center fin:justify-center fin:max-w-full fin:py-xs fin:px-m fin:rounded-s';

/* Tones: fill, text (icons follow it) and the 1px inside stroke. Primary is Badge-base's own color. */
export const tone: Record<FinBadgeTone, string> = {
  primary: 'fin:bg-brand fin:text-white-both',
  secondary: 'fin:bg-transparent fin:text-secondary fin:inset-ring fin:inset-ring-strong',
  success: 'fin:bg-success-secondary fin:text-success fin:inset-ring fin:inset-ring-success',
  error: 'fin:bg-error-secondary fin:text-error fin:inset-ring fin:inset-ring-error',
  info: 'fin:bg-info-secondary fin:text-info fin:inset-ring fin:inset-ring-info',
  warning: 'fin:bg-warning-secondary fin:text-warning fin:inset-ring fin:inset-ring-warning',
  // A disabled look only (a badge isn't a control); its contrast is a documented exception (§9.10).
  disabled: 'fin:bg-disabled fin:text-disabled-on-bg',
  neutral: 'fin:bg-neutral fin:text-secondary',
};

/* Small fits its content (26); Large is a fixed 32 in Figma. */
export const size: Record<FinBadgeBaseSize, string> = {
  small: 'fin:font-label-small',
  large: 'fin:h-32 fin:font-label-medium',
};

/* One line, no fixed max width; "…" when the container is narrower (decided 15 Oct 2026). */
export const label = 'fin:min-w-0 fin:truncate';
