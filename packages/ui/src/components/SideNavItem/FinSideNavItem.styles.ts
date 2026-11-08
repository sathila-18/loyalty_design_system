/*
 * FinSideNavItem classes (DESIGN.md §9, §3.11). Figma Main Selection: padding 8 (Space-M) / 12 (Space-L), gap 12
 * (Space-L), radius M, Label/Medium text-secondary; chevron 20 fg-secondary, fg-active when selected. Default has no
 * fill (the nav's bg-secondary shows); Hovered bg-tertiary, Pressed bg-neutral; Selected - BG bg-primary +
 * text-action (no hover change); Selected text-action. Sub items 4 (Space-XS) below, 4 apart. The label keeps a 12
 * gap before the chevron (decided 29 Oct 2026). No Focused design: a 2px border-focused ring inside.
 */
import type { FinSideNavItemSelected, FinSideNavItemType } from './FinSideNavItem';

export const item = 'fin:flex fin:flex-col fin:gap-xs';

const header =
  'fin:relative fin:flex fin:gap-l fin:items-center fin:py-m fin:px-l fin:border-none fin:border-current fin:rounded-m ' +
  'fin:font-label-medium fin:text-start fin:no-underline fin:cursor-pointer ' +
  'fin:focus-visible:outline-2 fin:focus-visible:-outline-offset-2 fin:focus-visible:outline-focused';

/*
 * Full fills the nav. Minimized: the icon only, 44 × 37, as tall as Full (one line of the label), so the items don't
 * move when the nav collapses (decided 29 Oct 2026; sidenav-minimized-height in tailwind.css).
 */
export const type: Record<FinSideNavItemType, string> = {
  full: `${header} fin:w-full`,
  minimized: `${header} fin:w-auto fin:sidenav-minimized-height fin:self-start`,
};

/* Not selected, Selected (a sub item is the current page) and Selected - BG (this item is the current place). */
export const selected: Record<FinSideNavItemSelected | 'none', string> = {
  none: 'fin:bg-transparent fin:text-secondary fin:hover:bg-tertiary fin:active:bg-neutral',
  'sub-item': 'fin:bg-transparent fin:text-action fin:hover:bg-tertiary fin:active:bg-neutral',
  item: 'fin:bg-primary fin:text-action',
};

/* One line, ending in "…" when it doesn't fit (as the sub items). Minimized: the label stays its name for screen readers. */
export const label: Record<FinSideNavItemType, string> = {
  full: 'fin:flex-1 fin:min-w-0 fin:truncate',
  minimized: 'fin:sr-only',
};

export const chevron = { default: 'fin:flex fin:flex-none fin:fg-secondary', selected: 'fin:flex fin:flex-none fin:fg-active' };

export const subItems = 'fin:flex fin:flex-col fin:gap-xs';
