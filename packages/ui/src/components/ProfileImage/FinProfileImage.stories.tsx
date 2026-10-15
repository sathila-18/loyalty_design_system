import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import sample from '../Avatar/avatar-sample.jpg';
import { FinProfileImage, type FinProfileImageProps } from './FinProfileImage';
import styles from './FinProfileImage.stories.module.css';

const onClick = fn();

/** Figma `Type`, for the controls only: in code the type follows `src`. */
type Args = Omit<FinProfileImageProps, 'src'> & { type: 'image' | 'icon' };

const meta: Meta<Args> = {
  title: 'Components/Avatar/Profile image',
  component: FinProfileImage,
  args: { type: 'image', label: 'Sample person', onClick },
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['image', 'icon'],
      description: 'Figma `Type`. In code: `image` passes a photo as `src`, `icon` passes no `src`.',
    },
    label: { control: 'text' },
    buttonLabel: { control: 'text' },
  },
  render: ({ type, ...args }) => <FinProfileImage {...args} {...(type === 'image' ? { src: sample } : {})} />,
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/** The Figma Profile image page: `Type=Image` (badge: edit) and `Type=Icon` (no photo, badge: camera). */
export const Types: Story = {
  name: 'Types (Figma)',
  render: () => (
    <div className={styles.row}>
      <figure className={styles.case}>
        <FinProfileImage src={sample} label="Sample person" onClick={onClick} />
        <figcaption>Image</figcaption>
      </figure>
      <figure className={styles.case}>
        <FinProfileImage onClick={onClick} />
        <figcaption>Icon (no photo)</figcaption>
      </figure>
    </div>
  ),
};
