import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinHeaderNotificationButton } from './FinHeaderNotificationButton';

describe('FinHeaderNotificationButton', () => {
  it('is a button that does not submit forms, with a dot by default', () => {
    render(<FinHeaderNotificationButton />);
    const button = screen.getByRole('button', { name: 'Notifications, unread' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('data-notification', 'dot');
  });

  it('shows the count, capped at max, and adds it to the name', () => {
    const { container } = render(<FinHeaderNotificationButton notification="number" count={120} />);
    expect(screen.getByRole('button', { name: 'Notifications, 99+ unread' })).toBeInTheDocument();
    expect(container).toHaveTextContent('99+');
  });

  it('shows no badge with Notification=None, or a count of 0', () => {
    const { rerender } = render(<FinHeaderNotificationButton notification="none" />);
    expect(screen.getByRole('button', { name: 'Notifications' })).toHaveAttribute('data-notification', 'none');
    rerender(<FinHeaderNotificationButton notification="number" count={0} />);
    expect(screen.getByRole('button', { name: 'Notifications' })).toHaveAttribute('data-notification', 'none');
    expect(screen.getByRole('button')).not.toHaveTextContent('0');
  });

  it('never shows a badge when disabled, and is not focusable or pressable', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<FinHeaderNotificationButton notification="number" count={5} disabled onClick={onClick} />);
    const button = screen.getByRole('button', { name: 'Notifications' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('data-notification', 'none');
    await user.click(button);
    await user.tab();
    expect(onClick).not.toHaveBeenCalled();
    expect(button).not.toHaveFocus();
  });

  it('is pressed with a click, Enter or Space', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<FinHeaderNotificationButton onClick={onClick} />);
    await user.click(screen.getByRole('button'));
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('takes a custom label, and forwards ref, className and attributes', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<FinHeaderNotificationButton ref={ref} label="Alerts" className="extra" data-testid="bell" notification="none" />);
    const button = screen.getByRole('button', { name: 'Alerts' });
    expect(ref.current).toBe(button);
    expect(button).toHaveClass('extra');
    expect(button).toHaveAttribute('data-testid', 'bell');
  });
});
