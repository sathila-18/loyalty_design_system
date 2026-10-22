import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { userEvent } from 'storybook/test';
import { FinRowCountSelect } from './FinRowCountSelect';
import styles from './FinRowCountSelect.stories.module.css';

/**
 * INTERNAL: part of the pagination (Table footer). Opens a select menu of row counts (FinMenu `kind="select"`, as
 * wide as the button): the current one is Selected; choosing one closes it (DESIGN.md §9).
 */
const meta: Meta<typeof FinRowCountSelect> = {
  title: 'Internal/Pagination/Row count dropdown',
  component: FinRowCountSelect,
  args: { value: 10, label: 'Rows per page:' },
  argTypes: {
    value: { control: { type: 'number', min: 1 }, description: 'The rows shown per page (at the start here)' },
    label: { control: 'text', description: 'The text before the value' },
    options: { control: 'object', description: 'The row counts in the menu (default 10, 25, 50, 100)' },
    onValueChange: { control: false },
  },
  parameters: { layout: 'padded' },
  render: function Playground(args) {
    const [value, setValue] = useState(args.value);
    return (
      <div className={styles.stage}>
        <FinRowCountSelect key={args.value} {...args} value={value} onValueChange={setValue} />
      </div>
    );
  },
};
export default meta;

type Story = StoryObj<typeof FinRowCountSelect>;

/** Click the dropdown (or focus it and press Enter, Space or an arrow key) and choose a row count. */
export const Playground: Story = {};

/** The Figma Row count dropdown page: Default, and Hovered live (point at it), with a few values. */
export const States: Story = {
  name: 'States (Figma)',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className={styles.row}>
      <FinRowCountSelect value={10} />
      <FinRowCountSelect value={25} />
      <FinRowCountSelect value={100} />
    </div>
  ),
};

/** The menu open: the current row count Selected. */
export const Open: Story = {
  parameters: { controls: { disable: true } },
  render: function OpenStory() {
    const [value, setValue] = useState(25);
    return (
      <div className={styles.stage}>
        <FinRowCountSelect value={value} onValueChange={setValue} />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(canvasElement.querySelector('button')!);
  },
};

/** No Focused design: the default ring. Click an empty area here, then press Tab. */
export const Focused: Story = {
  parameters: { controls: { disable: true } },
  render: () => <FinRowCountSelect value={10} />,
  play: async () => {
    await userEvent.tab();
  },
};
