import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { finSpace } from '@finspace-loyalty/tokens';
import { Page } from './Foundations';
import { useComputed } from './useComputed';
import { varName } from './resolve';
import styles from './Foundations.module.css';

function Space({ size, deps }: { size: string; deps: unknown[] }) {
  const [ref, value] = useComputed('width', deps);
  return (
    <div className={styles.row}>
      <div className={styles.meta}>
        <code className={styles.name}>{varName(size)}</code>
        <code className={styles.detail}>{value}</code>
      </div>
      <div ref={ref} className={styles.bar} style={{ '--size': size } as CSSProperties} />
    </div>
  );
}

const meta: Meta = {
  title: 'Foundations/Spacing',
  parameters: { layout: 'fullscreen' },
};
export default meta;

export const Scale: StoryObj = {
  render: (_, { globals }) => (
    <Page title="Spacing" intro="The spacing scale for padding, gaps and margins (DESIGN.md §3.5).">
      <div className={styles.rows}>
        {Object.values(finSpace).map((size) => (
          <Space key={size} size={size} deps={[globals.brand]} />
        ))}
      </div>
    </Page>
  ),
};
