'use client';

import { forwardRef, type ElementType, type MouseEvent, type ReactNode, type TdHTMLAttributes } from 'react';
import type { FinIconName } from '../../icons/finIcons';
import { FinBadge } from '../Badge';
import { FinButton } from '../Button';
import type { FinBadgeTone } from '../BadgeBase';
import { FinCheckboxBase } from '../CheckboxBase';
import styles from './FinTableCell.module.css';

export type FinTableCellType = 'default' | 'badge' | 'link';

interface FinTableCellOwnProps extends Omit<TdHTMLAttributes<HTMLTableCellElement>, 'children'> {
  /**
   * Figma `Type`: how text content is shown. Default (Body/Medium, `text-secondary`), Badge (FinBadge) or Link
   * (`text-action`, underlined). Content that isn't text is shown as given, whatever the type.
   */
  type?: FinTableCellType;
  /** Figma `Show leading accessories`. Default on, as in Figma. */
  leadingAccessories?: boolean;
  /** Figma Leading accessories slot. Default: the row's checkbox (Base-Checkbox). */
  leading?: ReactNode;
  /** Whether the row checkbox is ticked (controlled). Leave it out for an uncontrolled checkbox. */
  checked?: boolean;
  /** Called with the new value when the row checkbox is clicked. */
  onCheckedChange?: (checked: boolean) => void;
  /** The row checkbox's name for screen readers. Default "Select row". */
  checkboxLabel?: string;
  /** Figma `Show content`. Default on. */
  showContent?: boolean;
  /**
   * Figma Content slot. Text is shown as `type` says (one line, "…" when narrow); any other component (an avatar, a
   * flag, a chip…) is shown as given, so new kinds of content need no change here.
   */
  children?: ReactNode;
  /** Badge type: the nested Badge-primary's `State` (FinBadge `tone`). Default primary. */
  badgeTone?: FinBadgeTone;
  /** Link type: where the link goes. */
  href?: string;
  /** Link type: the link element, for a router's link component (React Router `Link`, `next/link`). Default `a`. */
  linkAs?: ElementType;
}

type FinTableCellActionProps =
  | { action?: false; actionIcon?: never; actionLabel?: never; onAction?: never }
  | {
      /** Figma `Show action button`: an icon button after the content (XSmall Tertiary, icon only). Default off. */
      action: true;
      /** The action's icon (Figma Action slot). Default `edit`. */
      actionIcon?: FinIconName;
      /** The action's name for screen readers (required: the button has no visible text). */
      actionLabel: string;
      /** Called when the action button is clicked. */
      onAction?: (event: MouseEvent<HTMLButtonElement>) => void;
    };

export type FinTableCellProps = FinTableCellOwnProps & FinTableCellActionProps;

/**
 * A table data cell (Figma Table - Cell; DESIGN.md §9): optional leading accessories (the row checkbox), the content
 * and an optional action button, 56 tall. A native `<td>`, so it goes inside a table row. No fill or hover of its
 * own: the row draws those. `ref` goes to the `td`.
 * **Internal:** part of the table.
 */
export const FinTableCell = forwardRef<HTMLTableCellElement, FinTableCellProps>(function FinTableCell(
  {
    type = 'default',
    leadingAccessories = true,
    leading,
    checked,
    onCheckedChange,
    checkboxLabel = 'Select row',
    showContent = true,
    children,
    badgeTone = 'primary',
    href,
    linkAs: Link = 'a',
    action = false,
    actionIcon = 'edit',
    actionLabel,
    onAction,
    className,
    ...rest
  },
  ref,
) {
  const isText = typeof children === 'string' || typeof children === 'number';
  let content: ReactNode = children;
  if (isText && type === 'default') content = <span className={styles.text}>{children}</span>;
  if (isText && type === 'badge') content = <FinBadge tone={badgeTone}>{children}</FinBadge>;
  if (isText && type === 'link')
    content = (
      <Link href={href} className={styles.link}>
        {children}
      </Link>
    );

  return (
    <td {...rest} ref={ref} data-type={type} className={className ? `${styles.cell} ${className}` : styles.cell}>
      <div className={styles.inner}>
        {leadingAccessories && (
          <span className={styles.leading}>
            {leading ?? (
              <FinCheckboxBase
                label={checkboxLabel}
                {...(checked !== undefined ? { checked } : {})}
                {...(onCheckedChange ? { onChange: (event) => onCheckedChange(event.target.checked) } : {})}
                {...(checked !== undefined && !onCheckedChange ? { readOnly: true } : {})}
              />
            )}
          </span>
        )}
        {showContent && children !== undefined && children !== null && <span className={styles.content}>{content}</span>}
        {action && (
          // The icon button (all-button XSmall Tertiary, Only Icon; decided by design 22 Oct 2026): its hover and
          // pressed fills, a 32 square with a 20 icon; the label is hidden and names it.
          <FinButton variant="tertiary" size="xsmall" icon="only-icon" iconName={actionIcon} onClick={onAction}>
            {actionLabel}
          </FinButton>
        )}
      </div>
    </td>
  );
});
