import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { finFont } from '@finspace-loyalty/tokens';
import { Page } from './Foundations';
import { useComputed } from './useComputed';
import { varName } from './resolve';
import styles from './Foundations.module.css';

function TextStyle({ font, deps }: { font: string; deps: unknown[] }) {
  const [ref, value] = useComputed('font', deps);
  return (
    <div className={styles.row}>
      <div className={styles.meta}>
        <code className={styles.name}>{varName(font)}</code>
        <code className={styles.detail}>{value}</code>
      </div>
      <div ref={ref} className={styles.textSample} style={{ '--font': font } as CSSProperties}>
        Loyalty points earned 1,250
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'Foundations/Typography',
  parameters: { layout: 'fullscreen' },
};
export default meta;

export const TextStyles: StoryObj = {
  name: 'Text styles',
  render: (_, { globals }) => (
    <Page
      title="Typography"
      intro="23 text styles. Components use the font shorthand only: font: var(--fin-font-…) (DESIGN.md §3.4, §3.8)."
    >
      <div className={styles.rows}>
        {Object.values(finFont).map((font) => (
          <TextStyle key={font} font={font} deps={[globals.brand]} />
        ))}
      </div>
    </Page>
  ),
};
