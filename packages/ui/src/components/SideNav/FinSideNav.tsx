'use client';

import { finBreakpoint } from '@finspace-loyalty/tokens/breakpoints';
import { Fragment, useEffect, useId, useState, type ElementType, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import type { FinIconName } from '../../icons/finIcons';
import { FinAvatar } from '../Avatar';
import { FinBadge } from '../Badge';
import { FinButton } from '../Button';
import { FinListItem } from '../ListItem';
import { FinListStandard } from '../ListStandard';
import { FinMenu, FinMenuDivider } from '../Menu';
import { FinSegmentedButton } from '../SegmentedButton';
import { FinSideNavItem, type FinSideNavItemSelected } from '../SideNavItem';
import { FinSideNavSubItem } from '../SideNavSubItem';
import styles from './FinSideNav.module.css';

/** Figma `Type`: Expanded (272: logo, labels, the user's name) or Minimized (80: icons and the avatar only). */
export type FinSideNavType = 'expanded' | 'minimized';

/** A page under a section (Figma sub selection). */
export interface FinSideNavPage {
  label: string;
  href: string;
}

/** A top-level item (Figma Main Selection). */
export interface FinSideNavSection {
  icon: FinIconName;
  label: string;
  /** A section without pages: the page it links to. */
  href?: string;
  /** The section's pages. With them, the section is a button that opens them (Figma `Show dropdown`). */
  pages?: FinSideNavPage[];
}

/** The signed-in user at the bottom (Figma List-base with an Avatar). */
export interface FinSideNavProfile {
  name: string;
  email?: string;
  /** The avatar's photo; without it, `initials`, then the default icon (FinAvatar's fallback). */
  src?: string;
  initials?: string;
  /**
   * Code only (2 Nov 2026): the user's role ("Admin", "Super admin"), a neutral FinBadge beside the name in the account
   * menu's header. The menu only.
   */
  role?: string;
  /** Where the row goes (for example the account page). With `href` or `onClick` the row shows the chevron. */
  href?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  /**
   * An account menu (code first, 22 Oct 2026): tapping the row (or the avatar when minimized) opens an action menu of
   * these items instead of going anywhere. Takes the place of `href` / `onClick`. 320 wide, with the user's name, email
   * and `role` at the top (2 Nov 2026).
   */
  menu?: FinSideNavMenuEntry[];
}

/** Code only (2 Nov 2026): `default` (Figma's sub items) or `tree` (connected tree lines). */
export type FinSideNavVariant = 'default' | 'tree';

/** The theme choices in the account menu. `system` follows the device (`prefers-color-scheme`). */
export type FinSideNavTheme = 'system' | 'light' | 'dark';

/**
 * The account menu's Theme row (code first, 2 Nov 2026): "Theme" with System, Light and Dark as icon-only menu item
 * radios, each with its name in a tooltip on hover and keyboard focus (3 Nov 2026). Picking one keeps the menu open, so the change shows. The app applies the theme (`data-theme` on `<html>`).
 */
export interface FinSideNavThemeItem {
  type: 'theme';
  /** The current choice, shown selected. */
  value: FinSideNavTheme;
  onValueChange: (value: FinSideNavTheme) => void;
  /** The row's title. Default "Theme". */
  label?: string;
  /** The choices' names (read by screen readers). Default "System", "Light", "Dark". */
  optionLabels?: Partial<Record<FinSideNavTheme, string>>;
  /** A line before this row, to group the ones after it. */
  separator?: boolean;
}

/** An account menu entry: an item, or the Theme row. */
export type FinSideNavMenuEntry = FinSideNavMenuItem | FinSideNavThemeItem;

const isThemeItem = (entry: FinSideNavMenuEntry): entry is FinSideNavThemeItem => 'type' in entry && entry.type === 'theme';

/** The account menu: 320 (2 × Size-120 + Size-80; decided 2 Nov 2026). */
const ACCOUNT_MENU_WIDTH = 'calc(2 * var(--fin-size-120) + var(--fin-size-80))';

/** One item in the account menu. */
export interface FinSideNavMenuItem {
  label: string;
  icon?: FinIconName;
  onSelect: () => void;
  disabled?: boolean;
  /** A line before this item, to group the ones after it (for example Log out). */
  separator?: boolean;
}

export interface FinSideNavProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** The menu, in order (Figma `Menu` is which of them is active, worked out from `currentHref`). */
  sections: FinSideNavSection[];
  /** The current page's `href`: its section or page is shown selected, and its section open. */
  currentHref?: string | undefined;
  /** A router's link component (React Router `Link`, `next/link`), for the section, page and profile links. Default `a`. */
  linkAs?: ElementType;
  /** The product logo, shown Expanded only (Figma Logo sizes). Logos are artwork, so they're passed in (DESIGN.md §6). */
  logo?: ReactNode;
  /** The signed-in user (Figma List-base). Hidden without it. */
  profile?: FinSideNavProfile;
  /** Figma `Type`, controlled. Without it the nav keeps its own: collapsed below 1280, expanded from 1280. */
  type?: FinSideNavType;
  /** The starting `type` when not controlled; then the window width no longer sets it. */
  defaultType?: FinSideNavType;
  /** Called when the collapse button (or a section clicked while minimized) changes the type. */
  onTypeChange?: (type: FinSideNavType) => void;
  /**
   * Code only (2 Nov 2026): how a section's pages are drawn. `default` (Figma's) or `tree`: connected tree lines from
   * the section's icon to each page (decorative; DESIGN.md §9.57). Default `default`.
   */
  variant?: FinSideNavVariant;
  /** The collapse button's name when expanded. Default "Collapse menu". */
  collapseLabel?: string;
  /** The collapse button's name when minimized. Default "Expand menu". */
  expandLabel?: string;
}

const containsHref = (section: FinSideNavSection, href?: string) =>
  href !== undefined && (section.href === href || (section.pages ?? []).some((page) => page.href === href));

/**
 * The side nav (Figma Side Menu; DESIGN.md §9): the logo and collapse button, the sections (Main Selection, 8 apart)
 * and the signed-in user pinned at the bottom, on `bg-secondary`, padding 24 / 16, full height. The menu scrolls on
 * its own when it's taller than the window. **Only the active section is open:** the one holding `currentHref`, or
 * the one last clicked; it's Selected - BG, or Selected when the current page is one of its pages. Minimized shows
 * the icons only; clicking a section there expands the nav and opens it. Other attributes go to the `<nav>`.
 */
export function FinSideNav({
  sections,
  currentHref,
  linkAs: Link = 'a',
  logo,
  profile,
  type: typeProp,
  defaultType,
  onTypeChange,
  variant = 'default',
  collapseLabel = 'Collapse menu',
  expandLabel = 'Expand menu',
  className,
  'aria-label': ariaLabel = 'Main',
  ...rest
}: FinSideNavProps) {
  const currentSection = sections.find((section) => containsHref(section, currentHref))?.label;
  const [active, setActive] = useState(currentSection);
  const [open, setOpen] = useState(true);
  const [shownHref, setShownHref] = useState(currentHref);
  if (shownHref !== currentHref) {
    // A new page: its section becomes the active, open one.
    setShownHref(currentHref);
    setActive(currentSection);
    setOpen(true);
  }

  const [ownType, setOwnType] = useState<FinSideNavType>(defaultType ?? 'expanded');
  const type = typeProp ?? ownType;
  const expanded = type === 'expanded';
  const followsWidth = typeProp === undefined && defaultType === undefined;

  // Not controlled and no default: collapsed below 1280, expanded from 1280 (DESIGN.md §2 rule 4).
  useEffect(() => {
    if (!followsWidth) return;
    const query = window.matchMedia(finBreakpoint.lg);
    const update = () => setOwnType(query.matches ? 'expanded' : 'minimized');
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, [followsWidth]);

  const changeType = (next: FinSideNavType) => {
    setOwnType(next);
    onTypeChange?.(next);
  };

  const openSection = (label: string) => {
    if (!expanded) {
      changeType('expanded');
      setActive(label);
      setOpen(true);
      return;
    }
    // Clicking the open section closes it; another one becomes the active, open section.
    setOpen(active === label ? !open : true);
    setActive(label);
  };

  const selectedOf = (section: FinSideNavSection): FinSideNavItemSelected | undefined => {
    if (active !== section.label) return undefined;
    // Minimized shows the active section white (Selected - BG) whether or not one of its pages is current.
    if (!expanded || !section.pages) return 'item';
    return containsHref(section, currentHref) ? 'sub-item' : 'item';
  };

  const avatar = profile
    ? { size: 'medium' as const, ...(profile.src !== undefined ? { src: profile.src } : {}), ...(profile.initials !== undefined ? { initials: profile.initials } : {}) }
    : undefined;
  // The minimized avatar's name: when it shows initials (no photo), they're its visible text, so the name starts with
  // them for voice control ("click OJ"; WCAG 2.5.3): "OJ, Olivia James".
  const avatarName = profile && (profile.src === undefined && profile.initials ? `${profile.initials}, ${profile.name}` : profile.name);
  const profileAction = profile && !profile.menu && (profile.href !== undefined ? Link : profile.onClick ? 'button' : undefined);
  // The account menu lines up with the user's area when expanded, and opens beside the nav when minimized.
  const [navEl, setNavEl] = useState<HTMLElement | null>(null);
  const [footerEl, setFooterEl] = useState<HTMLDivElement | null>(null);
  const themeTitleId = useId();
  const accountItems = profile?.menu?.map((item, index) => (
    <Fragment key={isThemeItem(item) ? `theme-${index}` : `${item.label}-${index}`}>
      {item.separator && index > 0 && <FinMenuDivider />}
      {isThemeItem(item) ? (
        // Not an item itself: the row holds a group of menu item radios (the menu's one stop is the selected theme).
        <li role="none">
          <FinListStandard
            size="small"
            divider={false}
            title={item.label ?? 'Theme'}
            titleId={themeTitleId}
            trailing={
              <FinSegmentedButton
                behavior="menuitemradio"
                iconOnly
                tooltips
                size="xsmall"
                aria-labelledby={themeTitleId}
                value={item.value}
                onValueChange={(next) => item.onValueChange(next as FinSideNavTheme)}
                options={[
                  { value: 'system', label: item.optionLabels?.system ?? 'System', icon: 'desktop_windows' },
                  { value: 'light', label: item.optionLabels?.light ?? 'Light', icon: 'light_mode' },
                  { value: 'dark', label: item.optionLabels?.dark ?? 'Dark', icon: 'dark_mode' },
                ]}
              />
            }
          />
        </li>
      ) : (
        <FinListStandard
          as="li"
          size="small"
          behavior="menuitem"
          divider={false}
          title={item.label}
          {...(item.icon ? { leadingAccessory: 'icon' as const, icon: item.icon } : {})}
          disabled={item.disabled ?? false}
          onClick={item.onSelect}
        />
      )}
    </Fragment>
  ));
  // The account menu's header: who's signed in, not clickable (FinMenu draws the line under it).
  const accountHeader = profile?.menu && (
    <FinListStandard
      size="small"
      divider={false}
      title={profile.name}
      {...(profile.email !== undefined ? { description: profile.email } : {})}
      {...(profile.role !== undefined ? { trailing: <FinBadge tone="neutral">{profile.role}</FinBadge> } : {})}
    />
  );
  const profileActionProps = profile
    ? profile.href !== undefined
      ? { href: profile.href, onClick: profile.onClick }
      : { type: 'button', onClick: profile.onClick }
    : {};

  return (
    <nav {...rest} ref={setNavEl} aria-label={ariaLabel} className={className ? `${styles.nav} ${className}` : styles.nav} data-type={type}>
      <div className={styles.top}>
        <div className={styles.header}>
          {expanded && logo && <div className={styles.logo}>{logo}</div>}
          <FinButton
            variant="tertiary"
            size="medium"
            icon="only-icon"
            iconName="dock_to_right"
            aria-expanded={expanded}
            onClick={() => changeType(expanded ? 'minimized' : 'expanded')}
          >
            {expanded ? collapseLabel : expandLabel}
          </FinButton>
        </div>
        <ul className={styles.menu}>
          {sections.map((section) => {
            const selected = selectedOf(section);
            const itemType = expanded ? 'full' : 'minimized';
            return (
              <li key={section.label} className={styles.menuItem}>
                {section.pages && section.pages.length > 0 ? (
                  <FinSideNavItem
                    icon={section.icon}
                    label={section.label}
                    type={itemType}
                    expanded={active === section.label && open}
                    {...(selected ? { selected } : {})}
                    onClick={() => openSection(section.label)}
                  >
                    {section.pages.map((page) => (
                      <FinSideNavSubItem
                        key={page.href}
                        href={page.href}
                        linkAs={Link}
                        selected={page.href === currentHref}
                        variant={variant}
                      >
                        {page.label}
                      </FinSideNavSubItem>
                    ))}
                  </FinSideNavItem>
                ) : (
                  <FinSideNavItem
                    icon={section.icon}
                    label={section.label}
                    type={itemType}
                    href={section.href}
                    linkAs={Link}
                    {...(selected ? { selected } : {})}
                    onClick={() => setActive(section.label)}
                  />
                )}
              </li>
            );
          })}
        </ul>
      </div>
      {profile && (
        <div ref={setFooterEl} className={styles.footer}>
          {profile.menu && expanded ? (
            <FinMenu
              placement="top-start"
              width={ACCOUNT_MENU_WIDTH}
              anchor={footerEl}
              header={accountHeader}
              headerPadding="none"
              label="Account"
              trigger={(menuProps) => (
                <FinListItem
                  className={styles.profile}
                  size="small"
                  divider={false}
                  data-interactive=""
                  data-open={menuProps['aria-expanded'] ? '' : undefined}
                  leading={<FinAvatar {...avatar} />}
                  title={
                    <button {...menuProps} type="button" className={`${styles.name} ${styles.action}`}>
                      {profile.name}
                    </button>
                  }
                  showBody={profile.email !== undefined}
                  trailing={
                    // A dropdown: down, and up while the menu is open (as every dropdown).
                    <FinIcon name={menuProps['aria-expanded'] ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} size={24} color="secondary" />
                  }
                >
                  {profile.email !== undefined ? <span className={styles.email}>{profile.email}</span> : undefined}
                </FinListItem>
              )}
            >
              {accountItems}
            </FinMenu>
          ) : profile.menu ? (
            <div className={styles.profileMinimized} data-interactive="">
              <FinMenu
                placement="right-end"
                width={ACCOUNT_MENU_WIDTH}
                anchor={navEl}
                header={accountHeader}
                headerPadding="none"
                label="Account"
                trigger={(menuProps) => (
                  <button {...menuProps} type="button" className={styles.avatarAction} aria-label={avatarName}>
                    <FinAvatar {...avatar} />
                  </button>
                )}
              >
                {accountItems}
              </FinMenu>
            </div>
          ) : expanded ? (
            <FinListItem
              className={styles.profile}
              size="small"
              divider={false}
              data-interactive={profileAction ? '' : undefined}
              leading={<FinAvatar {...avatar} />}
              title={
                profileAction ? (
                  <ProfileAction as={profileAction} {...profileActionProps} className={`${styles.name} ${styles.action}`}>
                    {profile.name}
                  </ProfileAction>
                ) : (
                  <span className={styles.name}>{profile.name}</span>
                )
              }
              showBody={profile.email !== undefined}
              trailingAccessory={profileAction !== undefined}
            >
              {profile.email !== undefined ? <span className={styles.email}>{profile.email}</span> : undefined}
            </FinListItem>
          ) : (
            <div className={styles.profileMinimized} data-interactive={profileAction ? '' : undefined}>
              {profileAction ? (
                <ProfileAction as={profileAction} {...profileActionProps} className={styles.avatarAction} aria-label={avatarName}>
                  <FinAvatar {...avatar} />
                </ProfileAction>
              ) : (
                <FinAvatar {...avatar} label={profile.name} />
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

/** The profile row's link or button. */
function ProfileAction({ as: Element, ...props }: { as: ElementType; [prop: string]: unknown }) {
  return <Element {...props} />;
}
