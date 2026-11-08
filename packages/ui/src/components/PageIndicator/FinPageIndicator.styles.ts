/* FinPageIndicator classes (DESIGN.md §9, §3.11). The dots are FinIndicatorDot; these only lay them out. */

export const still = 'fin:inline-flex fin:flex-none fin:gap-xs fin:items-center';

/*
 * Clickable: each dot's 24px-tall hit area already holds 2px either side, so no gap; negative margins keep the
 * footprint the Figma size while the hit areas reach past it (page-indicator-hit-margins in tailwind.css).
 */
export const clickable = 'fin:inline-flex fin:flex-none fin:gap-none fin:items-center fin:page-indicator-hit-margins';
