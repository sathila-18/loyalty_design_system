/*
 * FinRadio classes (DESIGN.md §9, §3.11). The native radio (fin:peer) sits invisibly over the 24px box: it gets the
 * clicks, keyboard and focus; the ring and dot are drawn here and follow its state (peer-*, and inside-peer-* for the
 * dot inside the ring). No animation: motion is deferred (§5).
 */

export const radio =
  'fin:relative fin:inline-flex fin:flex-none fin:items-center fin:justify-center fin:size-24 fin:cursor-pointer fin:has-disabled:cursor-default';

export const input =
  'fin:peer fin:absolute fin:inset-none fin:size-full fin:m-none fin:opacity-0 fin:cursor-pointer fin:disabled:cursor-default';

/*
 * Unselected, Enabled: a 20px ring, 2px border-strong stroke inside (3.90:1 Light, 8.76:1 Dark since 19 Oct 2026).
 * Selected: fg-action ring and dot (the dot is currentcolor). Disabled: fg-disabled, never focusable, no hover or
 * pressed. Hovered and Pressed (enabled only), unselected then selected; Pressed wins while the button is down.
 */
export const ring =
  'fin:flex fin:items-center fin:justify-center fin:size-20 fin:border-2 fin:border-strong fin:rounded-full ' +
  'fin:peer-checked:border-fg-action fin:peer-checked:fg-action fin:peer-disabled:border-fg-disabled fin:peer-disabled:fg-disabled ' +
  'fin:peer-enabled:peer-hover:border-hovered fin:peer-enabled:peer-hover:bg-active ' +
  'fin:peer-enabled:peer-active:border-pressed fin:peer-enabled:peer-active:bg-active-hover ' +
  'fin:peer-enabled:peer-hover:peer-checked:border-fg-hovered fin:peer-enabled:peer-hover:peer-checked:bg-transparent fin:peer-enabled:peer-hover:peer-checked:fg-hovered ' +
  'fin:peer-enabled:peer-active:peer-checked:border-fg-pressed fin:peer-enabled:peer-active:peer-checked:bg-transparent fin:peer-enabled:peer-active:peer-checked:fg-pressed';

/* Focus (no Focused variant in Figma): the default ring, 2px border-focused, 2px offset (§10 #6). Off when a parent (a list row) draws the ring. */
export const ringFocus = 'fin:peer-focus-visible:outline-2 fin:peer-focus-visible:outline-offset-2 fin:peer-focus-visible:outline-focused';

/* The 12px dot, shown when Selected. */
export const dot = 'fin:hidden fin:size-12 fin:rounded-full fin:bg-current fin:inside-peer-checked:block';

/* The visually hidden label: read by screen readers, not shown. */
export const label = 'fin:sr-only';
