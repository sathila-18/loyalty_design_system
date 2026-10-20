import type { Meta, StoryObj } from '@storybook/react-vite';
import { FinPaymentIcon, type FinPaymentIconProps, type FinPaymentIconSize } from './FinPaymentIcon';
import { finPaymentMethods, type FinPaymentMethod } from './finPaymentMethods';
import styles from './FinPaymentIcon.stories.module.css';

const METHODS = Object.keys(finPaymentMethods) as FinPaymentMethod[];
const SIZES: FinPaymentIconSize[] = ['small', 'medium', 'large', 'xlarge'];

/**
 * Payment method logos (DESIGN.md §9): Shopify's open-source `activemerchant/payment_icons` (MIT, pinned), our own
 * logos from src/payment/custom/, and our default card. Code is the source of truth; Figma Payment Icons is reference.
 */
const meta: Meta<FinPaymentIconProps> = {
  title: 'Components/Payment icon',
  component: FinPaymentIcon,
  args: { method: 'visa', size: 'medium', disabled: false, decorative: false },
  argTypes: {
    method: { control: 'select', options: METHODS, description: 'Figma `Payment Method` (the registry)' },
    size: { control: 'inline-radio', options: SIZES, description: 'Figma `Size`' },
    disabled: { control: 'boolean', description: 'Figma `State=Disabled` (opacity 0.4)' },
    decorative: { control: 'boolean', description: 'Next to a visible brand name' },
  },
};
export default meta;

type Story = StoryObj<FinPaymentIconProps>;

export const Playground: Story = {};

/** Every registered method at Large (32 tall). */
export const Methods: Story = {
  render: () => (
    <div className={styles.grid}>
      {METHODS.map((method) => (
        <div key={method} className={styles.item}>
          <FinPaymentIcon method={method} size="large" />
          {method}
        </div>
      ))}
    </div>
  ),
};

/** Figma `Size`: Small 16, Medium 24, Large 32, XLarge 48 tall, on the 38 × 24 card. */
export const Sizes: Story = {
  render: () => (
    <div className={styles.sizes}>
      {SIZES.map((size) => (
        <FinPaymentIcon key={size} method="mastercard" size={size} />
      ))}
      {SIZES.map((size) => (
        <FinPaymentIcon key={`default-${size}`} method="default" size={size} />
      ))}
    </div>
  ),
};

/** Figma `State=Disabled`: every method partly transparent, colors unchanged. */
export const Disabled: Story = {
  render: () => (
    <div className={styles.grid}>
      {METHODS.map((method) => (
        <FinPaymentIcon key={method} method={method} size="large" disabled />
      ))}
    </div>
  ),
};
