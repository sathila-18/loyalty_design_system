/*
 * FinSpinner classes (DESIGN.md §9, §3.11). A 48px box; the progress ring is 40px inside it, Success/Error fill it (as
 * Figma). The ring starts at 12 o'clock and runs clockwise (decided 15 Oct 2026); the arc is --arc of 100, set from
 * TSX (spinner-start, spinner-arc in tailwind.css).
 */
import type { FinSpinnerStatus } from './FinSpinner';

export const spinner = 'fin:inline-flex fin:flex-none fin:items-center fin:justify-center fin:size-48 fin:rounded-full';

export const status: Record<FinSpinnerStatus, string> = {
  progress: '',
  success: 'fin:bg-success-secondary',
  error: 'fin:bg-error-secondary',
};

/*
 * Loading (no value): the arc spins clockwise, one turn per second at a steady speed (decided 15 Oct 2026; the first
 * animation, raw duration until motion tokens exist, §5). Still for people who prefer reduced motion.
 */
export const ring = { still: 'fin:size-40 fin:spinner-start', spinning: 'fin:size-40 fin:spinner-start fin:animate-spinner-turn fin:motion-reduce:animate-none' };

export const track = 'fin:fill-none fin:stroke-4 fin:stroke-bg-active-hover';

/* Figma's arc has flat ends (cap: none). */
export const arc = 'fin:fill-none fin:stroke-4 fin:stroke-fg-brand fin:spinner-arc';
