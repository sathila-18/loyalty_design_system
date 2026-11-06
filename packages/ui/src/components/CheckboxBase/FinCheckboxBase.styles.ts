/*
 * FinCheckboxBase classes (DESIGN.md §9, §3.11). The native checkbox (fin:peer) sits invisibly over the 24px frame:
 * it gets the clicks, keyboard and focus; the box and its icon are drawn here and follow its state (peer-*, and
 * inside-peer-* for the icons inside the box). Disabled: never focusable, no hover or pressed. No animation (§5).
 */

export const checkbox =
  'fin:relative fin:inline-flex fin:flex-none fin:items-center fin:justify-center fin:size-24 fin:cursor-pointer fin:has-disabled:cursor-default';

export const input =
  'fin:peer fin:absolute fin:inset-none fin:size-full fin:m-none fin:opacity-0 fin:cursor-pointer fin:disabled:cursor-default';

/*
 * The 18px box (checkbox-box-size in tailwind.css). Figma's 2px inside stroke is an inset ring, so the 16px icon
 * keeps the full box. Unselected, Enabled: border-default, no fill (was border-strong; changed by design 29 Oct 2026,
 * below 3:1, accepted: §10 #75). Selected and Indeterminate: filled, no stroke. Hovered and Pressed (enabled only),
 * Unselected then Selected / Indeterminate; Pressed wins while held down.
 */
export const box =
  'fin:flex fin:items-center fin:justify-center fin:checkbox-box-size fin:rounded-xs fin:bg-transparent fin:fg-white-both ' +
  'fin:inset-ring-2 fin:inset-ring-default ' +
  'fin:peer-checked:bg-action-primary fin:peer-checked:inset-ring-transparent ' +
  'fin:peer-indeterminate:bg-action-primary fin:peer-indeterminate:inset-ring-transparent ' +
  'fin:peer-disabled:inset-ring-fg-disabled ' +
  'fin:peer-disabled:peer-checked:bg-fg-disabled fin:peer-disabled:peer-checked:inset-ring-transparent fin:peer-disabled:peer-checked:fg-disabled-on-bg ' +
  'fin:peer-disabled:peer-indeterminate:bg-fg-disabled fin:peer-disabled:peer-indeterminate:inset-ring-transparent fin:peer-disabled:peer-indeterminate:fg-disabled-on-bg ' +
  'fin:peer-enabled:peer-hover:bg-active-hover fin:peer-enabled:peer-hover:inset-ring-hovered ' +
  'fin:peer-enabled:peer-active:bg-action-primary-pressed fin:peer-enabled:peer-active:inset-ring-pressed ' +
  'fin:peer-enabled:peer-hover:peer-checked:bg-fg-hovered fin:peer-enabled:peer-hover:peer-checked:inset-ring-transparent ' +
  'fin:peer-enabled:peer-hover:peer-indeterminate:bg-fg-hovered fin:peer-enabled:peer-hover:peer-indeterminate:inset-ring-transparent ' +
  'fin:peer-enabled:peer-active:peer-checked:bg-fg-pressed fin:peer-enabled:peer-active:peer-checked:inset-ring-transparent ' +
  'fin:peer-enabled:peer-active:peer-indeterminate:bg-fg-pressed fin:peer-enabled:peer-active:peer-indeterminate:inset-ring-transparent';

/* Figma Focused: a 2px border-focused ring around the box (22 around 18), same radius. Off when a parent (a list row) draws the ring. */
export const boxFocusRing = 'fin:peer-focus-visible:outline-2 fin:peer-focus-visible:outline-focused';

/* Each icon shows only in its own Type: the check when checked (not indeterminate), the dash when indeterminate. */
export const check = 'fin:hidden fin:inside-peer-checked-only:flex';
export const dash = 'fin:hidden fin:inside-peer-indeterminate:flex';

/* The visually hidden label: read by screen readers, not shown. */
export const label = 'fin:sr-only';
