/*
 * FinMenu classes (DESIGN.md §9, §3.11). Figma standard-menu `Type=Normal`: bg-primary, 1px border-subtle, Radius-M,
 * no padding, content clipped to the corners, Shadow/Menu. Shown in the top layer (popover) at the position Floating
 * UI works out, Space-XS from the trigger (menu-place and the menu-* sizes in tailwind.css). No animation (§5).
 */

const menuBase =
  'fin:menu-place fin:fixed fin:flex fin:flex-col fin:box-border fin:m-none fin:p-none fin:overflow-hidden ' +
  'fin:border fin:border-subtle fin:rounded-m fin:bg-primary fin:text-primary fin:shadow-menu';

export const menu = menuBase;

/* Until Floating UI has placed it (one frame), keep it out of sight. */
export const unplaced = 'fin:invisible';

/* Never past the window, or a fixed limit and never past the window. */
export const maxHeight = { window: 'fin:menu-max-h', limit: 'fin:menu-max-h-limit' };

/* Width: fits the content but never narrower than the trigger; the trigger's (fields); or a given length. */
export const width = { content: 'fin:menu-min-w-trigger', trigger: 'fin:menu-w-trigger', custom: 'fin:menu-w-custom' };

/*
 * The menu itself takes focus when opened with a pointer (the list, the nav or the filter dialog): no ring there, as
 * the rows show theirs once the keyboard is used.
 */
export const focusTarget = 'fin:focus:outline-none';

/* Figma `conten` slot: no padding or gap; scrolls when the menu is at its limit. */
export const content = 'fin:flex fin:flex-auto fin:flex-col fin:min-h-0 fin:overflow-y-auto fin:overscroll-contain';

export const list = 'fin:flex fin:flex-col fin:m-none fin:p-none fin:list-none';

export const separator = 'fin:block';

/* Code first (22 Oct 2026): content kept at the top (a search field), a line below. Code only (2 Nov 2026): a list row brings its own padding. */
const headerBase = 'fin:flex-none fin:border-b fin:border-b-subtle';

export const header = { default: `${headerBase} fin:p-l`, none: `${headerBase} fin:p-none` };

/* Code first (22 Oct 2026): buttons kept at the bottom, a line above, right aligned. */
export const footer = 'fin:flex fin:flex-none fin:gap-m fin:justify-end fin:p-xl fin:border-t fin:border-t-subtle';
