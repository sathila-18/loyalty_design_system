import type { HTMLAttributes } from 'react';
import styles from './FinDivider.module.css';

export type FinDividerType = 'divider' | 'section-divider';
export type FinDividerOrientation = 'horizontal' | 'vertical';

export interface FinDividerProps extends Omit<HTMLAttributes<HTMLHRElement>, 'children'> {
  /** Figma `Type`: a 1px line (`divider`) or an 8px band between sections (`section-divider`). */
  type?: FinDividerType;
  /** `vertical` isn't in Figma (added 15 Oct 2026). It stretches to the height of its flex row. */
  orientation?: FinDividerOrientation;
  /** Only visual: hidden from screen readers instead of being announced as a separator. */
  decorative?: boolean;
}

/** A separator line or band (Figma Divider; DESIGN.md §9). */
export function FinDivider({
  type = 'divider',
  orientation = 'horizontal',
  decorative = false,
  className,
  ...rest
}: FinDividerProps) {
  return (
    <hr
      {...rest}
      className={className ? `${styles.divider} ${className}` : styles.divider}
      data-type={type}
      data-orientation={orientation}
      {...(decorative
        ? { 'aria-hidden': true }
        : orientation === 'vertical'
          ? { 'aria-orientation': 'vertical' as const }
          : {})}
    />
  );
}
