import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { createContext, useContext, useState, type MouseEvent, type ReactNode } from 'react';
// Storybook's hooks, for the story functions that also read the theme toolbar (`useGlobals`): its hooks and React's
// can't be mixed in one story function.
import { useEffect as useStoryEffect, useGlobals, useState as useStoryState } from 'storybook/preview-api';
import { userEvent, within } from 'storybook/test';
import { FinIcon } from '../../icons/FinIcon';
import { FinLogo } from '../../logos';
import avatarSample from '../Avatar/avatar-sample.jpg';
import {
  FinSideNav,
  type FinSideNavMenuEntry,
  type FinSideNavProfile,
  type FinSideNavProps,
  type FinSideNavSection,
  type FinSideNavTheme,
  type FinSideNavType,
  type FinSideNavVariant,
} from './FinSideNav';
import styles from './FinSideNav.stories.module.css';

/** The Figma Side Menu's menu. */
const SECTIONS: FinSideNavSection[] = [
  { icon: 'home', label: 'Dashboard', href: '#dashboard' },
  {
    icon: 'loyalty',
    label: 'Loyalty management',
    pages: [
      { label: 'Program configuration', href: '#loyalty/program' },
      { label: 'Tier management', href: '#loyalty/tiers' },
      { label: 'Reward catalog', href: '#loyalty/rewards' },
    ],
  },
  {
    icon: 'sports_esports',
    label: 'Gamification',
    pages: [
      { label: 'Badge management', href: '#gamification/badges' },
      { label: 'Focus & learning', href: '#gamification/learning' },
    ],
  },
  { icon: 'desktop_windows', label: 'System configuration', href: '#system-configuration' },
  { icon: 'assignment', label: 'Report management', href: '#reports' },
  {
    icon: 'supervised_user_circle',
    label: 'User management',
    pages: [
      { label: 'User roles', href: '#users/roles' },
      { label: 'System users', href: '#users/system' },
    ],
  },
  // Figma says "Audit Trial"; the spelling is corrected here.
  { icon: 'plagiarism', label: 'System audit', pages: [{ label: 'Audit trail', href: '#audit/trail' }] },
];

const STATIC_PROFILE = { name: 'Olivia James', email: 'oliviajames@email.com', src: avatarSample, initials: 'OJ' };
const PROFILE = { ...STATIC_PROFILE, href: '#account' };
/**
 * The Theme row, linked to Storybook's theme toolbar (the stories stand in for the app, which sets `data-theme` on
 * `<html>`): Light and Dark set it; System follows the device's `prefers-color-scheme`, also when it changes.
 */
function useStoryTheme() {
  const [globals, updateGlobals] = useGlobals();
  const [system, setSystem] = useStoryState(false);
  useStoryEffect(() => {
    if (!system) return;
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const follow = () => updateGlobals({ theme: query.matches ? 'dark' : 'light' });
    follow();
    query.addEventListener('change', follow);
    return () => query.removeEventListener('change', follow);
  }, [system, updateGlobals]);
  const value: FinSideNavTheme = system ? 'system' : globals['theme'] === 'dark' ? 'dark' : 'light';
  const onValueChange = (next: FinSideNavTheme) => {
    setSystem(next === 'system');
    if (next !== 'system') updateGlobals({ theme: next });
  };
  return { value, onValueChange };
}

/** The account menu (an example: the items follow the product): no leading icons; Log out last, after a line. */
function useAccountProfile(role: string | undefined, profile: Omit<FinSideNavProfile, 'menu'> = STATIC_PROFILE): FinSideNavProfile {
  const theme = useStoryTheme();
  const menu: FinSideNavMenuEntry[] = [
    { label: 'My profile', onSelect: () => {} },
    { label: 'Settings', onSelect: () => {} },
    { type: 'theme', ...theme },
    { label: 'Log out', onSelect: () => {}, separator: true },
  ];
  return { ...profile, ...(role ? { role } : {}), menu };
}

/** Opens the account menu, as a click on the profile row (or the avatar, minimized) does. */
const openAccountMenu = async (canvasElement: HTMLElement, name: string | RegExp = 'Olivia James') => {
  await userEvent.click(within(canvasElement).getByRole('button', { name }));
};

/** The Brand toolbar's value, for the logo (Storybook's hooks only work in decorators and story functions). */
const StoryBrandContext = createContext<string | undefined>(undefined);
const withStoryBrand: Decorator = (Story, { globals }) => (
  <StoryBrandContext.Provider value={globals['brand'] as string | undefined}>
    <Story />
  </StoryBrandContext.Provider>
);

/**
 * The logo slot follows the Brand toolbar (decided by design 4 Nov 2026): Sampath's logo (FinLogo, Small; White in
 * Dark), or for Finspace and Burgundy a stand-in (Figma Logo sizes, Small, Coloured, With text): the `image`
 * placeholder in the brand colour and the product name, "Fintech loyalty" (Figma: "Company Name"; decided by design
 * 2 Nov 2026). Apps pass their logo in `logo` (DESIGN.md §6, §9.83).
 */
const LogoPlaceholder = () =>
  useContext(StoryBrandContext) === 'sampath' ? (
    <FinLogo brand="sampath" />
  ) : (
    <span className={styles.logo}>
      <span className={styles.logoImage}>
        <FinIcon name="image" size={36} color="brand" />
      </span>
      <span className={styles.companyName}>Fintech loyalty</span>
    </span>
  );

/** Links in the stories change the current page instead of leaving Storybook. */
function Routed({ start, children }: { start?: string; children: (href: string | undefined) => ReactNode }) {
  const [href, setHref] = useState(start);
  const follow = (event: MouseEvent) => {
    const link = (event.target as HTMLElement).closest('a[href^="#"]');
    if (!link) return;
    event.preventDefault();
    setHref(link.getAttribute('href') ?? undefined);
  };
  return (
    <div className={styles.frame} onClickCapture={follow}>
      {children(href)}
    </div>
  );
}

/** Figma `Menu`: which place is current. */
const MENUS: { name: string; current: string; open?: string }[] = [
  { name: 'Dashboard', current: '#dashboard' },
  { name: 'Loyalty management', current: '#dashboard', open: 'Loyalty management' },
  { name: 'Loyalty management - Program configuration', current: '#loyalty/program' },
  { name: 'Gamification', current: '#dashboard', open: 'Gamification' },
  { name: 'System configuration', current: '#system-configuration' },
  { name: 'Report management', current: '#reports' },
  { name: 'User management', current: '#dashboard', open: 'User management' },
  { name: 'System audit', current: '#dashboard', open: 'System audit' },
];

interface Args {
  type: FinSideNavType;
  menu: string;
  showLogo: boolean;
  showProfile: boolean;
  profileAction: 'menu' | 'link' | 'none';
  role: 'Admin' | 'Super admin' | 'none';
  variant: FinSideNavVariant;
}

/**
 * Known contrast failure, accepted by design (DESIGN.md §10 #3, 20 Oct 2026): a Selected section's label
 * (`text-action` on the nav's `bg-secondary`) is 4.32:1 Light / 4.34:1 Dark. Only those labels are left out of the
 * a11y check (as the Main selection stories).
 */
const KNOWN_CONTRAST_ISSUES = ['html[data-brand="finspace"] [data-selected="sub-item"]'];

/** Matches Figma's properties (DESIGN.md §9). Click the sections, pages and collapse button. */
const meta: Meta<Args> = {
  title: 'Components/Side nav/Side menu',
  decorators: [withStoryBrand],
  parameters: { layout: 'fullscreen', a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
  args: { type: 'expanded', menu: '#dashboard', showLogo: true, showProfile: true, profileAction: 'menu', role: 'Admin', variant: 'default' },
  argTypes: {
    type: { control: 'inline-radio', options: ['expanded', 'minimized'], description: 'Figma `Type` (click the button to change it)' },
    menu: {
      control: 'select',
      options: ['#dashboard', '#loyalty/program', '#gamification/badges', '#system-configuration', '#reports', '#users/roles', '#audit/trail'],
      description: 'The current page (`currentHref`); Figma `Menu` follows from it',
    },
    showLogo: { control: 'boolean', description: 'The `logo` slot (a placeholder here)' },
    showProfile: { control: 'boolean', description: 'The `profile` (the user at the bottom)' },
    profileAction: {
      control: 'inline-radio',
      options: ['menu', 'link', 'none'],
      description: 'The profile row opens an account menu (`profile.menu`), is a link (with the chevron), or is static',
    },
    role: {
      control: 'inline-radio',
      options: ['Admin', 'Super admin', 'none'],
      description: "`profile.role`: the badge in the account menu's header",
    },
    variant: {
      control: 'inline-radio',
      options: ['default', 'tree'],
      description: '`variant` (code only): `tree` draws connected tree lines to a section’s pages',
    },
  },
  render: function Render({ type, menu, showLogo, showProfile, profileAction, role, variant }) {
    const menuProfile = useAccountProfile(role === 'none' ? undefined : role);
    // The collapse button changes the type; the `type` control sets it again.
    const [ownType, setOwnType] = useStoryState(type);
    useStoryEffect(() => setOwnType(type), [type]);
    return (
      <Routed key={menu} start={menu}>
        {(href) => (
          <FinSideNav
            sections={SECTIONS}
            currentHref={href}
            type={ownType}
            onTypeChange={setOwnType}
            variant={variant}
            {...(showLogo ? { logo: <LogoPlaceholder /> } : {})}
            {...(showProfile ? { profile: profileAction === 'menu' ? menuProfile : profileAction === 'link' ? PROFILE : STATIC_PROFILE } : {})}
          />
        )}
      </Routed>
    );
  },
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/**
 * The account menu, open (code first, 2 Nov 2026): who's signed in with their role, My profile, Settings, the Theme row
 * and Log out; 320 wide. Picking a theme keeps the menu open and switches the canvas (System follows the device).
 */
export const AccountMenu: Story = {
  name: 'Account menu',
  play: async ({ canvasElement }) => {
    await openAccountMenu(canvasElement);
  },
};

/** Minimized: the avatar opens the same menu beside the nav. */
export const AccountMenuMinimized: Story = {
  name: 'Account menu, minimized',
  args: { type: 'minimized' },
  play: async ({ canvasElement }) => {
    await openAccountMenu(canvasElement, /Olivia James/);
  },
};

/** A long name and email end in "…" before the badge; "Super admin" is the longer role. */
export const AccountMenuLongName: Story = {
  name: 'Account menu, long name',
  args: { role: 'Super admin' },
  render: function Render({ role }) {
    const profile = useAccountProfile(role === 'none' ? undefined : role, {
      ...STATIC_PROFILE,
      name: 'Olivia Alexandra James-Fernando',
      email: 'olivia.alexandra.james-fernando@email.com',
    });
    return <FinSideNav sections={SECTIONS} currentHref="#dashboard" defaultType="expanded" logo={<LogoPlaceholder />} profile={profile} />;
  },
  play: async ({ canvasElement }) => {
    await openAccountMenu(canvasElement, 'Olivia Alexandra James-Fernando');
  },
};

/** A Figma menu: the section opened by a click, or the current page's section. */
function Menu({ current, open, type }: { current: string; open?: string | undefined; type: FinSideNavType }) {
  const props: FinSideNavProps = {
    sections: SECTIONS,
    currentHref: current,
    defaultType: type,
    logo: <LogoPlaceholder />,
    profile: PROFILE,
    className: styles.short,
  };
  return (
    <div
      className={styles.menu}
      ref={(node) => {
        // Open the section the Figma variant shows, as a click would.
        if (!node || !open || node.dataset.opened) return;
        node.dataset.opened = '';
        const button = [...node.querySelectorAll('button')].find((b) => b.textContent?.includes(open));
        button?.click();
      }}
    >
      <FinSideNav {...props} />
    </div>
  );
}

/** The Figma Side Menu: the 8 menus, Expanded. */
export const Menus: Story = {
  name: 'Menus (Figma)',
  render: () => (
    <div className={styles.gallery}>
      {MENUS.map(({ name, current, open }) => (
        <figure key={name} className={styles.figure}>
          <figcaption className={styles.caption}>{name}</figcaption>
          <Menu current={current} open={open} type="expanded" />
        </figure>
      ))}
    </div>
  ),
};

/** The Figma Side Menu: the 8 menus, Minimized (the active section white). */
export const Minimized: Story = {
  name: 'Minimized (Figma)',
  render: () => (
    <div className={styles.gallery}>
      {MENUS.map(({ name, current, open }) => (
        <figure key={name} className={styles.figure}>
          <figcaption className={styles.caption}>{name}</figcaption>
          {/* A click on a minimized section expands the nav, so the active section comes from a page in it. */}
          <Menu current={open ? (SECTIONS.find((s) => s.label === open)?.pages?.[0]?.href ?? current) : current} type="minimized" />
        </figure>
      ))}
    </div>
  ),
};

/** Long labels, name and email end in "…"; a long menu scrolls between the header and the user. */
export const LongContent: Story = {
  name: 'Long content',
  render: () => (
    <Routed start="#loyalty/a-page-with-a-very-long-name">
      {(href) => (
        <FinSideNav
          sections={[
            ...SECTIONS,
            {
              icon: 'loyalty',
              label: 'A section with a very long name indeed',
              pages: [{ label: 'A page with a very long name that does not fit', href: '#loyalty/a-page-with-a-very-long-name' }],
            },
            ...SECTIONS.map(({ icon, label, href, pages }) => ({ icon, label: `${label} 2`, href: `${href ?? pages?.[0]?.href}-2` })),
          ]}
          currentHref={href}
          defaultType="expanded"
          className={styles.short}
          logo={<LogoPlaceholder />}
          profile={{ ...PROFILE, name: 'Olivia Alexandra James-Fernando', email: 'olivia.alexandra.james-fernando@email.com' }}
        />
      )}
    </Routed>
  ),
};

/** Sections for the tree gallery: one, two and many pages, with long labels. */
const TREE_SECTIONS: FinSideNavSection[] = [
  { icon: 'home', label: 'Dashboard', href: '#dashboard' },
  { icon: 'desktop_windows', label: 'System configuration', pages: [{ label: 'General settings', href: '#system/general' }] },
  {
    icon: 'sports_esports',
    label: 'Gamification',
    pages: [
      { label: 'Badge management', href: '#gamification/badges' },
      { label: 'Focus & learning', href: '#gamification/learning' },
    ],
  },
  {
    icon: 'loyalty',
    label: 'Loyalty management',
    pages: [
      { label: 'Program configuration', href: '#loyalty/program' },
      { label: 'Tier management', href: '#loyalty/tiers' },
      { label: 'Reward catalog for members in every segment and region', href: '#loyalty/rewards' },
      { label: 'Point expiry rules', href: '#loyalty/expiry' },
      { label: 'Partner merchants and their reward catalogs', href: '#loyalty/partners' },
      { label: 'Campaigns', href: '#loyalty/campaigns' },
    ],
  },
  { icon: 'assignment', label: 'Report management', href: '#reports' },
];

function TreeNav({ current, type = 'expanded', variant = 'tree' }: { current: string; type?: FinSideNavType; variant?: FinSideNavVariant }) {
  return (
    <Routed start={current}>
      {(href) => (
        <FinSideNav
          sections={TREE_SECTIONS}
          currentHref={href}
          defaultType={type}
          variant={variant}
          className={styles.short}
          logo={<LogoPlaceholder />}
          profile={STATIC_PROFILE}
        />
      )}
    </Routed>
  );
}

/**
 * The tree style (code only, 2 Nov 2026; `variant="tree"`): a 1px `border-subtle` line from under the section's icon to
 * the middle of its last page, and a connector curving into each page, ending 4 before its text. Decorative only.
 * One, two and many pages (long labels end in "…"); a closed group and the minimized nav show no lines. Click
 * the sections and pages.
 */
export const TreeStyle: Story = {
  name: 'Tree style',
  render: () => (
    <div className={styles.gallery}>
      {[
        { name: 'One page', current: '#system/general' },
        { name: 'Two pages', current: '#gamification/learning' },
        { name: 'Many pages, long labels', current: '#loyalty/rewards' },
        { name: 'Groups closed', current: '#dashboard' },
        { name: 'Minimized: no lines', current: '#loyalty/rewards', type: 'minimized' as const },
      ].map(({ name, current, type }) => (
        <figure key={name} className={styles.figure}>
          <figcaption className={styles.caption}>{name}</figcaption>
          <TreeNav current={current} {...(type ? { type } : {})} />
        </figure>
      ))}
    </div>
  ),
};

/** The same nav in both styles: Default (Figma's) and Tree (code only). */
export const DefaultAndTree: Story = {
  name: 'Default and tree',
  render: () => (
    <div className={styles.gallery}>
      {(['default', 'tree'] as const).map((variant) => (
        <figure key={variant} className={styles.figure}>
          <figcaption className={styles.caption}>{variant === 'default' ? 'Default' : 'Tree'}</figcaption>
          <TreeNav current="#loyalty/tiers" variant={variant} />
        </figure>
      ))}
    </div>
  ),
};
