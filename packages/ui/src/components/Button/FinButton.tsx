'use client';

import { forwardRef } from 'react';
import type { FinIconName } from '../../icons/finIcons';
import {
  FinButtonBase,
  type FinButtonBaseProps,
  type FinButtonBaseVariant,
  type FinButtonContentTone,
  type FinButtonVariant,
} from '../ButtonBase';

/** Figma `Tone`: which button base the look comes from (decided 19 Oct 2026). */
export type FinButtonTone = 'normal' | 'white' | 'destructive';
/** Figma `Icon`. */
export type FinButtonIcon = 'none' | 'leading' | 'trailing' | 'only-icon';

/**
 * Figma `Tone` × `Type`. Only the combinations Figma has: Normal has Primary / Secondary / Tertiary, White has one
 * look, Destructive has Primary / Secondary. Any other combination is a type error.
 */
export type FinButtonToneProps =
  | {
      tone?: 'normal';
      variant?: FinButtonVariant;
      /**
       * Tertiary only, code only (added 26 Oct 2026): `secondary` makes the icon grey (`fg-secondary`) at rest; hover
       * and press keep the Tertiary colors. Default `action`. For the side sheet's back and close buttons.
       */
      iconTone?: 'action' | 'secondary';
      /**
       * Tertiary only, code only (added 27 Oct 2026, for the Snackbar and the Notification banner): colours for the
       * label and icon in every state, with a neutral hover and press: `inverse` (on `bg-direct`), `primary` or
       * `secondary` (on a status or neutral background), or a status's own (`info`, `success`, `error`, `warning`).
       */
      contentTone?: FinButtonContentTone;
    }
  | { tone: 'white'; variant?: 'primary' }
  | { tone: 'destructive'; variant?: 'primary' | 'secondary' };

/** Figma `Icon` and the icon swap: an icon name is required whenever there's an icon. */
export type FinButtonIconProps =
  | { icon?: 'none'; iconName?: never }
  | { icon: Exclude<FinButtonIcon, 'none'>; iconName: FinIconName };

export type FinButtonProps = Omit<
  FinButtonBaseProps,
  'variant' | 'leadingIcon' | 'trailingIcon' | 'showLabel' | 'iconOnly' | 'iconSide' | 'iconTone' | 'contentTone'
> &
  FinButtonToneProps &
  FinButtonIconProps;

function baseVariant(tone: FinButtonTone, variant: FinButtonVariant): FinButtonBaseVariant {
  if (tone === 'white') return 'white';
  if (tone === 'destructive') return variant === 'secondary' ? 'destructive-secondary' : 'destructive';
  return variant;
}

/**
 * The button (Figma all-button; DESIGN.md §9). A thin wrapper of FinButtonBase, which holds the looks of all three
 * Figma button bases (Base-button, white-button, Destructive-button; §7.2). A native `<button>`, `type="button"`
 * unless set; `ref` goes to it. Figma `State` is runtime state (§7.3). `children` is the label; with
 * `icon="only-icon"` it's visually hidden and names the button.
 */
export const FinButton = forwardRef<HTMLButtonElement, FinButtonProps>(function FinButton(
  { tone = 'normal', variant = 'primary', icon = 'none', iconName, ...rest },
  ref,
) {
  return (
    <FinButtonBase
      {...rest}
      ref={ref}
      variant={baseVariant(tone, variant)}
      {...(icon === 'leading' && iconName ? { leadingIcon: iconName } : {})}
      {...((icon === 'trailing' || icon === 'only-icon') && iconName ? { trailingIcon: iconName } : {})}
      showLabel={icon !== 'only-icon'}
      iconOnly={icon === 'only-icon'}
      {...(icon === 'leading' || icon === 'trailing' ? { iconSide: icon } : {})}
    />
  );
});
