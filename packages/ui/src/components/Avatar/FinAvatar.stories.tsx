import type { Meta, StoryObj } from '@storybook/react-vite';
import { FinAvatar, type FinAvatarSize, type FinAvatarType } from './FinAvatar';
import sample from './avatar-sample.jpg';
import styles from './FinAvatar.stories.module.css';

const TYPES: FinAvatarType[] = ['image', 'icon', 'text'];
const SIZES: FinAvatarSize[] = ['xsmall', 'small', 'medium', 'large', 'xlarge', 'xxlarge', 'xxxlarge'];
const SIZE_LABEL: Record<FinAvatarSize, string> = {
  xsmall: 'XSmall',
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
  xlarge: 'XLarge',
  xxlarge: 'XXLarge',
  xxxlarge: 'XXXLarge',
};
const title = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const meta: Meta<typeof FinAvatar> = {
  title: 'Components/Avatar/Avatar',
  component: FinAvatar,
  args: { type: 'image', size: 'medium', src: sample, initials: 'SD', label: 'Sample person' },
  argTypes: {
    type: { control: 'select', options: TYPES },
    size: { control: 'select', options: SIZES },
    src: { control: 'text' },
    initials: { control: 'text' },
    label: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof FinAvatar>;

export const Playground: Story = {};

/** The Figma Avatar page: every Type and Size. XXXLarge is 96 (changed from 100 in Figma on 15 Oct 2026). */
export const TypesAndSizes: Story = {
  name: 'Types and sizes (Figma)',
  render: () => (
    <div className={styles.table}>
      <span />
      {SIZES.map((size) => (
        <span key={size}>{SIZE_LABEL[size]}</span>
      ))}
      {TYPES.map((type) => [
        <span key={type} className={styles.rowLabel}>
          {title(type)}
        </span>,
        ...SIZES.map((size) => (
          <FinAvatar key={`${type}-${size}`} type={type} size={size} src={sample} initials="SD" label="Sample person" />
        )),
      ])}
    </div>
  ),
};

/** Not in Figma (decided 15 Oct 2026): without a photo, initials; without initials either, the icon. */
export const Fallback: Story = {
  render: () => (
    <div className={styles.fallback}>
      <figure className={styles.case}>
        <FinAvatar size="xlarge" src={sample} initials="SD" label="Sample person" />
        <figcaption>Photo</figcaption>
      </figure>
      <figure className={styles.case}>
        <FinAvatar size="xlarge" initials="SD" label="Sample person" />
        <figcaption>No photo → initials</figcaption>
      </figure>
      <figure className={styles.case}>
        <FinAvatar size="xlarge" src="/missing-photo.jpg" initials="SD" label="Sample person" />
        <figcaption>Photo fails to load → initials</figcaption>
      </figure>
      <figure className={styles.case}>
        <FinAvatar size="xlarge" label="Sample person" />
        <figcaption>No photo, no initials → icon</figcaption>
      </figure>
    </div>
  ),
};
