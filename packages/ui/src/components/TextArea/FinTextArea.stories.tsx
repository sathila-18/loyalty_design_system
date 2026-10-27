import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { FinTextArea } from './FinTextArea';
import styles from './FinTextArea.stories.module.css';

const LONG =
  'Your voucher is valid for 30 days at this store. Show the code at the counter before you pay. It can be used once, on one bill, and cannot be exchanged for cash. Members on every tier can use it, but only one voucher per visit. If the store is closed on the last day, the voucher is valid the next day it opens.';

interface Args {
  label: string;
  showLabel: boolean;
  placeholder: string;
  showHelperText: boolean;
  helperText: string;
  error: boolean;
  disabled: boolean;
  rows: number;
  maxRows: number;
}

/**
 * A disabled field's helper text is inactive by design (WCAG exempts the text of disabled controls), as the Helper
 * text stories (DESIGN.md §9.20). Only disabled helper text is left out of the a11y check.
 */
const KNOWN_CONTRAST_ISSUES = ['[data-tone="disabled"]'];

/**
 * A multi-line text field (Figma Input field-textArea-base and its field set; DESIGN.md §9). Matches Figma's
 * properties. Hover, focus and type in it to see the states; with more than 4 lines it grows, up to 8, then scrolls.
 */
const meta: Meta<Args> = {
  title: 'Components/Input field/Text area',
  parameters: { a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
  args: {
    label: 'Label',
    showLabel: true,
    placeholder: 'Placeholder text',
    showHelperText: true,
    helperText: 'Helper text here',
    error: false,
    disabled: false,
    rows: 4,
    maxRows: 8,
  },
  argTypes: {
    label: { control: 'text', description: 'Figma Label text (`label`; always the name)' },
    showLabel: { control: 'boolean', description: 'Figma `Label` (`showLabel`)' },
    placeholder: { control: 'text', description: 'Figma `Place holder` (`placeholder`)' },
    showHelperText: { control: 'boolean', description: 'Figma `Helper text` (`helperText`)' },
    helperText: { control: 'text', if: { arg: 'showHelperText' } },
    error: { control: 'boolean', description: 'Figma `Type=Distructive` (`error`)' },
    disabled: { control: 'boolean', description: 'Figma `State=Disabled` (`disabled`)' },
    rows: { control: { type: 'number', min: 1, max: 12 }, description: '`rows` (default 4)' },
    maxRows: { control: { type: 'number', min: 1, max: 20 }, description: '`maxRows` (default 8)' },
  },
  render: ({ showHelperText, helperText, ...args }) => (
    <div className={styles.column}>
      <FinTextArea {...args} {...(showHelperText ? { helperText } : {})} />
    </div>
  ),
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};

/** Figma's states that don't need the pointer or focus: Enabled, Complete, Disabled, and Error with each. */
export const States: Story = {
  name: 'States (Figma)',
  render: () => (
    <div className={styles.grid}>
      <FinTextArea label="Enabled" placeholder="Placeholder text" helperText="Helper text here" />
      <FinTextArea label="Complete" defaultValue="Typing" helperText="Helper text here" />
      <FinTextArea label="Disabled" placeholder="Placeholder text" helperText="Helper text here" disabled />
      <FinTextArea label="Error" placeholder="Placeholder text" helperText="Helper text here" error />
      <FinTextArea label="Error, complete" defaultValue="Typing" helperText="Helper text here" error />
      <FinTextArea label="Disabled, filled" defaultValue="Typing" helperText="Helper text here" disabled />
    </div>
  ),
};

/** Focused: the label on the border, the caret and the ring (the placeholder hides). */
export const Focused: Story = {
  render: () => (
    <div className={styles.column}>
      <FinTextArea label="Label" placeholder="Placeholder text" helperText="Helper text here" />
    </div>
  ),
  play: async () => {
    await userEvent.tab();
  },
};

/** Typing: focused with text. */
export const Typing: Story = {
  render: () => (
    <div className={styles.column}>
      <FinTextArea label="Label" placeholder="Placeholder text" helperText="Helper text here" />
    </div>
  ),
  play: async () => {
    await userEvent.tab();
    await userEvent.keyboard('Typing');
  },
};

/** Focused with an error: the red ring and halo, and the helper text's icon. */
export const FocusedError: Story = {
  name: 'Focused, error',
  render: () => (
    <div className={styles.column}>
      <FinTextArea label="Label" placeholder="Placeholder text" helperText="Enter a description" error />
    </div>
  ),
  play: async () => {
    await userEvent.tab();
  },
};

/** Longer text: the box grows with it up to 8 lines, then scrolls. */
export const LongText: Story = {
  name: 'Long text',
  render: () => (
    <div className={styles.grid}>
      <FinTextArea label="Description" defaultValue={LONG.slice(0, 140)} helperText="Grows with the text" />
      <FinTextArea label="Description" defaultValue={LONG} helperText="Up to 8 lines, then scrolls" />
      <FinTextArea label="Description" defaultValue={LONG} rows={2} maxRows={4} helperText="rows 2, maxRows 4" />
    </div>
  ),
};
