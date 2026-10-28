import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FinStatCard } from './FinStatCard';

describe('FinStatCard', () => {
  it('shows the label above the value, in reading order', () => {
    const { container } = render(<FinStatCard label="Total points" value="806,400" />);
    expect(container.firstElementChild).toHaveTextContent(/^Total points806,400$/);
    expect(screen.getByText('806,400').tagName).toBe('P');
    expect(screen.getByText('Total points').tagName).toBe('P');
  });

  it('takes any value and passes other attributes to the card', () => {
    render(
      <FinStatCard
        label="Next expiry"
        value={
          <>
            1,200 pts on <time dateTime="2026-10-31">31/10/2026</time>
          </>
        }
        data-testid="card"
        className="extra"
      />,
    );
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('extra');
    expect(card.querySelector('time')).toHaveAttribute('dateTime', '2026-10-31');
  });
});
