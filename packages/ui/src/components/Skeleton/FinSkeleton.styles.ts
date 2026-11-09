/*
 * FinSkeleton classes (DESIGN.md §9, §3.11; code first, decided 27 Oct 2026): a `bg-neutral` placeholder that pulses
 * (full to 60% opacity and back, 1.6 s; deeper looked washed out on white), still when motion is reduced. Text: 12
 * tall, Radius-XS; block: Radius-S; circle: round. `width` / `height` come from TSX as --skeleton-width /
 * --skeleton-height (skeleton-* in tailwind.css).
 */
import type { FinSkeletonShape } from './FinSkeleton';

const skeletonBase =
  'fin:inline-block fin:flex-none fin:max-w-full fin:bg-neutral fin:align-middle ' +
  'fin:animate-skeleton-pulse fin:motion-reduce:animate-none';

export const skeleton: Record<FinSkeletonShape, string> = {
  text: `${skeletonBase} fin:skeleton-w fin:skeleton-h fin:rounded-xs`,
  rect: `${skeletonBase} fin:skeleton-w fin:skeleton-h-rect fin:rounded-s`,
  circle: `${skeletonBase} fin:skeleton-w-circle fin:h-auto fin:rounded-full fin:aspect-square`,
};
