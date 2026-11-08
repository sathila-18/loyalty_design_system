/* FinAvatarGroup classes (DESIGN.md §9, §3.11). The circles are FinAvatar; these only lay them out. */
import type { FinAvatarGroupSize } from './FinAvatarGroup';

export const group = 'fin:inline-flex fin:flex-none fin:items-start';

/*
 * Each avatar after the first overlaps the one before it and sits on top of it (later in the DOM). Raw −4/−8/−12 in
 * Figma, mapped to spacing tokens (approved 15 Oct 2026).
 */
export const overlap: Record<FinAvatarGroupSize, string> = {
  xsmall: 'fin:-ms-xs',
  medium: 'fin:-ms-m',
  xlarge: 'fin:-ms-l',
};
