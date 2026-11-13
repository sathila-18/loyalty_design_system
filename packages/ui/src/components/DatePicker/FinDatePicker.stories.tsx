import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { userEvent, within } from 'storybook/test';
import type { FinInputBaseSize } from '../InputBase';
import { FinDatePicker, FinDateRangePicker } from './FinDatePicker';
import styles from './FinDatePicker.stories.module.css';

/** The stories' fixed today, so they look the same every day (and in the visual checks). */
const TODAY = '2026-08-12';

interface Args {
  label: string;
  placeholder: string;
  showHelperText: boolean;
  helperText: string;
  error: boolean;
  disabled: boolean;
  size: FinInputBaseSize;
  min: string;
  max: string;
}

/** A disabled field's helper text is inactive by design (WCAG exempts disabled controls), as the other fields. */
const KNOWN_CONTRAST_ISSUES = ['[data-tone="disabled"]'];

/**
 * A date picker (code first, no Figma component: shadcn's date picker in this system's look; DESIGN.md §9): a field,
 * as the select field, that opens a calendar. It shows DD/MM/YYYY; code gets YYYY-MM-DD. Choosing a date closes it.
 * Today is 12/08/2026 in these stories.
 */
const meta: Meta<Args> = {
  title: 'Components/Date picker/Date picker',
  parameters: { a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
  args: {
    label: 'Start date',
    placeholder: 'Pick a date',
    showHelperText: true,
    helperText: 'The first day members can claim it',
    error: false,
    disabled: false,
    size: 'large',
    min: '',
    max: '',
  },
  argTypes: {
    label: { control: 'text', description: '`label`' },
    placeholder: { control: 'text', description: '`placeholder`' },
    showHelperText: { control: 'boolean', description: '`helperText`' },
    helperText: { control: 'text', if: { arg: 'showHelperText' } },
    error: { control: 'boolean', description: '`error`' },
    disabled: { control: 'boolean', description: '`disabled`' },
    size: { control: 'inline-radio', options: ['large', 'small'], description: '`size`' },
    min: { control: 'text', description: '`min` (YYYY-MM-DD)' },
    max: { control: 'text', description: '`max` (YYYY-MM-DD)' },
  },
  render: function Playground({ showHelperText, helperText, min, max, ...args }) {
    const [date, setDate] = useState<string | null>(null);
    return (
      <div className={`${styles.column} ${styles.open}`}>
        <FinDatePicker
          {...args}
          today={TODAY}
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

/** The field's states: Enabled, Complete (01/08/2026), Disabled, Error and Small. */
export const States: Story = {
  render: () => (
    <div className={styles.grid}>
      <FinDatePicker label="Enabled" today={TODAY} helperText="Helper text here" />
      <FinDatePicker label="Start date" today={TODAY} defaultValue="2026-08-01" helperText="Helper text here" />
      <FinDatePicker label="Disabled" today={TODAY} defaultValue="2026-08-01" helperText="Helper text here" disabled />
      <FinDatePicker label="Error" today={TODAY} error helperText="Choose the start date" />
      <FinDatePicker label="Small" today={TODAY} size="small" defaultValue="2026-08-01" helperText="size small" />
    </div>
  ),
};

/** Open: the calendar under the field, focus on the chosen day. */
export const Open: Story = {
  render: () => (
    <div className={`${styles.column} ${styles.open}`}>
      <FinDatePicker label="Start date" today={TODAY} defaultValue="2026-08-01" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: /Start date/ }));
  },
};

/** A date range: two months side by side; the first pick is the start, the second the end, then it closes. */
export const Range: Story = {
  render: function Range() {
    const [range, setRange] = useState<{ from: string; to: string } | null>({ from: '2026-08-20', to: '2026-09-04' });
    return (
      <div className={`${styles.column} ${styles.open}`}>
        <FinDateRangePicker label="Campaign dates" today={TODAY} value={range} onChange={setRange} helperText="The days the offer runs" />
        <p className={styles.readout}>onChange: {range ? `${range.from} → ${range.to}` : 'null'}</p>
      </div>
    );
  },
};

/** The range picker open, on the chosen range. */
export const RangeOpen: Story = {
  name: 'Range open',
  render: () => (
    <div className={`${styles.column} ${styles.open}`}>
      <FinDateRangePicker label="Campaign dates" today={TODAY} defaultValue={{ from: '2026-08-20', to: '2026-09-04' }} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: /Campaign dates/ }));
  },
};

/** The range picker's states: empty, Disabled and Small. */
export const RangeStates: Story = {
  name: 'Range states',
  render: () => (
    <div className={styles.grid}>
      <FinDateRangePicker label="Campaign dates" today={TODAY} helperText="Helper text here" />
      <FinDateRangePicker label="Disabled" today={TODAY} defaultValue={{ from: '2026-08-20', to: '2026-09-04' }} disabled helperText="Helper text here" />
      <FinDateRangePicker label="Small" size="small" today={TODAY} defaultValue={{ from: '2026-08-20', to: '2026-09-04' }} />
    </div>
  ),
};
