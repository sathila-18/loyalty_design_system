'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import { FinListStandard } from '../ListStandard';
import { FinMenu } from '../Menu';
import styles from './FinRowCountSelect.module.css';
import { FIN_ROW_COUNT_OPTIONS } from './rowCountOptions';

export interface FinRowCountSelectProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'value'> {
  /** The rows shown per page (Figma's "10"). */
  value: number;
  /** The row counts in the menu. Default 10, 25, 50, 100. */
  options?: readonly number[];
  /** Called with the row count chosen in the menu. */
  onValueChange?: (value: number) => void;
  /** The text before the value. Default "Rows per page:" (pass a translation for other languages). */
  label?: string;
}

/**
 * The table footer's rows-per-page control (Figma Row count dropdown; DESIGN.md §9): "Rows per page: 10" and a down
 * arrow in a pill, a native `<button>` that opens a select menu (FinMenu `kind="select"`, as wide as the button) of
 * row counts; the current one is Selected, and choosing one closes it. Figma `Property 1` = Default / Hovered is
 * runtime state (§7.3); press keeps the hover look. `ref` goes to the button. **Internal:** part of the pagination
 * (Table footer).
 */
export const FinRowCountSelect = forwardRef<HTMLButtonElement, FinRowCountSelectProps>(function FinRowCountSelect(
  { value, options = FIN_ROW_COUNT_OPTIONS, onValueChange, label = 'Rows per page:', type = 'button', className, ...rest },
  ref,
) {
  return (
    <FinMenu
      kind="select"
      width="trigger"
      label={label.replace(/:\s*$/, '')}
      trigger={
        <button {...rest} ref={ref} type={type} className={className ? `${styles.select} ${className}` : styles.select}>
          <span className={styles.label}>{label}</span>
          <span className={styles.value}>{value}</span>
          <span className={styles.chevron}>
            <FinIcon name="keyboard_arrow_down" size={24} />
          </span>
        </button>
      }
    >
      {options.map((count) => (
        <FinListStandard
          key={count}
          as="li"
          size="small"
          behavior="option"
          divider={false}
          title={String(count)}
          selected={count === value}
          onClick={() => onValueChange?.(count)}
        />
      ))}
    </FinMenu>
  );
});
