import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FinProgressBar } from './FinProgressBar';

const width = (el: HTMLElement) => el.style.getPropertyValue('--progress');

describe('FinProgressBar', () => {
  it('is a progressbar with its name and value, large by default', () => {
    render(<FinProgressBar value={40} label="Profile completion" />);
    const bar = screen.getByRole('progressbar', { name: 'Profile completion' });
    expect(bar).toHaveAttribute('aria-valuenow', '40');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(bar).toHaveAttribute('data-size', 'large');
    expect(width(bar)).toBe('40%');
  });

  it.each([
    [0, '0%'],
    [33.3, '33.3%'],
    [100, '100%'],
  ])('accepts any value: %s → %s', (value, expected) => {
    render(<FinProgressBar value={value} label="Progress" />);
    expect(width(screen.getByRole('progressbar'))).toBe(expected);
  });

  it('clamps out-of-range and invalid values', () => {
    const { rerender } = render(<FinProgressBar value={140} label="Progress" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    rerender(<FinProgressBar value={-5} label="Progress" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    rerender(<FinProgressBar value={Number.NaN} label="Progress" />);
    expect(width(screen.getByRole('progressbar'))).toBe('0%');
  });

  it('takes a max, for counts', () => {
    render(<FinProgressBar value={3} max={5} label="Step 3 of 5" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuemax', '5');
    expect(bar).toHaveAttribute('aria-valuenow', '3');
    expect(width(bar)).toBe('60%');
  });

  it('renders the small size', () => {
    render(<FinProgressBar value={10} size="small" label="Upload" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('data-size', 'small');
  });

  it('keeps a passed style and passes className and other attributes', () => {
    render(<FinProgressBar value={50} label="P" className="extra" data-testid="pb" style={{ marginTop: 0 }} />);
    const bar = screen.getByTestId('pb');
    expect(bar).toHaveClass('extra');
    expect(bar.style.marginTop).toBe('0px');
    expect(width(bar)).toBe('50%');
  });
});
