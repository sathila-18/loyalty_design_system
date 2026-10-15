import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FinCaption } from './FinCaption';

describe('FinCaption', () => {
  it('is a span, small and heavy by default (as Figma)', () => {
    const { container } = render(<FinCaption>Caption</FinCaption>);
    const root = container.firstElementChild!;
    expect(root.tagName).toBe('SPAN');
    expect(root).toHaveAttribute('data-size', 'small');
    expect(root).toHaveAttribute('data-thickness', 'heavy');
    expect(root).toHaveTextContent('Caption');
  });

  it.each([
    ['small', 'light'],
    ['medium', 'heavy'],
    ['large', 'light'],
  ] as const)('renders size %s, thickness %s', (size, thickness) => {
    const { container } = render(
      <FinCaption size={size} thickness={thickness}>
        Caption
      </FinCaption>,
    );
    expect(container.firstElementChild).toHaveAttribute('data-size', size);
    expect(container.firstElementChild).toHaveAttribute('data-thickness', thickness);
  });

  it('passes className and other attributes to the span', () => {
    render(
      <FinCaption className="extra" data-testid="c" id="points-help">
        Caption
      </FinCaption>,
    );
    expect(screen.getByTestId('c')).toHaveClass('extra');
    expect(screen.getByTestId('c')).toHaveAttribute('id', 'points-help');
  });
});
