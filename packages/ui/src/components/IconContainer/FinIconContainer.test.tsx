import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FinIconContainer } from './FinIconContainer';

const icon = (root: Element) => root.querySelector('[data-size][translate="no"]')!;

describe('FinIconContainer', () => {
  it('defaults to a 40px primary circle with a 24px FinIcon inside', () => {
    const { container } = render(<FinIconContainer name="person" />);
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute('data-size', '40');
    expect(root).toHaveAttribute('data-tone', 'primary');
    expect(icon(root)).toHaveAttribute('data-size', '24');
    expect(icon(root)).toHaveTextContent('person');
  });

  it('uses a 36px icon in the 64px circle', () => {
    const { container } = render(<FinIconContainer name="person" size={64} />);
    expect(container.firstElementChild).toHaveAttribute('data-size', '64');
    expect(icon(container.firstElementChild!)).toHaveAttribute('data-size', '36');
  });

  it.each([
    ['primary', 'var(--fin-fg-primary)'],
    ['secondary', 'var(--fin-fg-secondary)'],
    ['disabled', 'var(--fin-fg-disabled-on-bg)'],
    ['success', 'var(--fin-fg-success)'],
    ['warning', 'var(--fin-fg-warning)'],
    ['error', 'var(--fin-fg-error)'],
    ['info', 'var(--fin-fg-info)'],
  ] as const)('tone %s colors the icon with %s', (tone, token) => {
    const { container } = render(<FinIconContainer name="person" tone={tone} />);
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute('data-tone', tone);
    expect((icon(root) as HTMLElement).style.getPropertyValue('--icon-color')).toBe(token);
  });

  it('is decorative by default', () => {
    const { container } = render(<FinIconContainer name="person" />);
    expect(icon(container.firstElementChild!)).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('passes label to the icon, which is then announced as an image', () => {
    render(<FinIconContainer name="check_circle" tone="success" label="Completed" />);
    expect(screen.getByRole('img', { name: 'Completed' })).toHaveTextContent('check_circle');
  });

  it('passes className and other attributes to the circle', () => {
    const { container } = render(<FinIconContainer name="person" className="extra" data-testid="circle" />);
    expect(container.firstElementChild).toHaveClass('extra');
    expect(screen.getByTestId('circle')).toBe(container.firstElementChild);
  });
});
