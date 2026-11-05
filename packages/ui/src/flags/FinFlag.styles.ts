/*
 * FinFlag classes (DESIGN.md §9, §3.11). The box is sized from the Size-* tokens before the artwork loads, so nothing
 * moves. The artwork is an <img> that fills the box at its own ratio (4:3 or 1:1), so it's never distorted or recolored.
 */
import type { FinFlagShape, FinFlagSize } from './FinFlag';

export const flag = 'fin:relative fin:inline-block fin:flex-none fin:overflow-hidden fin:align-middle';

/*
 * Sizes: Figma Flag sizes heights. Rectangle: 4:3, as the artwork (Small is 21.33 × 16, not Figma's stretched
 * 22 × 16; flag-w-* in tailwind.css), Radius-XS and a 1px border-subtle edge drawn over the artwork, as Figma, so white
 * flags stay visible on white. Circle: the square artwork rounded, no edge (as Figma).
 */
const edge = 'fin:rounded-xs fin:after:absolute fin:after:inset-none fin:after:rounded-xs fin:after:inset-ring fin:after:inset-ring-subtle fin:after:pointer-events-none';
export const shape: Record<FinFlagShape, Record<FinFlagSize, string>> = {
  rectangle: {
    xsmall: `fin:h-12 fin:flag-w-12 ${edge}`,
    small: `fin:h-16 fin:flag-w-16 ${edge}`,
    medium: `fin:h-24 fin:flag-w-24 ${edge}`,
    large: `fin:h-40 fin:flag-w-40 ${edge}`,
    xlarge: `fin:h-48 fin:flag-w-48 ${edge}`,
  },
  circle: {
    xsmall: 'fin:size-12 fin:rounded-full',
    small: 'fin:size-16 fin:rounded-full',
    medium: 'fin:size-24 fin:rounded-full',
    large: 'fin:size-40 fin:rounded-full',
    xlarge: 'fin:size-48 fin:rounded-full',
  },
};

/*
 * Disabled: the artwork is shown partly transparent (opacity 0.4, decided 19 Oct 2026). Its colors aren't changed,
 * and it works on light and dark backgrounds (Figma's light wash would look wrong in Dark).
 */
export const art = { enabled: 'fin:block fin:size-full fin:object-cover', disabled: 'fin:block fin:size-full fin:object-cover fin:opacity-40' };
