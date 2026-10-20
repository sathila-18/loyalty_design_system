import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FinListRadioGroup } from '../ListRadio';
import { FinListRadioFilled } from './FinListRadioFilled';
import styles from './FinListRadioFilled.stories.module.css';

/** Disabled cards are greyed on purpose (as List-standard, DESIGN.md §10 #3) and left out of the a11y check. */
const KNOWN_CONTRAST_ISSUES = ['[data-disabled]'];

/** Radio cards: the radio list on List_fill-base, in FinListRadioGroup. Code first (DESIGN.md §10 #56). */
const meta: Meta = {
  title: 'Components/List/Filled/List radio',
  parameters: { layout: 'padded', a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
};
export default meta;

type Story = StoryObj;

/** Choose a card to pay with: the chosen card has the 1px blue edge (click a card, or Tab and the arrow keys). */
export const PaymentMethod: Story = {
  name: 'Payment method',
  render: function PaymentMethod() {
    const [card, setCard] = useState('visa');
    return (
      <div className={styles.list}>
        <FinListRadioGroup label="Pay with" value={card} onValueChange={setCard}>
          <FinListRadioFilled value="visa" title="Visa ending 4242" description="Expires 09/28" type="payment" paymentMethod="visa" />
          <FinListRadioFilled value="mastercard" title="Mastercard ending 8812" description="Expires 03/27" type="payment" paymentMethod="mastercard" />
          <FinListRadioFilled value="amex" title="American Express ending 1005" description="Expired" type="payment" paymentMethod="amex" disabled />
        </FinListRadioGroup>
      </div>
    );
  },
};

/** Each type with the item on each side (the first card chosen). */
export const Types: Story = {
  render: () => (
    <div className={styles.row}>
      {(['leading', 'trailing'] as const).map((side) => (
        <div key={side} className={styles.list}>
          <FinListRadioGroup label={`Item side ${side}`} value="default">
            <FinListRadioFilled value="default" title="Title here" description="Placeholder description here" />
            <FinListRadioFilled value="country" title="Title here" description="Placeholder description here" type="country" country="LK" itemSide={side} />
            <FinListRadioFilled value="payment" title="Title here" type="payment" paymentMethod="visa" itemSide={side} />
          </FinListRadioGroup>
        </div>
      ))}
    </div>
  ),
};
