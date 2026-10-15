'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import styles from './FinToggle.module.css';

export type FinToggleSize = 'small' | 'large';

export interface FinToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'role' | 'children'> {
  /** Accessible name, visually hidden (decided 15 Oct 2026; Figma shows no label). */
  label: string;
  /** Figma `Size`: Small (40 × 24) or Large (56 × 32). */
  size?: FinToggleSize;
}

/**
 * An on/off switch (Figma Toggle, was Switch; DESIGN.md §9). A native checkbox with `role="switch"`, so
 * `checked` / `defaultChecked` / `onChange` / `disabled` work like any input, and `ref` goes to the input.
 * Figma `Type` = Selected/Unselected is `checked`; `State` and `Focused` are runtime states (§7.3).
 */
export const FinToggle = forwardRef<HTMLInputElement, FinToggleProps>(function FinToggle(
  { label, size = 'small', className, ...rest },
  ref,
) {
  return (
    <label className={className ? `${styles.toggle} ${className}` : styles.toggle} data-size={size}>
      <input {...rest} ref={ref} type="checkbox" role="switch" className={styles.input} />
      <span className={styles.track} aria-hidden="true">
        <span className={styles.handle} />
      </span>
      <span className={styles.label}>{label}</span>
    </label>
  );
});
