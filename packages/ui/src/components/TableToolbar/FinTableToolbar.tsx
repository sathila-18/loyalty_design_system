import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import type { FinIconName } from '../../icons/finIcons';
import { FinButton } from '../Button';
import { FinSearchField, type FinSearchFieldProps } from '../SearchField';
import styles from './FinTableToolbar.module.css';

export interface FinTableToolbarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Figma `Show search` and its Search: FinSearchField, Small (40; decided 22 Oct 2026), 343 wide. Hidden without it. */
  search?: FinSearchFieldProps;
  /** Figma `Show filter` and the Filter slot: chips (an Assist chip with a select menu, filter chips). Hidden without it. */
  filters?: ReactNode;
  /** Figma `Show button` and its label: a Small Primary button with a leading icon. Hidden without it. */
  actionLabel?: string;
  /** The button's icon. Default `add`. */
  actionIcon?: FinIconName;
  /** Called when the button is pressed. */
  onAction?: MouseEventHandler<HTMLButtonElement>;
}

/**
 * The toolbar above a table (Figma Table header, renamed in code so it isn't confused with the table's header cells
 * and row; DESIGN.md §9): the search on the left; the filters and the main action on the right, 12 (Space-L) apart.
 * The parts are the built components (FinSearchField, Small; the filter slot's chips; FinButton). It fills its
 * container; when it's narrow, the search shrinks and the right side keeps its size. **Internal:** part of the table
 * (FinTable `toolbar`).
 */
export function FinTableToolbar({ search, filters, actionLabel, actionIcon = 'add', onAction, className, ...rest }: FinTableToolbarProps) {
  const hasFilters = filters !== undefined && filters !== null && filters !== false;
  return (
    <div {...rest} className={className ? `${styles.toolbar} ${className}` : styles.toolbar}>
      <div className={styles.start}>{search && <FinSearchField size="small" {...search} className={search.className ? `${styles.search} ${search.className}` : styles.search} />}</div>
      {(hasFilters || actionLabel) && (
        <div className={styles.end}>
          {hasFilters && <div className={styles.filters}>{filters}</div>}
          {actionLabel && (
            <FinButton size="small" icon="leading" iconName={actionIcon} {...(onAction ? { onClick: onAction } : {})}>
              {actionLabel}
            </FinButton>
          )}
        </div>
      )}
    </div>
  );
}
