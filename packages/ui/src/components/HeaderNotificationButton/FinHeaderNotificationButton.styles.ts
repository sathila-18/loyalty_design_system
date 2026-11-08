/*
 * FinHeaderNotificationButton classes (DESIGN.md §9, §3.11). A 40 circle with the 20 bell centred, padding Space-M: the
 * Small icon button's size (changed by design 2 Nov 2026). The badge is FinBadgeIndicator (Small, red), placed over the
 * top-right of the circle. Figma State=Hovered, Pressed and Disabled (no badge); no Focused design: the default ring,
 * 2px border-focused, 2px out (§10 #6). No animation (§5).
 */
export const button =
  'fin:relative fin:inline-flex fin:flex-none fin:items-center fin:justify-center fin:size-40 fin:m-none fin:p-m ' +
  'fin:border-none fin:border-current fin:rounded-full fin:bg-action-secondary fin:fg-action fin:cursor-pointer ' +
  'fin:enabled:hover:bg-action-secondary-hovered fin:enabled:hover:fg-hovered ' +
  'fin:enabled:active:bg-action-secondary-pressed fin:enabled:active:fg-pressed ' +
  'fin:disabled:bg-disabled fin:disabled:fg-disabled-on-bg fin:disabled:cursor-default ' +
  'fin:focus-visible:outline-2 fin:focus-visible:outline-offset-2 fin:focus-visible:outline-focused';

/*
 * Dot: a 6 dot on the bell's top-right corner, 8 from the top and the right (Figma: 12 in the 48). Number: starts at
 * the circle's centre line, 4 above its top, and grows to the right.
 */
export const badge = {
  dot: 'fin:absolute fin:flex fin:top-m fin:right-m',
  number: 'fin:absolute fin:flex fin:-top-xs fin:left-1/2',
};
