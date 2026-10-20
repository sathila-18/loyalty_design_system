import type { Meta, StoryObj } from '@storybook/react-vite';
import { finIcons, type FinIconName } from '../../icons/finIcons';
import { FinAvatar } from '../Avatar';
import { FinBadge } from '../Badge';
import type { FinListItemSize } from '../ListItem';
import { FinListItemFilled } from './FinListItemFilled';
import avatarSample from '../Avatar/avatar-sample.jpg';
import styles from './FinListItemFilled.stories.module.css';

interface Args {
  size: FinListItemSize;
  leadingAccessory: boolean;
  topLabel: string;
  title: string;
  extraIcon: 'none' | FinIconName;
  showBody: boolean;
  body: string;
  trailingAccessory: boolean;
}

const photo = <FinAvatar size="medium" src={avatarSample} />;

/** INTERNAL: a base (§7.2), with no states of its own. Matches Figma's properties (DESIGN.md §9). */
const meta: Meta<Args> = {
  title: 'Internal/List/List fill base',
  args: {
    size: 'large',
    leadingAccessory: true,
    topLabel: '',
    title: 'Title here',
    extraIcon: 'none',
    showBody: true,
    body: 'Placeholder description here',
    trailingAccessory: true,
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
  },
  render: ({ topLabel, extraIcon, body, ...args }) => (
    <div className={styles.frame}>
      <FinListItemFilled
        {...args}
        leading={photo}
        {...(topLabel ? { topLabel } : {})}
        {...(extraIcon === 'none' ? {} : { extraIcon })}
      >
        {body}
      </FinListItemFilled>
    </div>
  ),
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/** The Figma List_fill-base page: Size Large and Small, with a photo avatar. */
export const Sizes: Story = {
  name: 'Sizes (Figma)',
  render: () => (
    <div className={styles.row}>
      <div className={styles.frame}>
        <FinListItemFilled title="Title here" leading={photo}>
          Placeholder description here
        </FinListItemFilled>
      </div>
      <div className={styles.frame}>
        <FinListItemFilled size="small" title="Title here" leading={photo}>
          Placeholder description here
        </FinListItemFilled>
      </div>
    </div>
  ),
};

/** Several filled items together (a `ul` of `li` items) sit 12 apart; one without a body is centred. */
export const Group: Story = {
  render: () => (
    <ul className={styles.frame} aria-label="Members">
      <FinListItemFilled as="li" title="Ann Perera" leading={photo} trailing={<FinBadge tone="success">Gold</FinBadge>}>
        ann.perera@email.com
      </FinListItemFilled>
      <FinListItemFilled as="li" title="Ravi Fernando" leading={<FinAvatar size="medium" initials="RF" />}>
        ravi.fernando@email.com
      </FinListItemFilled>
      <FinListItemFilled as="li" size="small" title="Mala Silva" leading={<FinAvatar size="medium" initials="MS" />} showBody={false} />
    </ul>
  ),
};
