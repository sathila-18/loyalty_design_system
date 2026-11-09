/*
 * FinSideNav classes (DESIGN.md §9.57, §3.11). Expanded: 5 × Size-48 plus Space-XL either side; Minimized: one Size-48
 * plus Space-XL either side; the width animates between them (sidenav-* in tailwind.css; still when motion is
 * reduced). bg-secondary, Space-3XL above and below, Space-XL at the sides, full height, sticky at the top. The logo
 * row, the menu (Space-XS between items, scrolling when the window is short) and the profile at the bottom.
 */
import type { FinSideNavType } from './FinSideNav';

const navBase =
  'fin:sticky fin:top-none fin:flex fin:flex-col fin:flex-none fin:gap-6xl fin:justify-between fin:box-border fin:h-dvh ' +
  'fin:py-3xl fin:px-xl fin:overflow-hidden fin:bg-secondary fin:sidenav-motion fin:motion-reduce:motion-off';

export const nav: Record<FinSideNavType, string> = {
  expanded: `${navBase} fin:sidenav-w-full`,
  minimized: `${navBase} fin:sidenav-w-minimized`,
};

export const top = 'fin:flex fin:flex-1 fin:flex-col fin:gap-l fin:min-h-0';

const headerBase = 'fin:flex fin:flex-none fin:gap-m fin:items-center fin:h-48';

export const header: Record<FinSideNavType, string> = {
  expanded: `${headerBase} fin:justify-between`,
  minimized: `${headerBase} fin:justify-center`,
};

export const logo = 'fin:flex fin:items-center fin:min-w-0';

export const menu = 'fin:flex fin:flex-col fin:gap-xs fin:min-h-0 fin:m-none fin:p-none fin:overflow-y-auto fin:list-none';

export const menuItem: Record<FinSideNavType, string> = {
  expanded: 'fin:flex fin:flex-col',
  minimized: 'fin:flex fin:flex-col fin:items-center',
};

export const footer = 'fin:flex-none';

/*
 * The profile row (a FinListItem): Space-L above and below and no side padding; interactive (an action or the account
 * menu), Space-XL at the sides, Radius-M, hover and open bg-tertiary, pressed bg-neutral. The padding replaces
 * FinListItem's own, so it's `placement:` (both in @layer fin).
 */
export const profile = {
  still: 'fin:relative fin:placement:py-l fin:placement:px-none',
  interactive: 'fin:relative fin:placement:py-l fin:placement:px-xl fin:rounded-m fin:hover:bg-tertiary fin:active:bg-neutral',
  open: 'fin:relative fin:placement:py-l fin:placement:px-xl fin:rounded-m fin:bg-tertiary fin:active:bg-neutral',
};

export const name = 'fin:block fin:truncate';

export const email = 'fin:block fin:truncate fin:font-body-medium fin:text-secondary';

/* The name as a link or button: covers the whole row (cover-action in tailwind.css), its ring on that cover. */
export const action =
  'fin:w-full fin:p-none fin:border-none fin:border-current fin:bg-transparent fin:text-inherit fin:font-inherit fin:text-start ' +
  'fin:no-underline fin:cursor-pointer fin:cover-action fin:after:rounded-m';

export const profileMinimized = 'fin:flex fin:justify-center fin:py-l fin:px-none';

export const avatarAction =
  'fin:flex fin:p-none fin:border-none fin:border-current fin:rounded-full fin:bg-transparent fin:no-underline fin:cursor-pointer ' +
  'fin:focus-visible:outline-2 fin:focus-visible:outline-offset-2 fin:focus-visible:outline-focused';
