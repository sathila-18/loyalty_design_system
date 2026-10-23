import type { FinAppShellProps, FinSideNavSection } from '@finspace-loyalty/ui';
import { PageLogo } from './PageLogo';

/**
 * What every page's shell shares (DESIGN.md §8.6): the side nav's sections, following the Figma screens' side nav,
 * the signed-in user and the logo placeholder. Fake data for Storybook only.
 */
export const PAGE_SECTIONS: FinSideNavSection[] = [
  { icon: 'home', label: 'Dashboard', href: '#dashboard' },
  {
    icon: 'loyalty',
    label: 'Loyalty management',
    pages: [
      { label: 'Programme configuration', href: '#loyalty/programme' },
      { label: 'Tier management', href: '#loyalty/tiers' },
      { label: 'Reward catalog', href: '#loyalty/rewards' },
    ],
  },
  { icon: 'sports_esports', label: 'Gamification', pages: [{ label: 'Focus areas', href: '#gamification/focus' }, { label: 'Badges', href: '#gamification/badges' }] },
  { icon: 'desktop_windows', label: 'System configuration', href: '#system' },
  { icon: 'assignment', label: 'Report management', href: '#reports' },
  { icon: 'supervised_user_circle', label: 'User management', pages: [{ label: 'System users', href: '#users/system' }, { label: 'Role management', href: '#users/roles' }] },
  { icon: 'plagiarism', label: 'System audit', href: '#audit' },
];

const PAGE_PROFILE = { name: 'Olivia James', email: 'oliviajames@email.com', initials: 'OJ', href: '#account' };

/** The side nav props for a page, open at `currentHref`. */
export const pageSideNav = (currentHref: string): FinAppShellProps['sideNav'] => ({
  sections: PAGE_SECTIONS,
  currentHref,
  profile: PAGE_PROFILE,
  logo: <PageLogo />,
});

/**
 * Accepted contrast exceptions (DESIGN.md §10 #3) that every page shows: the selected section's label in the side
 * nav, the bell's number badge in Dark, Grey table header titles in Dark, a link on a Selected row and the current
 * page in the pagination. Only those are left out of the pages' a11y check.
 */
export const PAGE_KNOWN_CONTRAST_ISSUES = [
  '[data-selected="sub-item"]',
  'html[data-theme="dark"] [data-tone="error"]:is([data-shape="circle"], [data-shape="pill"])',
  'html[data-theme="dark"] th[data-type="grey"] [data-size]',
  'tr[data-selected] a',
  'main nav [data-selected]',
];
