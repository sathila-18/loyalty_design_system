import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { FinCheckbox } from './FinCheckbox';
import styles from './FinCheckbox.stories.module.css';

const TEXT = 'This phrase symbolizes the smooth and uninterrupted flow of communication signals.';

const meta: Meta<typeof FinCheckbox> = {
  title: 'Components/Checkbox',
  component: FinCheckbox,
  args: { children: TEXT, defaultChecked: false, indeterminate: false, disabled: false, showTextBox: true },
  argTypes: {
    children: { control: 'text', description: 'The text (Figma Text Box). Names the checkbox.' },
    defaultChecked: { control: 'boolean', description: 'Figma `Type=Selected` (uncontrolled start value)' },
    indeterminate: { control: 'boolean', description: 'Indeterminate (from the base; not drawn in this Figma set)' },
    disabled: { control: 'boolean', description: 'Figma `State=Disabled`' },
    showTextBox: { control: 'boolean', name: 'Show Text Box', description: 'Figma `Show Text Box`' },
  },
  render: (args) => (
    <div className={styles.frame}>
      <FinCheckbox {...args} />
    </div>
  ),
};
export default meta;

type Story = StoryObj<typeof FinCheckbox>;

export const Playground: Story = {};

/**
 * The Figma Checkbox page at its 343px width: Unselected and Selected, Enabled and Disabled. Hovered and Pressed
 * come from the base and are live: point at a checkbox or its text and press.
 */
export const States: Story = {
  name: 'States (Figma)',
  render: () => (
    <div className={styles.list}>
      <FinCheckbox>{TEXT}</FinCheckbox>
      <FinCheckbox defaultChecked>{TEXT}</FinCheckbox>
      <FinCheckbox disabled>{TEXT}</FinCheckbox>
      <FinCheckbox defaultChecked disabled>{TEXT}</FinCheckbox>
      <FinCheckbox indeterminate>{TEXT}</FinCheckbox>
    </div>
  ),
};

/** Short text stays on one line; long text wraps beside the checkbox. The row fills its container. */
export const Widths: Story = {
  render: () => (
    <div className={styles.widths}>
      <FinCheckbox>Remember me</FinCheckbox>
      <div className={styles.wide}>
        <FinCheckbox defaultChecked>{TEXT}</FinCheckbox>
      </div>
    </div>
  ),
};

/**
 * Focus shows the checkbox's own ring (decided 19 Oct 2026). It's `:focus-visible`, so it shows for keyboard focus
 * only: click an empty part of the preview, then press Tab.
 */
export const Focused: Story = {
  render: () => (
    <div className={styles.list}>
      <p className={styles.hint}>Click an empty area here, then press Tab (Shift+Tab to go back). Space toggles.</p>
      <FinCheckbox>{TEXT}</FinCheckbox>
      <FinCheckbox defaultChecked>{TEXT}</FinCheckbox>
    </div>
  ),
  play: async () => {
    await userEvent.tab();
  },
};
