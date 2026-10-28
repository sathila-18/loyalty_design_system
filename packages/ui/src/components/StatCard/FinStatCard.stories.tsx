import type { Meta, StoryObj } from '@storybook/react-vite';
import { FinStatCard } from './FinStatCard';
import styles from './FinStatCard.stories.module.css';

interface Args {
  label: string;
  value: string;
}

/**
 * A summary number with its label (code first, no Figma component; measured from the Reports screens, DESIGN.md §9).
 * It fills its container: the page lays the cards out on its grid.
 */
const meta: Meta<Args> = {
  title: 'Components/Stat card',
  args: { label: 'Total points', value: '806,400' },
  argTypes: {
    label: { control: 'text', description: '`label`' },
    value: { control: 'text', description: '`value`' },
  },
  render: (args) => (
    <div className={styles.one}>
      <FinStatCard {...args} />
    </div>
  ),
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};

/** As the Reports screen (`435:90575`): four in a row, 364 wide each at 1920. */
export const Reports: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className={styles.row}>
      <FinStatCard label="Total points" value="806,400" />
      <FinStatCard label="Reward redemption (pts)" value="806,400" />
      <FinStatCard label="Cash conversion (pts)" value="286,400" />
      <FinStatCard label="Points expired" value="76,200" />
    </div>
  ),
};

/** As a customer's points history (`440:94624`): three, the last a longer value. */
export const CustomerHistory: Story = {
  name: 'Customer history',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className={styles.row}>
      <FinStatCard label="Active points" value="5,400" />
      <FinStatCard label="Lifetime points" value="12,400" />
      <FinStatCard label="Next expiry" value="1,200 pts on 31/10/2026" />
    </div>
  ),
};

/** Narrow: a long label ends in "…", a long value wraps. */
export const Narrow: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className={styles.narrow}>
      <FinStatCard label="Reward redemption this financial year (pts)" value="1,234,567,890" />
      <FinStatCard label="Next expiry" value="1,200 pts on 31/10/2026" />
    </div>
  ),
};
