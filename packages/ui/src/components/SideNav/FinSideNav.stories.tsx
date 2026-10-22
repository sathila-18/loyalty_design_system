import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type MouseEvent, type ReactNode } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import avatarSample from '../Avatar/avatar-sample.jpg';
import { FinSideNav, type FinSideNavMenuItem, type FinSideNavProps, type FinSideNavSection, type FinSideNavType } from './FinSideNav';
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
/** The account menu's items (an example: they follow the product). */
const ACCOUNT_MENU: FinSideNavMenuItem[] = [
  { label: 'My profile', icon: 'person', onSelect: () => {} },
  { label: 'Notifications', icon: 'notifications', onSelect: () => {} },
  { label: 'Settings', icon: 'settings', onSelect: () => {} },
  { label: 'Log out', icon: 'logout', onSelect: () => {}, separator: true },
];
const MENU_PROFILE = { ...STATIC_PROFILE, menu: ACCOUNT_MENU };

/**
 * A stand-in for the product logo (Figma Logo sizes, Small, Coloured, With text): the `image` placeholder and
 * "Company Name". There's no logo yet; apps pass theirs in `logo` (DESIGN.md §6).
 */
const LogoPlaceholder = () => (
  <span className={styles.logo}>
    <span className={styles.logoImage}>
      <FinIcon name="image" size={36} color="brand" />
    </span>
    <span className={styles.companyName}>Company name</span>
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
}

/**
 * Known contrast failure, accepted by design (DESIGN.md §10 #3, 20 Oct 2026): a Selected section's label
 * (`text-action` on the nav's `bg-secondary`) is 4.32:1 Light / 4.34:1 Dark. Only those labels are left out of the
 * a11y check (as the Main selection stories).
 */
const KNOWN_CONTRAST_ISSUES = ['[data-selected="sub-item"]'];

/** Matches Figma's properties (DESIGN.md §9). Click the sections, pages and collapse button. */
const meta: Meta<Args> = {
  title: 'Components/Side nav/Side menu',
  parameters: { layout: 'fullscreen', a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
  args: { type: 'expanded', menu: '#dashboard', showLogo: true, showProfile: true, profileAction: 'menu' },
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
  },
  render: function Render({ type, menu, showLogo, showProfile, profileAction }) {
    const [ownType, setOwnType] = useState(type);
    const [shownType, setShownType] = useState(type);
    if (shownType !== type) {
      setShownType(type);
      setOwnType(type);
    }
    return (
      <Routed key={menu} start={menu}>
        {(href) => (
          <FinSideNav
            sections={SECTIONS}
            currentHref={href}
            type={ownType}
            onTypeChange={setOwnType}
            {...(showLogo ? { logo: <LogoPlaceholder /> } : {})}
            {...(showProfile ? { profile: profileAction === 'menu' ? MENU_PROFILE : profileAction === 'link' ? PROFILE : STATIC_PROFILE } : {})}
          />
        )}
      </Routed>
    );
  },
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

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
