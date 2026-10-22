import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { finFlags, type FinFlagCountry } from '../../flags/finFlags';
import { finIcons, type FinIconName } from '../../icons/finIcons';
import { finPaymentMethods, type FinPaymentMethod } from '../../payment/finPaymentMethods';
import type { FinInputBaseSize } from '../InputBase';
import { FinTextField, type FinTextFieldVariant } from './FinTextField';
import styles from './FinTextField.stories.module.css';

interface Args {
  variant: FinTextFieldVariant;
  size: FinInputBaseSize;
  label: string;
  placeholder: string;
  value: string;
  trailingIcon: 'none' | FinIconName;
  showHelperText: boolean;
  helperText: string;
  error: boolean;
  disabled: boolean;
  country: FinFlagCountry;
  showDialCodes: boolean;
  paymentMethod: 'auto' | FinPaymentMethod;
}

/**
 * A disabled field's helper text is inactive by design (WCAG exempts the text of disabled controls), as the Helper
 * text stories (DESIGN.md §9.20). The country menu's dial code on the Selected row in Dark is the accepted List-standard
 * caption exception (4.48:1, §10 #3, as the List stories). Only those are left out of the a11y check.
 */
const KNOWN_CONTRAST_ISSUES = ['[data-tone="disabled"]', 'html[data-theme="dark"] li[data-selected] [data-thickness]'];

/**
 * A single-line text field (Figma Input field-standard). Hover, focus and type in it to see the states; Payment groups a
 * card number as you type and shows its brand.
 */
const meta: Meta<Args> = {
  title: 'Components/Input field/Text field',
  parameters: { a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
  args: {
    variant: 'default',
    size: 'large',
    label: 'Label',
    placeholder: 'Placeholder text',
    value: '',
    trailingIcon: 'none',
    showHelperText: true,
    helperText: 'Helper text here',
    error: false,
    disabled: false,
    country: 'LK',
    showDialCodes: true,
    paymentMethod: 'auto',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'mobile-number', 'payment'], description: 'Figma `Type`' },
    size: { control: 'inline-radio', options: ['large', 'small'], description: 'Large 48 (Figma) or Small 40 (code only)' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    value: { control: 'text', description: 'A starting value (Complete)' },
    trailingIcon: { control: 'select', options: ['none', ...finIcons], description: 'Figma `Trailing icon` and its icon' },
    showHelperText: { control: 'boolean' },
    helperText: { control: 'text', if: { arg: 'showHelperText' } },
    error: { control: 'boolean', description: 'Figma `Error`' },
    disabled: { control: 'boolean', description: 'Figma `State=Disabled`' },
    country: { control: 'select', options: Object.keys(finFlags), description: 'The country at the start (`defaultCountry`); the menu changes it', if: { arg: 'variant', eq: 'mobile-number' } },
    showDialCodes: { control: 'boolean', description: 'The dial codes in the country menu', if: { arg: 'variant', eq: 'mobile-number' } },
    paymentMethod: {
      control: 'select',
      options: ['auto', ...Object.keys(finPaymentMethods)],
      description: '`auto`: from the first digits',
      if: { arg: 'variant', eq: 'payment' },
    },
  },
  render: (args) => (
    <div className={styles.column}>
      <FinTextField
        key={`${args.variant}-${args.value}-${args.country}`}
        variant={args.variant}
        size={args.size}
        label={args.label}
        placeholder={args.placeholder}
        defaultValue={args.value}
        error={args.error}
        disabled={args.disabled}
        defaultCountry={args.country}
        showDialCodes={args.showDialCodes}
        {...(args.paymentMethod !== 'auto' ? { paymentMethod: args.paymentMethod } : {})}
        {...(args.trailingIcon !== 'none' ? { trailingIcon: args.trailingIcon } : {})}
        {...(args.showHelperText ? { helperText: args.helperText } : {})}
      />
    </div>
  ),
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

const VARIANTS: { variant: FinTextFieldVariant; name: string; value: string; placeholder: string }[] = [
  { variant: 'default', name: 'Default', value: 'Olivia James', placeholder: 'Placeholder text' },
  { variant: 'mobile-number', name: 'Mobile number', value: '77 123 4567', placeholder: '77 123 4567' },
  { variant: 'payment', name: 'Payment', value: '4242424242424242', placeholder: '0000 0000 0000 0000' },
];

/** The Figma page: each Type with and without the trailing icon, Error off and on. */
export const Types: Story = {
  name: 'Types (Figma)',
  render: () => (
    <div className={styles.grid}>
      {[false, true].map((error) =>
        [false, true].map((icon) =>
          VARIANTS.map(({ variant, name, placeholder }) => (
            <FinTextField
              key={`${variant}-${icon}-${error}`}
              variant={variant}
              label={name}
              placeholder={placeholder}
              error={error}
              {...(icon ? { trailingIcon: 'person' as const } : {})}
              helperText="Helper text here"
            />
          )),
        ),
      )}
    </div>
  ),
};

/** Enabled, Complete and Disabled for each Type (hover Enabled for Hovered; see Focused and Typing below). */
export const States: Story = {
  name: 'States (Figma)',
  render: () => (
    <div className={styles.grid}>
      {VARIANTS.map(({ variant, name, placeholder }) => (
        <FinTextField key={`${variant}-enabled`} variant={variant} label={name} placeholder={placeholder} helperText="Enabled" />
      ))}
      {VARIANTS.map(({ variant, name, value, placeholder }) => (
        <FinTextField key={`${variant}-complete`} variant={variant} label={name} placeholder={placeholder} defaultValue={value} helperText="Complete" />
      ))}
      {VARIANTS.map(({ variant, name, placeholder }) => (
        <FinTextField key={`${variant}-disabled`} variant={variant} label={name} placeholder={placeholder} helperText="Disabled" disabled />
      ))}
      {VARIANTS.map(({ variant, name, value, placeholder }) => (
        <FinTextField key={`${variant}-error`} variant={variant} label={name} placeholder={placeholder} defaultValue={value} helperText="Error" error />
      ))}
    </div>
  ),
};

/** Large (48, Figma) and Small (40, code only). */
export const Sizes: Story = {
  render: () => (
    <div className={styles.grid}>
      {(['large', 'small'] as const).map((size) =>
        VARIANTS.map(({ variant, name, placeholder }) => (
          <FinTextField
            key={`${variant}-${size}`}
            variant={variant}
            size={size}
            label={`${name}, ${size}`}
            placeholder={placeholder}
            trailingIcon="person"
            helperText="Helper text here"
          />
        )),
      )}
    </div>
  ),
};

/** Focused: the label on the border, the caret and the ring. */
export const Focused: Story = {
  render: () => (
    <div className={styles.column}>
      <FinTextField label="Label" placeholder="Placeholder text" trailingIcon="person" helperText="Helper text here" />
    </div>
  ),
  play: async () => {
    await userEvent.tab();
  },
};

/**
 * Mobile number: the dial code follows the chosen country (from libphonenumber-js). Click a flag to open the country
 * menu: search by name, ISO code or dial code, as wide as the field and 4 below it.
 */
export const MobileNumber: Story = {
  name: 'Mobile number',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className={styles.stack}>
      {(['LK', 'GB', 'AE', 'US'] as const).map((country) => (
        <FinTextField key={country} variant="mobile-number" label={`Mobile number, ${finFlags[country]}`} defaultCountry={country} placeholder="Phone number" />
      ))}
    </div>
  ),
};

/** The country menu open: the search field has focus, the chosen country (Sri Lanka) is Selected and in view. */
export const CountryMenu: Story = {
  name: 'Country menu',
  args: { variant: 'mobile-number', label: 'Mobile number', placeholder: '77 123 4567', showHelperText: false },
  parameters: { controls: { include: ['country', 'showDialCodes', 'size'] } },
  decorators: [
    (Story) => (
      <div className={styles.menuStage}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    await userEvent.click(canvasElement.querySelector<HTMLButtonElement>('button[aria-haspopup="listbox"]')!);
  },
};

/** Payment: type a card number. The digits are grouped as you type and the brand's logo comes from the first digits. */
export const Payment: Story = {
  render: () => (
    <div className={styles.stack}>
      <FinTextField variant="payment" label="Card number" placeholder="0000 0000 0000 0000" helperText="Type a card number" />
      <FinTextField variant="payment" label="Visa" defaultValue="4242424242424242" />
      <FinTextField variant="payment" label="Mastercard" defaultValue="5555555555554444" />
      <FinTextField variant="payment" label="American Express (4-6-5)" defaultValue="378282246310005" />
    </div>
  ),
};

/** Typing a card number. */
export const PaymentTyping: Story = {
  name: 'Payment, typing',
  render: () => (
    <div className={styles.column}>
      <FinTextField variant="payment" label="Card number" placeholder="0000 0000 0000 0000" />
    </div>
  ),
  play: async () => {
    await userEvent.tab();
    await userEvent.keyboard('5555555555');
  },
};

/** Fields stacked in a form: 24 (Space-3XL) apart (DESIGN.md §2 rule 4). */
export const Form: Story = {
  render: () => (
    <form className={styles.stack} onSubmit={(event) => event.preventDefault()}>
      <FinTextField label="Full name" placeholder="Full name" autoComplete="name" />
      <FinTextField label="Email" placeholder="name@email.com" type="email" autoComplete="email" helperText="We'll send the receipt here" />
      <FinTextField variant="mobile-number" label="Mobile number" placeholder="77 123 4567" />
      <FinTextField variant="payment" label="Card number" placeholder="0000 0000 0000 0000" />
    </form>
  ),
};
