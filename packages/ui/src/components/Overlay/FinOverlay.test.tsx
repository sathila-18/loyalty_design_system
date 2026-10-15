import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FinOverlay } from './FinOverlay';

describe('FinOverlay', () => {
  it('is decorative: hidden from screen readers, not focusable, no content', () => {
    const { container } = render(<FinOverlay />);
    const overlay = container.firstElementChild as HTMLElement;
    expect(overlay).toHaveAttribute('aria-hidden', 'true');
    expect(overlay).not.toHaveAttribute('tabindex');
    expect(overlay).toBeEmptyDOMElement();
  });

  it('is skipped by the keyboard', async () => {
    const user = userEvent.setup();
    render(
      <>
        <FinOverlay />
        <button type="button">Close</button>
      </>,
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
  });

  it('calls onClick (for "click outside")', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<FinOverlay onClick={onClick} data-testid="overlay" />);
    await user.click(screen.getByTestId('overlay'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('passes className and other attributes to the overlay', () => {
    render(<FinOverlay className="extra" data-testid="overlay" />);
    expect(screen.getByTestId('overlay')).toHaveClass('extra');
  });
});
