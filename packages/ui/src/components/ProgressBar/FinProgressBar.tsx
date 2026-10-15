import type { CSSProperties, HTMLAttributes } from 'react';
import styles from './FinProgressBar.module.css';

export type FinProgressBarSize = 'large' | 'small';

export interface FinProgressBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Progress, from 0 to `max` (clamped). Any value: Figma's `Filled` steps are only examples. */
  value: number;
  /** The value that means complete (default 100), so a screen can pass "3 of 5" or "120 of 300" as is. */
  max?: number;
  /** Figma `Size`: Large (8 tall) or Small (4 tall). */
  size?: FinProgressBarSize;
  /** Accessible name, for example "Profile completion". */
  label: string;
}

/**
 * A progress bar (Figma Progress bar; DESIGN.md §9). Public although it's the base of Progress-full: it's
 * also used on its own (§7.2 rule 4 exception, decided 15 Oct 2026). Fills the width of its container.
 */
export function FinProgressBar({ value, max = 100, size = 'large', label, className, style, ...rest }: FinProgressBarProps) {
  const total = max > 0 ? max : 100;
  const current = Math.min(Math.max(Number.isFinite(value) ? value : 0, 0), total);
  const percent = (current / total) * 100;
  return (
    <div
      {...rest}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={current}
      className={className ? `${styles.track} ${className}` : styles.track}
      style={{ ...style, '--progress': `${percent}%` } as CSSProperties}
      data-size={size}
    >
      <div className={styles.fill} />
    </div>
  );
}
