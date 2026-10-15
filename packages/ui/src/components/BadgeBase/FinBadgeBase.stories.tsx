import type { Meta, StoryObj } from '@storybook/react-vite';
import { FinBadgeBase, type FinBadgeBaseSize } from './FinBadgeBase';
import styles from './FinBadgeBase.stories.module.css';

const SIZES: FinBadgeBaseSize[] = ['small', 'large'];

/**
 * INTERNAL: FinBadgeBase isn't exported from the package (DESIGN.md §7.2: bases are internal unless DESIGN.md
 * says otherwise). These stories exist only to check it against Figma; products use FinBadge.
 */
const meta: Meta = {
  title: 'Internal/Badge base',
};
export default meta;

type Story = StoryObj;

/** The Figma Badge-base page: Small and Large, with both icons (Figma's default), one, or none (code's default). */
export const Sizes: Story = {
  name: 'Sizes (Figma)',
  render: () => (
    <div className={styles.table}>
      <span />
      <span>Both icons</span>
      <span>Leading only</span>
      <span>Trailing only</span>
      <span>No icons</span>
      {SIZES.map((size) => [
        <span key={size} className={styles.rowLabel}>
          {size === 'small' ? 'Small' : 'Large'}
        </span>,
        <FinBadgeBase key={`${size}-both`} size={size} leadingIcon="person" trailingIcon="person">
          Text here
        </FinBadgeBase>,
        <FinBadgeBase key={`${size}-lead`} size={size} leadingIcon="person">
          Text here
        </FinBadgeBase>,
        <FinBadgeBase key={`${size}-trail`} size={size} trailingIcon="person">
          Text here
        </FinBadgeBase>,
        <FinBadgeBase key={`${size}-none`} size={size}>
          Text here
        </FinBadgeBase>,
      ])}
    </div>
  ),
};

/** Long labels stay on one line and end in "…" when the container is narrower, like a table cell (decided 15 Oct 2026). */
export const LongLabel: Story = {
  name: 'Long label',
  render: () => (
    <div className={styles.cells}>
      {[240, 160, 96].map((width) => (
        <div key={width} className={styles.cell} data-width={width}>
          <span className={styles.cellLabel}>{width}px container</span>
          <FinBadgeBase leadingIcon="person">Awaiting approval from the finance team</FinBadgeBase>
          <FinBadgeBase size="large" leadingIcon="person">
            Awaiting approval from the finance team
          </FinBadgeBase>
        </div>
      ))}
    </div>
  ),
};
