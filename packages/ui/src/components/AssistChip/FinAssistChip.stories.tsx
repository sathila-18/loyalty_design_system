import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { FinChipSize } from '../ChipBase';
import { chipLeadingArgs, chipLeadingArgTypes, withChipLeading, type ChipLeadingArgs } from '../ChipBase/chipStoryControls';
import { FinListStandard } from '../ListStandard';
import { FinMenu } from '../Menu';
import { FinAssistChip, type FinAssistChipProps } from './FinAssistChip';
import styles from './FinAssistChip.stories.module.css';

const SIZES: FinChipSize[] = ['xsmall', 'small', 'large'];

/** Selected text contrast is accepted by design (DESIGN.md §10 #3); only the open (Selected) chips skip the a11y check. */
const KNOWN_CONTRAST_ISSUES = ['[data-variant="selected"]'];

type Args = Omit<FinAssistChipProps, 'leadingIcon' | 'leadingAccessory'> & ChipLeadingArgs;

const meta: Meta<Args> = {
  title: 'Components/Chips/Assist chip',
  component: FinAssistChip,
  args: { children: 'Last 30 days', size: 'small', dropdown: true, expanded: false, disabled: false, ...chipLeadingArgs, leading: 'none' },
  argTypes: {
    children: { control: 'text', description: 'The label' },
    size: { control: 'inline-radio', options: SIZES },
    dropdown: { control: 'boolean', description: 'Shows the down arrow: opens a menu or picker' },
    expanded: { control: 'boolean', description: 'The menu is open (Selected look)' },
    disabled: { control: 'boolean' },
    ...chipLeadingArgTypes,
  },
  parameters: { a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
  render: (args) => <FinAssistChip {...withChipLeading(args)} />,
};
export default meta;

type Story = StoryObj<Args>;

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

const RANGES = ['Today', 'Last 7 days', 'Last 30 days', 'Last 90 days', 'This year'];

/**
 * The chip opening a menu (FinMenu, `kind="select"`; DESIGN.md §9.64): a date range is one choice, so the chosen one
 * is Selected and shown on the chip; choosing closes the menu. While the menu is open the chip is Selected and its
 * arrow points up. Click it, or focus it and press Enter, Space or an arrow key.
 */
export const WithMenu: Story = {
  name: 'With a menu',
  parameters: { controls: { disable: true } },
  render: function WithMenuStory() {
    const [range, setRange] = useState(RANGES[2]!);
    return (
      <div className={styles.menuDemo}>
        <FinMenu
          kind="select"
          label="Date range"
          trigger={(menuProps) => (
            <FinAssistChip {...menuProps} dropdown expanded={menuProps['aria-expanded']}>
              {range}
            </FinAssistChip>
          )}
        >
          {RANGES.map((r) => (
            <FinListStandard key={r} as="li" size="small" behavior="option" divider={false} title={r} selected={r === range} onClick={() => setRange(r)} />
          ))}
        </FinMenu>
      </div>
    );
  },
};
