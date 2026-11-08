'use client';

import { Children, forwardRef, useId, type AnchorHTMLAttributes, type ElementType, type ReactNode } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import type { FinIconName } from '../../icons/finIcons';
import { FinSideNavIcon } from '../SideNavIcon';
import * as styles from './FinSideNavItem.styles';

/** Figma `State=Selected - BG` is `'item'` (this item is the current place); `State=Selected` is `'sub-item'`. */
export type FinSideNavItemSelected = 'item' | 'sub-item';

export type FinSideNavItemType = 'full' | 'minimized';

export interface FinSideNavItemProps extends Omit<AnchorHTMLAttributes<HTMLElement>, 'children' | 'type'> {
  /** The item's icon (Figma Icon). */
  icon: FinIconName;
  /** The item's name. Hidden on screen when minimized, still read out. */
  label: string;
  /**
   * Figma `State=Selected - BG` (`'item'`: this item is the current place, white fill) or `State=Selected`
   * (`'sub-item'`: one of its sub items is the current page; purple text, no fill). Hovered and Pressed are CSS.
   */
  selected?: FinSideNavItemSelected;
  /** Figma `Expanded`: the sub items show under the item (Full only). */
  expanded?: boolean;
  /** Figma `Type`: Full (icon, label, chevron; fills the nav) or Minimized (icon only). Default full. */
  type?: FinSideNavItemType;
  /**
   * Figma `Expanded Slot`: the sub items (`FinSideNavSubItem`s). An item with sub items shows the chevron (Figma
   * `Show dropdown`) and is a button; one without is a link (`href`).
   */
  children?: ReactNode;
  /** An item without sub items: a router's link component (React Router `Link`, `next/link`). Default `a`. */
  linkAs?: ElementType;
}

/**
 * A top-level side nav item (Figma Main Selection; DESIGN.md §9): the Icon, the label (Label/Medium, one line with
 * "…") and, with sub items, a 20 chevron (down when closed, up when open), padding 8 / 12, radius M. Hovered
 * `bg-tertiary`, Pressed `bg-neutral`; Selected - BG `bg-primary` + `text-action` (no hover change); Selected
 * `text-action` with no fill. The sub items sit 4 below. Which item is selected or open is the side nav's decision
 * (only the active section is open); this item shows it and reports clicks. Other attributes and `ref` go to the
 * link or button. **Internal:** part of the side nav.
 */
export const FinSideNavItem = forwardRef<HTMLElement, FinSideNavItemProps>(function FinSideNavItem(
  { icon, label, selected, expanded = false, type = 'full', children, linkAs: Link = 'a', className, ...rest },
  ref,
) {
  const subItemsId = useId();
  const hasSubItems = Children.count(children) > 0;
  const full = type === 'full';
  const open = hasSubItems && full && expanded;
  const headerClass = `${styles.type[type]} ${styles.selected[selected ?? 'none']}`;

  const content = (
    <>
      <FinSideNavIcon name={icon} selected={selected !== undefined} />
      <span className={styles.label[type]}>{label}</span>
      {hasSubItems && full && (
        <span className={selected ? styles.chevron.selected : styles.chevron.default}>
          <FinIcon name={open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} size={20} />
        </span>
      )}
    </>
  );

  return (
    <div className={className ? `${styles.item} ${className}` : styles.item}>
      {hasSubItems ? (
        <button
          {...rest}
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          className={headerClass}
          data-selected={selected}
          data-type={type}
          {...(full ? { 'aria-expanded': open } : {})}
          {...(open ? { 'aria-controls': subItemsId } : {})}
        >
          {content}
        </button>
      ) : (
        <Link
          {...rest}
          ref={ref}
          className={headerClass}
          data-selected={selected}
          data-type={type}
          aria-current={selected === 'item' ? 'page' : undefined}
        >
          {content}
        </Link>
      )}
      {open && (
        <div id={subItemsId} className={styles.subItems}>
          {children}
        </div>
      )}
    </div>
  );
});
