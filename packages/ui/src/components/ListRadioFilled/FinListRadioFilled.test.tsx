import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { FinListRadioGroup } from '../ListRadio';
import { FinListRadioFilled } from './FinListRadioFilled';

function Cards() {
  const [card, setCard] = useState('visa');
  return (
    <FinListRadioGroup label="Pay with" value={card} onValueChange={setCard}>
      <FinListRadioFilled value="visa" title="Visa ending 4242" type="payment" paymentMethod="visa" />
      <FinListRadioFilled value="mastercard" title="Mastercard ending 8812" type="payment" paymentMethod="mastercard" />
    </FinListRadioGroup>
  );
}

describe('FinListRadioFilled', () => {
  it('works in the radio group as cards: clicking a card chooses it and marks it selected', async () => {
    const user = userEvent.setup();
    const { container } = render(<Cards />);
    const cards = container.querySelectorAll('[data-filled]');
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveAttribute('data-selected');
    await user.click(screen.getByText('Mastercard ending 8812'));
    expect(screen.getByRole('radio', { name: 'Mastercard ending 8812' })).toBeChecked();
    expect(container.querySelectorAll('[data-filled]')[1]).toHaveAttribute('data-selected');
    expect(container.querySelector('hr')).toBeNull();
  });
});
