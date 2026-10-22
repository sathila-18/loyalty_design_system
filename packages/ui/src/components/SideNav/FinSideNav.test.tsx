import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { forwardRef, type AnchorHTMLAttributes } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FinSideNav, type FinSideNavSection } from './FinSideNav';

const SECTIONS: FinSideNavSection[] = [
  { icon: 'home', label: 'Dashboard', href: '/' },
  {
    icon: 'loyalty',
    label: 'Loyalty Management',
    pages: [
      { label: 'Program Configuration', href: '/loyalty/program' },
      { label: 'Tier Management', href: '/loyalty/tiers' },
    ],
  },
  { icon: 'sports_esports', label: 'Gamification', pages: [{ label: 'Badge Management', href: '/gamification/badges' }] },
];

const PROFILE = { name: 'Olivia James', email: 'oliviajames@email.com', initials: 'OJ' };

/** jsdom has no matchMedia: a stand-in whose width can be changed. */
let wide = true;
const listeners = new Set<() => void>();
beforeEach(() => {
  wide = true;
  vi.stubGlobal('matchMedia', (query: string) => ({
    get matches() {
      return query.includes('1280') ? wide : true;
    },
    addEventListener: (_: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
  }));
});
afterEach(() => {
  vi.unstubAllGlobals();
  listeners.clear();
});

const nav = () => screen.getByRole('navigation', { name: 'Main' });

describe('FinSideNav', () => {
  it('is a navigation landmark with the sections in a list', () => {
    render(<FinSideNav sections={SECTIONS} currentHref="/" />);
    expect(within(nav()).getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('button', { name: 'Loyalty Management' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('marks the current page and opens only its section', () => {
    render(<FinSideNav sections={SECTIONS} currentHref="/loyalty/tiers" />);
    expect(screen.getByRole('button', { name: 'Loyalty Management' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Gamification' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('link', { name: 'Tier Management' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Dashboard' })).not.toHaveAttribute('aria-current');
  });

  it('marks a section link as the current page', () => {
    render(<FinSideNav sections={SECTIONS} currentHref="/" />);
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page');
  });

  it('opening a section closes the others; clicking the open one closes it', async () => {
    const user = userEvent.setup();
    render(<FinSideNav sections={SECTIONS} currentHref="/loyalty/tiers" />);
    const loyalty = screen.getByRole('button', { name: 'Loyalty Management' });
    const gamification = screen.getByRole('button', { name: 'Gamification' });

    await user.click(gamification);
    expect(gamification).toHaveAttribute('aria-expanded', 'true');
    expect(loyalty).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('link', { name: 'Badge Management' })).toBeInTheDocument();

    await user.click(gamification);
    expect(gamification).toHaveAttribute('aria-expanded', 'false');
  });

  it('a new current page opens its section', () => {
    const { rerender } = render(<FinSideNav sections={SECTIONS} currentHref="/" />);
    rerender(<FinSideNav sections={SECTIONS} currentHref="/gamification/badges" />);
    expect(screen.getByRole('button', { name: 'Gamification' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Badge Management' })).toHaveAttribute('aria-current', 'page');
  });

  it('shows the logo only when expanded', async () => {
    const user = userEvent.setup();
    render(<FinSideNav sections={SECTIONS} logo={<span>Acme</span>} />);
    expect(screen.getByText('Acme')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Collapse menu' }));
    expect(screen.queryByText('Acme')).toBeNull();
  });

  it('the collapse button switches the type and reports it', async () => {
    const user = userEvent.setup();
    const onTypeChange = vi.fn();
    render(<FinSideNav sections={SECTIONS} onTypeChange={onTypeChange} />);
    const collapse = screen.getByRole('button', { name: 'Collapse menu' });
    expect(collapse).toHaveAttribute('aria-expanded', 'true');

    await user.click(collapse);
    expect(onTypeChange).toHaveBeenLastCalledWith('minimized');
    expect(nav()).toHaveAttribute('data-type', 'minimized');
    expect(screen.getByRole('button', { name: 'Expand menu' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('is collapsed below 1280 and expanded from 1280, unless a default is given', () => {
    wide = false;
    const { unmount } = render(<FinSideNav sections={SECTIONS} />);
    expect(nav()).toHaveAttribute('data-type', 'minimized');
    unmount();

    render(<FinSideNav sections={SECTIONS} defaultType="expanded" />);
    expect(nav()).toHaveAttribute('data-type', 'expanded');
  });

  it('follows the window crossing 1280', () => {
    render(<FinSideNav sections={SECTIONS} />);
    expect(nav()).toHaveAttribute('data-type', 'expanded');
    wide = false;
    act(() => listeners.forEach((listener) => listener()));
    expect(nav()).toHaveAttribute('data-type', 'minimized');
  });

  it('minimized: labels stay the names; clicking a section expands the nav and opens it', async () => {
    const user = userEvent.setup();
    const onTypeChange = vi.fn();
    render(<FinSideNav sections={SECTIONS} type="minimized" onTypeChange={onTypeChange} />);
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Gamification' }));
    expect(onTypeChange).toHaveBeenCalledWith('expanded');
  });

  it('shows the user; with an href the row is one link named by the user', () => {
    render(<FinSideNav sections={SECTIONS} profile={{ ...PROFILE, href: '/account' }} />);
    const link = screen.getByRole('link', { name: 'Olivia James' });
    expect(link).toHaveAttribute('href', '/account');
    expect(screen.getByText('oliviajames@email.com')).toBeInTheDocument();
    expect(nav()).toHaveTextContent('keyboard_arrow_right');
  });

  it('a static user row has no link and no chevron', () => {
    render(<FinSideNav sections={SECTIONS} profile={PROFILE} />);
    expect(screen.getByText('Olivia James')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Olivia James' })).toBeNull();
    expect(nav()).not.toHaveTextContent('keyboard_arrow_right');
  });

  it('a user row with onClick is a button', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<FinSideNav sections={SECTIONS} profile={{ ...PROFILE, onClick }} />);
    await user.click(screen.getByRole('button', { name: 'Olivia James' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('minimized: the user is the avatar, still named', () => {
    render(<FinSideNav sections={SECTIONS} type="minimized" profile={{ ...PROFILE, href: '/account' }} />);
    expect(screen.getByRole('link', { name: 'Olivia James' })).toHaveAttribute('href', '/account');
    expect(screen.queryByText('oliviajames@email.com')).toBeNull();
  });

  it('uses the router link component for every link', () => {
    const RouterLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(function RouterLink(props, ref) {
      return <a {...props} ref={ref} data-router="">{props.children}</a>;
    });
    render(<FinSideNav sections={SECTIONS} currentHref="/loyalty/program" linkAs={RouterLink} profile={{ ...PROFILE, href: '/account' }} />);
    for (const name of ['Dashboard', 'Program Configuration', 'Olivia James']) {
      expect(screen.getByRole('link', { name })).toHaveAttribute('data-router');
    }
  });

  it('takes its own name', () => {
    render(<FinSideNav sections={SECTIONS} aria-label="Admin" />);
    expect(screen.getByRole('navigation', { name: 'Admin' })).toBeInTheDocument();
  });

  it('profile menu: the user row opens an account menu (expanded), its arrow up while open', async () => {
    const user = userEvent.setup();
    const onLogOut = vi.fn();
    render(
      <FinSideNav
        sections={SECTIONS}
        type="expanded"
        profile={{
          name: 'Olivia James',
          email: 'olivia@email.com',
          menu: [
            { label: 'Settings', icon: 'settings', onSelect: () => {} },
            { label: 'Log out', icon: 'logout', onSelect: onLogOut, separator: true },
          ],
        }}
      />,
    );
    const row = screen.getByRole('button', { name: 'Olivia James' });
    expect(row).toHaveAttribute('aria-haspopup', 'menu');
    expect(row.closest('[data-size]')).toHaveTextContent('keyboard_arrow_down');
    await user.click(row);
    expect(screen.getByRole('menu', { name: 'Account' })).toBeInTheDocument();
    expect(row.closest('[data-size]')).toHaveTextContent('keyboard_arrow_up');
    expect(screen.getByRole('separator')).toBeInTheDocument();
    await user.click(screen.getByRole('menuitem', { name: 'Log out' }));
    expect(onLogOut).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('profile menu when minimized: the avatar opens it', async () => {
    const user = userEvent.setup();
    render(
      <FinSideNav sections={SECTIONS} type="minimized" profile={{ name: 'Olivia James', menu: [{ label: 'Settings', onSelect: () => {} }] }} />,
    );
    await user.click(screen.getByRole('button', { name: 'Olivia James' }));
    expect(screen.getByRole('menuitem', { name: 'Settings' })).toBeInTheDocument();
  });
});
