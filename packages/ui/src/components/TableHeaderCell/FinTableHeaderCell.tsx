'use client';

import { forwardRef, type ReactNode, type ThHTMLAttributes } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import { FinCheckboxBase } from '../CheckboxBase';
import { FinLabel } from '../Label';
import styles from './FinTableHeaderCell.module.css';

export type FinTableHeaderCellType = 'white' | 'grey';

export interface FinTableHeaderCellProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, 'children'> {
  /** Figma `Type`: White (no fill) or Grey (`bg-tertiary`). Default white. */
  type?: FinTableHeaderCellType;
  /** Figma `Show checkbox`: the "select all" checkbox before the title. Default on, as in Figma. */
  checkbox?: boolean;
  /** Whether the checkbox is ticked (controlled). Leave it out for an uncontrolled checkbox. */
  checked?: boolean;
  /** Some rows selected: the dash, announced as mixed. */
  indeterminate?: boolean;
  /** Called with the new value when the checkbox is clicked. */
  onCheckedChange?: (checked: boolean) => void;
  /** The checkbox's name for screen readers. Default "Select all rows". */
  checkboxLabel?: string;
  /** Figma `Show title`. Off hides the title on screen; screen readers still read it as the column's name. Default on. */
  showTitle?: boolean;
  /** Figma Slot: the column title. Text is shown as Label/Medium (one line, "…" when narrow); other content as given. */
  children?: ReactNode;
  /** Figma `Show trailing icon`: a down arrow after the title. Display only for now (sort / filter later, §10). */
  trailingIcon?: boolean;
}

/**
 * A table column header (Figma Table header cell; DESIGN.md §9): an optional "select all" checkbox, the title (Slot)
 * and an optional down arrow, 48 tall. A native `<th scope="col">`, so it goes inside a table row. No hover or other
 * states of its own (decided 19 Oct 2026); the checkbox keeps its own. `ref` goes to the `th`.
 * **Internal:** part of the table.
 */
export const FinTableHeaderCell = forwardRef<HTMLTableCellElement, FinTableHeaderCellProps>(function FinTableHeaderCell(
  {
    type = 'white',
    checkbox = true,
    checked,
    indeterminate = false,
    onCheckedChange,
    checkboxLabel = 'Select all rows',
    showTitle = true,
    children,
    trailingIcon = false,
    scope = 'col',
    className,
    ...rest
  },
  ref,
) {
  const title = typeof children === 'string' || typeof children === 'number' ? <FinLabel>{children}</FinLabel> : children;

  return (
    <th {...rest} ref={ref} scope={scope} data-type={type} className={className ? `${styles.cell} ${className}` : styles.cell}>
      <div className={styles.content}>
        {checkbox && (
          <FinCheckboxBase
            label={checkboxLabel}
            indeterminate={indeterminate}
            {...(checked !== undefined ? { checked } : {})}
            {...(onCheckedChange ? { onChange: (event) => onCheckedChange(event.target.checked) } : {})}
            {...(checked !== undefined && !onCheckedChange ? { readOnly: true } : {})}
          />
        )}
        {children !== undefined && children !== null && (
          <span className={styles.slot} data-hidden={showTitle ? undefined : ''}>
            {title}
          </span>
        )}
        {trailingIcon && (
          <span className={styles.trailing}>
            <FinIcon name="keyboard_arrow_down" size={24} />
          </span>
        )}
      </div>
    </th>
  );
});
