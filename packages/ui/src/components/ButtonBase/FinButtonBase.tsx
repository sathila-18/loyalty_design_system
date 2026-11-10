'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import type { FinIconName } from '../../icons/finIcons';
import * as styles from './FinButtonBase.styles';

/** Figma Base-button `Type`. */
export type FinButtonVariant = 'primary' | 'secondary' | 'tertiary';
/**
 * The base's variants: Figma `Type`, plus the colors of the other two button bases (decided 19 Oct 2026):
 * `white` for FinWhiteButton (Figma white-button), `destructive` / `destructive-secondary` for FinDestructiveButton.
 */
export type FinButtonBaseVariant = FinButtonVariant | 'white' | 'destructive' | 'destructive-secondary';
export type FinButtonSize = 'large' | 'medium' | 'small' | 'xsmall';
/** Tertiary's code-only label and icon colours (`contentTone`): the `text-*` / `fg-*` token names. */
export type FinButtonContentTone = 'inverse' | 'primary' | 'secondary' | 'info' | 'success' | 'error' | 'warning';

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
  /**
   * Square padding for an icon-only button (all-button `Icon=Only Icon`, where Figma overrides the base's padding):
   * the vertical padding on every side, so 56 / 48 / 36 / 32. Set by FinButton, not part of Figma's Base-button.
   */
  iconOnly?: boolean;
  /**
   * Less padding on the icon's side, so a button with one icon looks balanced (all-button `Icon=Leading` /
   * `Trailing`, where Figma overrides the base's padding; decided 19 Oct 2026). Set by FinButton, not part of
   * Figma's Base-button.
   */
  iconSide?: 'leading' | 'trailing';
  /**
   * Tertiary only, code only (added 26 Oct 2026 for the side sheet's back and close buttons): `secondary` makes the
   * icon `fg-secondary` (grey) at rest; hover and press keep the Tertiary colors. Set through FinButton `iconTone`.
   */
  iconTone?: 'action' | 'secondary';
  /**
   * Tertiary only, code only (added 27 Oct 2026 for the Snackbar and the Notification banner, whose Figma buttons
   * override the colours): the label and icon in `text-<tone>` / `fg-<tone>` in every state, with a neutral hover and
   * press. Set through FinButton `contentTone`.
   */
  contentTone?: FinButtonContentTone;
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
    iconOnly = false,
    iconSide,
    iconTone = 'action',
    contentTone,
    type = 'button',
    className,
    ...rest
  },
  ref,
) {
  const iconSize = ICON_SIZE[size];
  // Tertiary's colours give way to contentTone, and its icon to iconTone; the other variants ignore both (§9.28).
  const tone = variant === 'tertiary' && contentTone ? styles.contentTone[contentTone] : undefined;
  const colours = tone ?? styles.variant[variant];
  const iconClass = `${styles.icon} ${!tone && variant === 'tertiary' && iconTone === 'secondary' ? styles.tertiaryGreyIcon : colours.icon}`;
  const padding = styles.size[size].padding[iconOnly ? 'only' : (iconSide ?? 'none')];
  const buttonClass = [styles.button, styles.size[size].button, padding, colours.button, className].filter(Boolean).join(' ');
  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      className={buttonClass}
      data-variant={variant}
      data-size={size}
      data-icon-only={iconOnly || undefined}
      data-icon-side={iconSide}
      data-icon-tone={iconTone === 'secondary' ? 'secondary' : undefined}
      data-content-tone={contentTone}
    >
      {leadingIcon && (
        <span className={iconClass}>
          <FinIcon name={leadingIcon} size={iconSize} />
        </span>
      )}
      <span className={showLabel ? styles.label : styles.hiddenLabel}>{children}</span>
      {trailingIcon && (
        <span className={iconClass}>
          <FinIcon name={trailingIcon} size={iconSize} />
        </span>
      )}
    </button>
  );
});
