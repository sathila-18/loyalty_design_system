import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FinBadgeBase } from './FinBadgeBase';

const icons = (root: Element) => [...root.querySelectorAll('[translate="no"]')] as HTMLElement[];

describe('FinBadgeBase', () => {
  it('defaults to a small badge with the label and no icons', () => {
    const { container } = render(<FinBadgeBase>Text here</FinBadgeBase>);
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute('data-size', 'small');
    expect(root).toHaveAttribute('data-tone', 'primary');
    expect(root).toHaveTextContent('Text here');
    expect(icons(root)).toHaveLength(0);
  });

  it.each([
    ['small', '16'],
    ['large', '20'],
  ] as const)('a %s badge uses %spx icons', (size, iconSize) => {
    const { container } = render(
      <FinBadgeBase size={size} leadingIcon="person" trailingIcon="check">
        Text here
      </FinBadgeBase>,
    );
    const [lead, trail] = icons(container.firstElementChild!);
    expect(lead).toHaveTextContent('person');
    expect(trail).toHaveTextContent('check');
    for (const i of [lead, trail]) expect(i).toHaveAttribute('data-size', iconSize);
  });

  it('places the icons before and after the label', () => {
    const { container } = render(
      <FinBadgeBase leadingIcon="person" trailingIcon="check">
        Text here
      </FinBadgeBase>,
    );
    const parts = [...container.firstElementChild!.children].map((c) => c.textContent);
    expect(parts).toEqual(['person', 'Text here', 'check']);
  });

  it('shows only the icon that is set', () => {
    const { container } = render(<FinBadgeBase trailingIcon="check">Text here</FinBadgeBase>);
    const parts = [...container.firstElementChild!.children].map((c) => c.textContent);
    expect(parts).toEqual(['Text here', 'check']);
  });

  it('keeps icons decorative and colorless, so they inherit the label color', () => {
    const { container } = render(<FinBadgeBase leadingIcon="person">Text here</FinBadgeBase>);
    const [lead] = icons(container.firstElementChild!);
    expect(lead).toHaveAttribute('aria-hidden', 'true');
    expect(lead!.style.getPropertyValue('--icon-color')).toBe('');
  });

  it('is read as its label only', () => {
    render(
      <FinBadgeBase leadingIcon="person" data-testid="b">
        Text here
      </FinBadgeBase>,
    );
    expect(screen.getByText('Text here')).toBeInTheDocument();
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('passes className and other attributes to the badge', () => {
    render(
      <FinBadgeBase className="extra" data-testid="b" title="Full text">
        Text here
      </FinBadgeBase>,
    );
    expect(screen.getByTestId('b')).toHaveClass('extra');
    expect(screen.getByTestId('b')).toHaveAttribute('title', 'Full text');
  });
});
