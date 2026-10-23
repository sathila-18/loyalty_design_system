'use client';

import { Fragment } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import type { FinIconName } from '../../icons/finIcons';
import { FinListStandard } from '../ListStandard';
import { FinMenu, FinMenuDivider, type FinMenuPlacement } from '../Menu';
import styles from './FinTableRowActions.module.css';

/** One action in a row's "more actions" menu. */
export interface FinTableRowActionItem {
  /** The action's name ("Edit member"). */
  label: string;
  /** A leading icon. */
  icon?: FinIconName;
  /** Runs the action (the menu closes). */
  onSelect: () => void;
  /** Shown but unavailable (for example without permission). */
  disabled?: boolean;
  /** A line before this action, to group the ones after it (for example a destructive action). */
  separator?: boolean;
  /** Deletes or removes: the destructive button's colours, `text-error` and an `fg-error` icon (23 Oct 2026). */
  destructive?: boolean;
}

export interface FinTableRowActionsProps {
  /** The button's name for screen readers ("More actions for Ann Perera"). */
  label: string;
  /** The actions, in order. They can differ per table and per row. */
  actions: FinTableRowActionItem[];
  /** Where the menu opens from the button. Default `bottom-end` (the column at the end of the table). */
  placement?: FinMenuPlacement;
}

/**
 * A row's "more actions" button (code first, 22 Oct 2026; DESIGN.md §9): a `more_vert` icon button that works as the
 * icon button (XSmall Tertiary Only Icon: 32 square, hover and pressed fills), fg-secondary at rest and purple while
 * its menu is open, that opens an action menu (FinMenu `kind="action"`) of the row's actions.
 * **Internal:** part of the table (FinTable `rowActions`).
 */
/** 240 wide (design, 23 Oct 2026: wider than its short action names). No Size-240 token, so 2 × Size-120. */
const MENU_WIDTH = 'calc(2 * var(--fin-size-120))';

export function FinTableRowActions({ label, actions, placement = 'bottom-end' }: FinTableRowActionsProps) {
  return (
    <FinMenu
      placement={placement}
      width={MENU_WIDTH}
      trigger={(menuProps) => (
        <button {...menuProps} type="button" className={styles.button} aria-label={label}>
          <FinIcon name="more_vert" size={20} />
        </button>
      )}
    >
      {actions.map((action, index) => (
        <Fragment key={`${action.label}-${index}`}>
          {action.separator && index > 0 && <FinMenuDivider />}
          <FinListStandard
            as="li"
            size="small"
            behavior="menuitem"
            divider={false}
            title={action.label}
            {...(action.icon
              ? {
                  leadingAccessory: 'icon' as const,
                  leading: <FinIcon name={action.icon} size={24} color={action.disabled ? 'disabled' : action.destructive ? 'error' : 'secondary'} />,
                }
              : {})}
            tone={action.destructive ? 'destructive' : 'default'}
            disabled={action.disabled ?? false}
            onClick={action.onSelect}
          />
        </Fragment>
      ))}
    </FinMenu>
  );
}
