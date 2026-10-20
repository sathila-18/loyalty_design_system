import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { FinListItemSize } from '../ListItem';
import { FinListCheckboxGroup } from '../ListCheckbox';
import type { FinListRadioItemSide, FinListRadioType } from '../ListRadio';
import { FinListCheckboxFilled } from './FinListCheckboxFilled';
import styles from './FinListCheckboxFilled.stories.module.css';

/** Disabled cards are greyed on purpose (as List-standard, DESIGN.md §10 #3) and left out of the a11y check. */
const KNOWN_CONTRAST_ISSUES = ['[data-disabled]'];

interface Args {
  type: FinListRadioType;
  itemSide: FinListRadioItemSide;
  description: boolean;
  size: FinListItemSize;
  disabled: boolean;
}

/** Checkbox cards: the checkbox list on List_fill-base, in FinListCheckboxGroup. Code first (DESIGN.md §10 #56). */
const meta: Meta<Args> = {
  title: 'Components/List/Filled/List checkbox',
  args: { type: 'default', itemSide: 'leading', description: true, size: 'large', disabled: false },
  argTypes: {
    type: { control: 'inline-radio', options: ['default', 'country', 'payment'], description: 'Type' },
    itemSide: { control: 'inline-radio', options: ['leading', 'trailing'], description: 'Item side' },
    description: { control: 'boolean', description: 'Description' },
    size: { control: 'inline-radio', options: ['large', 'small'], description: 'Size' },
    disabled: { control: 'boolean', description: 'Disabled (the third card)' },
  },
  parameters: { layout: 'padded', a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
  render: function Playground({ type, itemSide, description, size, disabled }) {
    const [value, setValue] = useState(['one']);
    const rows = [
      { value: 'one', country: 'LK', payment: 'visa' },
      { value: 'two', country: 'IN', payment: 'mastercard' },
      { value: 'three', country: 'MV', payment: 'amex' },
    ] as const;
    return (
      <div className={styles.list}>
        <FinListCheckboxGroup label="Example" value={value} onValueChange={setValue} size={size}>
          {rows.map((row) => (
            <FinListCheckboxFilled
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
        </FinListCheckboxGroup>
      </div>
    );
  },
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/** Tick any cards: ticked cards have the 1px blue edge. */
export const Countries: Story = {
  render: function Countries() {
    const [value, setValue] = useState(['lk']);
    return (
      <div className={styles.list}>
        <FinListCheckboxGroup label="Countries" value={value} onValueChange={setValue}>
          <FinListCheckboxFilled value="lk" title="Sri Lanka" description="LKR" type="country" country="LK" />
          <FinListCheckboxFilled value="in" title="India" description="INR" type="country" country="IN" />
          <FinListCheckboxFilled value="mv" title="Maldives" description="Not available yet" type="country" country="MV" disabled />
        </FinListCheckboxGroup>
      </div>
    );
  },
};

/** Each type with the item on each side (the first two ticked). */
export const Types: Story = {
  render: () => (
    <div className={styles.row}>
      {(['leading', 'trailing'] as const).map((side) => (
        <div key={side} className={styles.list}>
          <FinListCheckboxGroup label={`Item side ${side}`} value={['default', 'country']}>
            <FinListCheckboxFilled value="default" title="Title here" description="Placeholder description here" />
            <FinListCheckboxFilled value="country" title="Title here" description="Placeholder description here" type="country" country="LK" itemSide={side} />
            <FinListCheckboxFilled value="payment" title="Title here" type="payment" paymentMethod="visa" itemSide={side} />
          </FinListCheckboxGroup>
        </div>
      ))}
    </div>
  ),
};
