import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import sample from '../Avatar/avatar-sample.jpg';
import { FinProfileImage } from './FinProfileImage';
import styles from './FinProfileImage.stories.module.css';

const onClick = fn();

const meta: Meta<typeof FinProfileImage> = {
  title: 'Components/Avatar/Profile image',
  component: FinProfileImage,
  args: { src: sample, label: 'Sample person', onClick },
  argTypes: {
    src: { control: 'text' },
    label: { control: 'text' },
    buttonLabel: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof FinProfileImage>;

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
