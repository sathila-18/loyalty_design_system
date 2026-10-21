import type { Meta, StoryObj } from '@storybook/react-vite';
import { FinTextField } from '../TextField';
import { FinLabel, type FinLabelSize } from './FinLabel';
import styles from './FinLabel.stories.module.css';

type Args = { text: string; size: FinLabelSize; badge: boolean; badgeLabel: string };

const meta: Meta<Args> = {
  title: 'Components/Text box/Label',
  args: { text: 'Label text', size: 'medium', badge: false, badgeLabel: 'Required' },
  argTypes: {
    text: { control: 'text', description: 'Figma `Label` (`children`)' },
    size: { control: 'inline-radio', options: ['medium', 'small'] },
    badge: { control: 'boolean', description: 'Figma `Show badge`' },
    badgeLabel: { control: 'text', description: 'Required with `badge`: what the dot means, read by screen readers', if: { arg: 'badge' } },
  },
  render: ({ text, size, badge, badgeLabel }) =>
    badge ? (
      <FinLabel size={size} badge badgeLabel={badgeLabel}>
        {text}
      </FinLabel>
    ) : (
      <FinLabel size={size}>{text}</FinLabel>
    ),
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/** The Figma Label page: Medium and Small, with and without the badge. */
export const Sizes: Story = {
  name: 'Sizes (Figma)',
  render: () => (
    <div className={styles.table}>
      <span />
      <span>Label</span>
      <span>Show badge</span>
      <span className={styles.rowLabel}>Medium</span>
      <FinLabel>Label text</FinLabel>
      <FinLabel badge badgeLabel="New">
        Label text
      </FinLabel>
      <span className={styles.rowLabel}>Small</span>
      <FinLabel size="small">Label text</FinLabel>
      <FinLabel size="small" badge badgeLabel="New">
        Label text
      </FinLabel>
    </div>
  ),
};

/**
 * Plain text by default (captions, table headings, a heading over a group of fields); a real `<label>` linked to a
 * control with `htmlFor` (clicking it focuses the control). Text fields bring their own label (on the border), so here
 * FinLabel heads the group. The dot's meaning depends on the screen, so `badgeLabel` says it.
 */
export const Usage: Story = {
  render: () => (
    <div className={styles.usage}>
      <div className={styles.field}>
        <FinLabel badge badgeLabel="Required">
          Contact details
        </FinLabel>
        <FinTextField label="Email address" type="email" placeholder="name@email.com" className={styles.input} />
      </div>
      <FinLabel size="small" badge badgeLabel="Unread">
        Notifications
      </FinLabel>
      <div className={styles.narrow}>
        <FinLabel>Last transaction date and time</FinLabel>
      </div>
    </div>
  ),
};
