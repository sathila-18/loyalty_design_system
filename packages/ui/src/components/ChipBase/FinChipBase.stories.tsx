import type { Meta, StoryObj } from '@storybook/react-vite';
import { FinIcon } from '../../icons/FinIcon';
import { FinAvatar } from '../Avatar';
import { finIcons, type FinIconName } from '../../icons/finIcons';
import { FinChipBase, type FinChipBaseProps, type FinChipSize, type FinChipVariant } from './FinChipBase';
import styles from './FinChipBase.stories.module.css';
import { chipLeadingArgs, chipLeadingArgTypes, withChipLeading, type ChipLeadingArgs } from './chipStoryControls';

const VARIANTS: FinChipVariant[] = ['unselected', 'selected', 'unselected-border'];
const SIZES: FinChipSize[] = ['xsmall', 'small', 'large'];
const VARIANT_NAMES: Record<FinChipVariant, string> = {
  unselected: 'Unselected',
  selected: 'Selected',
  'unselected-border': 'Unselected-border',
};
const SIZE_NAMES: Record<FinChipSize, string> = { xsmall: 'XSmall', small: 'Small', large: 'Large' };

/**
 * Known contrast failure (DESIGN.md §10 #3, accepted by design 19 Oct 2026): Selected text-action on bg-active is
 * 4.13:1 Light and 3.95:1 Dark. Only Selected chips are left out of the a11y check; every other Type is checked.
 */
const KNOWN_CONTRAST_ISSUES = ['[data-variant="selected"]'];

type Args = Omit<FinChipBaseProps, 'leadingIcon' | 'leadingAccessory' | 'trailingIcon'> &
  ChipLeadingArgs & {
  showTrailingIcon: boolean;
  trailingIcon: FinIconName;
};

/**
 * INTERNAL: FinChipBase isn't exported from the package (DESIGN.md §7.2: bases are internal unless DESIGN.md says
 * otherwise). These stories exist only to check it against Figma; products use FinChip.
 */
const meta: Meta<Args> = {
  title: 'Internal/Chip base',
  args: {
    children: 'Label',
    variant: 'unselected',
    size: 'small',
    ...chipLeadingArgs,
    showTrailingIcon: true,
    trailingIcon: 'close',
  },
  argTypes: {
    children: { control: 'text', description: 'Figma `Label text`' },
    variant: { control: 'inline-radio', options: VARIANTS, description: 'Figma `Type`' },
    size: { control: 'inline-radio', options: SIZES, description: 'Figma `Size`' },
    ...chipLeadingArgTypes,
    showTrailingIcon: { control: 'boolean', name: 'Show Trailing Icon', description: 'Figma `Show Trailing Icon`' },
    trailingIcon: { control: 'select', options: finIcons, description: 'The trailing icon', if: { arg: 'showTrailingIcon' } },
  },
  parameters: { a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
  render: ({ showTrailingIcon, trailingIcon, ...args }) => (
    <FinChipBase {...withChipLeading(args)} {...(showTrailingIcon ? { trailingIcon } : {})} />
  ),
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/** The Figma Chips-base page: every Type and Size, with both the leading icon and the trailing ✕ (Figma's default). */
export const Types: Story = {
  name: 'Types (Figma)',
  render: () => (
    <div className={styles.table}>
      <span />
      {SIZES.map((size) => (
        <span key={size}>{SIZE_NAMES[size]}</span>
      ))}
      {VARIANTS.map((variant) => [
        <span key={`${variant}-name`} className={styles.rowLabel}>
          {VARIANT_NAMES[variant]}
        </span>,
        ...SIZES.map((size) => (
          <FinChipBase key={`${variant}-${size}`} variant={variant} size={size} leadingIcon="person" trailingIcon="close">
            Label
          </FinChipBase>
        )),
      ])}
    </div>
  ),
};

/** The leading accessory takes an icon, or other content (two icons here, 8 apart). Both parts are optional. */
export const Content: Story = {
  render: () => (
    <div className={styles.row}>
      <FinChipBase leadingIcon="person" trailingIcon="close">
        Label
      </FinChipBase>
      <FinChipBase leadingIcon="person">Label</FinChipBase>
      <FinChipBase trailingIcon="close">Label</FinChipBase>
      <FinChipBase>Label</FinChipBase>
      <FinChipBase
        variant="selected"
        leadingAccessory={
          <>
            <FinIcon name="check_circle" size={16} filled />
            <FinIcon name="person" size={16} />
          </>
        }
      >
        Custom accessory
      </FinChipBase>
    </div>
  ),
};

/**
 * The leading slot with an avatar, ready for when design adds one. The smallest FinAvatar is 24px, so XSmall and
 * Small chips grow (26 → 32, 33 → 36); Large (40) fits. Avatar sizes in chips are for design to decide (DESIGN.md §10 #47).
 */
export const AvatarAccessory: Story = {
  name: 'Avatar in the slot',
  render: () => (
    <div className={styles.row}>
      {SIZES.map((size) => (
        <FinChipBase
          key={size}
          size={size}
          trailingIcon="close"
          leadingAccessory={<FinAvatar size="xsmall" type="text" initials="SD" />}
        >
          {SIZE_NAMES[size]}
        </FinChipBase>
      ))}
    </div>
  ),
};

/** Long labels stay on one line and end in "…" when the container is narrower. */
export const LongLabel: Story = {
  name: 'Long label',
  render: () => (
    <div className={styles.narrow}>
      <FinChipBase leadingIcon="person" trailingIcon="close">
        Members who joined in the last thirty days
      </FinChipBase>
    </div>
  ),
};
