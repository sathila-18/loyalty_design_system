import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FinHeader } from './FinHeader';

describe('FinHeader', () => {
  it('shows the title as an h1, a back button and the notification button by default', () => {
    render(<FinHeader heading="Members" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Members' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back' })).toHaveAttribute('type', 'button');
    expect(screen.getByRole('button', { name: /^Notifications/ })).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('shows a string body content as a description, and any other content as it is', () => {
    const { rerender } = render(<FinHeader heading="Members" bodyContent="All members" />);
    expect(screen.getByText('All members').tagName).toBe('P');
    rerender(<FinHeader heading="Members" bodyContent={<span data-testid="custom">Active</span>} />);
    expect(screen.getByTestId('custom')).toBeInTheDocument();
  });

  it('hides the back button and the notification button', () => {
    render(<FinHeader heading="Members" backButton={false} notification={false} />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('calls onBack, and passes the notification props to the bell', async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    const onBell = vi.fn();
    render(
      <FinHeader
        heading="Members"
        onBack={onBack}
        backLabel="Back to dashboard"
        notificationProps={{ notification: 'number', count: 4, onClick: onBell }}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Back to dashboard' }));
    await user.click(screen.getByRole('button', { name: 'Notifications, 4 unread' }));
    expect(onBack).toHaveBeenCalledTimes(1);
    expect(onBell).toHaveBeenCalledTimes(1);
  });

  it('keeps the title on one line, takes a heading level, and passes className and attributes', () => {
    render(<FinHeader heading="Members" headingLevel={2} className="extra" aria-label="Page header" />);
    const heading = screen.getByRole('heading', { level: 2, name: 'Members' });
    expect(heading.closest('[data-truncate-heading]')).not.toBeNull();
    const header = screen.getByRole('banner', { name: 'Page header' });
    expect(header).toHaveClass('extra');
  });
});
