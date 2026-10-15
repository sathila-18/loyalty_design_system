import type { Meta, StoryObj } from '@storybook/react-vite';
import { FinProgressBar, type FinProgressBarSize } from './FinProgressBar';
import styles from './FinProgressBar.stories.module.css';

const meta: Meta<typeof FinProgressBar> = {
  title: 'Components/Progress/Progress bar',
  component: FinProgressBar,
  args: { value: 40, max: 100, size: 'large', label: 'Profile completion' },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 }, description: 'Any value from 0 to `max`' },
    max: { control: 'number' },
    size: { control: 'inline-radio', options: ['large', 'small'] },
    label: { control: 'text', description: 'Accessible name' },
  },
  decorators: [
    (Story) => (
      <div className={styles.frame}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof FinProgressBar>;

export const Playground: Story = {};

const FIGMA: { size: FinProgressBarSize; steps: number; values: number[] }[] = [
  { size: 'large', steps: 4, values: [0, 25, 50, 75, 100] },
  { size: 'small', steps: 4, values: [0, 25, 50, 75, 100] },
  { size: 'small', steps: 5, values: [0, 20, 40, 60, 80, 100] },
];

/** The Figma Progress bar page: every `Filled` value in each Size / Steps group (16 variants). */
export const ValuesAndSizes: Story = {
  name: 'Values and sizes (Figma)',
  render: () => (
    <div className={styles.groups}>
      {FIGMA.map(({ size, steps, values }) => (
        <div key={`${size}-${steps}`} className={styles.group}>
          <span className={styles.groupLabel}>
            Size={size === 'large' ? 'Large' : 'Small'}, Steps={steps}
          </span>
          {values.map((v) => (
            <div key={v} className={styles.row}>
              <span className={styles.value}>{v}%</span>
              <FinProgressBar value={v} size={size} label={`${v}% complete`} />
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};

/** Fills the width of its container; `max` lets a screen pass counts as they are ("3 of 5"). */
export const FillsItsContainer: Story = {
  name: 'Fills its container',
  decorators: [(Story) => <Story />],
  render: () => (
    <div className={styles.groups}>
      <div className={styles.narrow}>
        <FinProgressBar value={3} max={5} label="Step 3 of 5" />
      </div>
      <div className={styles.medium}>
        <FinProgressBar value={120} max={300} size="small" label="120 of 300 MB uploaded" />
      </div>
      <div className={styles.wide}>
        <FinProgressBar value={72} label="Campaign budget used" />
      </div>
    </div>
  ),
};
