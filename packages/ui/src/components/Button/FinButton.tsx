'use client';

import { forwardRef, type ReactElement, type RefAttributes } from 'react';
import type { FinIconName } from '../../icons/finIcons';
import {
  FinButtonBase,
  type FinButtonBaseLinkProps,
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

/** The base's props FinButton sets itself, from `tone`, `variant`, `icon` and `iconName`. */
type FinButtonSetProps = 'variant' | 'leadingIcon' | 'trailingIcon' | 'showLabel' | 'iconOnly' | 'iconSide' | 'iconTone' | 'contentTone';

/**
 * A native `<button>` (default), or with `href` a link with the same look (code only, added 10 Nov 2026): `<a>`, or
 * `linkAs` for a router's link component. Links can't be disabled and have no `type`.
 */
export type FinButtonElementProps = Omit<FinButtonBaseProps, FinButtonSetProps> | Omit<FinButtonBaseLinkProps, FinButtonSetProps>;

/** FinButton as a `<button>`. */
export type FinButtonButtonProps = Omit<FinButtonBaseProps, FinButtonSetProps> & FinButtonToneProps & FinButtonIconProps;
/** FinButton as a link (`href`). */
export type FinButtonLinkProps = Omit<FinButtonBaseLinkProps, FinButtonSetProps> & FinButtonToneProps & FinButtonIconProps;
export type FinButtonProps = FinButtonButtonProps | FinButtonLinkProps;

/** Two signatures, so `ref` is typed by what renders: a button's ref is an HTMLButtonElement, a link's an HTMLAnchorElement. */
interface FinButtonComponent {
  (props: FinButtonButtonProps & RefAttributes<HTMLButtonElement>): ReactElement | null;
  (props: FinButtonLinkProps & RefAttributes<HTMLAnchorElement>): ReactElement | null;
  displayName?: string;
}

function baseVariant(tone: FinButtonTone, variant: FinButtonVariant): FinButtonBaseVariant {
  if (tone === 'white') return 'white';
  if (tone === 'destructive') return variant === 'secondary' ? 'destructive-secondary' : 'destructive';
  return variant;
}

/**
 * The button (Figma all-button; DESIGN.md §9). A thin wrapper of FinButtonBase, which holds the looks of all three
 * Figma button bases (Base-button, white-button, Destructive-button; §7.2). A native `<button>`, `type="button"`
 * unless set; with `href`, a link with the same look (`<a>`, or `linkAs` for next/link). `ref` goes to the element.
 * Figma `State` is runtime state (§7.3). `children` is the label; with `icon="only-icon"` it's visually hidden and
 * names the button.
 */
export const FinButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, FinButtonProps>(function FinButton(
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
}) as FinButtonComponent;
