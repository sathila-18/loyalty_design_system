/*
 * FinCalendar classes (DESIGN.md §9, §3.11). Code first (13 Nov 2026; no Figma component): shadcn's calendar in this
 * system's tokens. Space-L around it; months Space-2XL apart; a header 40 high with the month title (Title/Small) in
 * the middle and the previous / next buttons (FinButton Tertiary, icon only) at its ends; weekday labels
 * (Label/Small, text-secondary) and day buttons 40 × 40, Radius-S, Body/Medium. No animation (§5).
 */

export const root = 'fin:inline-flex fin:flex-col fin:box-border fin:p-l fin:text-primary';

export const months = 'fin:flex fin:items-start fin:gap-2xl';

export const month = 'fin:flex fin:flex-col fin:gap-s';

/* The title is centred over the whole header (absolute), so it stays centred with one button or two. */
export const header = 'fin:relative fin:flex fin:items-center fin:h-40';

export const title =
  'fin:absolute fin:inset-none fin:flex fin:items-center fin:justify-center fin:m-none fin:font-title-small fin:text-primary ' +
  'fin:pointer-events-none';

export const previous = 'fin:relative fin:me-auto';
export const next = 'fin:relative fin:ms-auto';

export const grid = 'fin:border-collapse';

export const weekday = 'fin:size-40 fin:p-none fin:font-label-small fin:text-secondary fin:text-center';

/*
 * The cell carries a range's band (bg-active), rounded at the range's start and end; a day alone has none. A day of
 * another month in a two-month calendar is an empty cell.
 */
const cellBase = 'fin:p-none';

export const cell = {
  none: cellBase,
  band: `${cellBase} fin:bg-active`,
  start: `${cellBase} fin:bg-active fin:rounded-s-s`,
  end: `${cellBase} fin:bg-active fin:rounded-e-s`,
};

/* The default focus ring, 2px border-focused, 2px out (§10 #6), as the pagination's page buttons. */
const focus = 'fin:focus-visible:outline-2 fin:focus-visible:outline-offset-2 fin:focus-visible:outline-focused';

const dayBase =
  'fin:relative fin:flex fin:items-center fin:justify-center fin:size-40 fin:m-none fin:p-none fin:border-none ' +
  `fin:border-current fin:rounded-s fin:font-body-medium ${focus}`;

/* One list per look; none of them set the same property as another (rule 2). */
export const day = {
  // A day of the month shown; hover bg-secondary, pressed bg-tertiary.
  default: `${dayBase} fin:bg-transparent fin:text-primary fin:cursor-pointer fin:hover:bg-secondary fin:active:bg-tertiary`,
  // Inside a range (on the cell's bg-active band): the band's own hover.
  band: `${dayBase} fin:bg-transparent fin:text-primary fin:cursor-pointer fin:hover:bg-active-hover fin:active:bg-active-hover`,
  // A day of the previous or next month (one-month calendar only).
  outside: `${dayBase} fin:bg-transparent fin:text-tertiary fin:cursor-pointer fin:hover:bg-secondary fin:active:bg-tertiary`,
  // The chosen day, or a range's start and end: the primary button's colours.
  selected:
    `${dayBase} fin:bg-action-primary fin:text-white-both fin:cursor-pointer fin:hover:bg-action-primary-hovered ` +
    'fin:active:bg-action-primary-pressed',
  // Before `min`, after `max` or ruled out: can't be chosen (still reachable with the arrow keys, as WAI-ARIA's pattern).
  disabled: `${dayBase} fin:bg-transparent fin:text-disabled fin:cursor-default`,
};

/* Today, when it isn't chosen: a 1px border-strong stroke inside. */
export const today = 'fin:inset-ring fin:inset-ring-strong';
