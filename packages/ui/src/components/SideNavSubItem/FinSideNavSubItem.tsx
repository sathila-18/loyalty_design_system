import { forwardRef, type AnchorHTMLAttributes, type ElementType, type ReactNode } from 'react';
import * as styles from './FinSideNavSubItem.styles';

export interface FinSideNavSubItemProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  /** Figma `state=Selected`: the current page (white, `text-action`, `aria-current="page"`). Default false. */
  selected?: boolean;
  /** The item's label: one line, "…" when it doesn't fit (the full text is still read out). */
  children: ReactNode;
  /** The link element, for a router's link component (React Router `Link`, `next/link`). Default `a`. */
  linkAs?: ElementType;
  /**
   * Code only (2 Nov 2026), from the side nav's `variant`: `tree` draws the connected tree lines (decorative, CSS
   * only). Default `default`.
   */
  variant?: 'default' | 'tree';
}

/**
 * A child link under a side nav section (Figma sub selection; DESIGN.md §9): Label/Medium, padding 8 / 16 / 8 / 40,
 * radius M, filling the nav's width. Default has no fill (the nav's own background shows); Hovered `bg-tertiary`,
 * Pressed `bg-neutral`, Selected `bg-primary` with `text-action` and no hover change. A real link; `ref` goes to it.
 * **Internal:** part of the side nav.
 */
export const FinSideNavSubItem = forwardRef<HTMLAnchorElement, FinSideNavSubItemProps>(function FinSideNavSubItem(
  { selected = false, children, linkAs: Link = 'a', variant = 'default', className, ...rest },
  ref,
) {
  return (
    <Link
      {...rest}
      ref={ref}
      className={[selected ? styles.look.selected : styles.look.default, variant === 'tree' && styles.tree, className].filter(Boolean).join(' ')}
      data-selected={selected ? '' : undefined}
      data-variant={variant === 'tree' ? 'tree' : undefined}
      aria-current={selected ? 'page' : undefined}
    >
      <span className={styles.label}>{children}</span>
    </Link>
  );
});
