import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { FinIcon } from '../../icons/FinIcon';
import { finIcons, type FinIconName } from '../../icons/finIcons';
import { FinInputBase, type FinInputBaseVariant } from './FinInputBase';
import styles from './FinInputBase.stories.module.css';

interface Args {
  variant: FinInputBaseVariant;
  label: string;
  placeholder: string;
  value: string;
  showPrefix: boolean;
  prefix: string;
  showSuffix: boolean;
  suffix: string;
  leadingAccessory: 'none' | FinIconName;
  trailingAccessory: 'none' | FinIconName;
  showHelperText: boolean;
  helperText: string;
  error: boolean;
  disabled: boolean;
}

const icon = (name: 'none' | FinIconName) => (name === 'none' ? undefined : <FinIcon name={name} size={24} />);

/**
 * A disabled field's helper text is inactive by design (WCAG exempts the text of disabled controls), as the Helper
 * text stories (DESIGN.md §9.20). Only disabled helper text is left out of the a11y check.
 */
const KNOWN_CONTRAST_ISSUES = ['[data-tone="disabled"]'];

/**
 * INTERNAL: the base of the single-line fields (FinTextField, FinPasswordField, FinSelectField, FinMultiSelectField,
 * FinSearchField). Matches Figma's properties (DESIGN.md §9). Hover, focus and type in it to see the states.
 */
const meta: Meta<Args> = {
  title: 'Internal/Input field/Input field base',
  parameters: { a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
  args: {
    variant: 'default',
    label: 'Label',
    placeholder: 'Placeholder text',
    value: '',
    showPrefix: false,
    prefix: '+94',
    showSuffix: false,
    suffix: '%',
    leadingAccessory: 'none',
    trailingAccessory: 'person',
    showHelperText: true,
    helperText: 'Helper text here',
    error: false,
    disabled: false,
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'payment', 'mobile-number', 'select'],
      description: 'Figma `Type`',
    },
    label: { control: 'text', description: 'Figma `Show Label` (on the border when focused or filled)' },
    placeholder: { control: 'text', description: 'Figma `Show Placeholder text`' },
    value: { control: 'text', description: 'A starting value (Complete)' },
    showPrefix: { control: 'boolean', description: 'Figma `Show Prefix`' },
    prefix: { control: 'text', if: { arg: 'showPrefix' } },
    showSuffix: { control: 'boolean', description: 'Figma `Show Suffix`' },
    suffix: { control: 'text', if: { arg: 'showSuffix' } },
    leadingAccessory: { control: 'select', options: ['none', ...finIcons], description: 'Figma `Show Leading accessory` and slot' },
    trailingAccessory: { control: 'select', options: ['none', ...finIcons], description: 'Figma `Show Trailing accessory` and slot' },
    showHelperText: { control: 'boolean', description: 'Figma `Show Helper text`' },
    helperText: { control: 'text', if: { arg: 'showHelperText' } },
    error: { control: 'boolean', description: 'Figma `Destructive`' },
    disabled: { control: 'boolean', description: 'Disabled (Figma State, in the mapped fields)' },
  },
  render: (args) => (
    <div className={styles.column}>
      <FinInputBase
        key={args.value}
        variant={args.variant}
        label={args.label}
        placeholder={args.placeholder}
        defaultValue={args.value}
        error={args.error}
        disabled={args.disabled}
        {...(args.showPrefix ? { prefix: args.prefix } : {})}
        {...(args.showSuffix ? { suffix: args.suffix } : {})}
        {...(args.leadingAccessory !== 'none' ? { leading: icon(args.leadingAccessory) } : {})}
        {...(args.trailingAccessory !== 'none' ? { trailing: icon(args.trailingAccessory) } : {})}
        {...(args.showHelperText ? { helperText: args.helperText } : {})}
      />
    </div>
  ),
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

const VARIANTS: { variant: FinInputBaseVariant; name: string }[] = [
  { variant: 'default', name: 'Default' },
  { variant: 'payment', name: 'Payment' },
  { variant: 'mobile-number', name: 'Mobile number' },
  { variant: 'select', name: 'Select' },
];

/** The Figma Input field-base page: each Type, Destructive off and on. */
export const Types: Story = {
  name: 'Types (Figma)',
  render: () => (
    <div className={styles.grid}>
      {[false, true].map((error) =>
        VARIANTS.map(({ variant, name }) => (
          <FinInputBase
            key={`${variant}-${error}`}
            variant={variant}
            label={name}
            placeholder="Placeholder text"
            error={error}
            {...(variant === 'select' ? {} : { trailing: icon('person') })}
            helperText="Helper text here"
          />
        )),
      )}
    </div>
  ),
};

/** The states from Input field-standard. Hover the Enabled field to see Hovered; see Focused and Typing below. */
export const States: Story = {
  name: 'States (Figma)',
  render: () => (
    <div className={styles.grid}>
      <FinInputBase label="Enabled" placeholder="Placeholder text" trailing={icon('person')} helperText="Helper text here" />
      <FinInputBase label="Complete" defaultValue="Olivia James" trailing={icon('person')} helperText="Helper text here" />
      <FinInputBase label="Disabled" placeholder="Placeholder text" trailing={icon('person')} helperText="Helper text here" disabled />
      <FinInputBase label="Disabled, filled" defaultValue="Olivia James" trailing={icon('person')} helperText="Helper text here" disabled />
      <FinInputBase label="Error" placeholder="Placeholder text" trailing={icon('person')} helperText="Helper text here" error />
      <FinInputBase label="Error, complete" defaultValue="Olivia James" trailing={icon('person')} helperText="Helper text here" error />
    </div>
  ),
};

/** Focused: the label on the border, the caret and the ring (the placeholder hides). */
export const Focused: Story = {
  render: () => (
    <div className={styles.column}>
      <FinInputBase label="Label" placeholder="Placeholder text" trailing={icon('person')} helperText="Helper text here" />
    </div>
  ),
  play: async () => {
    await userEvent.tab();
  },
};

/** Typing: focused with a value. */
export const Typing: Story = {
  render: () => (
    <div className={styles.column}>
      <FinInputBase label="Label" placeholder="Placeholder text" trailing={icon('person')} helperText="Helper text here" />
    </div>
  ),
  play: async () => {
    await userEvent.tab();
    await userEvent.keyboard('Olivia');
  },
};

/** Focused with an error: the red ring and halo. */
export const FocusedError: Story = {
  name: 'Focused, error',
  render: () => (
    <div className={styles.column}>
      <FinInputBase label="Label" defaultValue="Olivia" trailing={icon('person')} helperText="Helper text here" error />
    </div>
  ),
  play: async () => {
    await userEvent.tab();
  },
};

/** Prefix, suffix, a leading icon and a long label and helper text. */
export const Accessories: Story = {
  render: () => (
    <div className={styles.grid}>
      <FinInputBase label="Discount" placeholder="0" suffix="%" defaultValue="15" />
      <FinInputBase label="Amount" placeholder="0.00" prefix="LKR" leading={icon('credit_card')} />
      <FinInputBase
        label="A long label that does not fit on the border of the field at all"
        defaultValue="A value"
        helperText="A long helper text that wraps onto a second line when the field is too narrow for it to fit on one."
      />
    </div>
  ),
};

/** The label's notch shows whatever surface is behind the field (here `bg-secondary`), not a white patch. */
export const OnASurface: Story = {
  name: 'On a surface',
  render: () => (
    <div className={styles.surface}>
      <FinInputBase label="Label" defaultValue="Olivia James" helperText="Helper text here" />
      <FinInputBase label="Label" placeholder="Placeholder text" helperText="Helper text here" error />
    </div>
  ),
};

/** Fields stacked in a form: 24 (Space-3XL) apart (DESIGN.md §2 rule 4). */
export const Stacked: Story = {
  render: () => (
    <form className={styles.stack} onSubmit={(event) => event.preventDefault()}>
      <FinInputBase label="First name" placeholder="First name" helperText="As on your ID" />
      <FinInputBase label="Last name" placeholder="Last name" />
      <FinInputBase variant="mobile-number" label="Mobile number" placeholder="77 123 4567" prefix="+94" />
      <FinInputBase label="Email" placeholder="name@email.com" type="email" helperText="We'll send the receipt here" />
    </form>
  ),
};
