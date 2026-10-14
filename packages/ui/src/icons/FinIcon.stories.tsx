import type { Meta, StoryObj } from '@storybook/react-vite';
import { finColor } from '@finspace-loyalty/tokens';
import { FinIcon, type FinFgColor, type FinIconSize } from './FinIcon';
import { finIcons } from './finIcons';
import styles from './FinIcon.stories.module.css';

const SIZES: FinIconSize[] = [16, 20, 24, 36, 48, 64];
const FG_COLORS = Object.keys(finColor)
  .filter((key) => key.startsWith('fg'))
  .map((key) => (key.charAt(2).toLowerCase() + key.slice(3)) as FinFgColor);
// The Figma Icon sizes states (DESIGN.md §6.3) are examples of these colors.
const FIGMA_STATES: [string, FinFgColor][] = [
  ['Primary', 'primary'],
  ['Secondary', 'secondary'],
  ['Disabled', 'disabled'],
  ['Success', 'success'],
  ['Warning', 'warning'],
  ['Error', 'error'],
  ['Info', 'info'],
];

const meta: Meta<typeof FinIcon> = {
  title: 'Components/Icon',
  component: FinIcon,
  args: { name: 'person', size: 24, filled: false },
  argTypes: {
    name: { control: 'select', options: finIcons },
    size: { control: 'select', options: SIZES },
    color: { control: 'select', options: [undefined, ...FG_COLORS], labels: { undefined: '(inherit)' } },
    filled: { control: 'boolean' },
    label: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof FinIcon>;

export const Playground: Story = {};

/** Every icon in the finIcons registry, outlined and filled. */
export const AllIcons: Story = {
  name: 'All icons',
  render: () => (
    <div className={styles.grid}>
      {finIcons.map((name) => (
        <div key={name} className={styles.cell}>
          <div className={styles.pair}>
            <FinIcon name={name} />
            <FinIcon name={name} filled />
          </div>
          {name}
        </div>
      ))}
    </div>
  ),
};

/** The Figma Icon sizes page: every size in the seven state colors. */
export const SizesAndStates: Story = {
  name: 'Sizes and states (Figma)',
  render: (args) => (
    <div className={styles.table}>
      <span />
      {FIGMA_STATES.map(([state]) => (
        <span key={state}>{state}</span>
      ))}
      {SIZES.map((size) => [
        <span key={size} className={styles.rowLabel}>
          {size}px
        </span>,
        ...FIGMA_STATES.map(([state, color]) => (
          <FinIcon key={`${size}-${state}`} name={args.name} size={size} color={color} filled={args.filled ?? false} />
        )),
      ])}
    </div>
  ),
};
