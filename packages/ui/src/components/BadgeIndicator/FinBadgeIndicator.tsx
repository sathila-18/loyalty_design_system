import type { HTMLAttributes } from 'react';
import styles from './FinBadgeIndicator.module.css';

export type FinBadgeIndicatorSize = 'small' | 'large';
export type FinBadgeIndicatorTone = 'error' | 'warning' | 'success';

export interface FinBadgeIndicatorProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /**
   * The number to show (Figma `Digits`). Without it: a dot. 1–9: a circle. 10 and up: a pill, capped at `max` ("99+").
   * 0 (or less) hides the badge (decided 15 Oct 2026).
   */
  count?: number;
  /** Highest number shown before "+" (default 99). */
  max?: number;
  /** Figma `Style` = Red / Yellow / Green (only changes colors, so `tone`, DESIGN.md §7.3). */
  tone?: FinBadgeIndicatorTone;
  /** Figma `Size`. */
  size?: FinBadgeIndicatorSize;
  /** Accessible text, for example "3 unread notifications". Without it, a count is read as the number and a dot is decorative. */
  label?: string;
}

/** A small count or dot (Figma Badge - indicator; DESIGN.md §9). */
export function FinBadgeIndicator({
  count,
  max = 99,
  tone = 'error',
  size = 'small',
  label,
  className,
  ...rest
}: FinBadgeIndicatorProps) {
  if (count !== undefined && count <= 0) return null;

  const text = count === undefined ? undefined : count > max ? `${max}+` : String(count);
  const shape = text === undefined ? 'dot' : text.length === 1 ? 'circle' : 'pill';
  const a11y = label ? { role: 'img', 'aria-label': label } : text === undefined ? { 'aria-hidden': true as const } : {};

  return (
    <span
      {...rest}
      {...a11y}
      className={className ? `${styles.badge} ${className}` : styles.badge}
      data-size={size}
      data-tone={tone}
      data-shape={shape}
    >
      {text}
    </span>
  );
}
