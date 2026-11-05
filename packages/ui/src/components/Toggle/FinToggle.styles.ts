/*
 * FinToggle classes (DESIGN.md §9, §3.11). The native checkbox (fin:peer) sits invisibly over the track: it gets the
 * clicks, keyboard and focus; the track and handle are drawn here and follow its state (peer-*, and inside-peer-* for
 * the handle inside the track). No hover/pressed design yet: cursor only. No animation: motion is deferred (§5), so
 * the handle moves instantly. Disabled is never focusable, so Figma's Disabled + Focused variants don't apply (§7.3).
 */
import type { FinToggleSize } from './FinToggle';

export const toggle = 'fin:relative fin:inline-flex fin:flex-none fin:cursor-pointer fin:has-disabled:cursor-default';

export const input =
  'fin:peer fin:absolute fin:inset-none fin:size-full fin:m-none fin:opacity-0 fin:cursor-pointer fin:disabled:cursor-default';

/*
 * Unselected, enabled: fg-placeholder track (Light 2.96:1 on white, logged in §10 #3), handle on the left. Selected:
 * brand track, handle on the right. Disabled: border-disabled, or bg-disabled when selected.
 */
export const track =
  'fin:flex fin:items-center fin:justify-start fin:p-xs fin:rounded-full fin:bg-fg-placeholder ' +
  'fin:peer-checked:justify-end fin:peer-checked:bg-fg-brand fin:peer-disabled:bg-border-disabled fin:peer-disabled:peer-checked:bg-disabled';

/* Figma Focused: a 2px border-focused ring, 1px outside the track. Off when a parent (a list row) draws the ring. */
export const trackFocusRing =
  'fin:peer-focus-visible:outline-2 fin:peer-focus-visible:outline-offset-1 fin:peer-focus-visible:outline-focused';

export const handle =
  'fin:rounded-full fin:bg-fg-white-both fin:inside-peer-disabled:bg-fg-disabled fin:inside-peer-disabled:inside-peer-checked:bg-fg-disabled-on-bg';

export const size: Record<FinToggleSize, { track: string; handle: string }> = {
  small: { track: 'fin:w-40 fin:h-24', handle: 'fin:size-16' },
  large: { track: 'fin:w-56 fin:h-32', handle: 'fin:size-24' },
};

/* The visually hidden label: read by screen readers, not shown. */
export const label = 'fin:sr-only';
