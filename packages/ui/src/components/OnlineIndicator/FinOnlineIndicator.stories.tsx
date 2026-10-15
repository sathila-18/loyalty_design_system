import type { Meta, StoryObj } from '@storybook/react-vite';
import { FinOnlineIndicator, type FinOnlineIndicatorSize } from './FinOnlineIndicator';
import styles from './FinOnlineIndicator.stories.module.css';

const SIZES: FinOnlineIndicatorSize[] = ['xsmall', 'small', 'medium', 'large', 'xlarge'];
const SIZE_LABEL: Record<FinOnlineIndicatorSize, string> = {
  xsmall: 'XSmall',
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
  xlarge: 'XLarge',
};

const meta: Meta<typeof FinOnlineIndicator> = {
  title: 'Components/Avatar/Online indicator',
  component: FinOnlineIndicator,
  args: { size: 'medium', label: 'Online', decorative: false },
  argTypes: {
    size: { control: 'select', options: SIZES },
    label: { control: 'text' },
    decorative: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof FinOnlineIndicator>;

export const Playground: Story = {};

/** The Figma Online Indicator page: every Size. On an avatar, use FinAvatar `online` (Components/Avatar/Avatar › Online). */
export const Sizes: Story = {
  name: 'Sizes (Figma)',
  render: () => (
    <div className={styles.row}>
      {SIZES.map((size) => (
        <figure key={size} className={styles.case}>
          <FinOnlineIndicator size={size} />
          <figcaption>{SIZE_LABEL[size]}</figcaption>
        </figure>
      ))}
    </div>
  ),
};
