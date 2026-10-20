'use client';

import { forwardRef, type HTMLAttributes, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { FinTableCell } from '../TableCell';
import styles from './FinTableRow.module.css';

/** Clicks on these do their own job (checkbox, link, action button…), so they don't also trigger `onRowClick`. */
const INTERACTIVE = 'a, button, input, select, textarea, label, [role="button"], [role="link"], [tabindex]';

export interface FinTableRowProps extends Omit<HTMLAttributes<HTMLTableRowElement>, 'children'> {
  /** Figma `State=Selected`: the row's selected fill, and its checkbox ticked. Hovered is CSS. Default false. */
  selected?: boolean;
  /** Called with the new value when the row checkbox is clicked. */
  onSelectedChange?: (selected: boolean) => void;
  /** Figma `Select Cell`: the first cell, with only the row checkbox. Default on, as in Figma. */
  selectCell?: boolean;
  /** The row checkbox's name for screen readers; pass the row's name ("Select Ann Perera"). Default "Select row". */
  checkboxLabel?: string;
  /**
   * Called when the row itself is clicked, or focused and Enter is pressed, for example to open a side sheet with
   * the details. Clicks on the checkbox, links and action buttons do their own job instead. Leave it out for a row
   * that only shows data (not focusable, no pointer).
   */
  onRowClick?: () => void;
  /** Figma `Cell Slot`: the data cells, as `FinTableCell`s. */
  children?: ReactNode;
}

/**
 * A table body row (Figma Table row; DESIGN.md §9): an optional select cell with the row checkbox, then the data
 * cells (Cell Slot), with a 1px `border-default` line under it. Hover fills the whole row (`bg-secondary`); Selected
 * is `bg-active`, and `bg-active-hover` when hovered. A native `<tr>`, so it goes inside a `<tbody>` of a table with
 * collapsed borders (the line is the row's border). `ref` goes to the `tr`.
 * **Internal:** part of the table.
 */
export const FinTableRow = forwardRef<HTMLTableRowElement, FinTableRowProps>(function FinTableRow(
  {
    selected = false,
    onSelectedChange,
    selectCell = true,
    checkboxLabel = 'Select row',
    onRowClick,
    children,
    className,
    onClick,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const handleClick = (event: MouseEvent<HTMLTableRowElement>) => {
    onClick?.(event);
    if (!onRowClick || event.defaultPrevented) return;
    const hit = (event.target as Element).closest(INTERACTIVE);
    if (hit && hit !== event.currentTarget) return;
    onRowClick();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTableRowElement>) => {
    onKeyDown?.(event);
    if (!onRowClick || event.defaultPrevented) return;
    if (event.key === 'Enter' && event.target === event.currentTarget) onRowClick();
  };

  return (
    <tr
      {...rest}
      ref={ref}
      className={className ? `${styles.row} ${className}` : styles.row}
      data-selected={selected ? '' : undefined}
      data-clickable={onRowClick ? '' : undefined}
      {...(onRowClick ? { tabIndex: 0 } : {})}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {selectCell && (
        <FinTableCell
          showContent={false}
          className={styles.select}
          checked={selected}
          checkboxLabel={checkboxLabel}
          {...(onSelectedChange ? { onCheckedChange: onSelectedChange } : {})}
        />
      )}
      {children}
    </tr>
  );
});
