import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import type { FinInputBaseSize } from '../InputBase';
import { FinPasswordField } from './FinPasswordField';
import styles from './FinPasswordField.stories.module.css';

interface Args {
  size: FinInputBaseSize;
  label: string;
  placeholder: string;
  value: string;
  showPassword: boolean;
  showHelperText: boolean;
  helperText: string;
  error: boolean;
  disabled: boolean;
}

/**
 * A disabled field's helper text is inactive by design (WCAG exempts the text of disabled controls), as the Helper
 * text stories (DESIGN.md §9.20). Only disabled helper text is left out of the a11y check.
 */
const KNOWN_CONTRAST_ISSUES = ['[data-tone="disabled"]'];

/**
 * A password field (Figma Input field-password). The eye button shows or hides the password; its name always says what
 * it does. Hover, focus and type in it to see the states.
 */
const meta: Meta<Args> = {
  title: 'Components/Input field/Password field',
  parameters: { a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
  args: {
    size: 'large',
    label: 'Password',
    placeholder: 'Password',
    value: '',
    showPassword: false,
    showHelperText: true,
    helperText: 'Helper text here',
    error: false,
    disabled: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['large', 'small'], description: 'Large 48 (Figma) or Small 40 (code only)' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    value: { control: 'text', description: 'A starting value (Complete)' },
    showPassword: { control: 'boolean', description: 'Figma `Show password` (the starting value; the eye button changes it)' },
    showHelperText: { control: 'boolean' },
    helperText: { control: 'text', if: { arg: 'showHelperText' } },
    error: { control: 'boolean', description: 'Figma `Error`' },
    disabled: { control: 'boolean', description: 'Figma `State=Disabled`' },
  },
  render: (args) => (
    <div className={styles.column}>
      <FinPasswordField
        key={`${args.value}-${args.showPassword}`}
        size={args.size}
        label={args.label}
        placeholder={args.placeholder}
        defaultValue={args.value}
        defaultShowPassword={args.showPassword}
        error={args.error}
        disabled={args.disabled}
        {...(args.showHelperText ? { helperText: args.helperText } : {})}
      />
    </div>
  ),
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/** The Figma page: Enabled, Complete, Disabled and Error, with the password hidden and shown (hover Enabled for Hovered). */
export const States: Story = {
  name: 'States (Figma)',
  render: () => (
    <div className={styles.grid}>
      {[false, true].flatMap((shown) => [
        <FinPasswordField key={`enabled-${shown}`} label="Password" placeholder="Password" defaultShowPassword={shown} helperText="Enabled" />,
        <FinPasswordField key={`complete-${shown}`} label="Password" defaultValue="@34hj56hd7" defaultShowPassword={shown} helperText="Complete" />,
        <FinPasswordField key={`disabled-${shown}`} label="Password" placeholder="Password" defaultShowPassword={shown} helperText="Disabled" disabled />,
        <FinPasswordField key={`error-${shown}`} label="Password" defaultValue="@34hj56hd7" defaultShowPassword={shown} helperText="Error" error />,
      ])}
    </div>
  ),
};

/** Large (48, Figma) and Small (40, code only, a 20 eye). */
export const Sizes: Story = {
  render: () => (
    <div className={styles.stack}>
      <FinPasswordField label="Password, large" defaultValue="@34hj56hd7" helperText="Helper text here" />
      <FinPasswordField label="Password, small" defaultValue="@34hj56hd7" size="small" helperText="Helper text here" />
    </div>
  ),
};

/** Typing: focused with a value, hidden. */
export const Typing: Story = {
  render: () => (
    <div className={styles.column}>
      <FinPasswordField label="Password" placeholder="Password" helperText="Helper text here" />
    </div>
  ),
  play: async () => {
    await userEvent.tab();
    await userEvent.keyboard('@34hj');
  },
};

/** With the keyboard: Tab to the eye button and press Enter or Space; focus stays on it. */
export const EyeButtonFocused: Story = {
  name: 'Eye button, focused',
  render: () => (
    <div className={styles.column}>
      <FinPasswordField label="Password" defaultValue="@34hj56hd7" helperText="Helper text here" />
    </div>
  ),
  play: async () => {
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
  },
};

/** In a form: a new password (`autoComplete="new-password"`) under the email, 24 apart (DESIGN.md §2 rule 4). */
export const Form: Story = {
  render: () => (
    <form className={styles.stack} onSubmit={(event) => event.preventDefault()}>
      <FinPasswordField label="Current password" placeholder="Current password" />
      <FinPasswordField label="New password" placeholder="New password" autoComplete="new-password" helperText="At least 8 characters" />
    </form>
  ),
};
