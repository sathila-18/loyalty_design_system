/*
 * FinChipBase classes (DESIGN.md §9, §3.11). Icons are FinIcon with no color, so they take the color of their wrapper:
 * the leading icon follows the Type, the trailing icon is fg-secondary (as Figma) until Pressed or Disabled. Figma's
 * 1px stroke is an inset ring, so it never changes the size. Interaction states (Figma Chips) apply when the chip is a
 * button (they follow it through group-*\/chip:); Disabled applies to any chip. No animation (§5).
 */
import type { FinChipSize, FinChipVariant } from './FinChipBase';

/* No Focused design for chips: the default ring, 2px border-focused, 2px out (§10 #6). */
export const chip =
  'fin:group/chip fin:inline-flex fin:flex-none fin:items-center fin:justify-center fin:max-w-full fin:rounded-s ' +
  'fin:focus-visible:outline-2 fin:focus-visible:outline-offset-2 fin:focus-visible:outline-focused';

/* As a button: no native button look. */
export const asButton = 'fin:m-none fin:border-none fin:border-current fin:cursor-pointer fin:disabled:cursor-default';

/* Sizes. Height comes from the padding plus the text style's line height (18 / 21 / 24). */
export const size: Record<FinChipSize, string> = {
  xsmall: 'fin:py-xs fin:px-m fin:gap-xs fin:font-label-small',
  small: 'fin:py-s fin:px-l fin:gap-m fin:font-label-medium',
  large: 'fin:py-m fin:px-l fin:gap-m fin:font-label-large',
};

/** A plain chip, a button chip (with the Chips hover and pressed states), or a disabled one. */
export type FinChipState = 'static' | 'button' | 'disabled';

/*
 * Types and states (Figma Chips). Selected: text-action on bg-active is 4.14:1 Light / 3.95:1 Dark, accepted by design
 * (19 Oct 2026, §10 #3). Unselected-border: white with a stronger border and the Resting cards shadow. Unselected (and
 * Unselected-border, which has no states of its own in Figma) drops its border and shadow on Hovered, Pressed and
 * Disabled; Selected keeps one. Hover and press contrast is accepted (§10 #3).
 */
const hover = 'fin:enabled:hover:bg-active-hover fin:enabled:active:bg-action-primary-pressed fin:enabled:active:text-inverse';
const dropStroke =
  'fin:enabled:hover:inset-ring-transparent fin:enabled:hover:shadow-none fin:enabled:active:inset-ring-transparent fin:enabled:active:shadow-none';
export const look: Record<FinChipVariant, Record<FinChipState, string>> = {
  unselected: {
    static: 'fin:bg-primary fin:inset-ring fin:inset-ring-subtle fin:text-primary',
    button: `fin:bg-primary fin:inset-ring fin:inset-ring-subtle fin:text-primary ${hover} ${dropStroke}`,
    disabled: 'fin:bg-disabled fin:text-disabled-on-bg',
  },
  selected: {
    static: 'fin:bg-active fin:inset-ring fin:inset-ring-active fin:text-action',
    button: `fin:bg-active fin:inset-ring fin:inset-ring-active fin:text-action ${hover} fin:enabled:active:inset-ring-pressed`,
    disabled: 'fin:bg-disabled fin:inset-ring fin:inset-ring-disabled fin:text-disabled-on-bg',
  },
  'unselected-border': {
    static: 'fin:bg-primary fin:inset-ring fin:inset-ring-default fin:text-primary fin:shadow-resting-cards',
    button: `fin:bg-primary fin:inset-ring fin:inset-ring-default fin:text-primary fin:shadow-resting-cards ${hover} ${dropStroke}`,
    disabled: 'fin:bg-disabled fin:text-disabled-on-bg',
  },
};

/* The leading accessory: an icon, or other content laid out 8 apart. */
const leadingBox = 'fin:inline-flex fin:flex-none fin:gap-m fin:items-center';
const pressedIcon = 'fin:group-enabled/chip:group-active/chip:fg-inverse';
export const leading: Record<FinChipVariant, Record<FinChipState, string>> = {
  unselected: {
    static: `${leadingBox} fin:fg-secondary`,
    button: `${leadingBox} fin:fg-secondary ${pressedIcon}`,
    disabled: `${leadingBox} fin:fg-disabled-on-bg`,
  },
  selected: {
    static: `${leadingBox} fin:fg-brand`,
    button: `${leadingBox} fin:fg-brand ${pressedIcon}`,
    disabled: `${leadingBox} fin:fg-disabled-on-bg`,
  },
  'unselected-border': {
    static: `${leadingBox} fin:fg-secondary`,
    button: `${leadingBox} fin:fg-secondary ${pressedIcon}`,
    disabled: `${leadingBox} fin:fg-disabled-on-bg`,
  },
};

export const trailing: Record<FinChipState, string> = {
  static: 'fin:inline-flex fin:flex-none fin:fg-secondary',
  button: `fin:inline-flex fin:flex-none fin:fg-secondary ${pressedIcon}`,
  disabled: 'fin:inline-flex fin:flex-none fin:fg-disabled-on-bg',
};

/* One line, no fixed max width; "…" when the container is narrower (as FinBadgeBase). */
export const label = 'fin:min-w-0 fin:truncate';
