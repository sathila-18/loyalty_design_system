import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { userEvent } from 'storybook/test';
import type { FinChipSize } from '../ChipBase';
import { FinFilterChip } from './FinFilterChip';
import styles from './FinFilterChip.stories.module.css';

const SIZES: FinChipSize[] = ['xsmall', 'small', 'large'];

/** Selected text contrast is accepted by design (DESIGN.md §10 #3); only Selected chips skip the a11y check. */
const KNOWN_CONTRAST_ISSUES = ['[data-variant="selected"]'];

const meta: Meta<typeof FinFilterChip> = {
  title: 'Components/Chips/Filter chip',
  component: FinFilterChip,
  args: { children: 'Gold', defaultSelected: false, size: 'small', disabled: false },
  argTypes: {
    children: { control: 'text', description: 'The label' },
    defaultSelected: { control: 'boolean', description: 'Figma Chips `Type=Selected` (uncontrolled start value)' },
    size: { control: 'inline-radio', options: SIZES },
    disabled: { control: 'boolean', description: 'Figma Chips `State=Disabled`' },
  },
  parameters: { a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
};
export default meta;

type Story = StoryObj<typeof FinFilterChip>;

export const Playground: Story = {};

/**
 * The Figma Chips page: Unselected and Selected, Enabled and Disabled, in every size. Hovered and Pressed are live:
 * point at a chip and press.
 */
export const States: Story = {
  name: 'States (Figma)',
  render: () => (
    <div className={styles.table}>
      <span />
      <span>Unselected</span>
      <span>Selected</span>
      <span>Unselected, disabled</span>
      <span>Selected, disabled</span>
      {SIZES.map((size) => [
        <span key={`${size}-name`}>{size}</span>,
        <FinFilterChip key={`${size}-off`} size={size}>
          Label
        </FinFilterChip>,
        <FinFilterChip key={`${size}-on`} size={size} defaultSelected>
          Label
        </FinFilterChip>,
        <FinFilterChip key={`${size}-off-dis`} size={size} disabled>
          Label
        </FinFilterChip>,
        <FinFilterChip key={`${size}-on-dis`} size={size} defaultSelected disabled>
          Label
        </FinFilterChip>,
      ])}
    </div>
  ),
};

const TIERS = ['Gold', 'Silver', 'Bronze', 'Platinum'];

/** Several filters can be on at once. The group is named for screen readers (Chips-group comes later, §8 #39). */
export const Filters: Story = {
  render: function FiltersStory() {
    const [on, setOn] = useState<string[]>(['Gold']);
    return (
      <div className={styles.group} role="group" aria-label="Filter by tier">
        {TIERS.map((tier) => (
          <FinFilterChip
            key={tier}
            selected={on.includes(tier)}
            onSelectedChange={(s) => setOn((list) => (s ? [...list, tier] : list.filter((t) => t !== tier)))}
          >
            {tier}
          </FinFilterChip>
        ))}
      </div>
    );
  },
};

/** No Focused design: the default ring. Click an empty area here, then press Tab. */
export const Focused: Story = {
  render: () => (
    <div className={styles.group}>
      <FinFilterChip>Gold</FinFilterChip>
      <FinFilterChip defaultSelected>Silver</FinFilterChip>
    </div>
  ),
  play: async () => {
    await userEvent.tab();
  },
};
