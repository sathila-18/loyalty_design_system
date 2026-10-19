import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { FinChipSize } from '../ChipBase';
import { FinAssistChip } from './FinAssistChip';
import styles from './FinAssistChip.stories.module.css';

const SIZES: FinChipSize[] = ['xsmall', 'small', 'large'];

/** Selected text contrast is accepted by design (DESIGN.md §10 #3); only the open (Selected) chips skip the a11y check. */
const KNOWN_CONTRAST_ISSUES = ['[data-variant="selected"]'];

const meta: Meta<typeof FinAssistChip> = {
  title: 'Components/Chips/Assist chip',
  component: FinAssistChip,
  args: { children: 'Last 30 days', size: 'small', dropdown: true, expanded: false, disabled: false },
  argTypes: {
    children: { control: 'text', description: 'The label' },
    size: { control: 'inline-radio', options: SIZES },
    dropdown: { control: 'boolean', description: 'Shows the down arrow: opens a menu or picker' },
    expanded: { control: 'boolean', description: 'The menu is open (Selected look)' },
    disabled: { control: 'boolean' },
  },
  parameters: { a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
};
export default meta;

type Story = StoryObj<typeof FinAssistChip>;

export const Playground: Story = {};

/** Every size: an action, with a dropdown, open, and disabled. Hovered and Pressed are live. */
export const States: Story = {
  render: () => (
    <div className={styles.table}>
      <span />
      <span>Action</span>
      <span>Dropdown</span>
      <span>Dropdown, open</span>
      <span>Disabled</span>
      {SIZES.map((size) => [
        <span key={`${size}-name`}>{size}</span>,
        <FinAssistChip key={`${size}-a`} size={size} leadingIcon="cloud_upload">
          Export
        </FinAssistChip>,
        <FinAssistChip key={`${size}-d`} size={size} dropdown>
          Last 30 days
        </FinAssistChip>,
        <FinAssistChip key={`${size}-o`} size={size} dropdown expanded>
          Last 30 days
        </FinAssistChip>,
        <FinAssistChip key={`${size}-x`} size={size} dropdown disabled>
          Last 30 days
        </FinAssistChip>,
      ])}
    </div>
  ),
};

const RANGES = ['Last 7 days', 'Last 30 days', 'Last 90 days'];

/** Opens a picker: Selected while it's open. The menu here is a stand-in for the demo only. */
export const WithMenu: Story = {
  name: 'With a menu',
  render: function WithMenuStory() {
    const [open, setOpen] = useState(false);
    const [range, setRange] = useState(RANGES[1]!);
    return (
      <div className={styles.menuDemo}>
        <FinAssistChip dropdown expanded={open} aria-controls="range-menu" onClick={() => setOpen((o) => !o)}>
          {range}
        </FinAssistChip>
        {open && (
          <ul id="range-menu" className={styles.menu} aria-label="Date range">
            {RANGES.map((r) => (
              <li key={r}>
                <button
                  type="button"
                  className={styles.option}
                  onClick={() => {
                    setRange(r);
                    setOpen(false);
                  }}
                >
                  {r}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  },
};
