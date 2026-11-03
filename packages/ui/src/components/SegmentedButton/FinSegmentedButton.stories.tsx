import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { FinSegmentedButton, type FinSegmentedButtonOption, type FinSegmentedButtonProps } from './FinSegmentedButton';
import styles from './FinSegmentedButton.stories.module.css';

const ALL: FinSegmentedButtonOption[] = [
  { value: 'day', label: 'Day', icon: 'home' },
  { value: 'week', label: 'Week', icon: 'assignment' },
  { value: 'month', label: 'Month', icon: 'credit_card' },
  { value: 'year', label: 'Year', icon: 'loyalty' },
  { value: 'all', label: 'All time', icon: 'search' },
];

const pick = (count: number, icons: boolean) =>
  ALL.slice(0, count).map(({ icon, ...o }) => (icons ? { ...o, icon } : o)) as FinSegmentedButtonProps['options'];

interface Args {
  segments: number;
  showIcons: boolean;
  disabled: boolean;
  label: string;
  size: 'medium' | 'small' | 'xsmall';
  iconOnly: boolean;
  tooltips: boolean;
}

const meta: Meta<Args> = {
  title: 'Components/Segmented button',
  args: { segments: 3, showIcons: false, disabled: false, label: 'Period', size: 'medium', iconOnly: false, tooltips: false },
  argTypes: {
    segments: { control: { type: 'range', min: 2, max: 5 }, description: 'Figma `Show Button 1 / 2 / 3` (code: at least 2)' },
    showIcons: { control: 'boolean', name: 'Show Leading Icon', description: 'The segments’ `Show Leading Accessory`' },
    disabled: { control: 'boolean', description: 'Figma `State=Disabled`' },
    label: { control: 'text', description: 'The group’s name for screen readers' },
    size: { control: 'inline-radio', options: ['medium', 'small', 'xsmall'], description: '`size`: `small` and `xsmall` are code only (2 Nov 2026)' },
    iconOnly: { control: 'boolean', description: '`iconOnly` (code only): the icons alone, labels as their names' },
    tooltips: { control: 'boolean', description: '`tooltips` (code only, with `iconOnly`): each label in a tooltip on hover and keyboard focus', if: { arg: 'iconOnly' } },
  },
  render: ({ segments, showIcons, disabled, label, size, iconOnly, tooltips }) => (
    <div className={styles.frame}>
      <FinSegmentedButton
        key={segments}
        label={label}
        options={pick(segments, showIcons || iconOnly)}
        disabled={disabled}
        size={size}
        iconOnly={iconOnly}
        tooltips={tooltips}
      />
    </div>
  ),
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/** The Figma Segmented button page at its 343px width: Enabled and Disabled, three segments. */
export const States: Story = {
  name: 'States (Figma)',
  render: () => (
    <div className={styles.list}>
      <FinSegmentedButton label="Period, enabled" options={pick(3, false)} />
      <FinSegmentedButton label="Period, disabled" options={pick(3, false)} disabled />
    </div>
  ),
};

/** Two to five segments, with icons, and one segment unavailable. The control fills its container. */
export const Variations: Story = {
  render: () => (
    <div className={styles.wideList}>
      <FinSegmentedButton
        label="Billing period"
        options={[
          { value: 'monthly', label: 'Monthly' },
          { value: 'yearly', label: 'Yearly' },
        ]}
      />
      <FinSegmentedButton label="Period with icons" options={pick(3, true)} />
      <FinSegmentedButton
        label="Period, quarter unavailable"
        options={[
          { value: 'monthly', label: 'Monthly' },
          { value: 'quarterly', label: 'Quarterly', disabled: true },
          { value: 'yearly', label: 'Yearly' },
        ]}
      />
      <FinSegmentedButton label="Period, five" options={pick(5, false)} defaultValue="all" />
    </div>
  ),
};

/**
 * Keyboard: one tab stop (the selected segment); ← → move and select, wrapping; Home and End jump to the ends.
 * Click an empty area here, then press Tab.
 */
export const Keyboard: Story = {
  render: () => (
    <div className={styles.frame}>
      <FinSegmentedButton label="Period" options={pick(3, false)} defaultValue="week" />
    </div>
  ),
  play: async () => {
    await userEvent.tab();
  },
};

/**
 * Code only (2 Nov 2026): `iconOnly` shows just the icons, 36 squares (the selected one filled), on a track as wide
 * as they are; each label stays as the segment's name. Inside a menu it's the account menu's Theme row
 * (`behavior="menuitemradio"`, Components/Side nav/Side menu › Account menu).
 */
export const IconOnly: Story = {
  name: 'Icon only',
  render: () => (
    <div className={styles.frame}>
      <FinSegmentedButton
        label="Theme"
        iconOnly
        defaultValue="light"
        options={[
          { value: 'system', label: 'System', icon: 'desktop_windows' },
          { value: 'light', label: 'Light', icon: 'light_mode' },
          { value: 'dark', label: 'Dark', icon: 'dark_mode' },
        ]}
      />
    </div>
  ),
};

/**
 * Sizes: Medium (Figma's; 48 track, icon only 44), Small (code only, 2 Nov 2026: Button/Small, gaps 4, Radius-M
 * track; 40 track, icon only 36 tall and 100 wide with three icons) and XSmall (code only, 2 Nov 2026: the segments
 * flush, 24 tall, 16 icons; icon only 72 × 24, as the account menu's Theme row).
 */
export const Sizes: Story = {
  render: () => {
    const theme: FinSegmentedButtonProps['options'] = [
      { value: 'system', label: 'System', icon: 'desktop_windows' },
      { value: 'light', label: 'Light', icon: 'light_mode' },
      { value: 'dark', label: 'Dark', icon: 'dark_mode' },
    ];
    return (
      <div className={styles.list}>
        <FinSegmentedButton label="Period, medium" options={pick(3, false)} defaultValue="week" />
        <FinSegmentedButton label="Period, small" size="small" options={pick(3, false)} defaultValue="week" />
        <FinSegmentedButton label="Period, small with icons" size="small" options={pick(3, true)} defaultValue="week" />
        <div>
          <FinSegmentedButton label="Theme, medium" iconOnly options={theme} defaultValue="light" />
        </div>
        <FinSegmentedButton label="Period, xsmall" size="xsmall" options={pick(3, false)} defaultValue="week" />
        <div>
          <FinSegmentedButton label="Theme, small" iconOnly size="small" options={theme} defaultValue="light" />
        </div>
        <div>
          <FinSegmentedButton label="Theme, xsmall" iconOnly tooltips size="xsmall" options={theme} defaultValue="light" />
        </div>
      </div>
    );
  },
};
