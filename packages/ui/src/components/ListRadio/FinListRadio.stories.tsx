import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { FinListItemSize } from '../ListItem';
import { FinListRadio, FinListRadioGroup, type FinListRadioItemSide, type FinListRadioType } from './FinListRadio';
import styles from './FinListRadio.stories.module.css';

/**
 * Known contrast exceptions (as List-standard, DESIGN.md §10 #3): Disabled rows are greyed on purpose and left out of
 * the a11y check; the Selected+hovered description (Light) is accepted and not part of the run (hover).
 */
const KNOWN_CONTRAST_ISSUES = ['[data-disabled]'];

interface Args {
  type: FinListRadioType;
  itemSide: FinListRadioItemSide;
  description: boolean;
  size: FinListItemSize;
  disabled: boolean;
}

/** A radio list: choose one row. Matches Figma's properties (DESIGN.md §9). */
const meta: Meta<Args> = {
  title: 'Components/List/List radio',
  args: { type: 'default', itemSide: 'leading', description: true, size: 'large', disabled: false },
  argTypes: {
    type: { control: 'inline-radio', options: ['default', 'country', 'payment'], description: 'Figma `Type`' },
    itemSide: { control: 'inline-radio', options: ['leading', 'trailing'], description: 'Figma `Item side`' },
    description: { control: 'boolean', description: 'Figma `Description`' },
    size: { control: 'inline-radio', options: ['large', 'small'], description: 'Size (List-base)' },
    disabled: { control: 'boolean', description: 'Figma `State=Disabled` (the third row)' },
  },
  parameters: { layout: 'padded', a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
  render: function Playground({ type, itemSide, description, size, disabled }) {
    const [value, setValue] = useState('one');
    const rows = [
      { value: 'one', country: 'LK', payment: 'visa' },
      { value: 'two', country: 'IN', payment: 'mastercard' },
      { value: 'three', country: 'MV', payment: 'amex' },
    ] as const;
    return (
      <div className={styles.column}>
        <FinListRadioGroup label="Example" value={value} onValueChange={setValue} size={size}>
          {rows.map((row) => (
            <FinListRadio
              key={row.value}
              value={row.value}
              title="Title here"
              type={type}
              itemSide={itemSide}
              country={row.country}
              paymentMethod={row.payment}
              disabled={disabled && row.value === 'three'}
              {...(description ? { description: 'Placeholder description here' } : {})}
            />
          ))}
        </FinListRadioGroup>
      </div>
    );
  },
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/** The Figma List-radio_button page: each Type with the item on each side (the first row chosen). */
export const Types: Story = {
  name: 'Types (Figma)',
  render: () => (
    <div className={styles.row}>
      {(['leading', 'trailing'] as const).map((side) => (
        <div key={side} className={styles.column}>
          <FinListRadioGroup label={`Item side ${side}`} value="default">
            <FinListRadio value="default" title="Title here" description="Placeholder description here" />
            <FinListRadio value="country" title="Title here" description="Placeholder description here" type="country" country="LK" itemSide={side} />
            <FinListRadio value="payment" title="Title here" description="Placeholder description here" type="payment" paymentMethod="visa" itemSide={side} />
            <FinListRadio value="disabled" title="Title here" type="payment" paymentMethod="visa" itemSide={side} disabled />
          </FinListRadioGroup>
        </div>
      ))}
    </div>
  ),
};

/** A real scenario: choose the card to pay with (click a row, or use Tab and the arrow keys). */
export const PaymentMethod: Story = {
  name: 'Payment method',
  render: function PaymentMethod() {
    const [card, setCard] = useState('visa');
    return (
      <div className={styles.column}>
        <FinListRadioGroup label="Pay with" value={card} onValueChange={setCard}>
          <FinListRadio value="visa" title="Visa ending 4242" description="Expires 09/28" type="payment" paymentMethod="visa" />
          <FinListRadio value="mastercard" title="Mastercard ending 8812" description="Expires 03/27" type="payment" paymentMethod="mastercard" />
          <FinListRadio value="amex" title="American Express ending 1005" description="Expired" type="payment" paymentMethod="amex" disabled />
        </FinListRadioGroup>
        <p className={styles.readout}>Chosen: {card}</p>
      </div>
    );
  },
};
