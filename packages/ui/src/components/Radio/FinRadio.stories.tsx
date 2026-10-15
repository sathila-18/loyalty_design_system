import type { Meta, StoryObj } from '@storybook/react-vite';
import { FinRadio } from './FinRadio';
import styles from './FinRadio.stories.module.css';

const meta: Meta<typeof FinRadio> = {
  title: 'Components/Radio button',
  component: FinRadio,
  args: { label: 'Monthly billing', name: 'playground', defaultChecked: true, disabled: false },
  argTypes: {
    label: { control: 'text', description: 'Visually hidden accessible name' },
    defaultChecked: { control: 'boolean', description: 'Figma `Type=Selected` (uncontrolled start value)' },
    disabled: { control: 'boolean', description: 'Figma `State=Disabled`' },
  },
};
export default meta;

type Story = StoryObj<typeof FinRadio>;

export const Playground: Story = {};

/**
 * The Figma Base-Radio_box page. Enabled and Disabled are shown as they are; Hovered and Pressed are live:
 * point at a radio and press the mouse button to see them.
 */
export const States: Story = {
  name: 'States (Figma)',
  render: () => (
    <div className={styles.table}>
      <span />
      <span>Unselected</span>
      <span>Selected</span>
      <span className={styles.rowLabel}>Enabled (hover / press me)</span>
      <FinRadio name="enabled-off" label="Enabled, unselected" />
      <FinRadio name="enabled-on" label="Enabled, selected" defaultChecked />
      <span className={styles.rowLabel}>Disabled</span>
      <FinRadio name="disabled-off" label="Disabled, unselected" disabled />
      <FinRadio name="disabled-on" label="Disabled, selected" defaultChecked disabled />
    </div>
  ),
};

/**
 * A group: radios that share a `name`, inside a `<fieldset>` whose `<legend>` names the group. Tab reaches the
 * group once (the selected radio); the arrow keys move and select. Visible option labels will come from the
 * List component; here they're plain text beside each radio, for the demo only.
 */
export const Group: Story = {
  render: () => (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>Billing period</legend>
      {['Monthly', 'Quarterly', 'Yearly'].map((period, i) => (
        <div key={period} className={styles.option}>
          <FinRadio name="billing" value={period.toLowerCase()} label={period} defaultChecked={i === 0} />
          <span aria-hidden="true">{period}</span>
        </div>
      ))}
    </fieldset>
  ),
};
