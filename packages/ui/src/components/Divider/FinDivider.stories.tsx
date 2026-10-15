import type { Meta, StoryObj } from '@storybook/react-vite';
import { FinDivider, type FinDividerOrientation, type FinDividerType } from './FinDivider';
import styles from './FinDivider.stories.module.css';

const TYPES: FinDividerType[] = ['divider', 'section-divider'];
const ORIENTATIONS: FinDividerOrientation[] = ['horizontal', 'vertical'];

const meta: Meta<typeof FinDivider> = {
  title: 'Components/Divider',
  component: FinDivider,
  args: { type: 'divider', orientation: 'horizontal', decorative: false },
  argTypes: {
    type: { control: 'select', options: TYPES },
    orientation: { control: 'select', options: ORIENTATIONS },
    decorative: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof FinDivider>;

export const Playground: Story = {
  render: (args) =>
    args.orientation === 'vertical' ? (
      <div className={styles.row}>
        <span>Before</span>
        <FinDivider {...args} />
        <span>After</span>
      </div>
    ) : (
      <div className={styles.column}>
        <span>Before</span>
        <FinDivider {...args} />
        <span>After</span>
      </div>
    ),
};

/** The Figma Divider page: `Type=Divider` and `Type=Section Divider`, both full width. */
export const Types: Story = {
  name: 'Types (Figma)',
  render: () => (
    <div className={styles.types}>
      {TYPES.map((type) => (
        <div key={type} className={styles.type}>
          <span className={styles.label}>{type === 'divider' ? 'Divider' : 'Section Divider'}</span>
          <FinDivider type={type} />
        </div>
      ))}
    </div>
  ),
};

/** Not in Figma (added 15 Oct 2026): each type stretched to the height of a flex row. */
export const Vertical: Story = {
  render: () => (
    <div className={styles.types}>
      {TYPES.map((type) => (
        <div key={type} className={styles.row}>
          <span>Before</span>
          <FinDivider type={type} orientation="vertical" />
          <span>After</span>
        </div>
      ))}
    </div>
  ),
};
