import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FinBadge } from './FinBadge';

const icons = (root: Element) => [...root.querySelectorAll('[translate="no"]')] as HTMLElement[];

describe('FinBadge', () => {
  it('is a small primary FinBadgeBase by default', () => {
    const { container } = render(<FinBadge>Active</FinBadge>);
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute('data-size', 'small');
    expect(root).toHaveAttribute('data-tone', 'primary');
    expect(root).toHaveTextContent('Active');
    expect(icons(root)).toHaveLength(0);
  });

  it.each(['primary', 'secondary', 'success', 'error', 'info', 'warning', 'disabled', 'neutral'] as const)(
    'passes tone %s to the base',
    (tone) => {
      const { container } = render(<FinBadge tone={tone}>Text</FinBadge>);
      expect(container.firstElementChild).toHaveAttribute('data-tone', tone);
    },
  );

  it('passes leading and trailing icons at 16px, colored by the tone (no color of their own)', () => {
    const { container } = render(
      <FinBadge tone="success" leadingIcon="check_circle" trailingIcon="keyboard_arrow_down">
        Paid
      </FinBadge>,
    );
    const [lead, trail] = icons(container.firstElementChild!);
    expect(lead).toHaveTextContent('check_circle');
    expect(trail).toHaveTextContent('keyboard_arrow_down');
    for (const i of [lead!, trail!]) {
      expect(i).toHaveAttribute('data-size', '16');
      expect(i).toHaveAttribute('aria-hidden', 'true');
      expect(i.style.getPropertyValue('--icon-color')).toBe('');
    }
  });

  it('is always small, whatever is passed', () => {
    const props = { size: 'large' } as unknown as Record<string, never>;
    const { container } = render(<FinBadge {...props}>Text</FinBadge>);
    expect(container.firstElementChild).toHaveAttribute('data-size', 'small');
  });

  it('passes className and other attributes to the badge', () => {
    render(
      <FinBadge className="extra" data-testid="b" title="Status: active">
        Active
      </FinBadge>,
    );
    expect(screen.getByTestId('b')).toHaveClass('extra');
    expect(screen.getByTestId('b')).toHaveAttribute('title', 'Status: active');
  });
});
