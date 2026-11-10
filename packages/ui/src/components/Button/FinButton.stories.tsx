import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { finIcons, type FinIconName } from '../../icons/finIcons';
import type { FinButtonSize, FinButtonVariant } from '../ButtonBase';
import {
  FinButton,
  type FinButtonIcon,
  type FinButtonIconProps,
  type FinButtonTone,
  type FinButtonToneProps,
} from './FinButton';
import { FinCheckbox } from '../Checkbox';
import { FinPasswordField } from '../PasswordField';
import { FinTextField } from '../TextField';
import styles from './FinButton.stories.module.css';

const TONES: FinButtonTone[] = ['normal', 'white', 'destructive'];
const VARIANTS: FinButtonVariant[] = ['primary', 'secondary', 'tertiary'];
const SIZES: FinButtonSize[] = ['large', 'medium', 'small', 'xsmall'];
const ICONS: FinButtonIcon[] = ['none', 'leading', 'trailing', 'only-icon'];
const SIZE_NAMES: Record<FinButtonSize, string> = { large: 'Large', medium: 'Medium', small: 'Small', xsmall: 'XSmall' };
const ICON_NAMES: Record<FinButtonIcon, string> = { none: 'None', leading: 'Leading', trailing: 'Trailing', 'only-icon': 'Only icon' };

/** Every Tone × Type combination Figma has. */
const LOOKS = [
  { name: 'Primary', tone: 'normal', variant: 'primary' },
  { name: 'Secondary', tone: 'normal', variant: 'secondary' },
  { name: 'Tertiary', tone: 'normal', variant: 'tertiary' },
  { name: 'White', tone: 'white', variant: 'primary' },
  { name: 'Destructive', tone: 'destructive', variant: 'primary' },
  { name: 'Destructive secondary', tone: 'destructive', variant: 'secondary' },
] as const;

/** Narrows the Playground's flat controls to a combination Figma has (White has one look; Destructive has no Tertiary). */
const toneProps = (tone: FinButtonTone, variant: FinButtonVariant): FinButtonToneProps => {
  if (tone === 'white') return { tone };
  if (tone === 'destructive') return { tone, variant: variant === 'secondary' ? 'secondary' : 'primary' };
  return { tone, variant };
};

const iconProps = (icon: FinButtonIcon, iconName: FinIconName): FinButtonIconProps =>
  icon === 'none' ? {} : { icon, iconName };

interface Args {
  children: string;
  tone: FinButtonTone;
  variant: FinButtonVariant;
  size: FinButtonSize;
  icon: FinButtonIcon;
  iconName: FinIconName;
  disabled: boolean;
}

const meta: Meta<Args> = {
  title: 'Components/Buttons/Button',
  args: {
    children: 'Text here',
    tone: 'normal',
    variant: 'primary',
    size: 'large',
    icon: 'none',
    iconName: 'person',
    disabled: false,
  },
  argTypes: {
    children: { control: 'text', description: 'The label. With Only icon it is hidden and names the button.' },
    tone: { control: 'inline-radio', options: TONES, description: 'Figma `Tone`' },
    variant: {
      control: 'inline-radio',
      options: VARIANTS,
      description: 'Figma `Type`. White has one look; Destructive has Primary and Secondary.',
      if: { arg: 'tone', neq: 'white' },
    },
    size: { control: 'inline-radio', options: SIZES },
    icon: { control: 'inline-radio', options: ICONS, description: 'Figma `Icon`' },
    iconName: { control: 'select', options: finIcons, description: 'The icon (Figma icon swap)', if: { arg: 'icon', neq: 'none' } },
    disabled: { control: 'boolean', description: 'Figma `State=Disabled`' },
  },
  render: ({ children, tone, variant, size, icon, iconName, disabled }) => (
    <FinButton {...toneProps(tone, variant)} {...iconProps(icon, iconName)} size={size} disabled={disabled}>
      {children}
    </FinButton>
  ),
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/**
 * The Figma all-button page, one table per Size: every Tone × Type, with each Icon option and Disabled.
 * Hovered and Pressed are live: hover or press a button.
 */
export const States: Story = {
  name: 'States (Figma)',
  render: () => (
    <div className={styles.sizes}>
      {SIZES.map((size) => (
        <div key={size} className={styles.table}>
          <span className={styles.heading}>{SIZE_NAMES[size]}</span>
          {ICONS.map((icon) => (
            <span key={icon}>{ICON_NAMES[icon]}</span>
          ))}
          <span>Disabled</span>
          {LOOKS.map((look) => [
            <span key={`${look.name}-name`} className={styles.rowLabel}>
              {look.name}
            </span>,
            ...ICONS.map((icon) => (
              <FinButton key={`${look.name}-${icon}`} {...toneProps(look.tone, look.variant)} {...iconProps(icon, 'person')} size={size}>
                {icon === 'only-icon' ? `${look.name}, person` : 'Text here'}
              </FinButton>
            )),
            <FinButton
              key={`${look.name}-disabled`}
              {...toneProps(look.tone, look.variant)}
              {...iconProps('leading', 'person')}
              size={size}
              disabled
            >
              Text here
            </FinButton>,
          ])}
        </div>
      ))}
    </div>
  ),
};

/** `icon="only-icon"`: square (56 / 48 / 36 / 32); the label is hidden and becomes the button's accessible name. */
export const IconOnly: Story = {
  name: 'Icon only',
  render: () => (
    <div className={styles.row}>
      {SIZES.map((size) => (
        <FinButton key={size} icon="only-icon" iconName="edit" size={size}>
          Edit ({SIZE_NAMES[size]})
        </FinButton>
      ))}
      <FinButton icon="only-icon" iconName="close" variant="secondary">
        Close
      </FinButton>
      <FinButton icon="only-icon" iconName="cancel" tone="destructive" variant="secondary">
        Remove
      </FinButton>
    </div>
  ),
};

/** White is made for colored backgrounds such as the brand color. */
export const OnBrand: Story = {
  name: 'White on brand',
  render: () => (
    <div className={styles.brand}>
      <FinButton tone="white">Text here</FinButton>
      <FinButton tone="white" icon="leading" iconName="person">
        Text here
      </FinButton>
      <FinButton tone="white" icon="only-icon" iconName="person">
        Profile
      </FinButton>
    </div>
  ),
};

/** Code only (`iconTone="secondary"`, 26 Oct 2026): a Tertiary icon in grey at rest, purple on hover and press. Used by the side sheet. */
export const GreyIcon: Story = {
  name: 'Tertiary grey icon',
  render: () => (
    <div className={styles.row}>
      <FinButton variant="tertiary" iconTone="secondary" size="medium" icon="only-icon" iconName="arrow_back">
        Back
      </FinButton>
      <FinButton variant="tertiary" iconTone="secondary" size="medium" icon="only-icon" iconName="close">
        Close
      </FinButton>
      <FinButton variant="tertiary" iconTone="secondary" size="medium" icon="only-icon" iconName="close" disabled>
        Close (disabled)
      </FinButton>
    </div>
  ),
};

/*
 * Code only (`hanging`, 10 Nov 2026; DESIGN.md §4.5): hanging alignment for Tertiary buttons under form content. The
 * button keeps its padding and moves to the start by exactly its start padding, so the label lines up with the fields'
 * edge and the hover background and focus ring hang past it. The play function checks that, with keyboard focus.
 */
export const Hanging: Story = {
  name: 'Hanging (under fields)',
  render: () => (
    <div className={styles.hangingColumn} data-testid="column">
      <FinTextField label="User name/ email" placeholder="User name/ email" />
      <FinPasswordField label="Password" placeholder="Password" />
      <div className={styles.hangingRow}>
        <FinButton variant="tertiary" size="xsmall" hanging>
          Forgot password
        </FinButton>
        <FinCheckbox>Remember me</FinCheckbox>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Forgot password' });
    const column = canvas.getByTestId('column').getBoundingClientRect();
    const label = button.firstElementChild!.getBoundingClientRect();
    // The label on the fields' edge; the button itself hangs past it by its padding (Space-XL, 16).
    await expect(Math.abs(label.left - column.left)).toBeLessThan(0.5);
    await expect(Math.round(column.left - button.getBoundingClientRect().left)).toBe(16);
    // Keyboard focus shows the 2px ring, and no parent clips the button.
    await userEvent.click(canvasElement.ownerDocument.body);
    while (button.ownerDocument.activeElement !== button) await userEvent.tab();
    const ring = getComputedStyle(button);
    await expect(ring.outlineStyle).toBe('solid');
    await expect(ring.outlineWidth).toBe('2px');
    for (let parent = button.parentElement; parent; parent = parent.parentElement) {
      const { overflowX, overflowY } = getComputedStyle(parent);
      if (overflowX === 'visible' && overflowY === 'visible') continue;
      const box = parent.getBoundingClientRect();
      const own = button.getBoundingClientRect();
      await expect(own.left >= box.left && own.right <= box.right && own.top >= box.top && own.bottom <= box.bottom).toBe(true);
    }
  },
};

/** `hanging` at every Size and Icon option: the label (or the leading icon) on the field's edge each time. */
export const HangingSizes: Story = {
  name: 'Hanging (every size)',
  render: () => (
    <div className={styles.hangingSizes}>
      {SIZES.map((size) => (
        <div key={size} className={styles.hangingColumn}>
          <FinTextField label={SIZE_NAMES[size]} placeholder="Field" />
          {ICONS.map((icon) => (
            <FinButton key={icon} variant="tertiary" size={size} hanging {...(icon === 'none' ? {} : { icon, iconName: 'arrow_back' as const })}>
              {ICON_NAMES[icon]}
            </FinButton>
          ))}
        </div>
      ))}
    </div>
  ),
};
