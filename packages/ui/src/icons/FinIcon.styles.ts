/*
 * FinIcon classes (DESIGN.md §6, §9, §3.11). Sizes are the Size-* tokens, not spacing, so they never move with the
 * spacing scale. The glyph settings (font, FILL) are named utilities in tailwind.css; the colour comes from the
 * `color` prop through --icon-color (set in FinIcon.tsx), or is inherited.
 */
import type { FinIconSize } from './FinIcon';

export const icon =
  'fin:inline-block fin:flex-none fin:overflow-hidden fin:not-italic fin:normal-case fin:whitespace-nowrap ' +
  'fin:select-none fin:antialiased fin:icon-color';

/* Outlined (FILL 0) by default, filled (FILL 1) for active or selected states. */
export const glyph = { outlined: 'fin:icon-glyph', filled: 'fin:icon-glyph-filled' };

export const size: Record<FinIconSize, string> = {
  16: 'fin:icon-16',
  20: 'fin:icon-20',
  24: 'fin:icon-24',
  36: 'fin:icon-36',
  48: 'fin:icon-48',
  64: 'fin:icon-64',
};
