import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FinSpinner } from './FinSpinner';

const arc = (el: HTMLElement) => el.style.getPropertyValue('--arc');

describe('FinSpinner', () => {
  it('without a value is a spinning loader: a progressbar with no value', () => {
    render(<FinSpinner label="Loading" />);
    const s = screen.getByRole('progressbar', { name: 'Loading' });
    expect(s).toHaveAttribute('data-spinning');
    expect(s).not.toHaveAttribute('aria-valuenow');
    expect(arc(s)).toBe('25');
  });

  it('with a value is a still ring showing that share', () => {
    render(<FinSpinner value={60} label="Upload" />);
    const s = screen.getByRole('progressbar', { name: 'Upload' });
    expect(s).not.toHaveAttribute('data-spinning');
    expect(s).toHaveAttribute('aria-valuenow', '60');
    expect(s).toHaveAttribute('aria-valuemin', '0');
    expect(s).toHaveAttribute('aria-valuemax', '100');
    expect(arc(s)).toBe('60');
  });

  it('clamps the value and takes a max', () => {
    const { rerender } = render(<FinSpinner value={150} label="P" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    rerender(<FinSpinner value={1} max={4} label="P" />);
    expect(arc(screen.getByRole('progressbar'))).toBe('25');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '4');
  });

  it.each([
    ['success', 'check', 'var(--fin-fg-success)'],
    ['error', 'warning', 'var(--fin-fg-error)'],
  ] as const)('%s shows the %s icon and is named by its label', (status, icon, color) => {
    render(<FinSpinner status={status} label="Upload finished" />);
    const s = screen.getByRole('img', { name: 'Upload finished' });
    expect(s).toHaveAttribute('data-status', status);
    const glyph = s.querySelector('[translate="no"]') as HTMLElement;
    expect(glyph).toHaveTextContent(icon);
    expect(glyph).toHaveAttribute('data-size', '24');
    expect(glyph.style.getPropertyValue('--icon-color')).toBe(color);
    expect(screen.queryByRole('progressbar')).toBeNull();
  });

  it('keeps a passed style and passes className and other attributes', () => {
    render(<FinSpinner value={10} label="P" className="extra" data-testid="s" style={{ marginTop: 0 }} />);
    const s = screen.getByTestId('s');
    expect(s).toHaveClass('extra');
    expect(s.style.marginTop).toBe('0px');
    expect(arc(s)).toBe('10');
  });
});
