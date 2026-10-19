'use client';

import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import type { FinIconName } from '../../icons/finIcons';
import styles from './FinChipBase.module.css';

/** Figma `Type`. Called `variant`, like the buttons. */
export type FinChipVariant = 'unselected' | 'selected' | 'unselected-border';
/** Figma `Size` (`Xsmall` in Figma). */
export type FinChipSize = 'xsmall' | 'small' | 'large';

interface FinChipBaseOwnProps {
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
  /** Figma `Show Trailing Icon` + the icon: decorative, sized and colored by the chip. */
  trailingIcon?: FinIconName;
  /** Other trailing content, used instead of `trailingIcon` (FinInputChip's remove button). */
  trailingAccessory?: ReactNode;
  /** The Disabled look (Figma Chips `State=Disabled`). On a button it's also the native `disabled`. */
  disabled?: boolean;
}

/**
 * `as="button"` makes the whole chip a native button with the Chips hover and pressed states (FinAssistChip,
 * FinFilterChip); the default `span` is not interactive itself (FinInputChip puts its button in the trailing slot).
 */
export type FinChipBaseProps =
  | (FinChipBaseOwnProps & { as?: 'span' } & Omit<HTMLAttributes<HTMLSpanElement>, 'children'>)
  | (FinChipBaseOwnProps & { as: 'button' } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'disabled'>);

const ICON_SIZE = { xsmall: 16, small: 16, large: 20 } as const;

/**
 * The base every chip is built from (Figma Chips-base; DESIGN.md §7.2, §9). Holds the looks (Figma Chips-base `Type`)
 * and the interaction states (Figma Chips `State`), so FinAssistChip, FinFilterChip and FinInputChip only pass props.
 * **Internal:** not exported from the package. Bases are internal unless DESIGN.md says otherwise.
 */
export const FinChipBase = forwardRef<HTMLElement, FinChipBaseProps>(function FinChipBase(props, ref) {
  const {
    as = 'span',
    children,
    variant = 'unselected',
    size = 'small',
    leadingIcon,
    leadingAccessory,
    trailingIcon,
    trailingAccessory,
    disabled = false,
    className,
    ...rest
  } = props;
  const iconSize = ICON_SIZE[size];
  const leading = leadingAccessory ?? (leadingIcon && <FinIcon name={leadingIcon} size={iconSize} />);
  const trailing = trailingAccessory ?? (trailingIcon && <FinIcon name={trailingIcon} size={iconSize} />);
  const Root = as as 'span';
  const buttonProps = as === 'button' ? { type: 'button' as const, disabled } : {};

  return (
    <Root
      {...buttonProps}
      {...(rest as HTMLAttributes<HTMLSpanElement>)}
      ref={ref as Ref<HTMLSpanElement>}
      className={className ? `${styles.chip} ${className}` : styles.chip}
      data-variant={variant}
      data-size={size}
      data-disabled={disabled || undefined}
    >
      {leading && <span className={styles.leading}>{leading}</span>}
      <span className={styles.label}>{children}</span>
      {trailing && <span className={styles.trailing}>{trailing}</span>}
    </Root>
  );
});
