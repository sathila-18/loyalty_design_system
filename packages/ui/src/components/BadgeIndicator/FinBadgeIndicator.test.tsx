import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FinBadgeIndicator } from './FinBadgeIndicator';

const badge = (container: HTMLElement) => container.firstElementChild as HTMLElement;

describe('FinBadgeIndicator', () => {
  it('defaults to a small error dot, hidden from screen readers', () => {
    const { container } = render(<FinBadgeIndicator />);
    const el = badge(container);
    expect(el).toHaveAttribute('data-shape', 'dot');
    expect(el).toHaveAttribute('data-size', 'small');
    expect(el).toHaveAttribute('data-tone', 'error');
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el).toBeEmptyDOMElement();
  });

  it.each([
    [1, 'circle', '1'],
    [9, 'circle', '9'],
    [10, 'pill', '10'],
    [99, 'pill', '99'],
    [100, 'pill', '99+'],
    [1500, 'pill', '99+'],
  ] as const)('count %i is a %s showing "%s"', (count, shape, text) => {
    const { container } = render(<FinBadgeIndicator count={count} />);
    expect(badge(container)).toHaveAttribute('data-shape', shape);
    expect(badge(container)).toHaveTextContent(text);
  });

  it('caps at max', () => {
    const { container } = render(<FinBadgeIndicator count={12} max={9} />);
    expect(badge(container)).toHaveTextContent('9+');
    expect(badge(container)).toHaveAttribute('data-shape', 'pill');
  });

  it.each([0, -2])('hides the badge when the count is %i', (count) => {
    const { container } = render(<FinBadgeIndicator count={count} label="No notifications" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('reads a count without a label as the number', () => {
    const { container } = render(<FinBadgeIndicator count={3} />);
    expect(badge(container)).not.toHaveAttribute('aria-hidden');
    expect(badge(container)).not.toHaveAttribute('role');
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('uses the label as the accessible name', () => {
    render(<FinBadgeIndicator count={120} label="120 unread notifications" />);
    expect(screen.getByRole('img', { name: '120 unread notifications' })).toHaveTextContent('99+');
  });

  it('announces a dot that has a label', () => {
    render(<FinBadgeIndicator label="New activity" tone="success" size="large" />);
    const dot = screen.getByRole('img', { name: 'New activity' });
    expect(dot).toHaveAttribute('data-tone', 'success');
    expect(dot).toHaveAttribute('data-size', 'large');
  });

  it('passes className and other attributes to the badge', () => {
    render(<FinBadgeIndicator count={3} className="extra" data-testid="b" />);
    expect(screen.getByTestId('b')).toHaveClass('extra');
  });
});
