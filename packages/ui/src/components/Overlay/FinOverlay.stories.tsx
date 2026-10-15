import type { Meta, StoryObj } from '@storybook/react-vite';
import { FinOverlay } from './FinOverlay';
import styles from './FinOverlay.stories.module.css';

const meta: Meta<typeof FinOverlay> = {
  title: 'Components/Overlay',
  component: FinOverlay,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof FinOverlay>;

/**
 * The Figma Overlay (`Type=Desktop`) over a sample page. It fills the whole window at any size: resize the
 * browser, or use Storybook's viewport. Dialog box and Side sheet will sit on top of it (they own stacking and
 * stop the page scrolling, DESIGN.md §9).
 */
export const OverPageContent: Story = {
  name: 'Over page content',
  render: () => (
    <>
      <div className={styles.page}>
        <header className={styles.header}>Page header</header>
        <main className={styles.main}>
          {Array.from({ length: 6 }, (_, i) => (
            <section key={i} className={styles.card}>
              <span className={styles.cardTitle}>Card {i + 1}</span>
              <span>Page content behind the overlay.</span>
            </section>
          ))}
        </main>
      </div>
      <FinOverlay />
    </>
  ),
};
