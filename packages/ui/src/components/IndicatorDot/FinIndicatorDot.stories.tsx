import type { Meta, StoryObj } from '@storybook/react-vite';
import { FinIndicatorDot } from './FinIndicatorDot';
import styles from './FinIndicatorDot.stories.module.css';

/**
 * INTERNAL: FinIndicatorDot isn't exported from the package (DESIGN.md §7.2 rule 4). These stories exist only to
 * check it against Figma; products use FinPageIndicator.
 */
const meta: Meta = { title: 'Internal/Indicator' };
export default meta;

type Story = StoryObj;

/** The Figma Indicator page: `Type=Default` and `Type=Selected`, display-only and clickable (Tab to see focus). */
export const Types: Story = {
  name: 'Types (Figma)',
  render: () => (
    <div className={styles.table}>
      <span />
      <span>Default</span>
      <span>Selected</span>
      <span className={styles.rowLabel}>Display-only</span>
      <FinIndicatorDot />
      <FinIndicatorDot selected />
      <span className={styles.rowLabel}>Clickable</span>
      <FinIndicatorDot interactive aria-label="Step 1" />
      <FinIndicatorDot interactive selected aria-label="Step 2" />
    </div>
  ),
};
