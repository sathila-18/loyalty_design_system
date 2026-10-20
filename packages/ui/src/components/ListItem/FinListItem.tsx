import type { HTMLAttributes, ReactNode } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import type { FinIconName } from '../../icons/finIcons';
import { FinDivider } from '../Divider';
import { FinIconContainer } from '../IconContainer';
import { FinLabel } from '../Label';
import styles from './FinListItem.module.css';

export type FinListItemSize = 'large' | 'small';

export interface FinListItemProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'title'> {
  /** The root element: `li` when the items are in a `ul` / `ol`, so they're siblings and the rule for the last one applies. Default `div`. */
  as?: 'div' | 'li';
  /** Figma `Size`: Large (title Headline Small-H6, body Body/Medium) or Small (Label/Medium, Body/Small). */
  size?: FinListItemSize;
  /** Figma `Show leading accessory`. Default on, as in Figma. */
  leadingAccessory?: boolean;
  /** Figma Leading accessory slot. Default: a 40 Icon container (info, `person`). Any component per scenario. */
  leading?: ReactNode;
  /** Figma `Show top label`: a small label above the title (`text-tertiary`). */
  topLabel?: string;
  /** The title (Figma Text Box, `text-primary`). Wraps. */
  title: ReactNode;
  /** Figma `Show extra icon` and its icon: a 20 icon after the title (`fg-secondary`). Hidden without it. */
  extraIcon?: FinIconName;
  /** Figma `Show body content`. Default on. */
  showBody?: boolean;
  /** Figma Body content slot. Text is shown as the description (`text-secondary`, wraps); other content as given. */
  children?: ReactNode;
  /** Figma `Show trailing accessory`. Default on, as in Figma. */
  trailingAccessory?: boolean;
  /** Figma Trailing accessory slot. Default: `keyboard_arrow_right` 24 (`fg-secondary`). Any component per scenario. */
  trailing?: ReactNode;
  /** Figma `Show divider`: the line under the item. Default on; never on the last item of a group (rule, 20 Oct 2026). */
  divider?: boolean;
}

/**
 * The base of list rows (Figma List-base; DESIGN.md §9): leading accessory, a text column (top label, title with an
 * extra icon, body) and a trailing accessory, with a divider 16 below. Padding 16 / 16 / 0, fills its container.
 * Without a body, the title and trailing accessory are centred on the leading accessory. When several items are
 * shown together (siblings), the last one has no divider.
 * **A base has no interaction states** (decided 20 Oct 2026): hover, selected and focus belong to the components
 * built on it (menus, list rows). Other attributes go to the root.
 * **Internal:** a base (§7.2).
 */
export function FinListItem({
  as: Root = 'div',
  size = 'large',
  leadingAccessory = true,
  leading,
  topLabel,
  title,
  extraIcon,
  showBody = true,
  children,
  trailingAccessory = true,
  trailing,
  divider = true,
  className,
  ...rest
}: FinListItemProps) {
  const body = typeof children === 'string' || typeof children === 'number' ? <p className={styles.description}>{children}</p> : children;
  const hasBody = showBody && children !== undefined && children !== null;

  return (
    <Root {...rest} className={className ? `${styles.item} ${className}` : styles.item} data-size={size} data-body={hasBody ? '' : undefined}>
      <div className={styles.content}>
        <div className={styles.leadingContent}>
          {leadingAccessory && (
            <div className={styles.leading}>{leading ?? <FinIconContainer name="person" size={40} tone="info" />}</div>
          )}
          <div className={styles.text}>
            {topLabel && <FinLabel size="small">{topLabel}</FinLabel>}
            <div className={styles.titleRow}>
              <span className={styles.title}>{title}</span>
              {extraIcon && <FinIcon name={extraIcon} size={20} color="secondary" />}
            </div>
            {hasBody && <div className={styles.body}>{body}</div>}
          </div>
        </div>
        {trailingAccessory && (
          <div className={styles.trailing}>{trailing ?? <FinIcon name="keyboard_arrow_right" size={24} color="secondary" />}</div>
        )}
      </div>
      {divider && <FinDivider decorative className={styles.divider} />}
    </Root>
  );
}
