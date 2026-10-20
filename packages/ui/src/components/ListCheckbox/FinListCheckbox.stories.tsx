import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { FinListItemSize } from '../ListItem';
import { FinListCheckbox, FinListCheckboxGroup, type FinListCheckboxItemSide, type FinListCheckboxType } from './FinListCheckbox';
import styles from './FinListCheckbox.stories.module.css';

/**
 * Known contrast exceptions (as List-standard, DESIGN.md §10 #3): Disabled rows are greyed on purpose and left out of
 * the a11y check; the Selected+hovered description (Light) is accepted and not part of the run (hover).
 */
const KNOWN_CONTRAST_ISSUES = ['[data-disabled]'];

interface Args {
  type: FinListCheckboxType;
  itemSide: FinListCheckboxItemSide;
  description: boolean;
  size: FinListItemSize;
  disabled: boolean;
}

/** A checkbox list: tick any rows. Code first, the radio list's twin (no Figma component yet, DESIGN.md §10 #55). */
const meta: Meta<Args> = {
  title: 'Components/List/Plain/List checkbox',
  args: { type: 'default', itemSide: 'leading', description: true, size: 'large', disabled: false },
  argTypes: {
    type: { control: 'inline-radio', options: ['default', 'country', 'payment'], description: 'Type (as the radio list)' },
    itemSide: { control: 'inline-radio', options: ['leading', 'trailing'], description: 'Item side (as the radio list)' },
    description: { control: 'boolean', description: 'Description' },
    size: { control: 'inline-radio', options: ['large', 'small'], description: 'Size (List-base)' },
    disabled: { control: 'boolean', description: 'Disabled (the third row)' },
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
      <div className={styles.column}>
        <FinListCheckboxGroup label="Example" value={value} onValueChange={setValue} size={size}>
          {rows.map((row) => (
            <FinListCheckbox
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

/** Each type with the item on each side (the first two rows ticked, the last disabled). */
export const Types: Story = {
  render: () => (
    <div className={styles.row}>
      {(['leading', 'trailing'] as const).map((side) => (
        <div key={side} className={styles.column}>
          <FinListCheckboxGroup label={`Item side ${side}`} value={['default', 'country']}>
            <FinListCheckbox value="default" title="Title here" description="Placeholder description here" />
            <FinListCheckbox value="country" title="Title here" description="Placeholder description here" type="country" country="LK" itemSide={side} />
            <FinListCheckbox value="payment" title="Title here" description="Placeholder description here" type="payment" paymentMethod="visa" itemSide={side} />
            <FinListCheckbox value="disabled" title="Title here" type="payment" paymentMethod="visa" itemSide={side} disabled />
          </FinListCheckboxGroup>
        </div>
      ))}
    </div>
  ),
};

/** A real scenario with a "select all" row above the list (ticked, unticked or mixed). */
export const SelectAll: Story = {
  name: 'Select all',
  render: function SelectAll() {
    const all = ['lk', 'in', 'mv'];
    const [value, setValue] = useState(['lk']);
    return (
      <div className={styles.column}>
        <FinListCheckbox
          value="all"
          title="All countries"
          checked={value.length === all.length}
          indeterminate={value.length > 0 && value.length < all.length}
          onCheckedChange={(on) => setValue(on ? all : [])}
        />
        <FinListCheckboxGroup label="Countries" value={value} onValueChange={setValue}>
          <FinListCheckbox value="lk" title="Sri Lanka" type="country" country="LK" />
          <FinListCheckbox value="in" title="India" type="country" country="IN" />
          <FinListCheckbox value="mv" title="Maldives" type="country" country="MV" />
        </FinListCheckboxGroup>
        <p className={styles.readout}>Ticked: {value.join(', ') || 'none'}</p>
      </div>
    );
  },
};
