/*
 * FinTableColumnFilter classes (DESIGN.md §9, §3.11). The header's down arrow as an icon-only button, 24 × 24 with no
 * padding (as the table cell's action button): fg-secondary; hover fg-hovered, pressed fg-pressed; purple (fg-action)
 * while its menu is open or a filter is applied, whatever the pointer does (decided 22 Oct 2026). Code first: Figma's
 * arrow is display only (§10 #50).
 */

const buttonBase =
  'fin:inline-flex fin:flex-none fin:items-center fin:justify-center fin:m-none fin:p-none fin:border-none fin:border-current ' +
  'fin:rounded-xs fin:bg-transparent fin:cursor-pointer ' +
  'fin:focus-visible:outline-2 fin:focus-visible:outline-offset-2 fin:focus-visible:outline-focused';

export const button = {
  idle:
    `${buttonBase} fin:fg-secondary fin:not-aria-expanded:hover:fg-hovered fin:not-aria-expanded:active:fg-pressed ` +
    'fin:aria-expanded:fg-action',
  active: `${buttonBase} fin:fg-action`,
};
