import type { FinAppShellProps, FinSideNavSection, FinSideNavTheme, FinSideNavThemeItem } from '@finspace-loyalty/ui';
import type { Decorator } from '@storybook/react-vite';
import { createContext, useContext } from 'react';
import { useEffect, useGlobals, useState } from 'storybook/preview-api';
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

const PAGE_PROFILE = { name: 'Olivia James', email: 'oliviajames@email.com', initials: 'OJ', role: 'Admin' };

type PageTheme = Pick<FinSideNavThemeItem, 'value' | 'onValueChange'>;

/** The account menu's Theme row, from `withPageTheme`. */
const PageThemeContext = createContext<PageTheme | null>(null);

/**
 * Every page story's decorator: the account menu's Theme row drives Storybook's theme toolbar (the stories stand in
 * for the app, which sets `data-theme` on `<html>`). Light and Dark set it; System follows the device's
 * `prefers-color-scheme`, also when it changes. Storybook's hooks: only decorators and story functions can read the
 * toolbar, so the pages get it through context.
 */
export const withPageTheme: Decorator = function PageTheme(Story) {
  const [globals, updateGlobals] = useGlobals();
  const [system, setSystem] = useState(false);
  useEffect(() => {
    if (!system) return;
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const follow = () => updateGlobals({ theme: query.matches ? 'dark' : 'light' });
    follow();
    query.addEventListener('change', follow);
    return () => query.removeEventListener('change', follow);
  }, [system, updateGlobals]);
  const theme: PageTheme = {
    value: system ? 'system' : globals['theme'] === 'dark' ? 'dark' : 'light',
    onValueChange: (next: FinSideNavTheme) => {
      setSystem(next === 'system');
      if (next !== 'system') updateGlobals({ theme: next });
    },
  };
  return (
    <PageThemeContext.Provider value={theme}>
      <Story />
    </PageThemeContext.Provider>
  );
};

/**
 * The side nav props for a page, open at `currentHref`, with the account menu (DESIGN.md §9.57): My profile,
 * Settings, the Theme row (with `withPageTheme`) and Log out.
 */
export function usePageSideNav(currentHref: string): FinAppShellProps['sideNav'] {
  const theme = useContext(PageThemeContext);
  return {
    sections: PAGE_SECTIONS,
    currentHref,
    profile: {
      ...PAGE_PROFILE,
      menu: [
        { label: 'My profile', onSelect: () => {} },
        { label: 'Settings', onSelect: () => {} },
        ...(theme ? [{ type: 'theme' as const, ...theme }] : []),
        { label: 'Log out', onSelect: () => {}, separator: true },
      ],
    },
    logo: <PageLogo />,
  };
}

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
