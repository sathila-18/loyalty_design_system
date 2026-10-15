import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FinSlider } from './FinSlider';
import styles from './FinSlider.stories.module.css';

const meta: Meta<typeof FinSlider> = {
  title: 'Components/Progress/Slider',
  component: FinSlider,
  args: { label: 'Points to redeem', defaultValue: 50, min: 0, max: 100, step: 1, disabled: false },
  argTypes: {
    label: { control: 'text', description: 'Visually hidden accessible name' },
    defaultValue: { control: 'number' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
    valueText: { control: 'text' },
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

type Story = StoryObj<typeof FinSlider>;

export const Playground: Story = {
  render: (args) => <FinSlider key={`${args.defaultValue}-${args.min}-${args.max}`} {...args} />,
};

/** The Figma slider page: Filled = 5 / 25 / 50 / 75 / 100% (exact values, standard slider positions). */
export const Values: Story = {
  name: 'Values (Figma)',
  render: () => (
    <div className={styles.list}>
      {[5, 25, 50, 75, 100].map((v) => (
        <div key={v} className={styles.row}>
          <span className={styles.value}>{v}%</span>
          <FinSlider label={`Slider at ${v}%`} defaultValue={v} />
        </div>
      ))}
      <div className={styles.row}>
        <span className={styles.value}>Disabled</span>
        <FinSlider label="Disabled slider" defaultValue={40} disabled />
      </div>
    </div>
  ),
};

/** Controlled, with the screen's own range and step, and a spoken value. Tab, then arrows / Page Up / Home / End. */
export const Controlled: Story = {
  render: () => {
    function Example() {
      const [points, setPoints] = useState(1500);
      return (
        <div className={styles.list}>
          <FinSlider
            label="Points to redeem"
            min={500}
            max={5000}
            step={100}
            value={points}
            valueText={`${points} points`}
            onChange={(e) => setPoints(Number(e.target.value))}
          />
          <span className={styles.value}>{points} points</span>
        </div>
      );
    }
    return <Example />;
  },
};

/** Fills the width of its container. */
export const FillsItsContainer: Story = {
  name: 'Fills its container',
  decorators: [(Story) => <Story />],
  render: () => (
    <div className={styles.list}>
      <div className={styles.narrow}>
        <FinSlider label="Narrow" defaultValue={30} />
      </div>
      <div className={styles.wide}>
        <FinSlider label="Wide" defaultValue={70} />
      </div>
    </div>
  ),
};
