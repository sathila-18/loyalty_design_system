import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FinFlag } from './FinFlag';
import { finFlags, isFinFlagCountry, type FinFlagCountry } from './finFlags';

/**
 * The artwork for a code and shape. Small flags are inlined as data URLs (Vite), bigger ones are separate files;
 * either way the SVG carries the library's id, and the square artwork has a 512 viewBox.
 */
const artwork = (code: string, shape: 'rectangle' | 'circle') =>
  new RegExp(`/${shape}/${code}\\.svg|flag-icons-${code}'%20viewBox='0%200%20${shape === 'circle' ? '512%20512' : '640%20480'}`);

describe('FinFlag', () => {
  it('is an image named by the country, and loads its own artwork', async () => {
    render(<FinFlag country="LK" />);
    const flag = screen.getByRole('img', { name: 'Sri Lanka' });
    expect(flag).toHaveAttribute('data-shape', 'rectangle');
    expect(flag).toHaveAttribute('data-size', 'medium');
    await waitFor(() => expect(flag.querySelector('img')).toHaveAttribute('src', expect.stringMatching(artwork('lk', 'rectangle'))));
    expect(flag.querySelector('img')).toHaveAttribute('alt', '');
  });

  it('uses the square artwork for a circle, in every size', async () => {
    const { rerender } = render(<FinFlag country="BH" shape="circle" size="xsmall" />);
    const flag = screen.getByRole('img', { name: 'Bahrain' });
    await waitFor(() => expect(flag.querySelector('img')).toHaveAttribute('src', expect.stringMatching(artwork('bh', 'circle'))));
    for (const size of ['small', 'medium', 'large', 'xlarge'] as const) {
      rerender(<FinFlag country="BH" shape="circle" size={size} />);
      expect(flag).toHaveAttribute('data-size', size);
    }
  });

  it('swaps the artwork when the country changes', async () => {
    const { rerender } = render(<FinFlag country="LK" />);
    await waitFor(() => expect(screen.getByRole('img').querySelector('img')).toBeInTheDocument());
    rerender(<FinFlag country="JP" />);
    expect(screen.getByRole('img', { name: 'Japan' })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('img').querySelector('img')).toHaveAttribute('src', expect.stringMatching(artwork('jp', 'rectangle'))));
  });

  it('marks Disabled without changing the name', () => {
    render(<FinFlag country="LK" disabled />);
    expect(screen.getByRole('img', { name: 'Sri Lanka' })).toHaveAttribute('data-disabled');
  });

  it('is hidden from screen readers when decorative, and takes a translated name', () => {
    const { container, rerender } = render(<FinFlag country="LK" decorative />);
    expect(screen.queryByRole('img')).toBeNull();
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    rerender(<FinFlag country="LK" label="ශ්‍රී ලංකාව" />);
    expect(screen.getByRole('img', { name: 'ශ්‍රී ලංකාව' })).toBeInTheDocument();
  });

  it('shows the neutral flag for an unsupported code', async () => {
    render(<FinFlag country={'ZZ' as FinFlagCountry} />);
    const flag = screen.getByRole('img', { name: 'Unknown country' });
    await waitFor(() => expect(flag.querySelector('img')).toHaveAttribute('src', expect.stringMatching(artwork('xx', 'rectangle'))));
  });

  it('knows every ISO country, and narrows codes from data', () => {
    expect(Object.keys(finFlags)).toHaveLength(249);
    expect(isFinFlagCountry('LK')).toBe(true);
    expect(isFinFlagCountry('lk')).toBe(false);
    expect(isFinFlagCountry('XK')).toBe(false);
  });

  it('passes className and other attributes to the flag', () => {
    render(<FinFlag country="LK" className="extra" data-testid="f" />);
    expect(screen.getByTestId('f')).toHaveClass('extra');
  });
});
