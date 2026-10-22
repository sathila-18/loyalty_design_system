'use client';

import { finBreakpoint } from '@finspace-loyalty/tokens/breakpoints';
import { Fragment, useEffect, useState, type ElementType, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import type { FinIconName } from '../../icons/finIcons';
import { FinAvatar } from '../Avatar';
import { FinButton } from '../Button';
import { FinListItem } from '../ListItem';
import { FinListStandard } from '../ListStandard';
import { FinMenu, FinMenuDivider } from '../Menu';
import { FinSideNavItem, type FinSideNavItemSelected } from '../SideNavItem';
import { FinSideNavSubItem } from '../SideNavSubItem';
import styles from './FinSideNav.module.css';

/** Figma `Type`: Expanded (312: logo, labels, the user's name) or Minimized (88: icons and the avatar only). */
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
  /** Where the row goes (for example the account page). With `href` or `onClick` the row shows the chevron. */
  href?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  /**
   * An account menu (code first, 22 Oct 2026): tapping the row (or the avatar when minimized) opens an action menu of
   * these items instead of going anywhere. Takes the place of `href` / `onClick`.
   */
  menu?: FinSideNavMenuItem[];
}

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
  const accountItems = profile?.menu?.map((item, index) => (
    <Fragment key={`${item.label}-${index}`}>
      {item.separator && index > 0 && <FinMenuDivider />}
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
    </Fragment>
  ));
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
              width="trigger"
              anchor={footerEl}
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
                anchor={navEl}
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
