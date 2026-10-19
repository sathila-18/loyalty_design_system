'use client';

import { forwardRef, useState, type HTMLAttributes } from 'react';
import { FinPagination, type FinPaginationProps } from '../Pagination';
import { FinRowCountSelect } from '../RowCountSelect';
import styles from './FinTableFooter.module.css';

/** What the summary text describes: the rows shown (from 1; 0 when there are none), the total and the page. */
export interface FinTableFooterSummary {
  from: number;
  to: number;
  total: number;
  page: number;
}

export interface FinTableFooterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** The number of rows in the whole table. */
  totalRows: number;
  /** The rows shown per page (the Row count dropdown's value). */
  rowsPerPage: number;
  /** The current page, from 1. Controlled. */
  page?: number;
  /** The start page when uncontrolled. Default 1. */
  defaultPage?: number;
  /** Called with the new page when another page is chosen. */
  onPageChange?: (page: number) => void;
  /** Called when the Row count dropdown is clicked (its menu comes with the List component). */
  onRowsPerPageClick?: () => void;
  /** Whether the Row count menu is open. */
  rowsPerPageExpanded?: boolean;
  /** The Row count dropdown's text. Default "Rows per page:". */
  rowsPerPageLabel?: string;
  /** The summary text. Default "Showing 1–10 of 45 entries in page 1" ("Showing 0 of 0 entries" when empty). */
  summary?: (info: FinTableFooterSummary) => string;
  /** Names for the pagination (translations). */
  paginationLabels?: Pick<FinPaginationProps, 'label' | 'previousLabel' | 'nextLabel' | 'pageLabel'>;
}

const defaultSummary = ({ from, to, total, page }: FinTableFooterSummary) =>
  total === 0 ? 'Showing 0 of 0 entries' : `Showing ${from}–${to} of ${total} entries in page ${page}`;

const clamp = (n: number, max: number) => Math.min(Math.max(1, Math.round(n)), max);

/**
 * The table's footer (Figma Table footer; DESIGN.md §9): a summary of the rows shown and the Row count dropdown on the
 * left, FinPagination on the right. Pages are worked out from `totalRows` and `rowsPerPage`. The summary is a polite
 * live region, so a page change is announced. Wraps onto two lines when narrow (decided 19 Oct 2026). `ref` goes to
 * the root. **Internal:** part of the table.
 */
export const FinTableFooter = forwardRef<HTMLDivElement, FinTableFooterProps>(function FinTableFooter(
  {
    totalRows,
    rowsPerPage,
    page,
    defaultPage = 1,
    onPageChange,
    onRowsPerPageClick,
    rowsPerPageExpanded,
    rowsPerPageLabel,
    summary = defaultSummary,
    paginationLabels,
    className,
    ...rest
  },
  ref,
) {
  const total = Math.max(0, Math.floor(totalRows));
  const perPage = Math.max(1, Math.floor(rowsPerPage));
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  const [inner, setInner] = useState(() => clamp(defaultPage, pageCount));
  const current = clamp(page ?? inner, pageCount);
  const from = total === 0 ? 0 : (current - 1) * perPage + 1;
  const to = Math.min(current * perPage, total);

  const changePage = (next: number) => {
    if (page === undefined) setInner(next);
    onPageChange?.(next);
  };

  return (
    <div {...rest} ref={ref} className={className ? `${styles.footer} ${className}` : styles.footer}>
      <div className={styles.start}>
        <p className={styles.summary} aria-live="polite">
          {summary({ from, to, total, page: current })}
        </p>
        <FinRowCountSelect
          value={perPage}
          {...(rowsPerPageLabel !== undefined ? { label: rowsPerPageLabel } : {})}
          {...(rowsPerPageExpanded !== undefined ? { expanded: rowsPerPageExpanded } : {})}
          {...(onRowsPerPageClick ? { onClick: onRowsPerPageClick } : {})}
        />
      </div>
      <FinPagination {...paginationLabels} pageCount={pageCount} page={current} onPageChange={changePage} />
    </div>
  );
});
