'use client';

import { forwardRef, useEffect, useRef, useState, type HTMLAttributes } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import { FinPaginationItem } from '../PaginationItem';
import { paginationRange } from './paginationRange';
import styles from './FinPagination.module.css';

export interface FinPaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** The number of pages. One page shows the page with both arrows disabled (Figma "Only one"). */
  pageCount: number;
  /** The current page, from 1. Controlled. */
  page?: number;
  /** The start page when uncontrolled. Default 1. */
  defaultPage?: number;
  /** Called with the new page when another page is chosen. */
  onPageChange?: (page: number) => void;
  /** The navigation's name. Default "Pagination". */
  label?: string;
  /** The previous arrow's name. Default "Previous page". */
  previousLabel?: string;
  /** The next arrow's name. Default "Next page". */
  nextLabel?: string;
  /** Each page's name. Default "Page {n}". */
  pageLabel?: (page: number) => string;
}

const clamp = (n: number, max: number) => Math.min(Math.max(1, Math.round(n)), Math.max(1, max));

/**
 * Page navigation (Figma Pagination group; DESIGN.md §9): previous / next arrows around FinPaginationItem pages, with
 * dots for the gaps (at most 7 items, decided 19 Oct 2026). A named `nav` with a list; the current page has
 * `aria-current="page"`. The arrows are drawn here as Figma's grey outline override of all-button (decided
 * 19 Oct 2026: code only, no new button look). `ref` goes to the `nav`.
 */
export const FinPagination = forwardRef<HTMLElement, FinPaginationProps>(function FinPagination(
  {
    pageCount,
    page,
    defaultPage = 1,
    onPageChange,
    label = 'Pagination',
    previousLabel = 'Previous page',
    nextLabel = 'Next page',
    pageLabel = (n) => `Page ${n}`,
    className,
    ...rest
  },
  ref,
) {
  const count = Math.max(1, Math.floor(pageCount));
  const [inner, setInner] = useState(() => clamp(defaultPage, count));
  const current = clamp(page ?? inner, count);
  const currentButton = useRef<HTMLButtonElement | null>(null);
  const arrowFocused = useRef<'previous' | 'next' | null>(null);

  const goTo = (next: number) => {
    const target = clamp(next, count);
    if (target === current) return;
    if (page === undefined) setInner(target);
    onPageChange?.(target);
  };

  // An arrow that becomes disabled at an end loses focus; move it to the current page instead of the page body.
  const atStart = current <= 1;
  const atEnd = current >= count;
  useEffect(() => {
    if ((arrowFocused.current === 'previous' && atStart) || (arrowFocused.current === 'next' && atEnd)) {
      currentButton.current?.focus();
      arrowFocused.current = null;
    }
  }, [atStart, atEnd]);

  const arrow = (direction: 'previous' | 'next') => (
    <button
      type="button"
      className={styles.arrow}
      aria-label={direction === 'previous' ? previousLabel : nextLabel}
      disabled={direction === 'previous' ? atStart : atEnd}
      onFocus={() => (arrowFocused.current = direction)}
      onBlur={() => (arrowFocused.current = null)}
      onClick={() => goTo(direction === 'previous' ? current - 1 : current + 1)}
    >
      <FinIcon name={direction === 'previous' ? 'chevron_left' : 'chevron_right'} size={20} />
    </button>
  );

  return (
    <nav {...rest} ref={ref} aria-label={label} className={className ? `${styles.pagination} ${className}` : styles.pagination}>
      <ul className={styles.list}>
        <li>{arrow('previous')}</li>
        {paginationRange(current, count).map((item) =>
          typeof item === 'number' ? (
            <li key={item}>
              <FinPaginationItem
                ref={item === current ? (el) => void (currentButton.current = el as HTMLButtonElement | null) : undefined}
                selected={item === current}
                aria-label={pageLabel(item)}
                onClick={() => goTo(item)}
              >
                {item}
              </FinPaginationItem>
            </li>
          ) : (
            <li key={item} aria-hidden="true">
              <FinPaginationItem variant="dots" />
            </li>
          ),
        )}
        <li>{arrow('next')}</li>
      </ul>
    </nav>
  );
});
