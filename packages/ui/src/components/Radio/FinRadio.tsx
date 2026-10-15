'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import styles from './FinRadio.module.css';

export interface FinRadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'children'> {
  /** Accessible name, visually hidden (decided 15 Oct 2026; visible labels will come from the List component). */
  label: string;
}

/**
 * A radio button (Figma Base-Radio_box; DESIGN.md §9). Public despite the "Base" name: nothing in Figma is
 * mapped from it (§7.2 rule 4 exception, decided 15 Oct 2026). A native `<input type="radio">`, so `name`,
 * `value`, `checked` / `defaultChecked`, `onChange` and `disabled` work like any radio, and radios that share a
 * `name` get the browser's arrow-key behaviour. Figma `Type` = Selected/Unselected is `checked`; `State`
 * (Hovered, Pressed, Disabled) is runtime state (§7.3). `ref` goes to the input.
 */
export const FinRadio = forwardRef<HTMLInputElement, FinRadioProps>(function FinRadio({ label, className, ...rest }, ref) {
  return (
    <label className={className ? `${styles.radio} ${className}` : styles.radio}>
      <input {...rest} ref={ref} type="radio" className={styles.input} />
      <span className={styles.ring} aria-hidden="true">
        <span className={styles.dot} />
      </span>
      <span className={styles.label}>{label}</span>
    </label>
  );
});
