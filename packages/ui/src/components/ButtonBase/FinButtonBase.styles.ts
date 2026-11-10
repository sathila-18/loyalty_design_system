/*
 * FinButtonBase classes (DESIGN.md §9.28, §3.11). Each prop value has its own list, picked in FinButtonBase.tsx, so
 * two lists never set the same property and nothing depends on the order Tailwind writes its rules in. Interaction
 * states are variants inside each list: not-disabled:hover:, not-disabled:active:, disabled:, focus-visible:. not-disabled:
 * (not enabled:) so the same lists work on the link (an <a> is never :enabled; for a <button> the two are the same). The icons take
 * their colour from the button's state through group-*\/button: (FinIcon has no colour of its own and inherits it);
 * the label uses the text-* token, as in Figma. No animation: motion is deferred (§5).
 */
import type { FinButtonBaseVariant, FinButtonContentTone, FinButtonSize } from './FinButtonBase';

/*
 * The button. Figma's inside stroke (Secondary 2px, White 1px) is an inset ring: drawn inside the box, so it never
 * changes the size. Figma Focused: a 2px border-focused ring straddling the edge (1px outside, 1px inside).
 */
export const button =
  'fin:group/button fin:relative fin:inline-flex fin:flex-none fin:items-center fin:justify-center fin:gap-m fin:whitespace-nowrap ' +
  'fin:border-none fin:border-current fin:cursor-pointer fin:disabled:cursor-default ' +
  'fin:focus-visible:outline-2 fin:focus-visible:-outline-offset-1 fin:focus-visible:outline-focused';

/* The link (href): no underline (the reset has no rule for links); the look is the variant's. */
export const link = 'fin:no-underline';

type Padding = { none: string; leading: string; trailing: string; only: string };

/*
 * Sizes. Height comes from the padding plus the 24px line height. One icon (all-button Icon=Leading / Trailing): one
 * step less padding on the icon's side, so the button looks balanced. Icon only: the vertical padding on every side
 * makes it square.
 */
export const size: Record<FinButtonSize, { button: string; padding: Padding }> = {
  large: {
    button: 'fin:rounded-m fin:font-button-xlarge',
    padding: { none: 'fin:py-xl fin:px-3xl', leading: 'fin:py-xl fin:ps-xl fin:pe-3xl', trailing: 'fin:py-xl fin:ps-3xl fin:pe-xl', only: 'fin:p-xl' },
  },
  medium: {
    button: 'fin:rounded-m fin:font-button-large',
    padding: { none: 'fin:py-l fin:px-3xl', leading: 'fin:py-l fin:ps-xl fin:pe-3xl', trailing: 'fin:py-l fin:ps-3xl fin:pe-xl', only: 'fin:p-l' },
  },
  small: {
    button: 'fin:rounded-s fin:font-button-medium',
    padding: { none: 'fin:py-m fin:px-xl', leading: 'fin:py-m fin:ps-l fin:pe-xl', trailing: 'fin:py-m fin:ps-xl fin:pe-l', only: 'fin:p-m' },
  },
  xsmall: {
    button: 'fin:rounded-s fin:font-button-medium',
    padding: { none: 'fin:py-s fin:px-xl', leading: 'fin:py-s fin:ps-l fin:pe-xl', trailing: 'fin:py-s fin:ps-xl fin:pe-l', only: 'fin:p-s' },
  },
};

/* A Tertiary link: the size's vertical padding only, so its text lines up with the content around it (10 Nov 2026). */
export const flushPadding: Record<FinButtonSize, string> = {
  large: 'fin:py-xl fin:px-none',
  medium: 'fin:py-l fin:px-none',
  small: 'fin:py-m fin:px-none',
  xsmall: 'fin:py-s fin:px-none',
};

/* Secondary (outlined) and Tertiary (text only) share every colour except the border. */
const secondaryIcon =
  'fin:group-not-disabled/button:group-hover/button:fg-hovered fin:group-not-disabled/button:group-active/button:fg-pressed fin:group-disabled/button:fg-disabled';

/*
 * Colours, per variant: the button (background, label, stroke) and its icons. Primary's Dark hover / pressed contrast
 * is a documented exception (§10 #3). White (Figma white-button, FinWhiteButton): white in both themes with dark text,
 * a 1px border-subtle in every state (§10 #40), the Secondary hover / pressed colours. Destructive (Figma
 * Destructive-button, FinDestructiveButton): Primary is filled red; Secondary has a 2px red stroke and keeps its red
 * text and stroke on hover and press.
 */
export const variant: Record<FinButtonBaseVariant, { button: string; icon: string }> = {
  primary: {
    button:
      'fin:bg-action-primary fin:text-white-both fin:not-disabled:hover:bg-action-primary-hovered fin:not-disabled:active:bg-action-primary-pressed ' +
      'fin:disabled:bg-disabled fin:disabled:text-disabled-on-bg',
    icon: 'fin:fg-white-both fin:group-disabled/button:fg-disabled-on-bg',
  },
  secondary: {
    button:
      'fin:bg-transparent fin:text-action fin:inset-ring-2 fin:inset-ring-active ' +
      'fin:not-disabled:hover:bg-action-secondary-hovered fin:not-disabled:hover:text-hovered fin:not-disabled:hover:inset-ring-hovered ' +
      'fin:not-disabled:active:bg-action-secondary-pressed fin:not-disabled:active:text-pressed fin:not-disabled:active:inset-ring-pressed ' +
      'fin:disabled:text-disabled fin:disabled:inset-ring-disabled',
    icon: `fin:fg-action ${secondaryIcon}`,
  },
  // Figma's XSmall Tertiary uses bg-active-hover when pressed; every other size uses the pressed token (§9).
  tertiary: {
    button:
      'fin:bg-transparent fin:text-action ' +
      'fin:not-disabled:hover:bg-action-secondary-hovered fin:not-disabled:hover:text-hovered ' +
      'fin:not-disabled:active:bg-action-secondary-pressed fin:not-disabled:active:text-pressed fin:disabled:text-disabled',
    icon: `fin:fg-action ${secondaryIcon}`,
  },
  white: {
    button:
      'fin:bg-action-inverse fin:text-dark-both fin:inset-ring fin:inset-ring-subtle ' +
      'fin:not-disabled:hover:bg-active fin:not-disabled:hover:text-hovered fin:not-disabled:active:bg-action-secondary-pressed fin:not-disabled:active:text-pressed ' +
      'fin:disabled:bg-disabled fin:disabled:text-disabled-on-bg',
    icon:
      'fin:fg-dark-both fin:group-not-disabled/button:group-hover/button:fg-hovered fin:group-not-disabled/button:group-active/button:fg-pressed ' +
      'fin:group-disabled/button:fg-disabled-on-bg',
  },
  destructive: {
    button:
      'fin:bg-action-destructive fin:text-white-both fin:not-disabled:hover:bg-action-destructive-hovered fin:not-disabled:active:bg-action-destructive-pressed ' +
      'fin:disabled:bg-disabled fin:disabled:text-disabled-on-bg',
    icon: 'fin:fg-white-both fin:group-disabled/button:fg-disabled-on-bg',
  },
  'destructive-secondary': {
    button:
      'fin:bg-transparent fin:text-error fin:inset-ring-2 fin:inset-ring-error ' +
      'fin:not-disabled:hover:bg-action-destructive-secondary-hovered fin:not-disabled:active:bg-action-destructive-secondary-pressed ' +
      'fin:disabled:text-disabled fin:disabled:inset-ring-disabled',
    icon: 'fin:fg-error fin:group-disabled/button:fg-disabled',
  },
};

/* Tertiary with a grey icon (code-only `iconTone`, 26 Oct 2026): at rest only; hover and press stay Tertiary. */
export const tertiaryGreyIcon = `fin:fg-secondary ${secondaryIcon}`;

/*
 * Tertiary in the Snackbar and the Notification banner (code-only `contentTone`, 27 Oct 2026), in place of the
 * Tertiary colours: the label and icon in the tone's text-* / fg-* in every state (disabled too), and a tinted
 * background on hover and press: alpha-light (white 12%) on bg-direct, alpha-sm elsewhere.
 */
const toneHover = 'fin:not-disabled:hover:bg-alpha-sm fin:not-disabled:active:bg-alpha-sm';
export const contentTone: Record<FinButtonContentTone, { button: string; icon: string }> = {
  inverse: {
    // In Dark, bg-direct is light, so white 12% doesn't show: alpha-sm instead (§10 #74). The one theme selector in a
    // component; it goes when Figma has an alpha token that flips with the theme.
    button:
      'fin:bg-transparent fin:text-inverse fin:not-disabled:hover:bg-alpha-light fin:not-disabled:active:bg-alpha-light ' +
      'fin:[[data-theme=dark]_&]:not-disabled:hover:bg-alpha-sm fin:[[data-theme=dark]_&]:not-disabled:active:bg-alpha-sm',
    icon: 'fin:fg-inverse',
  },
  primary: { button: `fin:bg-transparent fin:text-primary ${toneHover}`, icon: 'fin:fg-primary' },
  secondary: { button: `fin:bg-transparent fin:text-secondary ${toneHover}`, icon: 'fin:fg-secondary' },
  info: { button: `fin:bg-transparent fin:text-info ${toneHover}`, icon: 'fin:fg-info' },
  success: { button: `fin:bg-transparent fin:text-success ${toneHover}`, icon: 'fin:fg-success' },
  error: { button: `fin:bg-transparent fin:text-error ${toneHover}`, icon: 'fin:fg-error' },
  warning: { button: `fin:bg-transparent fin:text-warning ${toneHover}`, icon: 'fin:fg-warning' },
};

export const icon = 'fin:inline-flex fin:flex-none';
export const label = 'fin:min-w-0';
/* Figma Show Label off: read by screen readers, not shown. */
export const hiddenLabel = 'fin:sr-only';
