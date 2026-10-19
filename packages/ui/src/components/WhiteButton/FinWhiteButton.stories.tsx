import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import type { FinButtonSize } from '../ButtonBase';
import {
  buttonIconArgs,
  buttonIconArgTypes,
  withIconToggles,
  type FinButtonIconToggles,
} from '../ButtonBase/buttonStoryControls';
import { FinWhiteButton, type FinWhiteButtonProps } from './FinWhiteButton';
import styles from './FinWhiteButton.stories.module.css';

const SIZES: FinButtonSize[] = ['large', 'medium', 'small', 'xsmall'];
const SIZE_NAMES: Record<FinButtonSize, string> = { large: 'Large', medium: 'Medium', small: 'Small', xsmall: 'XSmall' };

type Args = Omit<FinWhiteButtonProps, 'leadingIcon' | 'trailingIcon'> & FinButtonIconToggles;

/**
 * INTERNAL: FinWhiteButton isn't exported from the package. White-button is one of the bases inside all-button
 * (DESIGN.md §7.2, decided 19 Oct 2026). These stories exist only to check it against Figma; products use FinButton.
 */
const meta: Meta<Args> = {
  title: 'Internal/White button',
  component: FinWhiteButton,
  args: {
    children: 'Text here',
    size: 'large',
    ...buttonIconArgs,
    showLabel: true,
    disabled: false,
  },
  argTypes: {
    children: { control: 'text', description: 'Figma `Button label`' },
    size: { control: 'inline-radio', options: SIZES },
    ...buttonIconArgTypes,
    showLabel: { control: 'boolean', name: 'Show Label', description: 'Figma `Show Label`' },
    disabled: { control: 'boolean', description: 'Figma `State=Disabled`' },
  },
  render: (args) => <FinWhiteButton {...withIconToggles(args)} />,
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/**
 * The Figma white-button page: every Size, Enabled and Disabled, with both icons (Figma's default).
 * Hovered and Pressed are live: hover or press a button.
 */
export const States: Story = {
  name: 'States (Figma)',
  render: () => (
    <div className={styles.table}>
      <span />
      <span>Enabled</span>
      <span>Disabled</span>
      {SIZES.map((size) => [
        <span key={`${size}-name`} className={styles.rowLabel}>
          {SIZE_NAMES[size]}
        </span>,
        <FinWhiteButton key={`${size}-on`} size={size} leadingIcon="person" trailingIcon="person">
          Text here
        </FinWhiteButton>,
        <FinWhiteButton key={`${size}-off`} size={size} leadingIcon="person" trailingIcon="person" disabled>
          Text here
        </FinWhiteButton>,
      ])}
    </div>
  ),
};

/** On the brand color, where it's meant to be used ("White call to action on brand"). White in both themes. */
export const OnBrand: Story = {
  name: 'On brand',
  render: () => (
    <div className={styles.brand}>
      {SIZES.map((size) => (
        <FinWhiteButton key={size} size={size} leadingIcon="person">
          {SIZE_NAMES[size]}
        </FinWhiteButton>
      ))}
    </div>
  ),
};

/** Figma `Show Leading Icon`, `Show Trailing Icon` and `Show Label`. With the label hidden it still names the button. */
export const Content: Story = {
  render: () => (
    <div className={styles.row}>
      <FinWhiteButton leadingIcon="person" trailingIcon="person">
        Text here
      </FinWhiteButton>
      <FinWhiteButton leadingIcon="person">Text here</FinWhiteButton>
      <FinWhiteButton trailingIcon="person">Text here</FinWhiteButton>
      <FinWhiteButton>Text here</FinWhiteButton>
      <FinWhiteButton leadingIcon="person" showLabel={false}>
        Profile
      </FinWhiteButton>
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
        {SIZES.map((size) => (
          <FinWhiteButton key={size} size={size} leadingIcon="person" trailingIcon="person">
            {SIZE_NAMES[size]}
          </FinWhiteButton>
        ))}
      </div>
    </div>
  ),
  play: async () => {
    await userEvent.tab();
  },
};
