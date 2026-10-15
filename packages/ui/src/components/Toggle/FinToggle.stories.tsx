import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { FinToggle, type FinToggleSize } from './FinToggle';
import styles from './FinToggle.stories.module.css';

const SIZES: FinToggleSize[] = ['small', 'large'];

const meta: Meta<typeof FinToggle> = {
  title: 'Components/Toggle',
  component: FinToggle,
  args: { label: 'Email notifications', size: 'small', defaultChecked: true, disabled: false },
  argTypes: {
    label: { control: 'text', description: 'Visually hidden accessible name' },
    size: { control: 'inline-radio', options: SIZES },
    defaultChecked: { control: 'boolean', description: 'Figma `Type=Selected` (uncontrolled start value)' },
    disabled: { control: 'boolean', description: 'Figma `State=Disabled`' },
  },
};
export default meta;

type Story = StoryObj<typeof FinToggle>;

export const Playground: Story = {};

/** The Figma Toggle page: both sizes, Selected/Unselected, Enabled/Disabled. */
export const States: Story = {
  name: 'States (Figma)',
  render: () => (
    <div className={styles.table}>
      <span />
      <span>Selected</span>
      <span>Unselected</span>
      <span>Selected, disabled</span>
      <span>Unselected, disabled</span>
      {SIZES.map((size) => [
        <span key={size} className={styles.rowLabel}>
          {size === 'small' ? 'Small' : 'Large'}
        </span>,
        <FinToggle key={`${size}-on`} size={size} label={`${size} on`} defaultChecked />,
        <FinToggle key={`${size}-off`} size={size} label={`${size} off`} />,
        <FinToggle key={`${size}-on-dis`} size={size} label={`${size} on, disabled`} defaultChecked disabled />,
        <FinToggle key={`${size}-off-dis`} size={size} label={`${size} off, disabled`} disabled />,
      ])}
    </div>
  ),
};

/**
 * Figma `Focused=True`. The ring is `:focus-visible`, so it shows for keyboard focus only (not after a mouse
 * click), and only while the preview has focus: click an empty part of the preview, then press Tab.
 */
export const Focused: Story = {
  render: () => (
    <div className={styles.focusStory}>
      <p className={styles.hint}>Click an empty area here, then press Tab (Shift+Tab to go back). Space toggles.</p>
      <div className={styles.row}>
        <FinToggle label="Small, focused" defaultChecked />
        <FinToggle label="Large, focused" size="large" />
      </div>
    </div>
  ),
  play: async () => {
    await userEvent.tab();
  },
};
