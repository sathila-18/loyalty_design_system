import { FinAvatar } from '../Avatar';
import { FinListItem, type FinListItemProps } from '../ListItem';
import styles from './FinListItemFilled.module.css';

export type FinListItemFilledProps = Omit<FinListItemProps, 'divider'>;

/**
 * List-base in a frame (Figma List_fill-base; DESIGN.md §9): `bg-primary`, a 1px `border-subtle` border, radius L and
 * 16 padding all round, with no divider. Same parts, slots and rules as FinListItem; the leading accessory defaults
 * to a 40 avatar. Filled items shown together sit 12 apart (decided 20 Oct 2026). No interaction states (a base).
 * **Internal:** a base (§7.2).
 */
export function FinListItemFilled({ leading, className, ...rest }: FinListItemFilledProps) {
  return (
    <FinListItem
      {...rest}
      leading={leading ?? <FinAvatar size="medium" />}
      divider={false}
      className={className ? `${styles.filled} ${className}` : styles.filled}
    />
  );
}
