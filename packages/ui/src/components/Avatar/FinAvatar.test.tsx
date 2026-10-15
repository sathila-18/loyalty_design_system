import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FinAvatar } from './FinAvatar';

const icon = (root: Element) => root.querySelector('[translate="no"]');

describe('FinAvatar', () => {
  it('shows the photo, named by its alt text', () => {
    const { container } = render(<FinAvatar src="/me.jpg" initials="SD" label="Sathila De Silva" />);
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute('data-type', 'image');
    expect(root).toHaveAttribute('data-size', 'medium');
    expect(screen.getByRole('img', { name: 'Sathila De Silva' })).toHaveAttribute('src', '/me.jpg');
    expect(root).not.toHaveAttribute('role');
  });

  it('falls back to initials without a photo', () => {
    const { container } = render(<FinAvatar initials="SD" label="Sathila De Silva" />);
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute('data-type', 'text');
    expect(root).toHaveTextContent('SD');
    expect(screen.getByRole('img', { name: 'Sathila De Silva' })).toBe(root);
  });

  it('falls back to initials when the photo fails, and tries a new src again', () => {
    const { container, rerender } = render(<FinAvatar src="/broken.jpg" initials="SD" />);
    fireEvent.error(container.querySelector('img')!);
    expect(container.firstElementChild).toHaveAttribute('data-type', 'text');
    rerender(<FinAvatar src="/other.jpg" initials="SD" />);
    expect(container.firstElementChild).toHaveAttribute('data-type', 'image');
  });

  it('falls back to the icon without a photo or initials', () => {
    const { container } = render(<FinAvatar initials="  " />);
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute('data-type', 'icon');
    expect(icon(root)).toHaveTextContent('person');
  });

  it('the icon type ignores src and initials', () => {
    const { container } = render(<FinAvatar type="icon" src="/me.jpg" initials="SD" />);
    expect(container.firstElementChild).toHaveAttribute('data-type', 'icon');
    expect(container.querySelector('img')).toBeNull();
  });

  it.each([
    ['xsmall', '16'],
    ['small', '20'],
    ['medium', '24'],
    ['large', '24'],
    ['xlarge', '36'],
    ['xxlarge', '48'],
    ['xxxlarge', '64'],
  ] as const)('size %s uses a %spx secondary icon', (size, iconSize) => {
    const { container } = render(<FinAvatar type="icon" size={size} />);
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute('data-size', size);
    expect(icon(root)).toHaveAttribute('data-size', iconSize);
    expect((icon(root) as HTMLElement).style.getPropertyValue('--icon-color')).toBe('var(--fin-fg-secondary)');
  });

  it('is decorative without a label', () => {
    const { container } = render(<FinAvatar initials="SD" />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('img')).toBeNull();
    render(<FinAvatar src="/me.jpg" />);
    expect(screen.getByRole('presentation', { hidden: true })).toHaveAttribute('alt', '');
  });

  it('passes className and other attributes to the circle', () => {
    const { container } = render(<FinAvatar type="icon" className="extra" data-testid="avatar" />);
    expect(container.firstElementChild).toHaveClass('extra');
    expect(screen.getByTestId('avatar')).toBe(container.firstElementChild);
  });
});
