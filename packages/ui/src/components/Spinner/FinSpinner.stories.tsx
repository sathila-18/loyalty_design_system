import type { Meta, StoryObj } from '@storybook/react-vite';
import { FinSpinner, type FinSpinnerStatus } from './FinSpinner';
import styles from './FinSpinner.stories.module.css';

type Args = { status: FinSpinnerStatus; loading: boolean; value: number; label: string };

const meta: Meta<Args> = {
  title: 'Components/Progress/Spinner',
  args: { status: 'progress', loading: true, value: 60, label: 'Loading' },
  argTypes: {
    status: { control: 'inline-radio', options: ['progress', 'success', 'error'], description: 'Figma `Pregress`' },
    loading: { control: 'boolean', description: 'Progress with no `value`: a spinning loader' },
    value: { control: { type: 'range', min: 0, max: 100 }, description: 'Progress with a `value`: a still ring', if: { arg: 'loading', truthy: false } },
    label: { control: 'text', description: 'Accessible name' },
  },
  render: ({ status, loading, value, label }) => (
    <FinSpinner status={status} label={label} {...(status === 'progress' && !loading ? { value } : {})} />
  ),
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/** The Figma Spinner page: 25 / 50 / 75%, Success and Error (Figma's own sizes: ring 40 in a 48 box; Success/Error fill 48). */
export const States: Story = {
  name: 'States (Figma)',
  render: () => (
    <div className={styles.row}>
      {[25, 50, 75].map((v) => (
        <figure key={v} className={styles.case}>
          <FinSpinner value={v} label={`${v}% complete`} />
          <figcaption>{v}%</figcaption>
        </figure>
      ))}
      <figure className={styles.case}>
        <FinSpinner status="success" label="Complete" />
        <figcaption>Success</figcaption>
      </figure>
      <figure className={styles.case}>
        <FinSpinner status="error" label="Failed" />
        <figcaption>Error</figcaption>
      </figure>
    </div>
  ),
};

/** Without a value it's a loader: a quarter arc spinning clockwise (still when the system asks for reduced motion). */
export const Loading: Story = {
  render: () => <FinSpinner label="Loading members" />,
};

/** Any value from 0 to `max`; the arc starts at 12 o'clock and runs clockwise. */
export const AnyValue: Story = {
  name: 'Any value',
  render: () => (
    <div className={styles.row}>
      {[0, 10, 33, 90, 100].map((v) => (
        <figure key={v} className={styles.case}>
          <FinSpinner value={v} label={`${v}% complete`} />
          <figcaption>{v}%</figcaption>
        </figure>
      ))}
      <figure className={styles.case}>
        <FinSpinner value={2} max={3} label="2 of 3 files uploaded" />
        <figcaption>2 of 3</figcaption>
      </figure>
    </div>
  ),
};
