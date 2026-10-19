import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { FinRowCountSelect } from './FinRowCountSelect';
import styles from './FinRowCountSelect.stories.module.css';

/**
 * INTERNAL: part of the pagination (Table footer). The trigger only for now: the menu of row counts comes once the
 * List component is built (DESIGN.md §9, decided 19 Oct 2026).
 */
const meta: Meta<typeof FinRowCountSelect> = {
  title: 'Internal/Pagination/Row count dropdown',
  component: FinRowCountSelect,
  args: { value: 10, label: 'Rows per page:' },
  argTypes: {
    value: { control: { type: 'number', min: 1 }, description: 'The rows shown per page' },
    label: { control: 'text', description: 'The text before the value' },
  },
};
export default meta;

type Story = StoryObj<typeof FinRowCountSelect>;

export const Playground: Story = {};

/** The Figma Row count dropdown page: Default, and Hovered live (point at it), with a few values. */
export const States: Story = {
  name: 'States (Figma)',
  render: () => (
    <div className={styles.row}>
      <FinRowCountSelect value={10} />
      <FinRowCountSelect value={25} />
      <FinRowCountSelect value={100} />
    </div>
  ),
};

/** No Focused design: the default ring. Click an empty area here, then press Tab. */
export const Focused: Story = {
  render: () => <FinRowCountSelect value={10} />,
  play: async () => {
    await userEvent.tab();
  },
};
