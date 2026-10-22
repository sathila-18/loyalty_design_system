import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { FinHeaderNotificationButton } from './FinHeaderNotificationButton';
import styles from './FinHeaderNotificationButton.stories.module.css';

/**
 * The number badge is FinBadgeIndicator Red, whose number fails 4.5:1 in Dark (3.97:1, DESIGN.md §10 #3, accepted).
 * Only that badge is left out of the a11y check, in Dark; the button and the dot are still checked.
 */
const KNOWN_CONTRAST_ISSUES = ['html[data-theme="dark"] [data-tone="error"]:is([data-shape="circle"], [data-shape="pill"])'];

const meta: Meta<typeof FinHeaderNotificationButton> = {
  title: 'Components/Header/Header notification',
  component: FinHeaderNotificationButton,
  args: { notification: 'dot', count: 120, max: 99, label: 'Notifications', disabled: false },
  argTypes: {
    notification: {
      control: 'inline-radio',
      options: ['none', 'dot', 'number'],
      description: 'Figma `Notification` = None / Dot / Number',
    },
    count: { control: 'number', description: 'Unread count', if: { arg: 'notification', eq: 'number' } },
    max: { control: 'number', description: 'Highest number before "+"', if: { arg: 'notification', eq: 'number' } },
    label: { control: 'text', description: 'Accessible name; the unread state is added to it' },
    disabled: { control: 'boolean', description: 'Figma `State=Disabled` (never shows a badge)' },
  },
  parameters: { a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
};
export default meta;

type Story = StoryObj<typeof FinHeaderNotificationButton>;

export const Playground: Story = {};

/**
 * The Figma set: Notification = Dot / Number / None in rows. The columns are Default, then Disabled. Hovered and
 * Pressed are live: point at a button, or hold it down.
 */
export const Variants: Story = {
  name: 'Variants (Figma)',
  render: () => (
    <div className={styles.grid}>
      <FinHeaderNotificationButton notification="dot" />
      <FinHeaderNotificationButton notification="dot" disabled />
      <span />
      <span />
      <FinHeaderNotificationButton notification="number" count={120} />
      <span />
      <span />
      <span />
      <FinHeaderNotificationButton notification="none" />
    </div>
  ),
};

/** The number badge: 1–9 is a circle, 10–99 a pill, over 99 "99+". 0 shows no badge. */
export const Counts: Story = {
  render: () => (
    <div className={styles.row}>
      <FinHeaderNotificationButton notification="number" count={3} />
      <FinHeaderNotificationButton notification="number" count={42} />
      <FinHeaderNotificationButton notification="number" count={120} />
      <FinHeaderNotificationButton notification="number" count={0} />
    </div>
  ),
};

/** No Focused design: the default ring. Click an empty area here, then press Tab. */
export const Focused: Story = {
  render: () => (
    <div className={styles.row}>
      <FinHeaderNotificationButton notification="dot" />
    </div>
  ),
  play: async () => {
    await userEvent.tab();
  },
};
