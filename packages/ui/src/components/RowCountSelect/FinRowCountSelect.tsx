'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import styles from './FinRowCountSelect.module.css';

export interface FinRowCountSelectProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'value'> {
  /** The rows shown per page (Figma's "10"). */
  value: number;
  /** The text before the value. Default "Rows per page:" (pass a translation for other languages). */
  label?: string;
  /** Whether the menu of row counts is open (announced; the menu comes with the List component). */
  expanded?: boolean;
}

/**
 * The table footer's rows-per-page control (Figma Row count dropdown; DESIGN.md §9): "Rows per page: 10" and a down
 * arrow in a pill. A native `<button>` that opens the menu of row counts, which is built once the List component
 * exists (decided 19 Oct 2026); until then it only shows the value and reports clicks. Figma `Property 1` =
 * Default / Hovered is runtime state (§7.3); press keeps the hover look. `ref` goes to the button.
 * **Internal:** part of the pagination (Table footer).
 */
export const FinRowCountSelect = forwardRef<HTMLButtonElement, FinRowCountSelectProps>(function FinRowCountSelect(
  { value, label = 'Rows per page:', expanded, type = 'button', className, ...rest },
  ref,
) {
  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      className={className ? `${styles.select} ${className}` : styles.select}
      aria-haspopup="listbox"
      {...(expanded !== undefined ? { 'aria-expanded': expanded } : {})}
    >
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
      <span className={styles.chevron}>
        <FinIcon name="keyboard_arrow_down" size={24} />
      </span>
    </button>
  );
});
