/*
 * FinEmptyState classes (DESIGN.md §9, §3.11). Figma Empty state: a centred column, no padding; the icon slot and the
 * Text Box Space-XL apart, the button Space-3XL below them. In code (decided 27 Oct 2026): it fills its container and
 * centres the column in it, across and down (when the container has a height); the column is 4 columns of the
 * window's layout grid wide (608 at 1920), never wider than the container (empty-state-* in tailwind.css). Figma's 711
 * is a drawing width.
 */

export const emptyState = 'fin:empty-state-column fin:flex fin:items-center fin:justify-center fin:box-border fin:w-full fin:h-full';

export const body = 'fin:flex fin:flex-col fin:gap-3xl fin:items-center fin:empty-state-w';

export const content = 'fin:flex fin:flex-col fin:gap-xl fin:items-center fin:w-full';

/* Figma's Text Box fills the width. */
export const text = 'fin:self-stretch';
