'use client';

import { forwardRef, useState, type CSSProperties, type ElementType, type HTMLAttributes, type ReactNode } from 'react';
import type { FinIconName } from '../../icons/finIcons';
import type { FinBadgeTone } from '../BadgeBase';
import { FinTableCell, type FinTableCellType } from '../TableCell';
import { FinTableFooter } from '../TableFooter';
import { FinTableHeaderCell } from '../TableHeaderCell';
import { FinTableHeaderRow } from '../TableHeaderRow';
import { FinTableRow } from '../TableRow';
import styles from './FinTable.module.css';

export type FinTableRowId = string | number;

/** One column: its header, how each row's value is shown, and its width (DESIGN.md §9). */
export interface FinTableColumn<Row> {
  /** Unique key; also the row field shown when there's no `value`. */
  key: string;
  /** The column title (Table header cell). */
  header: string;
  /** The value for a row. Text is shown as `type` says; any other component is shown as given. Default `row[key]`. */
  value?: (row: Row) => ReactNode;
  /** How text values are shown (FinTableCell `type`): default, badge or link. Default `'default'`. */
  type?: FinTableCellType;
  /** Badge type: the badge tone, fixed or per row. Default primary. */
  badgeTone?: FinBadgeTone | ((row: Row) => FinBadgeTone);
  /** Link type: where each row's link goes. */
  href?: (row: Row) => string;
  /** Link type: a router's link component (React Router `Link`, `next/link`). Default `a`. */
  linkAs?: ElementType;
  /** An icon-only action button after the value (FinTableCell `action`). */
  action?: {
    /** Default `edit`. */
    icon?: FinIconName;
    /** The button's name for screen readers, per row ("Edit Ann Perera's tier"). */
    label: (row: Row) => string;
    onAction: (row: Row) => void;
  };
  /** Fixed width in px. Leave both widths out for a flexible column (shares the remaining space with the others). */
  width?: number;
  /** Minimum width in px for a flexible column; below it the table scrolls sideways. */
  minWidth?: number;
  /** The header's trailing arrow (display only until sort and filter are designed, §10 #50). */
  trailingIcon?: boolean;
}

export interface FinTableProps<Row> extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  /** The table's name for screen readers ("Members"). */
  label: string;
  columns: FinTableColumn<Row>[];
  /** All rows (client pagination), or only the current page's rows with `totalRows` (server pagination). */
  rows: Row[];
  /** A stable ID for each row, used for selection. */
  getRowId: (row: Row) => FinTableRowId;
  /** The row's name for its checkbox ("Select Ann Perera"). Default the first column's text, else "row N". */
  getRowLabel?: (row: Row) => string;
  /** Select cells and "select all" (Figma `Select Cell`). Default on, as in Figma. */
  selectable?: boolean;
  /** Selected row IDs (controlled), kept across pages. */
  selectedIds?: FinTableRowId[];
  /** Selected row IDs at the start (uncontrolled). */
  defaultSelectedIds?: FinTableRowId[];
  /** Called with the new selection. */
  onSelectionChange?: (ids: FinTableRowId[]) => void;
  /**
   * Called when a row is clicked (or focused and Enter is pressed), for example to open a side sheet. While any row
   * is selected, a row click selects or clears that row instead (decided 20 Oct 2026).
   */
  onRowClick?: (row: Row) => void;
  /** Rows per page (controlled; with `onRowsPerPageChange`). */
  rowsPerPage?: number;
  /** Rows per page at the start (uncontrolled). Default 10. */
  defaultRowsPerPage?: number;
  /** Called with the row count chosen in the footer's Rows per page menu. */
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  /** The row counts offered in that menu. Default 10, 25, 50, 100. */
  rowsPerPageOptions?: readonly number[];
  /** Server pagination: the number of rows on every page; `rows` is then the current page only. */
  totalRows?: number;
  /** The page (controlled), from 1. */
  page?: number;
  /** The page at the start (uncontrolled). Default 1. */
  defaultPage?: number;
  /** Called with the new page. */
  onPageChange?: (page: number) => void;
}

const isText = (value: unknown): value is string | number => typeof value === 'string' || typeof value === 'number';

const columnStyle = (width: number) => ({ '--fin-table-column-width': `${width}px` }) as CSSProperties;

/**
 * A complete table (DESIGN.md §9): the Header row, Table rows and the Table footer with pagination, from columns and
 * rows as data. Code only (no Figma component): it adds no visuals beyond the 16 (`Space-XL`) gap above the footer.
 * Columns are fixed (`width`), flexible (the default, sharing the rest equally) or have a `minWidth`; the select
 * column is fixed at 72. When the columns don't fit, the table scrolls sideways; long text ends in "…". "Select all"
 * acts on the current page; selection is by row ID and kept across pages. No outer border; the last row has no line
 * under it. `ref` goes to the root.
 */
function FinTableInner<Row>(
  {
    label,
    columns,
    rows,
    getRowId,
    getRowLabel,
    selectable = true,
    selectedIds,
    defaultSelectedIds = [],
    onSelectionChange,
    onRowClick,
    rowsPerPage,
    defaultRowsPerPage = 10,
    onRowsPerPageChange,
    rowsPerPageOptions,
    totalRows,
    page,
    defaultPage = 1,
    onPageChange,
    className,
    ...rest
  }: FinTableProps<Row>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const [innerSelected, setInnerSelected] = useState<FinTableRowId[]>(defaultSelectedIds);
  const selected = selectedIds ?? innerSelected;
  const setSelected = (next: FinTableRowId[]) => {
    if (selectedIds === undefined) setInnerSelected(next);
    onSelectionChange?.(next);
  };

  const serverPaged = totalRows !== undefined;
  const total = serverPaged ? totalRows : rows.length;
  const [innerPerPage, setInnerPerPage] = useState(defaultRowsPerPage);
  const perPage = Math.max(1, Math.floor(rowsPerPage ?? innerPerPage));
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  const [innerPage, setInnerPage] = useState(defaultPage);
  const current = Math.min(Math.max(1, page ?? innerPage), pageCount);
  const changePage = (next: number) => {
    if (page === undefined) setInnerPage(next);
    onPageChange?.(next);
  };

  // A new row count keeps the first row on screen in view: the page that holds it (decided 22 Oct 2026).
  const changePerPage = (next: number) => {
    const firstRow = (current - 1) * perPage;
    if (rowsPerPage === undefined) setInnerPerPage(next);
    onRowsPerPageChange?.(next);
    changePage(Math.floor(firstRow / next) + 1);
  };

  const pageRows = serverPaged ? rows : rows.slice((current - 1) * perPage, current * perPage);
  const pageIds = pageRows.map(getRowId);
  const selectedOnPage = pageIds.filter((id) => selected.includes(id)).length;
  const selecting = selectable && selected.length > 0;

  const toggle = (id: FinTableRowId, on: boolean) =>
    setSelected(on ? [...selected.filter((item) => item !== id), id] : selected.filter((item) => item !== id));
  const toggleAll = (on: boolean) =>
    setSelected(on ? [...selected.filter((id) => !pageIds.includes(id)), ...pageIds] : selected.filter((id) => !pageIds.includes(id)));

  const rowLabel = (row: Row, index: number) => {
    if (getRowLabel) return getRowLabel(row);
    const first = columns[0];
    const value = first ? (first.value ? first.value(row) : (row as Record<string, unknown>)[first.key]) : undefined;
    return isText(value) ? String(value) : `row ${(current - 1) * perPage + index + 1}`;
  };

  // Equal sharing can't go below the largest flexible minimum, so the table's minimum width covers it for every column.
  const flexible = columns.filter((column) => column.width === undefined);
  const flexMin = Math.max(0, ...flexible.map((column) => column.minWidth ?? 0));
  const fixedTotal = columns.reduce((sum, column) => sum + (column.width ?? 0), 0);
  const tableStyle = { '--fin-table-min-width': `${fixedTotal + flexMin * flexible.length}px` } as CSSProperties;

  return (
    <div {...rest} ref={ref} className={className ? `${styles.root} ${className}` : styles.root}>
      <div className={styles.scroll}>
        <table className={styles.table} aria-label={label} style={tableStyle} data-selectable={selectable ? '' : undefined}>
          <colgroup>
            {selectable && <col className={styles.selectColumn} />}
            {columns.map((column) =>
              column.width === undefined ? (
                <col key={column.key} />
              ) : (
                <col key={column.key} className={styles.fixedColumn} style={columnStyle(column.width)} />
              ),
            )}
          </colgroup>
          <thead>
            <FinTableHeaderRow
              selectCell={selectable}
              checked={pageIds.length > 0 && selectedOnPage === pageIds.length}
              indeterminate={selectedOnPage > 0 && selectedOnPage < pageIds.length}
              onCheckedChange={toggleAll}
            >
              {columns.map((column) => (
                <FinTableHeaderCell key={column.key} type="grey" checkbox={false} trailingIcon={column.trailingIcon ?? false}>
                  {column.header}
                </FinTableHeaderCell>
              ))}
            </FinTableHeaderRow>
          </thead>
          <tbody>
            {pageRows.map((row, index) => {
              const id = getRowId(row);
              const isSelected = selected.includes(id);
              const rowClick = selecting ? () => toggle(id, !isSelected) : onRowClick ? () => onRowClick(row) : undefined;
              return (
                <FinTableRow
                  key={id}
                  selectCell={selectable}
                  selected={isSelected}
                  onSelectedChange={(on) => toggle(id, on)}
                  checkboxLabel={`Select ${rowLabel(row, index)}`}
                  {...(rowClick ? { onRowClick: rowClick } : {})}
                >
                  {columns.map((column) => {
                    const value = column.value ? column.value(row) : ((row as Record<string, unknown>)[column.key] as ReactNode);
                    const tone = typeof column.badgeTone === 'function' ? column.badgeTone(row) : column.badgeTone;
                    const cell = {
                      type: column.type ?? 'default',
                      leadingAccessories: false,
                      ...(tone ? { badgeTone: tone } : {}),
                      ...(column.href ? { href: column.href(row) } : {}),
                      ...(column.linkAs ? { linkAs: column.linkAs } : {}),
                    };
                    const { action } = column;
                    return action ? (
                      <FinTableCell
                        key={column.key}
                        {...cell}
                        action
                        actionLabel={action.label(row)}
                        onAction={() => action.onAction(row)}
                        {...(action.icon ? { actionIcon: action.icon } : {})}
                      >
                        {value}
                      </FinTableCell>
                    ) : (
                      <FinTableCell key={column.key} {...cell}>
                        {value}
                      </FinTableCell>
                    );
                  })}
                </FinTableRow>
              );
            })}
          </tbody>
        </table>
      </div>
      <FinTableFooter
        className={styles.footer}
        totalRows={total}
        rowsPerPage={perPage}
        page={current}
        onPageChange={changePage}
        onRowsPerPageChange={changePerPage}
        {...(rowsPerPageOptions ? { rowsPerPageOptions } : {})}
      />
    </div>
  );
}

/** See FinTableInner. Generic over the row type, so columns and callbacks are typed from `rows`. */
export const FinTable = forwardRef(FinTableInner) as <Row>(
  props: FinTableProps<Row> & { ref?: React.Ref<HTMLDivElement> },
) => ReturnType<typeof FinTableInner>;
