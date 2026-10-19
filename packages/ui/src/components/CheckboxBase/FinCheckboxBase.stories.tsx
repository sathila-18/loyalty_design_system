import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { userEvent } from 'storybook/test';
import { FinCheckboxBase } from './FinCheckboxBase';
import styles from './FinCheckboxBase.stories.module.css';

/**
 * INTERNAL: FinCheckboxBase isn't exported from the package (DESIGN.md §7.2: bases are internal unless DESIGN.md
 * says otherwise). These stories exist only to check it against Figma; products use FinCheckbox.
 */
const meta: Meta<typeof FinCheckboxBase> = {
  title: 'Internal/Checkbox base',
  component: FinCheckboxBase,
  args: { label: 'Select row', defaultChecked: true, indeterminate: false, disabled: false },
  argTypes: {
    label: { control: 'text', description: 'Visually hidden accessible name' },
    defaultChecked: { control: 'boolean', description: 'Figma `Type=Selected` (uncontrolled start value)' },
    indeterminate: { control: 'boolean', description: 'Figma `Type=Indeterminate`' },
    disabled: { control: 'boolean', description: 'Figma `State=Disabled`' },
  },
};
export default meta;

type Story = StoryObj<typeof FinCheckboxBase>;

export const Playground: Story = {};

/**
 * The Figma Base-Checkbox page. Enabled and Disabled are shown as they are; Hovered and Pressed are live:
 * point at a checkbox and press the mouse button to see them.
 */
export const States: Story = {
  name: 'States (Figma)',
  render: () => (
    <div className={styles.table}>
      <span />
      <span>Unselected</span>
      <span>Selected</span>
      <span>Indeterminate</span>
      <span className={styles.rowLabel}>Enabled (hover / press me)</span>
      <FinCheckboxBase label="Enabled, unselected" />
      <FinCheckboxBase label="Enabled, selected" defaultChecked />
      <FinCheckboxBase label="Enabled, indeterminate" indeterminate />
      <span className={styles.rowLabel}>Disabled</span>
      <FinCheckboxBase label="Disabled, unselected" disabled />
      <FinCheckboxBase label="Disabled, selected" defaultChecked disabled />
      <FinCheckboxBase label="Disabled, indeterminate" indeterminate disabled />
    </div>
  ),
};

const ROWS = ['Gold tier', 'Silver tier', 'Bronze tier'];

/** Select all: the top checkbox is indeterminate while only some rows are selected (how the Table will use it). */
export const SelectAll: Story = {
  name: 'Select all (indeterminate)',
  render: function SelectAllStory() {
    const [selected, setSelected] = useState<string[]>(['Gold tier']);
    const all = selected.length === ROWS.length;
    return (
      <div className={styles.list}>
        <div className={styles.option}>
          <FinCheckboxBase
            label="Select all tiers"
            checked={all}
            indeterminate={selected.length > 0 && !all}
            onChange={() => setSelected(all ? [] : ROWS)}
          />
          <span aria-hidden="true">All tiers</span>
        </div>
        {ROWS.map((row) => (
          <div key={row} className={styles.option} data-indent>
            <FinCheckboxBase
              label={row}
              checked={selected.includes(row)}
              onChange={(e) => setSelected((s) => (e.target.checked ? [...s, row] : s.filter((r) => r !== row)))}
            />
            <span aria-hidden="true">{row}</span>
          </div>
        ))}
      </div>
    );
  },
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
        <FinCheckboxBase label="Unselected, focused" />
        <FinCheckboxBase label="Selected, focused" defaultChecked />
        <FinCheckboxBase label="Indeterminate, focused" indeterminate />
      </div>
    </div>
  ),
  play: async () => {
    await userEvent.tab();
  },
};
