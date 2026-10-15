import type { CSSProperties, HTMLAttributes } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import styles from './FinSpinner.module.css';

export type FinSpinnerStatus = 'progress' | 'success' | 'error';

export interface FinSpinnerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Figma `Pregress` 25/50/75% (`progress`), Success or Error. */
  status?: FinSpinnerStatus;
  /**
   * Progress, from 0 to `max` (clamped): a still ring whose arc is that share of the circle. Without it, the
   * spinner is a loader: a quarter arc spinning continuously (decided 15 Oct 2026).
   */
  value?: number;
  /** The value that means complete (default 100). */
  max?: number;
  /** Accessible name, for example "Uploading file" or "Upload complete". */
  label: string;
}

/**
 * A circular progress / loading indicator (Figma Spinner; DESIGN.md §9). Public although it's the base of
 * Progress-Spinner (§7.2 rule 4 exception, decided 15 Oct 2026).
 */
export function FinSpinner({ status = 'progress', value, max = 100, label, className, style, ...rest }: FinSpinnerProps) {
  const root = className ? `${styles.spinner} ${className}` : styles.spinner;

  if (status !== 'progress') {
    return (
      <div {...rest} role="img" aria-label={label} className={root} style={style} data-status={status}>
        <FinIcon name={status === 'success' ? 'check' : 'warning'} size={24} color={status === 'success' ? 'success' : 'error'} />
      </div>
    );
  }

  const total = max > 0 ? max : 100;
  const determinate = value !== undefined && Number.isFinite(value);
  const current = determinate ? Math.min(Math.max(value, 0), total) : undefined;
  const arc = current === undefined ? 25 : (current / total) * 100;

  return (
    <div
      {...rest}
      role="progressbar"
      aria-label={label}
      {...(current === undefined ? {} : { 'aria-valuemin': 0, 'aria-valuemax': total, 'aria-valuenow': current })}
      className={root}
      style={{ ...style, '--arc': arc } as CSSProperties}
      data-status="progress"
      data-spinning={current === undefined || undefined}
    >
      {/* The ring: an r=18 circle with a 4px stroke fills the 40px box, like Figma's 4px inside stroke. pathLength 100 makes the dash a percentage. */}
      <svg className={styles.ring} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
        <circle className={styles.track} cx="20" cy="20" r="18" pathLength={100} />
        <circle className={styles.arc} cx="20" cy="20" r="18" pathLength={100} />
      </svg>
    </div>
  );
}
