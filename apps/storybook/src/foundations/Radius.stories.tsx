import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { finRadius } from '@finspace-loyalty/tokens';
import { Page } from './Foundations';
import { varName } from './resolve';
import styles from './Foundations.module.css';

const meta: Meta = {
  title: 'Foundations/Radius',
  parameters: { layout: 'fullscreen' },
};
export default meta;

export const Scale: StoryObj = {
  render: () => (
    <Page title="Radius" intro="Corner radius scale. full is a pill or circle (DESIGN.md §3.6).">
      <div className={styles.canvas}>
        {Object.values(finRadius).map((radius) => (
          <div key={radius} className={styles.meta}>
            <div className={styles.box} style={{ '--radius': radius } as CSSProperties} />
            <code className={styles.name}>{varName(radius)}</code>
          </div>
        ))}
      </div>
    </Page>
  ),
};
