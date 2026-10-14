import type { Meta, StoryObj } from '@storybook/react-vite';
import { finIcons } from '../../icons/finIcons';
import { FinIconContainer, type FinIconContainerSize, type FinIconContainerTone } from './FinIconContainer';
import styles from './FinIconContainer.stories.module.css';

const SIZES: FinIconContainerSize[] = [40, 48, 64];
const TONES: FinIconContainerTone[] = ['primary', 'secondary', 'disabled', 'success', 'warning', 'error', 'info'];
const title = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const meta: Meta<typeof FinIconContainer> = {
  title: 'Components/Icons/Icon container',
  component: FinIconContainer,
  args: { name: 'person', size: 40, tone: 'primary', filled: false },
  argTypes: {
    name: { control: 'select', options: finIcons },
    size: { control: 'select', options: SIZES },
    tone: { control: 'select', options: TONES },
    filled: { control: 'boolean' },
    label: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof FinIconContainer>;

export const Playground: Story = {};

/** The Figma Icon sizes page: `40px bg`, `48px bg` and `64px bg`, every State (tone). */
export const SizesAndTones: Story = {
  name: 'Sizes and tones (Figma)',
  render: (args) => (
    <div className={styles.table}>
      <span />
      {TONES.map((tone) => (
        <span key={tone}>{title(tone)}</span>
      ))}
      {SIZES.map((size) => [
        <span key={size} className={styles.rowLabel}>
          {size}px bg
        </span>,
        ...TONES.map((tone) => <FinIconContainer key={`${size}-${tone}`} name={args.name} size={size} tone={tone} filled={args.filled ?? false} />),
      ])}
    </div>
  ),
};
