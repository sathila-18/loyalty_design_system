import type { HTMLAttributes, ReactNode } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import type { FinIconName } from '../../icons/finIcons';
import styles from './FinChipBase.module.css';

/** Figma `Type`. Called `variant`, like the buttons. */
export type FinChipVariant = 'unselected' | 'selected' | 'unselected-border';
/** Figma `Size` (`Xsmall` in Figma). */
export type FinChipSize = 'xsmall' | 'small' | 'large';

export interface FinChipBaseProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** The label (Figma `Label text`). One line; cut off with "…" when the container is narrower. */
  children: ReactNode;
  /** Figma `Type`: Unselected, Selected or Unselected-border (white with a stronger border and a shadow). */
  variant?: FinChipVariant;
  /** Figma `Size`: XSmall 26, Small 33, Large 40 tall. */
  size?: FinChipSize;
  /** Figma `Show Leading Accessory` with its default content, an icon: sized and colored by the chip. */
  leadingIcon?: FinIconName;
  /** Figma `Show Leading Accessory` with other content (an avatar, a flag…). Used instead of `leadingIcon`. */
  leadingAccessory?: ReactNode;
  /** Figma `Show Trailing Icon` + the icon (Figma shows a ✕). Decorative here; removing a chip is up to the mapped components. */
  trailingIcon?: FinIconName;
}

const ICON_SIZE = { xsmall: 16, small: 16, large: 20 } as const;

/**
 * The base every chip is built from (Figma Chips-base; DESIGN.md §7.2, §9). Visual only for now: Figma's base has
 * no interaction states; they come with the mapped Chips.
 * **Internal:** not exported from the package; use FinChip. Bases are internal unless DESIGN.md says otherwise.
 */
export function FinChipBase({
  children,
  variant = 'unselected',
  size = 'small',
  leadingIcon,
  leadingAccessory,
  trailingIcon,
  className,
  ...rest
}: FinChipBaseProps) {
  const iconSize = ICON_SIZE[size];
  const leading = leadingAccessory ?? (leadingIcon && <FinIcon name={leadingIcon} size={iconSize} />);
  return (
    <span {...rest} className={className ? `${styles.chip} ${className}` : styles.chip} data-variant={variant} data-size={size}>
      {leading && <span className={styles.leading}>{leading}</span>}
      <span className={styles.label}>{children}</span>
      {trailingIcon && (
        <span className={styles.trailing}>
          <FinIcon name={trailingIcon} size={iconSize} />
        </span>
      )}
    </span>
  );
}
