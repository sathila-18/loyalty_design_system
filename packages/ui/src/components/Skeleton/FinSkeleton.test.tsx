import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FinSkeleton } from './FinSkeleton';

describe('FinSkeleton', () => {
  it('defaults to a text line, hidden from screen readers', () => {
    const { container } = render(<FinSkeleton />);
    const skeleton = container.firstElementChild as HTMLElement;
    expect(skeleton).toHaveAttribute('data-shape', 'text');
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    expect(skeleton).toBeEmptyDOMElement();
    expect(skeleton.getAttribute('style') ?? '').toBe('');
  });

  it('takes a width and height in px or any CSS length', () => {
    const { container } = render(<FinSkeleton shape="rect" width="60%" height={40} />);
    const skeleton = container.firstElementChild as HTMLElement;
    expect(skeleton).toHaveAttribute('data-shape', 'rect');
    expect(skeleton.style.getPropertyValue('--skeleton-width')).toBe('60%');
    expect(skeleton.style.getPropertyValue('--skeleton-height')).toBe('40px');
  });

  it('keeps a circle round: its height follows its width', () => {
    const { container } = render(<FinSkeleton shape="circle" width={48} height={20} className="extra" />);
    const skeleton = container.firstElementChild as HTMLElement;
    expect(skeleton.style.getPropertyValue('--skeleton-width')).toBe('48px');
    expect(skeleton.style.getPropertyValue('--skeleton-height')).toBe('');
    expect(skeleton).toHaveClass('extra');
  });
});
