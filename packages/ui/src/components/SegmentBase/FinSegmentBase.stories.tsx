import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { finIcons, type FinIconName } from '../../icons/finIcons';
import { FinSegmentBase, type FinSegmentBaseProps } from './FinSegmentBase';
import styles from './FinSegmentBase.stories.module.css';

type Args = Omit<FinSegmentBaseProps, 'leadingIcon'> & { showLeadingIcon: boolean; leadingIcon: FinIconName };

/**
 * INTERNAL: FinSegmentBase isn't exported from the package (DESIGN.md §7.2: bases are internal unless DESIGN.md says
 * otherwise). These stories exist only to check it against Figma; products use FinSegmentedButton.
 */
const meta: Meta<Args> = {
  title: 'Internal/Segment base',
  args: { children: 'Label', selected: true, showLeadingIcon: true, leadingIcon: 'person', disabled: false },
  argTypes: {
    children: { control: 'text', description: 'The label' },
    selected: { control: 'boolean', description: 'Figma `Type=Selected`' },
    showLeadingIcon: { control: 'boolean', name: 'Show Leading Icon', description: 'Figma `Show Leading Accessory`' },
    leadingIcon: { control: 'select', options: finIcons, description: 'The icon', if: { arg: 'showLeadingIcon' } },
    disabled: { control: 'boolean', description: 'Figma `State=Disabled`' },
  },
  render: ({ showLeadingIcon, leadingIcon, ...args }) => (
    <div className={styles.track}>
      <FinSegmentBase {...args} {...(showLeadingIcon ? { leadingIcon } : {})} />
    </div>
  ),
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/**
 * The Figma Segmented_button-base page: Selected and Unselected, Enabled and Disabled, on the grey track the
 * Segmented button puts them on. Hovered and Pressed are live: point at a segment and press.
 */
export const States: Story = {
  name: 'States (Figma)',
  render: () => (
    <div className={styles.table}>
      <span />
      <span>Selected</span>
      <span>Unselected</span>
      <span className={styles.rowLabel}>Enabled (hover / press me)</span>
      <div className={styles.track}>
        <FinSegmentBase selected leadingIcon="person">
          Label
        </FinSegmentBase>
      </div>
      <div className={styles.track}>
        <FinSegmentBase leadingIcon="person">Label</FinSegmentBase>
      </div>
      <span className={styles.rowLabel}>Disabled</span>
      <div className={styles.track}>
        <FinSegmentBase selected leadingIcon="person" disabled>
          Label
        </FinSegmentBase>
      </div>
      <div className={styles.track}>
        <FinSegmentBase leadingIcon="person" disabled>
          Label
        </FinSegmentBase>
      </div>
    </div>
  ),
};

/** No Focused design: the default ring. Click an empty area here, then press Tab. */
export const Focused: Story = {
  render: () => (
    <div className={styles.track}>
      <FinSegmentBase selected>Monthly</FinSegmentBase>
      <FinSegmentBase>Yearly</FinSegmentBase>
    </div>
  ),
  play: async () => {
    await userEvent.tab();
  },
};
