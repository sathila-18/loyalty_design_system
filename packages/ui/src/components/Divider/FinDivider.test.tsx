import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FinDivider } from './FinDivider';

describe('FinDivider', () => {
  it('defaults to a horizontal 1px divider announced as a separator', () => {
    render(<FinDivider />);
    const hr = screen.getByRole('separator');
    expect(hr.tagName).toBe('HR');
    expect(hr).toHaveAttribute('data-type', 'divider');
    expect(hr).toHaveAttribute('data-orientation', 'horizontal');
    expect(hr).not.toHaveAttribute('aria-orientation');
  });

  it('renders the section divider type', () => {
    render(<FinDivider type="section-divider" />);
    expect(screen.getByRole('separator')).toHaveAttribute('data-type', 'section-divider');
  });

  it('marks a vertical divider with aria-orientation', () => {
    render(<FinDivider orientation="vertical" />);
    const hr = screen.getByRole('separator');
    expect(hr).toHaveAttribute('data-orientation', 'vertical');
    expect(hr).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('is hidden from screen readers when decorative', () => {
    const { container } = render(<FinDivider decorative orientation="vertical" />);
    expect(screen.queryByRole('separator')).toBeNull();
    const hr = container.firstElementChild!;
    expect(hr).toHaveAttribute('aria-hidden', 'true');
    expect(hr).not.toHaveAttribute('aria-orientation');
  });

  it('passes className and other attributes to the <hr>', () => {
    render(<FinDivider className="extra" data-testid="line" />);
    const hr = screen.getByTestId('line');
    expect(hr).toHaveClass('extra');
    expect(hr).toBe(screen.getByRole('separator'));
  });
});
