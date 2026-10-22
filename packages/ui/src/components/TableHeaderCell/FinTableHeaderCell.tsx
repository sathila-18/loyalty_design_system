'use client';

import { forwardRef, type ReactNode, type ThHTMLAttributes } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import { FinCheckboxBase } from '../CheckboxBase';
import { FinLabel } from '../Label';
import { FinTableColumnFilter, type FinTableColumnFilterProps } from '../TableColumnFilter';
import styles from './FinTableHeaderCell.module.css';

export type FinTableHeaderCellType = 'white' | 'grey';

/** A column's sort: `none` (sortable, not sorted), `ascending` or `descending`. */
export type FinTableSortDirection = 'none' | 'ascending' | 'descending';

/** Clicking the title cycles none → ascending → descending → none (decided 22 Oct 2026). */
const NEXT_SORT: Record<FinTableSortDirection, FinTableSortDirection> = { none: 'ascending', ascending: 'descending', descending: 'none' };
const SORT_ICON = { none: 'unfold_more', ascending: 'arrow_upward', descending: 'arrow_downward' } as const;

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
  /** Figma `Show trailing icon`: a down arrow after the title. Display only, unless `filter` makes it the filter. */
  trailingIcon?: boolean;
  /**
   * Sortable (code first, 22 Oct 2026): the title becomes a button with a sort icon after it, and the header gets
   * `aria-sort`. Called with the next direction (none → ascending → descending → none).
   */
  sort?: FinTableSortDirection;
  onSortChange?: (sort: FinTableSortDirection) => void;
  /** Filterable (code first, 22 Oct 2026): the down arrow opens the column's filter menu. */
  filter?: Omit<FinTableColumnFilterProps, 'label'> & { label?: string };
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
    sort,
    onSortChange,
    filter,
    scope = 'col',
    className,
    ...rest
  },
  ref,
) {
  const title = typeof children === 'string' || typeof children === 'number' ? <FinLabel>{children}</FinLabel> : children;
  const text = typeof children === 'string' || typeof children === 'number' ? String(children) : '';
  const sortable = sort !== undefined;

  return (
    <th
      {...rest}
      ref={ref}
      scope={scope}
      data-type={type}
      aria-sort={sort === 'ascending' || sort === 'descending' ? sort : undefined}
      className={className ? `${styles.cell} ${className}` : styles.cell}
    >
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
        {sortable ? (
          // The title and its sort icon are one button; the icon is fg-secondary, purple once sorted.
          <button type="button" className={styles.sort} data-sorted={sort !== 'none' || undefined} onClick={() => onSortChange?.(NEXT_SORT[sort])}>
            <span className={styles.slot} data-hidden={showTitle ? undefined : ''}>
              {title}
            </span>
            <span className={styles.sortIcon}>
              <FinIcon name={SORT_ICON[sort]} size={20} />
            </span>
          </button>
        ) : (
          children !== undefined &&
          children !== null && (
            <span className={styles.slot} data-hidden={showTitle ? undefined : ''}>
              {title}
            </span>
          )
        )}
        {filter ? (
          <FinTableColumnFilter {...filter} label={filter.label ?? text} />
        ) : trailingIcon && (
          <span className={styles.trailing}>
            <FinIcon name="keyboard_arrow_down" size={24} />
          </span>
        )}
      </div>
    </th>
  );
});
