import type { Meta, StoryObj } from '@storybook/react-vite';
import { Page } from './Foundations';
import styles from './Foundations.module.css';

const meta: Meta = {
  title: 'Foundations/Grid',
  parameters: { layout: 'fullscreen' },
};
export default meta;

export const Desktop: StoryObj = {
  render: () => (
    <Page
      title="Grid"
      intro="Desktop-sm and Desktop-lg: 12 columns, 24 gutter (--fin-grid-gutter), 24 margin (--fin-grid-margin), stretch (DESIGN.md §4.3). Resize the window to see the columns stretch."
    >
      <div className={styles.gridOverlay}>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className={styles.column} />
        ))}
      </div>
    </Page>
  ),
};
