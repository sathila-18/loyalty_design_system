import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Page } from './Foundations';
import styles from './Foundations.module.css';

// Shadows are Figma effect styles, hand-written in @finspace-loyalty/tokens/styles.css (DESIGN.md §4.2).
const SHADOWS = [
  ['Shadow/Resting_cards', '--fin-shadow-resting-cards', '0 1 3 0, black 5%', 'Cards and surfaces at rest'],
  ['Shadow/Panel_sheets', '--fin-shadow-panel-sheets', '0 2 10 0, black 4%', 'Panels on the page. Not Dialog box or Side sheet: they sit on FinOverlay.'],
  ['Shadow/Sticky', '--fin-shadow-sticky', '0 −2 16 0, black 8%', 'Sticky bottom elements (falls upward)'],
  ['Shadow/Sticky, sideways (end)', '--fin-shadow-sticky-end', '−2 0 16 0, black 8%', 'A column fixed on the right while a table scrolls sideways (falls left). Code first.'],
  ['Shadow/Sticky, sideways (start)', '--fin-shadow-sticky-start', '2 0 16 0, black 8%', 'A column fixed on the left (falls right). Code first.'],
  ['Shadow/Menu', '--fin-shadow-menu', '0 −2 16 0, black 8%', 'Menus (FinMenu). Same values as Sticky, its own style so menus never use Sticky.'],
] as const;

const meta: Meta = {
  title: 'Foundations/Shadows',
  parameters: { layout: 'fullscreen' },
};
export default meta;

export const Styles: StoryObj = {
  render: () => (
    <Page title="Shadows" intro="Three effect styles. Same in Light and Dark (DESIGN.md §4.2, §10 #5).">
      <div className={styles.canvas}>
        {SHADOWS.map(([figma, cssVar, layer, use]) => (
          <div key={cssVar} className={styles.card} style={{ '--shadow': `var(${cssVar})` } as CSSProperties}>
            <span className={styles.cardTitle}>{figma}</span>
            <code className={styles.name}>{cssVar}</code>
            <code className={styles.detail}>{layer}</code>
            <span className={styles.detail}>{use}</span>
          </div>
        ))}
      </div>
    </Page>
  ),
};
