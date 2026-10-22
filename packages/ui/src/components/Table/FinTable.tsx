'use client';

import { forwardRef, useEffect, useState, type CSSProperties, type ElementType, type HTMLAttributes, type ReactNode } from 'react';
import type { FinIconName } from '../../icons/finIcons';
import type { FinBadgeTone } from '../BadgeBase';
import { FinTableCell, type FinTableCellType } from '../TableCell';
import { FinTableFooter } from '../TableFooter';
import type { FinTableFilterOption } from '../TableColumnFilter';
import { FinTableHeaderCell } from '../TableHeaderCell';
import { FinTableHeaderRow } from '../TableHeaderRow';
import { FinTableRow } from '../TableRow';
import { FinTableRowActions } from '../TableRowActions';
import styles from './FinTable.module.css';

export type FinTableRowId = string | number;

/** The table's sort: one column at a time. */
export interface FinTableSort {
  key: string;
  direction: 'ascending' | 'descending';
}

/** Each column's applied filter values, by column key. */
export type FinTableFilters = Record<string, string[]>;

/** One action in a row's "more actions" menu (FinTable `rowActions`). */
export interface FinTableRowAction<Row> {
  /** The action's name ("Edit member"). */
  label: string;
  /** A leading icon. */
  icon?: FinIconName;
  /** Runs the action for the row (the menu closes). */
  onSelect: (row: Row) => void;
  /** Shown but unavailable, for every row or per row (for example without permission). */
  disabled?: boolean | ((row: Row) => boolean);
  /** A line before this action, to group the ones after it (for example a destructive action). */
  separator?: boolean;
}

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
  /** The header's trailing arrow, display only (Figma `Show trailing icon`). `filter` makes it the filter instead. */
  trailingIcon?: boolean;
  /** Sortable by clicking its title (code first, 22 Oct 2026). */
  sortable?: boolean;
  /** What to sort by. Default the value when it's text or a number, else `row[key]`. */
  sortValue?: (row: Row) => string | number | Date;
  /**
   * Filterable from the header's down arrow (code first, 22 Oct 2026). `options` default: the column's distinct
   * values; `multiple` (default true): checkboxes, false: radios; `value`: a row's filter value (default as `sortValue`).
   */
  filter?: { options?: FinTableFilterOption[]; multiple?: boolean; value?: (row: Row) => string };
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
  /** The sort (controlled), or `null` for none. */
  sort?: FinTableSort | null;
  /** The sort at the start (uncontrolled). */
  defaultSort?: FinTableSort | null;
  /** Called with the new sort (or `null`). */
  onSortChange?: (sort: FinTableSort | null) => void;
  /** The applied filters (controlled). */
  filters?: FinTableFilters;
  /** The filters at the start (uncontrolled). */
  defaultFilters?: FinTableFilters;
  /** Called with the filters when a column's filter is applied. */
  onFiltersChange?: (filters: FinTableFilters) => void;
  /**
   * A "more actions" (⋮) column (code first, 22 Oct 2026): each row's button opens an action menu. The actions, for
   * every row, or per row (they can differ per table and per row). Without it, no column.
   */
  rowActions?: FinTableRowAction<Row>[] | ((row: Row) => FinTableRowAction<Row>[]);
  /** Where the ⋮ column goes: `end` (default, the last column) or `start` (first, after the select column). */
  rowActionsPosition?: 'start' | 'end';
  /** The ⋮ button's name per row. Default "More actions for {row label}". */
  rowActionsLabel?: (row: Row) => string;
  /** The ⋮ column's name for screen readers (its header is empty on screen). Default "Actions". */
  rowActionsHeader?: string;
}

const isText = (value: unknown): value is string | number => typeof value === 'string' || typeof value === 'number';

/** A column's raw value for a row: its `value()` when that's text or a number, else `row[key]`. */
function rawValue<Row>(column: FinTableColumn<Row>, row: Row): unknown {
  const shown = column.value?.(row);
  return isText(shown) ? shown : (row as Record<string, unknown>)[column.key];
}

const sortKey = <Row,>(column: FinTableColumn<Row>, row: Row) => column.sortValue?.(row) ?? (rawValue(column, row) as string | number);
const filterKey = <Row,>(column: FinTableColumn<Row>, row: Row) => column.filter?.value?.(row) ?? String(rawValue(column, row) ?? '');

/** Numbers and dates by value, text alphabetically with numbers inside it in order ("Item 2" before "Item 10"). */
function compare(a: string | number | Date, b: string | number | Date): number {
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

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
    sort: sortProp,
    defaultSort = null,
    onSortChange,
    filters: filtersProp,
    defaultFilters = {},
    onFiltersChange,
    rowActions,
    rowActionsPosition = 'end',
    rowActionsLabel,
    rowActionsHeader = 'Actions',
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

  // Sort and filter (code first, 22 Oct 2026): done here on the rows, or only reported with server pagination.
  const [innerSort, setInnerSort] = useState<FinTableSort | null>(defaultSort);
  const sort = sortProp === undefined ? innerSort : sortProp;
  const [innerFilters, setInnerFilters] = useState<FinTableFilters>(defaultFilters);
  const filters = filtersProp ?? innerFilters;
  let shownRows = rows;
  if (!serverPaged) {
    shownRows = rows.filter((row) =>
      columns.every((column) => {
        const values = filters[column.key];
        return !column.filter || !values || values.length === 0 || values.includes(filterKey(column, row));
      }),
    );
    const sortColumn = sort ? columns.find((column) => column.key === sort.key) : undefined;
    if (sort && sortColumn) {
      const direction = sort.direction === 'ascending' ? 1 : -1;
      shownRows = [...shownRows].sort((a, b) => direction * compare(sortKey(sortColumn, a), sortKey(sortColumn, b)));
    }
  }
  const total = serverPaged ? totalRows : shownRows.length;
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

  // A new sort or filter starts again from the first page.
  const changeSort = (next: FinTableSort | null) => {
    if (sortProp === undefined) setInnerSort(next);
    onSortChange?.(next);
    changePage(1);
  };
  const changeFilter = (key: string, values: string[]) => {
    const next = { ...filters, [key]: values };
    if (filtersProp === undefined) setInnerFilters(next);
    onFiltersChange?.(next);
    changePage(1);
  };
  const filterOptions = (column: FinTableColumn<Row>): FinTableFilterOption[] =>
    column.filter?.options ??
    [...new Set(rows.map((row) => filterKey(column, row)))].sort(compare).map((value) => ({ value, label: value }));

  const pageRows = serverPaged ? rows : shownRows.slice((current - 1) * perPage, current * perPage);
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

  // Whether content is scrolled under the fixed ⋮ column (start or end), for its shadow. Set on the scroll element
  // directly as it scrolls or resizes, so scrolling doesn't re-render the table.
  const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!scrollEl) return;
    const update = () => {
      const max = scrollEl.scrollWidth - scrollEl.clientWidth;
      scrollEl.toggleAttribute('data-hidden-start', scrollEl.scrollLeft > 0);
      scrollEl.toggleAttribute('data-hidden-end', scrollEl.scrollLeft < max - 1);
    };
    update();
    scrollEl.addEventListener('scroll', update, { passive: true });
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
    observer?.observe(scrollEl);
    return () => {
      scrollEl.removeEventListener('scroll', update);
      observer?.disconnect();
    };
  }, [scrollEl]);

  // The ⋮ column stays in place while the table scrolls sideways: at the end on the right, at the start on the left
  // (with the select column, which then stays too).
  const actionsAt = rowActions ? rowActionsPosition : undefined;
  const stickyClass = actionsAt === 'start' ? styles.stickyStart : styles.stickyEnd;
  const selectClass = actionsAt === 'start' ? styles.stickySelect : undefined;
  const actionsHeader = actionsAt && (
    <FinTableHeaderCell key="row-actions" type="grey" checkbox={false} showTitle={false} className={stickyClass}>
      {rowActionsHeader}
    </FinTableHeaderCell>
  );
  const actionsCell = (row: Row, index: number) => {
    if (!rowActions) return null;
    const list = typeof rowActions === 'function' ? rowActions(row) : rowActions;
    return (
      <FinTableCell
        key="row-actions"
        leadingAccessories={false}
        className={stickyClass}
        // The menu's clicks stay in the cell: they don't open or select the row.
        onClick={(event) => event.stopPropagation()}
      >
        <FinTableRowActions
          label={rowActionsLabel ? rowActionsLabel(row) : `More actions for ${rowLabel(row, index)}`}
          placement={actionsAt === 'start' ? 'bottom-start' : 'bottom-end'}
          actions={list.map((action) => ({
            label: action.label,
            onSelect: () => action.onSelect(row),
            ...(action.icon ? { icon: action.icon } : {}),
            ...(action.separator ? { separator: true } : {}),
            disabled: typeof action.disabled === 'function' ? action.disabled(row) : (action.disabled ?? false),
          }))}
        />
      </FinTableCell>
    );
  };

  return (
    <div {...rest} ref={ref} className={className ? `${styles.root} ${className}` : styles.root}>
      <div ref={setScrollEl} className={styles.scroll}>
        <table
          className={styles.table}
          aria-label={label}
          style={tableStyle}
          data-selectable={selectable ? '' : undefined}
          data-row-actions={actionsAt}
        >
          <colgroup>
            {selectable && <col className={styles.selectColumn} />}
            {actionsAt === 'start' && <col className={styles.actionsColumn} />}
            {columns.map((column) =>
              column.width === undefined ? (
                <col key={column.key} />
              ) : (
                <col key={column.key} className={styles.fixedColumn} style={columnStyle(column.width)} />
              ),
            )}
            {actionsAt === 'end' && <col className={styles.actionsColumn} />}
          </colgroup>
          <thead>
            <FinTableHeaderRow
              selectCell={selectable}
              checked={pageIds.length > 0 && selectedOnPage === pageIds.length}
              indeterminate={selectedOnPage > 0 && selectedOnPage < pageIds.length}
              onCheckedChange={toggleAll}
              {...(selectClass ? { selectCellClassName: selectClass } : {})}
            >
              {actionsAt === 'start' && actionsHeader}
              {columns.map((column) => (
                <FinTableHeaderCell
                  key={column.key}
                  type="grey"
                  checkbox={false}
                  trailingIcon={column.trailingIcon ?? false}
                  {...(column.sortable
                    ? {
                        sort: sort?.key === column.key ? sort.direction : 'none',
                        onSortChange: (direction: 'none' | 'ascending' | 'descending') =>
                          changeSort(direction === 'none' ? null : { key: column.key, direction }),
                      }
                    : {})}
                  {...(column.filter
                    ? {
                        filter: {
                          options: filterOptions(column),
                          value: filters[column.key] ?? [],
                          onApply: (values: string[]) => changeFilter(column.key, values),
                          ...(column.filter.multiple !== undefined ? { multiple: column.filter.multiple } : {}),
                        },
                      }
                    : {})}
                >
                  {column.header}
                </FinTableHeaderCell>
              ))}
              {actionsAt === 'end' && actionsHeader}
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
                  {...(selectClass ? { selectCellClassName: selectClass } : {})}
                >
                  {actionsAt === 'start' && actionsCell(row, index)}
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
                  {actionsAt === 'end' && actionsCell(row, index)}
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
