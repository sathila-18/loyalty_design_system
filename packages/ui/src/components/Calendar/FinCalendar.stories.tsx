import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FinCalendar, type FinDateRange } from './FinCalendar';
import styles from './FinCalendar.stories.module.css';

/** The stories' fixed today, so they look the same every day (and in the visual checks). */
const TODAY = '2026-08-12';

interface Args {
  mode: 'single' | 'range';
  numberOfMonths: 1 | 2;
  min: string;
  max: string;
  noWeekends: boolean;
}

const isWeekend = (date: string) => [0, 6].includes(new Date(`${date}T00:00:00Z`).getUTCDay());

/**
 * A calendar (code first, no Figma component: shadcn's calendar in this system's tokens; DESIGN.md §9). Weeks start on
 * Monday. Pick one date, or a range: a start, then an end, with a band between (previewed as you hover). With the
 * keyboard: the arrow keys, Home / End, Page Up / Page Down (Shift for a year), Enter or Space. Today (12/08/2026 in
 * these stories) has a stroke. FinDatePicker and FinDateRangePicker show it in a menu.
 */
const meta: Meta<Args> = {
  title: 'Components/Date picker/Calendar',
  args: { mode: 'single', numberOfMonths: 1, min: '', max: '', noWeekends: false },
  argTypes: {
    mode: { control: 'inline-radio', options: ['single', 'range'], description: '`mode`' },
    numberOfMonths: { control: 'inline-radio', options: [1, 2], description: '`numberOfMonths`' },
    min: { control: 'text', description: '`min` (YYYY-MM-DD)' },
    max: { control: 'text', description: '`max` (YYYY-MM-DD)' },
    noWeekends: { control: 'boolean', description: '`isDateDisabled` (weekends here)' },
  },
  render: function Playground({ mode, numberOfMonths, min, max, noWeekends }) {
    const [date, setDate] = useState<string | null>(null);
    const [range, setRange] = useState<FinDateRange>({ from: null, to: null });
    const common = {
      today: TODAY,
      numberOfMonths,
      ...(min ? { min } : {}),
      ...(max ? { max } : {}),
      ...(noWeekends ? { isDateDisabled: isWeekend } : {}),
    };
    return (
      <div className={styles.column}>
        <div className={styles.card}>
          {mode === 'range' ? (
            <FinCalendar key="range" mode="range" {...common} value={range} onChange={setRange} />
          ) : (
            <FinCalendar key="single" {...common} value={date} onChange={setDate} />
          )}
        </div>
        <p className={styles.readout}>
          onChange: {mode === 'range' ? `${range.from ?? 'null'} → ${range.to ?? 'null'}` : (date ?? 'null')}
        </p>
      </div>
    );
  },
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};

/** One date: nothing chosen (today marked), and 1 August 2026 chosen. */
export const Single: Story = {
  render: () => (
    <div className={styles.row}>
      <div className={styles.card}>
        <FinCalendar today={TODAY} />
      </div>
      <div className={styles.card}>
        <FinCalendar today={TODAY} defaultValue="2026-08-01" />
      </div>
    </div>
  ),
};

/** A range over two months: 20 August to 4 September 2026, with the band between. */
export const Range: Story = {
  render: () => (
    <div className={styles.card}>
      <FinCalendar mode="range" numberOfMonths={2} today={TODAY} defaultValue={{ from: '2026-08-20', to: '2026-09-04' }} />
    </div>
  ),
};

/** `min` and `max` (5 to 25 August 2026), and weekends ruled out with `isDateDisabled`. */
export const DisabledDates: Story = {
  name: 'Disabled dates',
  render: () => (
    <div className={styles.row}>
      <div className={styles.card}>
        <FinCalendar today={TODAY} min="2026-08-05" max="2026-08-25" />
      </div>
      <div className={styles.card}>
        <FinCalendar today={TODAY} isDateDisabled={isWeekend} />
      </div>
    </div>
  ),
};
