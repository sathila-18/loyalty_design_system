import type { Meta, StoryObj } from '@storybook/react-vite';
import { finIcons, type FinIconName } from '../../icons/finIcons';
import { FinAvatar } from '../Avatar';
import { FinBadge } from '../Badge';
import { FinFlag } from '../../flags';
import { FinListItem, type FinListItemSize } from './FinListItem';
import styles from './FinListItem.stories.module.css';

interface Args {
  size: FinListItemSize;
  leadingAccessory: boolean;
  topLabel: string;
  title: string;
  extraIcon: 'none' | FinIconName;
  showBody: boolean;
  body: string;
  trailingAccessory: boolean;
  divider: boolean;
}

/** INTERNAL: a base (§7.2), with no states of its own. Matches Figma's properties (DESIGN.md §9). */
const meta: Meta<Args> = {
  title: 'Internal/List/List base',
  args: {
    size: 'large',
    leadingAccessory: true,
    topLabel: '',
    title: 'Title here',
    extraIcon: 'none',
    showBody: true,
    body: 'Placeholder description here',
    trailingAccessory: true,
    divider: true,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['large', 'small'], description: 'Figma `Size`' },
    leadingAccessory: { control: 'boolean', description: 'Figma `Show leading accessory`' },
    topLabel: { control: 'text', description: 'Figma `Show top label` (empty: hidden)' },
    title: { control: 'text', description: 'The title' },
    extraIcon: { control: 'select', options: ['none', ...finIcons], description: 'Figma `Show extra icon` and its icon' },
    showBody: { control: 'boolean', description: 'Figma `Show body content`' },
    body: { control: 'text', description: 'Figma Body content (text)' },
    trailingAccessory: { control: 'boolean', description: 'Figma `Show trailing accessory`' },
    divider: { control: 'boolean', description: 'Figma `Show divider`' },
  },
  render: ({ topLabel, extraIcon, body, ...args }) => (
    <div className={styles.frame}>
      <FinListItem {...args} {...(topLabel ? { topLabel } : {})} {...(extraIcon === 'none' ? {} : { extraIcon })}>
        {body}
      </FinListItem>
    </div>
  ),
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/** The Figma List-base page: Size Large and Small with the defaults, and the extra icon (Figma placeholder `person`). */
export const Sizes: Story = {
  name: 'Sizes (Figma)',
  render: () => (
    <div className={styles.row}>
      <div className={styles.frame}>
        <FinListItem title="Title here" extraIcon="person">
          Placeholder description here
        </FinListItem>
      </div>
      <div className={styles.frame}>
        <FinListItem size="small" title="Title here" extraIcon="person">
          Placeholder description here
        </FinListItem>
      </div>
    </div>
  ),
};

/** Every optional part shown: top label, extra icon, body, both accessories and the divider. */
export const AllParts: Story = {
  name: 'All parts',
  render: () => (
    <div className={styles.frame}>
      <FinListItem topLabel="Label text" title="A longer title that wraps onto a second line" extraIcon="check_circle">
        A longer description that also wraps when the column is narrow.
      </FinListItem>
    </div>
  ),
};

/** Slots take any component per scenario: an avatar, a flag, a badge. */
export const Slots: Story = {
  render: () => (
    <div className={styles.frame}>
      <FinListItem leading={<FinAvatar size="large" initials="AP" />} title="Ann Perera" trailing={<FinBadge tone="success">Gold</FinBadge>}>
        ann.perera@email.com
      </FinListItem>
      <FinListItem size="small" leading={<FinFlag country="LK" decorative />} title="Sri Lanka" trailingAccessory={false} showBody={false} />
    </div>
  ),
};

/**
 * Several items together (a `ul` of `li` items): the last one has no divider. Without a body (the second group), the
 * title is centred on the leading accessory.
 */
export const Group: Story = {
  render: () => (
    <div className={styles.row}>
      <ul className={styles.list} aria-label="Members">
        <FinListItem as="li" title="Ann Perera">ann.perera@email.com</FinListItem>
        <FinListItem as="li" title="Ravi Fernando">ravi.fernando@email.com</FinListItem>
        <FinListItem as="li" title="Mala Silva">mala.silva@email.com</FinListItem>
      </ul>
      <ul className={styles.list} aria-label="Countries">
        <FinListItem as="li" size="small" title="Sri Lanka" showBody={false} />
        <FinListItem as="li" size="small" title="India" showBody={false} />
        <FinListItem as="li" size="small" title="Maldives" showBody={false} />
      </ul>
    </div>
  ),
};
