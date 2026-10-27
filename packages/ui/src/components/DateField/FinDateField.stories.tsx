import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { userEvent, within } from 'storybook/test';
import type { FinInputBaseSize } from '../InputBase';
import { FinDateField } from './FinDateField';
import styles from './FinDateField.stories.module.css';

interface Args {
  label: string;
  showHelperText: boolean;
  helperText: string;
  error: boolean;
  disabled: boolean;
  size: FinInputBaseSize;
  min: string;
  max: string;
}

/**
 * A disabled field's helper text is inactive by design (WCAG exempts the text of disabled controls), as the Helper
 * text stories (DESIGN.md §9.20). Only disabled helper text is left out of the a11y check.
 */
const KNOWN_CONTRAST_ISSUES = ['[data-tone="disabled"]'];

/**
 * A date field (code first, no Figma component; DESIGN.md §9): the text field with a calendar button. Type the digits
 * (the slashes are added) or press the calendar for the browser's date picker (for now: our own calendar replaces it
 * once it's designed). It shows DD/MM/YYYY; code gets YYYY-MM-DD. Leave it with a wrong date to see its error.
 */
const meta: Meta<Args> = {
  title: 'Components/Input field/Date field',
  parameters: { a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
  args: { label: 'Start date', showHelperText: true, helperText: 'The first day members can claim it', error: false, disabled: false, size: 'large', min: '', max: '' },
  argTypes: {
    label: { control: 'text', description: '`label`' },
    showHelperText: { control: 'boolean', description: '`helperText`' },
    helperText: { control: 'text', if: { arg: 'showHelperText' } },
    error: { control: 'boolean', description: '`error` (the page’s own error)' },
    disabled: { control: 'boolean', description: '`disabled`' },
    size: { control: 'inline-radio', options: ['large', 'small'], description: '`size`' },
    min: { control: 'text', description: '`min` (YYYY-MM-DD)' },
    max: { control: 'text', description: '`max` (YYYY-MM-DD)' },
  },
  render: function Playground({ showHelperText, helperText, min, max, ...args }) {
    const [date, setDate] = useState<string | null>(null);
    return (
      <div className={styles.column}>
        <FinDateField
          {...args}
          {...(showHelperText ? { helperText } : {})}
          {...(min ? { min } : {})}
          {...(max ? { max } : {})}
          value={date}
          onChange={setDate}
        />
        <p className={styles.readout}>onChange: {date ?? 'null'}</p>
      </div>
    );
  },
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};

/** The text field's states: Enabled, Complete (as Figma's screen, 01/08/2026), Disabled, and the error. */
export const States: Story = {
  render: () => (
    <div className={styles.grid}>
      <FinDateField label="Enabled" helperText="Helper text here" />
      <FinDateField label="Start date" defaultValue="2026-08-01" helperText="Helper text here" />
      <FinDateField label="Disabled" defaultValue="2026-08-01" helperText="Helper text here" disabled />
      <FinDateField label="Error" error helperText="Enter the start date" />
      <FinDateField label="Small" size="small" defaultValue="2027-08-01" helperText="size small" />
    </div>
  ),
};

/** Start and end dates, as the Add reward screen: End date's `min` is the start date, so earlier dates aren't allowed. */
export const Range: Story = {
  render: function Range() {
    const [start, setStart] = useState<string | null>('2026-08-01');
    const [end, setEnd] = useState<string | null>('2027-08-01');
    return (
      <div className={styles.row}>
        <FinDateField label="Start date" value={start} onChange={setStart} />
        <FinDateField label="End date" value={end} onChange={setEnd} {...(start ? { min: start } : {})} />
      </div>
    );
  },
};

/** Typing: the slashes are added as the digits go in. */
export const Typing: Story = {
  render: () => (
    <div className={styles.column}>
      <FinDateField label="Start date" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.type(within(canvasElement).getByRole('textbox', { name: 'Start date' }), '0108');
  },
};

/** Left with a date that doesn't exist (31/02/2026): the field's own error. Typing clears it. */
export const InvalidDate: Story = {
  name: 'Invalid date',
  render: () => (
    <div className={styles.column}>
      <FinDateField label="Start date" helperText="The first day members can claim it" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.type(within(canvasElement).getByRole('textbox', { name: 'Start date' }), '31022026');
    await userEvent.tab();
  },
};

/** Left with a date before `min`: "Choose a date from …". */
export const BeforeMin: Story = {
  name: 'Before min',
  render: () => (
    <div className={styles.column}>
      <FinDateField label="End date" min="2026-08-01" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.type(within(canvasElement).getByRole('textbox', { name: 'End date' }), '01072026');
    await userEvent.tab();
  },
};
