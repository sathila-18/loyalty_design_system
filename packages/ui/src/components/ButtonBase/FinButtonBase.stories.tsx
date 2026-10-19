import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { FinButtonBase, type FinButtonSize, type FinButtonVariant } from './FinButtonBase';
import styles from './FinButtonBase.stories.module.css';

const VARIANTS: FinButtonVariant[] = ['primary', 'secondary', 'tertiary'];
const SIZES: FinButtonSize[] = ['large', 'medium', 'small', 'xsmall'];
const SIZE_NAMES: Record<FinButtonSize, string> = { large: 'Large', medium: 'Medium', small: 'Small', xsmall: 'XSmall' };
const VARIANT_NAMES: Record<FinButtonVariant, string> = { primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary' };

/**
 * INTERNAL: FinButtonBase isn't exported from the package (DESIGN.md §7.2: bases are internal unless DESIGN.md
 * says otherwise). These stories exist only to check it against Figma; products use FinButton.
 */
const meta: Meta<typeof FinButtonBase> = {
  title: 'Internal/Base button',
  component: FinButtonBase,
  args: {
    children: 'Text here',
    variant: 'primary',
    size: 'large',
    leadingIcon: 'person',
    trailingIcon: 'person',
    showLabel: true,
    disabled: false,
  },
  argTypes: {
    children: { control: 'text', description: 'Figma `Button label`' },
    variant: { control: 'inline-radio', options: VARIANTS, description: 'Figma `Type`' },
    size: { control: 'inline-radio', options: SIZES },
    leadingIcon: { control: 'text', description: 'Figma `Show Leading Icon` + icon (a finIcons name)' },
    trailingIcon: { control: 'text', description: 'Figma `Show Trailing Icon` + icon (a finIcons name)' },
    showLabel: { control: 'boolean', description: 'Figma `Show Label`' },
    disabled: { control: 'boolean', description: 'Figma `State=Disabled`' },
  },
};
export default meta;

type Story = StoryObj<typeof FinButtonBase>;

export const Playground: Story = {};

/**
 * The Figma Base-button page: every Type and Size, Enabled and Disabled, with both icons (Figma's default).
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
            <FinButtonBase key={`${variant}-on`} variant={variant} size={size} leadingIcon="person" trailingIcon="person">
              Text here
            </FinButtonBase>,
            <FinButtonBase
              key={`${variant}-off`}
              variant={variant}
              size={size}
              leadingIcon="person"
              trailingIcon="person"
              disabled
            >
              Text here
            </FinButtonBase>,
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
      <FinButtonBase leadingIcon="person" trailingIcon="person">
        Text here
      </FinButtonBase>
      <FinButtonBase leadingIcon="person">Text here</FinButtonBase>
      <FinButtonBase trailingIcon="person">Text here</FinButtonBase>
      <FinButtonBase>Text here</FinButtonBase>
      <FinButtonBase leadingIcon="person" showLabel={false}>
        Profile
      </FinButtonBase>
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
          <FinButtonBase key={variant} variant={variant} leadingIcon="person" trailingIcon="person">
            {VARIANT_NAMES[variant]}
          </FinButtonBase>
        ))}
        <FinButtonBase variant="primary" size="xsmall" leadingIcon="person" trailingIcon="person">
          XSmall
        </FinButtonBase>
      </div>
    </div>
  ),
  play: async () => {
    await userEvent.tab();
  },
};
