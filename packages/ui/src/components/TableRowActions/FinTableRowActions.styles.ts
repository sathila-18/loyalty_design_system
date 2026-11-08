/*
 * FinTableRowActions classes (DESIGN.md §9, §3.11). The "more actions" button works as the icon button (all-button
 * XSmall Tertiary, Only Icon; decided by design 22 Oct 2026): a 32 square (padding Space-S, a 20 icon), Radius-S;
 * hover bg-action-secondary_hovered with fg-hovered, pressed bg-action-secondary_pressed with fg-pressed. At rest the
 * icon is fg-secondary (not the Tertiary purple), and while its menu is open it's purple (fg-action) on
 * bg-action-secondary, unless hovered or pressed (menu-open-idle in tailwind.css). The buttons' ring (FinButtonBase):
 * 2px border-focused, 1px in. Code first: no Figma design yet.
 */

export const button =
  'fin:inline-flex fin:flex-none fin:items-center fin:justify-center fin:m-none fin:p-s fin:border-none fin:border-current ' +
  'fin:rounded-s fin:bg-transparent fin:fg-secondary fin:cursor-pointer ' +
  'fin:menu-open-idle:bg-action-secondary fin:menu-open-idle:fg-action ' +
  'fin:hover:bg-action-secondary-hovered fin:hover:fg-hovered fin:active:bg-action-secondary-pressed fin:active:fg-pressed ' +
  'fin:focus-visible:outline-2 fin:focus-visible:-outline-offset-1 fin:focus-visible:outline-focused';
