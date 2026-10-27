import type { Meta, StoryObj } from '@storybook/react-vite';
import { FinSkeleton, type FinSkeletonShape } from './FinSkeleton';
import styles from './FinSkeleton.stories.module.css';

interface Args {
  shape: FinSkeletonShape;
  width: string;
  height: string;
}

/**
 * A grey placeholder where content is loading (code first, no Figma; DESIGN.md §9). It pulses gently, and stays still
 * when the system's "reduce motion" setting is on. Hidden from screen readers: the loading area says it's loading. For
 * a table, use FinTable `loading` (Components/Table/Loading).
 */
const meta: Meta<Args> = {
  title: 'Components/Skeleton',
  args: { shape: 'text', width: '240px', height: '' },
  argTypes: {
    shape: { control: 'inline-radio', options: ['text', 'rect', 'circle'], description: '`shape`' },
    width: { control: 'text', description: '`width` (any CSS width; empty: the default)' },
    height: { control: 'text', description: '`height` (any CSS height; empty: the default; not for a circle)' },
  },
  render: ({ shape, width, height }) => <FinSkeleton shape={shape} {...(width ? { width } : {})} {...(height ? { height } : {})} />,
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};

/** The three shapes at their default sizes: a text line (12 tall), a block (24 tall) and a circle (24). */
export const Shapes: Story = {
  render: () => (
    <div className={styles.column}>
      <FinSkeleton width={240} />
      <FinSkeleton shape="rect" width={240} />
      <FinSkeleton shape="circle" />
    </div>
  ),
};

/** Put together: a list item loading, with an avatar, a name and a line of detail. */
export const ListItem: Story = {
  name: 'List item',
  render: () => (
    <div className={styles.item}>
      <FinSkeleton shape="circle" width={40} />
      <div className={styles.column}>
        <FinSkeleton width="40%" height={16} />
        <FinSkeleton width="70%" />
      </div>
    </div>
  ),
};
