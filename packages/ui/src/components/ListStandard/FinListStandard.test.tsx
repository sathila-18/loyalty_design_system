import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinListStandard } from './FinListStandard';

describe('FinListStandard', () => {
  it('shows the title and description, with no accessories by default (Figma Default)', () => {
    const { container } = render(<FinListStandard title="Title here" description="Placeholder description here" />);
    const row = container.firstElementChild as HTMLElement;
    expect(screen.getByText('Title here')).toBeInTheDocument();
    expect(screen.getByText('Placeholder description here').tagName).toBe('P');
    expect(row).not.toHaveTextContent('keyboard_arrow_right');
    expect(row).not.toHaveAttribute('data-interactive');
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('shows each leading accessory, the caption and the chevron', () => {
    const { container, rerender } = render(<FinListStandard title="T" leadingAccessory="icon" icon="home" caption="Caption" chevron />);
    const row = () => container.firstElementChild as HTMLElement;
    expect(row()).toHaveTextContent('home');
    expect(screen.getByText('Caption')).toBeInTheDocument();
    expect(row()).toHaveTextContent('keyboard_arrow_right');
    rerender(<FinListStandard title="T" leadingAccessory="avatar" avatar={{ initials: 'AP', label: 'Ann Perera' }} />);
    expect(screen.getByRole('img', { name: 'Ann Perera' })).toBeInTheDocument();
    rerender(<FinListStandard title="T" leadingAccessory="payment" paymentMethod="mastercard" />);
    expect(screen.getByRole('img', { name: 'Mastercard' })).toBeInTheDocument();
    rerender(<FinListStandard title="T" leading={<span>VISA</span>} leadingAccessory="icon" />);
    expect(screen.getByText('VISA')).toBeInTheDocument();
    expect(row()).not.toHaveTextContent('person');
  });

  it('as a link, is one link named by the title and described by the description', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    render(<FinListStandard behavior="link" href="/members/1" title="Ann Perera" description="Gold member" onClick={onClick} selected />);
    const link = screen.getByRole('link', { name: 'Ann Perera' });
    expect(link).toHaveAttribute('href', '/members/1');
    expect(link).toHaveAccessibleDescription('Gold member');
    expect(link).toHaveAttribute('aria-current', 'page');
    await user.click(link);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("uses a router's link component when given", () => {
    const RouterLink = ({ href, className, children }: { href?: string; className?: string; children?: ReactNode }) => (
      <a href={href} className={className} data-router="">
        {children}
      </a>
    );
    render(<FinListStandard behavior="link" href="/x" linkAs={RouterLink} title="Go" />);
    expect(screen.getByRole('link', { name: 'Go' })).toHaveAttribute('data-router');
  });

  it('as a button, runs onClick; disabled, it does not', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(<FinListStandard behavior="button" title="Export" onClick={onClick} />);
    await user.click(screen.getByRole('button', { name: 'Export' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(<FinListStandard behavior="button" title="Export" onClick={onClick} disabled />);
    expect(screen.getByRole('button', { name: 'Export' })).toBeDisabled();
  });

  it('as an option, is a selectable option in a list box', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <ul role="listbox" aria-label="Countries">
        <FinListStandard as="li" behavior="option" title="Sri Lanka" selected onClick={onClick} />
        <FinListStandard as="li" behavior="option" title="India" disabled onClick={onClick} />
      </ul>,
    );
    const [lk, india] = screen.getAllByRole('option');
    expect(lk).toHaveAttribute('aria-selected', 'true');
    expect(india).toHaveAttribute('aria-disabled', 'true');
    await user.click(screen.getByText('Sri Lanka'));
    await user.click(screen.getByText('India'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('a disabled link is not a link target', () => {
    render(<FinListStandard behavior="link" href="/x" title="Locked" disabled />);
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByText('Locked')).toHaveAttribute('aria-disabled', 'true');
  });

  it('is a menu item (in a role="menu" list): a button with role menuitem, out of the tab order, in a role-less row', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <ul role="menu" aria-label="Actions">
        <FinListStandard as="li" behavior="menuitem" title="Edit" description="Change the details" onClick={onClick} />
        <FinListStandard as="li" behavior="menuitem" title="Delete" disabled />
      </ul>,
    );
    const item = screen.getByRole('menuitem', { name: 'Edit' });
    expect(item).toHaveAttribute('tabindex', '-1');
    expect(item).toHaveAccessibleDescription('Change the details');
    expect(item.closest('li')).toHaveAttribute('role', 'none');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeDisabled();
    await user.click(item);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('hides its line with divider={false}, marking the row for its 16 of bottom padding', () => {
    const { container } = render(<FinListStandard title="Members" divider={false} />);
    expect(container.querySelector('hr')).toBeNull();
    expect(container.firstElementChild).toHaveAttribute('data-divider', 'none');
  });
});
