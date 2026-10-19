'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import type { FinIconName } from '../../icons/finIcons';
import styles from './FinButtonBase.module.css';

/** Figma Base-button `Type`. */
export type FinButtonVariant = 'primary' | 'secondary' | 'tertiary';
/** The base's variants: Figma `Type`, plus `white` for FinWhiteButton (Figma white-button, decided 19 Oct 2026). */
export type FinButtonBaseVariant = FinButtonVariant | 'white';
export type FinButtonSize = 'large' | 'medium' | 'small' | 'xsmall';

export interface FinButtonBaseProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** The label (Figma `Button label`). Stays on one line. */
  children: ReactNode;
  /** Figma `Type`. Called `variant` so it doesn't clash with the native `type` (decided 19 Oct 2026). */
  variant?: FinButtonBaseVariant;
  /** Figma `Size`: Large 56, Medium 48, Small 40, XSmall 36 tall. */
  size?: FinButtonSize;
  /** Figma `Show Leading Icon` + the icon: shown when set. */
  leadingIcon?: FinIconName;
  /** Figma `Show Trailing Icon` + the icon: shown when set. */
  trailingIcon?: FinIconName;
  /** Figma `Show Label`. When false the label is visually hidden but still names the button. */
  showLabel?: boolean;
}

const ICON_SIZE = { large: 24, medium: 24, small: 20, xsmall: 20 } as const;

/**
 * The base every button is built from (Figma Base-button; DESIGN.md §7.2, §9). A native `<button>`, `type="button"`
 * unless set. Figma `State` and `Focused` are runtime states (§7.3).
 * **Internal:** not exported from the package; use FinButton. Bases are internal unless DESIGN.md says otherwise.
 */
export const FinButtonBase = forwardRef<HTMLButtonElement, FinButtonBaseProps>(function FinButtonBase(
  {
    children,
    variant = 'primary',
    size = 'large',
    leadingIcon,
    trailingIcon,
    showLabel = true,
    type = 'button',
    className,
    ...rest
  },
  ref,
) {
  const iconSize = ICON_SIZE[size];
  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      className={className ? `${styles.button} ${className}` : styles.button}
      data-variant={variant}
      data-size={size}
    >
      {leadingIcon && (
        <span className={styles.icon}>
          <FinIcon name={leadingIcon} size={iconSize} />
        </span>
      )}
      <span className={showLabel ? styles.label : styles.hiddenLabel}>{children}</span>
      {trailingIcon && (
        <span className={styles.icon}>
          <FinIcon name={trailingIcon} size={iconSize} />
        </span>
      )}
    </button>
  );
});
