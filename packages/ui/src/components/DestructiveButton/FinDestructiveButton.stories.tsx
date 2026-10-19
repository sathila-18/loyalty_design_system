import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import type { FinButtonSize } from '../ButtonBase';
import {
  buttonIconArgs,
  buttonIconArgTypes,
  withIconToggles,
  type FinButtonIconToggles,
} from '../ButtonBase/buttonStoryControls';
import {
  FinDestructiveButton,
  type FinDestructiveButtonProps,
  type FinDestructiveButtonVariant,
} from './FinDestructiveButton';
import styles from './FinDestructiveButton.stories.module.css';

const VARIANTS: FinDestructiveButtonVariant[] = ['primary', 'secondary'];
const SIZES: FinButtonSize[] = ['large', 'medium', 'small', 'xsmall'];
const SIZE_NAMES: Record<FinButtonSize, string> = { large: 'Large', medium: 'Medium', small: 'Small', xsmall: 'XSmall' };
const VARIANT_NAMES: Record<FinDestructiveButtonVariant, string> = { primary: 'Primary', secondary: 'Secondary' };

type Args = Omit<FinDestructiveButtonProps, 'leadingIcon' | 'trailingIcon'> & FinButtonIconToggles;

/**
 * INTERNAL: FinDestructiveButton isn't exported from the package. Destructive-button is one of the bases inside
 * all-button (DESIGN.md §7.2, decided 19 Oct 2026). These stories exist only to check it against Figma; products
 * use FinButton.
 */
const meta: Meta<Args> = {
  title: 'Internal/Destructive button',
  component: FinDestructiveButton,
  args: {
    children: 'Text here',
    variant: 'primary',
    size: 'large',
    ...buttonIconArgs,
    showLabel: true,
    disabled: false,
  },
  argTypes: {
    children: { control: 'text', description: 'Figma `Button label`' },
    variant: { control: 'inline-radio', options: VARIANTS, description: 'Figma `Type`' },
    size: { control: 'inline-radio', options: SIZES },
    ...buttonIconArgTypes,
    showLabel: { control: 'boolean', name: 'Show Label', description: 'Figma `Show Label`' },
    disabled: { control: 'boolean', description: 'Figma `State=Disabled`' },
  },
  render: (args) => <FinDestructiveButton {...withIconToggles(args)} />,
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/**
 * The Figma Destructive-button page: every Type and Size, Enabled and Disabled, with both icons (Figma's default).
 * Hovered and Pressed are live: hover or press a button.
 */
export const States: Story = {
  name: 'States (Figma)',
  render: () => (
    <div className={styles.sizes}>
      {SIZES.map((size) => (
        <div key={size} className={styles.table}>
          <span className={styles.heading}>{SIZE_NAMES[size]}</span>
          <span>Enabled</span>
          <span>Disabled</span>
          {VARIANTS.map((variant) => [
            <span key={`${variant}-name`} className={styles.rowLabel}>
              {VARIANT_NAMES[variant]}
            </span>,
            <FinDestructiveButton key={`${variant}-on`} variant={variant} size={size} leadingIcon="person" trailingIcon="person">
              Text here
            </FinDestructiveButton>,
            <FinDestructiveButton
              key={`${variant}-off`}
              variant={variant}
              size={size}
              leadingIcon="person"
              trailingIcon="person"
              disabled
            >
              Text here
            </FinDestructiveButton>,
          ])}
        </div>
      ))}
    </div>
  ),
};

/** Figma `Show Leading Icon`, `Show Trailing Icon` and `Show Label`. With the label hidden it still names the button. */
export const Content: Story = {
  render: () => (
    <div className={styles.row}>
      <FinDestructiveButton leadingIcon="person" trailingIcon="person">
        Text here
      </FinDestructiveButton>
      <FinDestructiveButton variant="secondary" leadingIcon="person">
        Text here
      </FinDestructiveButton>
      <FinDestructiveButton trailingIcon="person">Text here</FinDestructiveButton>
      <FinDestructiveButton variant="secondary">Text here</FinDestructiveButton>
      <FinDestructiveButton leadingIcon="person" showLabel={false}>
        Remove person
      </FinDestructiveButton>
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
      <p className={styles.hint}>Click an empty area here, then press Tab (Shift+Tab to go back). Enter or Space presses.</p>
      <div className={styles.row}>
        {VARIANTS.map((variant) => (
          <FinDestructiveButton key={variant} variant={variant} leadingIcon="person" trailingIcon="person">
            {VARIANT_NAMES[variant]}
          </FinDestructiveButton>
        ))}
        <FinDestructiveButton variant="secondary" size="xsmall" leadingIcon="person" trailingIcon="person">
          XSmall
        </FinDestructiveButton>
      </div>
    </div>
  ),
  play: async () => {
    await userEvent.tab();
  },
};
