import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FinSideNavIcon } from './FinSideNavIcon';

describe('FinSideNavIcon', () => {
  it('is an outlined, decorative 24 icon in fg-secondary (Figma Unselected)', () => {
    render(<FinSideNavIcon name="person" data-testid="icon" />);
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveTextContent('person');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).not.toHaveAttribute('data-filled');
    expect(icon.getAttribute('style')).toContain('fg-secondary');
  });

  it('is filled and fg-active when selected (Figma Selected)', () => {
    render(<FinSideNavIcon name="person" selected data-testid="icon" />);
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('data-filled');
    expect(icon.getAttribute('style')).toContain('fg-active');
  });

  it('passes other attributes to the icon', () => {
    render(<FinSideNavIcon name="home" className="extra" data-testid="icon" />);
    expect(screen.getByTestId('icon')).toHaveClass('extra');
    expect(screen.getByTestId('icon')).toHaveTextContent('home');
  });
});
