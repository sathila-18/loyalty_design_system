'use client';

import { finBreakpoint } from '@finspace-loyalty/tokens/breakpoints';
import { useEffect, useState, type ElementType, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import type { FinIconName } from '../../icons/finIcons';
import { FinAvatar } from '../Avatar';
import { FinButton } from '../Button';
import { FinListItem } from '../ListItem';
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
  const profileAction = profile && (profile.href !== undefined ? Link : profile.onClick ? 'button' : undefined);
  const profileActionProps = profile
    ? profile.href !== undefined
      ? { href: profile.href, onClick: profile.onClick }
      : { type: 'button', onClick: profile.onClick }
    : {};

  return (
    <nav {...rest} aria-label={ariaLabel} className={className ? `${styles.nav} ${className}` : styles.nav} data-type={type}>
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
        <div className={styles.footer}>
          {expanded ? (
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
                <ProfileAction as={profileAction} {...profileActionProps} className={styles.avatarAction} aria-label={profile.name}>
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
