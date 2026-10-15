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

  describe('online', () => {
    const dot = (root: Element) => root.querySelector(':scope > [data-size]:not([translate])');

    it.each([
      ['xsmall', 'xsmall'],
      ['small', 'small'],
      ['medium', 'medium'],
      ['large', 'medium'],
      ['xlarge', 'large'],
      ['xxlarge', 'large'],
      ['xxxlarge', 'xlarge'],
    ] as const)('a %s avatar gets a %s indicator', (size, indicator) => {
      const { container } = render(<FinAvatar type="icon" size={size} label="Sathila De Silva" online />);
      expect(dot(container.firstElementChild!)).toHaveAttribute('data-size', indicator);
    });

    it('adds the status to the name, and hides the dot', () => {
      const { container } = render(<FinAvatar initials="SD" label="Sathila De Silva" online />);
      expect(screen.getByRole('img')).toHaveAccessibleName('Sathila De Silva, Online');
      expect(dot(container.firstElementChild!)).toHaveAttribute('aria-hidden', 'true');
    });

    it('adds the status to the photo alt text', () => {
      render(<FinAvatar src="/me.jpg" label="Sathila De Silva" online onlineLabel="Available" />);
      expect(screen.getByRole('img')).toHaveAttribute('alt', 'Sathila De Silva, Available');
    });

    it('without a name, announces only the dot', () => {
      const { container } = render(<FinAvatar initials="SD" online />);
      expect(container.firstElementChild).not.toHaveAttribute('aria-hidden');
      expect(container.firstElementChild).not.toHaveAttribute('role');
      expect(screen.getByRole('img')).toHaveAccessibleName('Online');
      expect(screen.getByRole('img')).toBe(dot(container.firstElementChild!));
    });

    it('shows no indicator by default', () => {
      const { container } = render(<FinAvatar type="icon" label="Sathila De Silva" />);
      expect(dot(container.firstElementChild!)).toBeNull();
      expect(screen.getByRole('img')).toHaveAccessibleName('Sathila De Silva');
    });
  });
});
