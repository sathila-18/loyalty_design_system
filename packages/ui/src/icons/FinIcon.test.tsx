import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FinIcon } from './FinIcon';
import type { FinIconName } from './finIcons';

afterEach(() => vi.restoreAllMocks());

describe('FinIcon', () => {
  it('is decorative by default: hidden from screen readers, no role', () => {
    const { container } = render(<FinIcon name="home" />);
    const icon = container.firstElementChild!;
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).not.toHaveAttribute('role');
    expect(icon).toHaveTextContent('home');
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('is announced as an image with its label', () => {
    render(<FinIcon name="warning" label="Warning" />);
    const icon = screen.getByRole('img', { name: 'Warning' });
    expect(icon).not.toHaveAttribute('aria-hidden');
  });

  it('defaults to 24px and sets the size as a data attribute', () => {
    const { container, rerender } = render(<FinIcon name="home" />);
    expect(container.firstElementChild).toHaveAttribute('data-size', '24');
    rerender(<FinIcon name="home" size={36} />);
    expect(container.firstElementChild).toHaveAttribute('data-size', '36');
  });

  it('maps color to its fg token, and inherits when there is none', () => {
    const { container, rerender } = render(<FinIcon name="home" color="whiteBoth" />);
    const icon = container.firstElementChild as HTMLElement;
    expect(icon.style.getPropertyValue('--icon-color')).toBe('var(--fin-fg-white-both)');
    rerender(<FinIcon name="home" />);
    expect((container.firstElementChild as HTMLElement).style.getPropertyValue('--icon-color')).toBe('');
  });

  it('sets data-filled only when filled', () => {
    const { container, rerender } = render(<FinIcon name="home" />);
    expect(container.firstElementChild).not.toHaveAttribute('data-filled');
    rerender(<FinIcon name="home" filled />);
    expect(container.firstElementChild).toHaveAttribute('data-filled', 'true');
  });

  it('is never translated, and passes className and other attributes through', () => {
    const { container } = render(<FinIcon name="home" className="extra" data-testid="icon" />);
    const icon = container.firstElementChild!;
    expect(icon).toHaveAttribute('translate', 'no');
    expect(icon).toHaveClass('extra');
    expect(screen.getByTestId('icon')).toBe(icon);
  });

  it('warns once in development and renders an empty box for a name not in the registry', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const name = 'settings' as FinIconName;
    const { container } = render(
      <>
        <FinIcon name={name} />
        <FinIcon name={name} />
      </>,
    );
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0]![0]).toContain('"settings"');
    expect(container.firstElementChild).toBeEmptyDOMElement();
  });
});
