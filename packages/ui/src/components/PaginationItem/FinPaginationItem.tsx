'use client';

import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import styles from './FinPaginationItem.module.css';

/** A page: Figma `State` = Default / Hovered (runtime) / Selected. */
type FinPaginationPageProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  variant?: 'page';
  /** The page number. */
  children: ReactNode;
  /** Figma `State=Selected`: the current page, announced with `aria-current="page"`. */
  selected?: boolean;
};

/** The gap between page runs: Figma `State=Dots`. Not interactive, hidden from screen readers. */
type FinPaginationDotsProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  variant: 'dots';
};

export type FinPaginationItemProps = FinPaginationPageProps | FinPaginationDotsProps;

/**
 * One item of a pagination (Figma Pagination item; DESIGN.md §7.2, §9): a page button, or the dots between runs of
 * pages. Figma `State` Hovered is runtime state (§7.3); press keeps the hover look. `ref` goes to the button or span.
 * **Internal:** not exported from the package; FinPagination (Pagination group) lays the items out and names them.
 */
export const FinPaginationItem = forwardRef<HTMLElement, FinPaginationItemProps>(function FinPaginationItem(props, ref) {
  if (props.variant === 'dots') {
    const { variant, className, ...rest } = props;
    return (
      <span
        {...rest}
        ref={ref as Ref<HTMLSpanElement>}
        className={className ? `${styles.item} ${className}` : styles.item}
        data-variant={variant}
        aria-hidden="true"
      >
        …
      </span>
    );
  }
  const { variant = 'page', children, selected = false, type = 'button', className, ...rest } = props;
  return (
    <button
      {...rest}
      ref={ref as Ref<HTMLButtonElement>}
      type={type}
      className={className ? `${styles.item} ${className}` : styles.item}
      data-variant={variant}
      data-selected={selected || undefined}
      aria-current={selected ? 'page' : undefined}
    >
      {children}
    </button>
  );
});
