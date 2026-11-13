/* FinLabel classes (DESIGN.md §9, §3.11). The dot is FinBadgeIndicator; these lay it out with the text. */
import type { FinLabelSize, FinLabelTone } from './FinLabel';

export const label = 'fin:relative fin:inline-flex fin:gap-m fin:items-center fin:max-w-full';

/* The text colour: Figma's text-tertiary, or text-secondary (code only, 13 Nov 2026) on tinted surfaces. */
export const tone: Record<FinLabelTone, string> = {
  default: 'fin:text-tertiary',
  secondary: 'fin:text-secondary',
};

export const size: Record<FinLabelSize, string> = {
  medium: 'fin:font-label-medium',
  small: 'fin:font-label-small',
};

/* One line, no fixed max width; "…" when the container is narrower (decided 15 Oct 2026, as Badge). */
export const text = 'fin:min-w-0 fin:truncate';

/* The badge's meaning, for screen readers only. */
export const hidden = 'fin:sr-only';
