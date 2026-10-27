import type { CSSProperties, HTMLAttributes } from 'react';
import styles from './FinSkeleton.module.css';

/** The placeholder's shape: a line of text, a block, or a circle (an avatar, an icon). */
export type FinSkeletonShape = 'text' | 'rect' | 'circle';

export interface FinSkeletonProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Default `text`: 12 tall (`Size-12`), as wide as its container, `Radius-XS`. */
  shape?: FinSkeletonShape;
  /** Any CSS width (a number is px). Default: the container's width (`text`, `rect`) or 24 (`circle`). */
  width?: number | string;
  /** Any CSS height (a number is px). Default: 12 (`text`), 24 (`rect`, `circle`). A circle's height is its width. */
  height?: number | string;
}

const size = (value: number | string) => (typeof value === 'number' ? `${value}px` : value);

/**
 * A grey placeholder shown where content is loading (code first, no Figma; DESIGN.md §9): `bg-neutral`, pulsing
 * gently, still when motion is reduced. Hidden from screen readers: the area that's loading says so (`aria-busy`
 * and a "Loading …" status, as FinTable `loading` does).
 */
export function FinSkeleton({ shape = 'text', width, height, className, style, ...rest }: FinSkeletonProps) {
  const sizes = {
    ...(width !== undefined ? { '--skeleton-width': size(width) } : {}),
    ...(height !== undefined && shape !== 'circle' ? { '--skeleton-height': size(height) } : {}),
  } as CSSProperties;
  return (
    <span
      {...rest}
      aria-hidden="true"
      className={className ? `${styles.skeleton} ${className}` : styles.skeleton}
      data-shape={shape}
      style={{ ...sizes, ...style }}
    />
  );
}
