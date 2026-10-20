'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { FinTableHeaderCell } from '../TableHeaderCell';
import styles from './FinTableHeaderRow.module.css';

export interface FinTableHeaderRowProps extends Omit<HTMLAttributes<HTMLTableRowElement>, 'children'> {
  /** Figma `Select Cell`: the first cell, Grey, with only the "select all" checkbox. Default on, as in Figma. */
  selectCell?: boolean;
  /** Whether the "select all" checkbox is ticked (controlled). Leave it out for an uncontrolled checkbox. */
  checked?: boolean;
  /** Some rows selected: the dash, announced as mixed. */
  indeterminate?: boolean;
  /** Called with the new value when the "select all" checkbox is clicked. */
  onCheckedChange?: (checked: boolean) => void;
  /** The checkbox's name for screen readers. Default "Select all rows". */
  checkboxLabel?: string;
  /** The select column's name for screen readers (hidden on screen, as in Figma). Default "Select". */
  selectTitle?: string;
  /** Figma `Cell Slot`: the column headers, as `FinTableHeaderCell`s. */
  children?: ReactNode;
}

/**
 * A table's header row (Figma Header row, was Title row; DESIGN.md §9): an optional select cell with the "select all"
 * checkbox, then the column header cells (Cell Slot), Grey in this project. A native `<tr>`, so it goes inside a
 * `<thead>`. The select cell shrinks to its checkbox (72 wide); the row has no width of its own (it fills the table)
 * and column widths are the table's (FinTable). `ref` goes to the `tr`.
 * **Internal:** part of the table.
 */
export const FinTableHeaderRow = forwardRef<HTMLTableRowElement, FinTableHeaderRowProps>(function FinTableHeaderRow(
  {
    selectCell = true,
    checked,
    indeterminate = false,
    onCheckedChange,
    checkboxLabel = 'Select all rows',
    selectTitle = 'Select',
    children,
    ...rest
  },
  ref,
) {
  return (
    <tr {...rest} ref={ref}>
      {selectCell && (
        <FinTableHeaderCell
          type="grey"
          showTitle={false}
          className={styles.select}
          indeterminate={indeterminate}
          checkboxLabel={checkboxLabel}
          {...(checked !== undefined ? { checked } : {})}
          {...(onCheckedChange ? { onCheckedChange } : {})}
        >
          {selectTitle}
        </FinTableHeaderCell>
      )}
      {children}
    </tr>
  );
});
