import type { HTMLAttributes } from 'react';
import styles from './FinOnlineIndicator.module.css';

export type FinOnlineIndicatorSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

export interface FinOnlineIndicatorProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Figma `Size`: a 6, 8, 12, 16 or 24 px dot (plus a 1px ring outside it). */
  size?: FinOnlineIndicatorSize;
  /** Accessible name, so the status doesn't rely on color alone. */
  label?: string;
  /** Hidden from screen readers, when the status is announced elsewhere (for example in an avatar's name). */
  decorative?: boolean;
}

/** A green dot that shows someone is online (Figma Online Indicator; DESIGN.md §9). */
export function FinOnlineIndicator({
  size = 'medium',
  label = 'Online',
  decorative = false,
  className,
  ...rest
}: FinOnlineIndicatorProps) {
  return (
    <span
      {...rest}
      {...(decorative ? { 'aria-hidden': true as const } : { role: 'img', 'aria-label': label })}
      className={className ? `${styles.indicator} ${className}` : styles.indicator}
      data-size={size}
    />
  );
}
