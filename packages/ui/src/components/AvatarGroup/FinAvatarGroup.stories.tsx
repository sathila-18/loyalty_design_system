import type { Meta, StoryObj } from '@storybook/react-vite';
import sample from '../Avatar/avatar-sample.jpg';
import { FinAvatarGroup, type FinAvatarGroupPerson, type FinAvatarGroupSize } from './FinAvatarGroup';
import person1 from './person-1.jpg';
import person2 from './person-2.jpg';
import person3 from './person-3.jpg';
import person4 from './person-4.jpg';
import styles from './FinAvatarGroup.stories.module.css';

// Unsplash photos from the Figma Avatar Group, for the stories only.
const PHOTOS = [person1, sample, person2, person3, person4];
const PEOPLE: FinAvatarGroupPerson[] = Array.from({ length: 10 }, (_, i) => ({
  src: PHOTOS[i % PHOTOS.length]!,
  initials: `P${i + 1}`,
  label: `Person ${i + 1}`,
}));

const SIZES: FinAvatarGroupSize[] = ['xsmall', 'medium', 'xlarge'];
const SIZE_LABEL: Record<FinAvatarGroupSize, string> = { xsmall: 'XSmall', medium: 'Medium', xlarge: 'XLarge' };
const COUNTS = [2, 3, 4, 5, 6, 10];

type Args = { size: FinAvatarGroupSize; people: number };

const meta: Meta<Args> = {
  title: 'Components/Avatar/Avatar group',
  args: { size: 'medium', people: 10 },
  argTypes: {
    size: { control: 'select', options: SIZES },
    people: { control: { type: 'range', min: 1, max: 10 }, name: 'number of people' },
  },
  render: ({ size, people }) => <FinAvatarGroup size={size} people={PEOPLE.slice(0, people)} label="Team members" />,
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/** Every Figma size with 2–6 people, and 10 people (6 avatars and "+4", as in Figma's Count=7). */
export const SizesAndCounts: Story = {
  name: 'Sizes and counts (Figma)',
  render: () => (
    <div className={styles.table}>
      <span />
      {COUNTS.map((count) => (
        <span key={count}>{count} people</span>
      ))}
      {SIZES.map((size) => [
        <span key={size} className={styles.rowLabel}>
          {SIZE_LABEL[size]}
        </span>,
        ...COUNTS.map((count) => (
          <FinAvatarGroup
            key={`${size}-${count}`}
            className={styles.cell}
            size={size}
            people={PEOPLE.slice(0, count)}
            label="Team members"
          />
        )),
      ])}
    </div>
  ),
};

/** A person without a photo shows their initials (FinAvatar fallback). */
export const WithoutPhotos: Story = {
  render: () => (
    <FinAvatarGroup
      size="xlarge"
      label="Team members"
      people={[
        PEOPLE[0]!,
        { initials: 'SD', label: 'Sathila De Silva' },
        PEOPLE[2]!,
        { initials: 'AK', label: 'Person A' },
        { label: 'Person B' },
      ]}
    />
  ),
};
