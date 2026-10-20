import type { Meta, StoryObj } from '@storybook/react-vite';
import avatarSample from '../Avatar/avatar-sample.jpg';
import type { FinListItemSize } from '../ListItem';
import type { FinListStandardLeading } from '../ListStandard';
import { FinListStandardFilled } from './FinListStandardFilled';
import styles from './FinListStandardFilled.stories.module.css';

/** Disabled cards are greyed on purpose (as List-standard, DESIGN.md §10 #3) and left out of the a11y check. */
const KNOWN_CONTRAST_ISSUES = ['[data-disabled]'];

interface Args {
  state: 'default' | 'selected' | 'disabled';
  size: FinListItemSize;
  description: boolean;
  leadingAccessory: FinListStandardLeading;
  caption: boolean;
}

/** Clickable cards: List-standard on List_fill-base, always with the chevron. Code first (DESIGN.md §10 #56). */
const meta: Meta<Args> = {
  title: 'Components/List/Filled/List standard',
  args: { state: 'default', size: 'large', description: true, leadingAccessory: 'icon', caption: false },
  argTypes: {
    state: { control: 'inline-radio', options: ['default', 'selected', 'disabled'], description: 'State (Hovered is the mouse)' },
    size: { control: 'inline-radio', options: ['large', 'small'], description: 'Size' },
    description: { control: 'boolean', description: 'Description' },
    leadingAccessory: { control: 'inline-radio', options: ['none', 'icon', 'flag', 'payment', 'avatar'], description: 'Leading accessory' },
    caption: { control: 'boolean', description: 'Caption (before the chevron)' },
  },
  parameters: { layout: 'padded', a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
  render: ({ state, description, caption, ...args }) => (
    <ul className={styles.list}>
      <FinListStandardFilled
        {...args}
        as="li"
        href="#"
        title="Title here"
        country="LK"
        paymentMethod="visa"
        avatar={{ src: avatarSample }}
        selected={state === 'selected'}
        disabled={state === 'disabled'}
        {...(description ? { description: 'Placeholder description here' } : {})}
        {...(caption ? { caption: 'Caption' } : {})}
      />
    </ul>
  ),
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/** Default, Selected (1px blue edge, no fill) and Disabled, stacked 12 apart; hover a card to see the hover fill. */
export const States: Story = {
  render: () => (
    <ul className={styles.list}>
      <FinListStandardFilled as="li" href="#" title="Default" description="Placeholder description here" leadingAccessory="icon" caption="Caption" />
      <FinListStandardFilled as="li" href="#" title="Selected" description="Placeholder description here" leadingAccessory="icon" caption="Caption" selected />
      <FinListStandardFilled as="li" href="#" title="Disabled" description="Placeholder description here" leadingAccessory="icon" caption="Caption" disabled />
    </ul>
  ),
};

/** Each leading accessory, with and without a description and caption. */
export const Accessories: Story = {
  render: () => (
    <div className={styles.row}>
      <ul className={styles.list}>
        <FinListStandardFilled as="li" href="#" title="Title here" description="Placeholder description here" />
        <FinListStandardFilled as="li" href="#" title="Title here" description="Placeholder description here" leadingAccessory="icon" />
        <FinListStandardFilled as="li" href="#" title="Title here" description="Placeholder description here" leadingAccessory="flag" country="LK" />
        <FinListStandardFilled as="li" href="#" title="Title here" description="Placeholder description here" leadingAccessory="payment" paymentMethod="visa" />
        <FinListStandardFilled as="li" href="#" title="Title here" description="Placeholder description here" leadingAccessory="avatar" avatar={{ src: avatarSample }} />
      </ul>
      <ul className={styles.list}>
        <FinListStandardFilled as="li" href="#" title="Title here" caption="Caption" />
        <FinListStandardFilled as="li" href="#" title="Title here" caption="Caption" leadingAccessory="icon" />
        <FinListStandardFilled as="li" href="#" title="Title here" caption="Caption" leadingAccessory="flag" country="LK" />
        <FinListStandardFilled as="li" href="#" title="Title here" caption="Caption" leadingAccessory="payment" paymentMethod="visa" />
        <FinListStandardFilled as="li" href="#" title="Title here" caption="Caption" leadingAccessory="avatar" avatar={{ src: avatarSample }} />
      </ul>
    </div>
  ),
};
