/*
 * FinProgressBar classes (DESIGN.md §9, §3.11). Fills its container's width (Figma's fixed 311 is a mobile-era frame
 * width). The fill width comes from --progress, set on the element (progress-fill in tailwind.css). No animation:
 * motion is deferred (§5). Figma's fill radius is bound to another library ("Radius 4px", Tokens); mapped to Radius-XS.
 */
import type { FinProgressBarSize } from './FinProgressBar';

export const track = 'fin:w-full fin:overflow-hidden fin:rounded-xs fin:bg-active-hover';

export const size: Record<FinProgressBarSize, string> = {
  large: 'fin:h-8',
  small: 'fin:h-4',
};

export const fill = 'fin:progress-fill fin:h-full fin:rounded-xs fin:bg-fg-brand';
