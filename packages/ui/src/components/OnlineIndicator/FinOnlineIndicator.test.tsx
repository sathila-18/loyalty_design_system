import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FinOnlineIndicator } from './FinOnlineIndicator';

describe('FinOnlineIndicator', () => {
  it('is announced as "Online" by default, at the medium size', () => {
    render(<FinOnlineIndicator />);
    const dot = screen.getByRole('img', { name: 'Online' });
    expect(dot).toHaveAttribute('data-size', 'medium');
  });

  it('takes another label', () => {
    render(<FinOnlineIndicator label="Available" />);
    expect(screen.getByRole('img', { name: 'Available' })).toBeInTheDocument();
  });

  it.each(['xsmall', 'small', 'medium', 'large', 'xlarge'] as const)('renders the %s size', (size) => {
    render(<FinOnlineIndicator size={size} />);
    expect(screen.getByRole('img')).toHaveAttribute('data-size', size);
  });

  it('is hidden from screen readers when decorative', () => {
    const { container } = render(<FinOnlineIndicator decorative />);
    expect(screen.queryByRole('img')).toBeNull();
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(container.firstElementChild).not.toHaveAttribute('aria-label');
  });

  it('passes className and other attributes to the dot', () => {
    render(<FinOnlineIndicator className="extra" data-testid="dot" />);
    expect(screen.getByTestId('dot')).toHaveClass('extra');
  });
});
