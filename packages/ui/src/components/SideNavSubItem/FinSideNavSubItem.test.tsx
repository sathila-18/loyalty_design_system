import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinSideNavSubItem } from './FinSideNavSubItem';

describe('FinSideNavSubItem', () => {
  it('is a link named by its label (Figma Default)', () => {
    render(<FinSideNavSubItem href="/members">Members</FinSideNavSubItem>);
    const link = screen.getByRole('link', { name: 'Members' });
    expect(link).toHaveAttribute('href', '/members');
    expect(link).not.toHaveAttribute('aria-current');
    expect(link).not.toHaveAttribute('data-selected');
  });

  it('when selected, is the current page (Figma Selected)', () => {
    render(
      <FinSideNavSubItem href="/members" selected>
        Members
      </FinSideNavSubItem>,
    );
    const link = screen.getByRole('link', { name: 'Members' });
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveAttribute('data-selected');
  });

  it("uses a router's link component when given", () => {
    const RouterLink = ({ href, className, children }: { href?: string; className?: string; children?: ReactNode }) => (
      <a href={href} className={className} data-router="">
        {children}
      </a>
    );
    render(
      <FinSideNavSubItem href="/tiers" linkAs={RouterLink}>
        Tiers
      </FinSideNavSubItem>,
    );
    expect(screen.getByRole('link', { name: 'Tiers' })).toHaveAttribute('data-router');
  });

  it('is reachable with the keyboard and passes clicks, ref and attributes through', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    const ref = createRef<HTMLAnchorElement>();
    render(
      <FinSideNavSubItem ref={ref} href="/members" className="extra" onClick={onClick}>
        Members
      </FinSideNavSubItem>,
    );
    await user.tab();
    expect(ref.current).toHaveFocus();
    expect(ref.current).toHaveClass('extra');
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
