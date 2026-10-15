'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import styles from './FinIndicatorDot.module.css';

export interface FinIndicatorDotProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Figma `Type=Selected`: the wide brand pill. Otherwise `Type=Default`: the small dot. */
  selected?: boolean;
  /** Clickable: a button with a 24px-tall hit area around the dot. Otherwise a decorative dot. */
  interactive?: boolean;
}

/**
 * One position marker (Figma Indicator; DESIGN.md §9). **Internal** base of FinPageIndicator (§7.2 rule 4):
 * not exported from the package. All dot styles, including the clickable hit area and focus ring, live here.
 */
export const FinIndicatorDot = forwardRef<HTMLButtonElement, FinIndicatorDotProps>(function FinIndicatorDot(
  { selected = false, interactive = false, className, ...rest },
  ref,
) {
  const dot = <span className={styles.dot} data-selected={selected || undefined} />;
  if (!interactive) {
    return (
      <span className={className ? `${styles.static} ${className}` : styles.static} aria-hidden="true">
        {dot}
      </span>
    );
  }
  return (
    <button {...rest} ref={ref} type="button" className={className ? `${styles.hit} ${className}` : styles.hit}>
      {dot}
    </button>
  );
});
