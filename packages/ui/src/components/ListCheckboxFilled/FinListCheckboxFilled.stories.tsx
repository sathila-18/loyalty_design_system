import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FinListCheckboxGroup } from '../ListCheckbox';
import { FinListCheckboxFilled } from './FinListCheckboxFilled';
import styles from './FinListCheckboxFilled.stories.module.css';

/** Disabled cards are greyed on purpose (as List-standard, DESIGN.md §10 #3) and left out of the a11y check. */
const KNOWN_CONTRAST_ISSUES = ['[data-disabled]'];

/** Checkbox cards: the checkbox list on List_fill-base, in FinListCheckboxGroup. Code first (DESIGN.md §10 #56). */
const meta: Meta = {
  title: 'Components/List/Filled/List checkbox',
  parameters: { layout: 'padded', a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
};
export default meta;

type Story = StoryObj;

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
