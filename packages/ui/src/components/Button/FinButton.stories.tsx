import type { Meta, StoryObj } from '@storybook/react-vite';
import { finIcons, type FinIconName } from '../../icons/finIcons';
import type { FinButtonSize, FinButtonVariant } from '../ButtonBase';
import {
  FinButton,
  type FinButtonIcon,
  type FinButtonIconProps,
  type FinButtonTone,
  type FinButtonToneProps,
} from './FinButton';
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
