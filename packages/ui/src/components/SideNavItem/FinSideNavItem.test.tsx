import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinSideNavSubItem } from '../SideNavSubItem';
import { FinSideNavItem } from './FinSideNavItem';

const subItems = (
  <>
    <FinSideNavSubItem href="/loyalty/program">Program Configuration</FinSideNavSubItem>
    <FinSideNavSubItem href="/loyalty/tiers">Tier Management</FinSideNavSubItem>
  </>
);

describe('FinSideNavItem', () => {
  it('without sub items, is a link with the icon and label (no chevron)', () => {
    render(<FinSideNavItem icon="home" label="Dashboard" href="/dashboard" />);
    const link = screen.getByRole('link', { name: 'Dashboard' });
    expect(link).toHaveAttribute('href', '/dashboard');
    expect(link).not.toHaveAttribute('aria-current');
    expect(link).not.toHaveTextContent('keyboard_arrow');
  });

  it('as the current place (Selected - BG), is the current page', () => {
    render(<FinSideNavItem icon="home" label="Dashboard" href="/dashboard" selected="item" />);
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page');
  });

  it('with sub items, is a closed button with a down chevron and no sub items shown', () => {
    render(
      <FinSideNavItem icon="person" label="Loyalty Management">
        {subItems}
      </FinSideNavItem>,
    );
    const button = screen.getByRole('button', { name: 'Loyalty Management' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveTextContent('keyboard_arrow_down');
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('when expanded, shows the sub items under an open button with an up chevron', () => {
    render(
      <FinSideNavItem icon="person" label="Loyalty Management" selected="sub-item" expanded>
        {subItems}
      </FinSideNavItem>,
    );
    const button = screen.getByRole('button', { name: 'Loyalty Management' });
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveTextContent('keyboard_arrow_up');
    const region = document.getElementById(button.getAttribute('aria-controls') ?? '');
    expect(region).toContainElement(screen.getByRole('link', { name: 'Tier Management' }));
  });

  it('reports clicks on the button (the side nav decides what opens)', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <FinSideNavItem icon="person" label="Loyalty Management" onClick={onClick}>
        {subItems}
      </FinSideNavItem>,
    );
    await user.click(screen.getByRole('button', { name: 'Loyalty Management' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('when minimized, shows only the icon, keeps the name and never shows sub items', () => {
    render(
      <FinSideNavItem icon="person" label="Loyalty Management" type="minimized" expanded>
        {subItems}
      </FinSideNavItem>,
    );
    const button = screen.getByRole('button', { name: 'Loyalty Management' });
    expect(button).not.toHaveAttribute('aria-expanded');
    expect(button).not.toHaveTextContent('keyboard_arrow');
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('forwards ref and attributes to the link', () => {
    const ref = createRef<HTMLElement>();
    render(<FinSideNavItem ref={ref} icon="home" label="Dashboard" href="/dashboard" data-testid="item" />);
    expect(ref.current?.tagName).toBe('A');
    expect(screen.getByTestId('item')).toBe(ref.current);
  });
});
