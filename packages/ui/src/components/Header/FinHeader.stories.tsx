import type { Meta, StoryObj } from '@storybook/react-vite';
import { FinBadge } from '../Badge';
import type { FinHeaderNotification } from '../HeaderNotificationButton';
import { FinHeader } from './FinHeader';
import styles from './FinHeader.stories.module.css';

/**
 * The bell's number badge is FinBadgeIndicator Red, whose number fails 4.5:1 in Dark (3.97:1, DESIGN.md §10 #3,
 * accepted). Only that badge is left out of the a11y check, in Dark.
 */
const KNOWN_CONTRAST_ISSUES = ['html[data-theme="dark"] [data-tone="error"]:is([data-shape="circle"], [data-shape="pill"])'];

interface Args {
  heading: string;
  showBodyContent: boolean;
  bodyContent: string;
  backButton: boolean;
  notification: boolean;
  notificationType: FinHeaderNotification;
  count: number;
}

const meta: Meta<Args> = {
  title: 'Components/Header/Main header',
  args: {
    heading: 'Title',
    showBodyContent: true,
    bodyContent: 'Description',
    backButton: true,
    notification: true,
    notificationType: 'number',
    count: 120,
  },
  argTypes: {
    heading: { control: 'text', description: 'The title (one line, "…" when too long)' },
    showBodyContent: { control: 'boolean', description: 'Figma `body content` slot shown' },
    bodyContent: { control: 'text', description: 'The slot\'s default content: a description', if: { arg: 'showBodyContent' } },
    backButton: { control: 'boolean', description: 'Figma `Show Back Button`' },
    notification: { control: 'boolean', description: 'Figma `Notification`' },
    notificationType: {
      control: 'inline-radio',
      options: ['none', 'dot', 'number'],
      description: 'The bell\'s `notification` (Header notification)',
      if: { arg: 'notification' },
    },
    count: { control: 'number', description: 'Unread count', if: { arg: 'notificationType', eq: 'number' } },
  },
  parameters: { layout: 'padded', a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
  render: ({ heading, showBodyContent, bodyContent, backButton, notification, notificationType, count }) => (
    <FinHeader
      heading={heading}
      bodyContent={showBodyContent ? bodyContent : undefined}
      backButton={backButton}
      notification={notification}
      notificationProps={{ notification: notificationType, count }}
    />
  ),
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/** The Figma Main header with every option on, then each one off. */
export const Options: Story = {
  render: () => (
    <div className={styles.stack}>
      <FinHeader heading="Title" bodyContent="Description" notificationProps={{ notification: 'number', count: 120 }} />
      <FinHeader heading="Title" bodyContent="Description" backButton={false} notificationProps={{ notification: 'dot' }} />
      <FinHeader heading="Title" notificationProps={{ notification: 'none' }} />
      <FinHeader heading="Title" bodyContent="Description" notification={false} />
    </div>
  ),
};

/** A long title stays on one line and ends in "…"; a long description wraps. */
export const LongTitle: Story = {
  render: () => (
    <div className={styles.narrow}>
      <FinHeader
        heading="Campaign performance for every loyalty tier across all regions this quarter"
        bodyContent="Points earned, redeemed and expired, compared with the same period last year"
        notificationProps={{ notification: 'dot' }}
      />
    </div>
  ),
};

/** The `body content` slot holds any content, here a status badge. */
export const CustomBodyContent: Story = {
  render: () => (
    <FinHeader
      heading="Summer rewards"
      bodyContent={<FinBadge tone="success">Active</FinBadge>}
      notificationProps={{ notification: 'number', count: 3 }}
    />
  ),
};
