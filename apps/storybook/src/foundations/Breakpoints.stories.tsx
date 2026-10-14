import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { finBreakpoint } from '@finspace-loyalty/tokens/breakpoints';
import { Page } from './Foundations';
import styles from './Foundations.module.css';
import bp from './Breakpoints.module.css';

function useMatches() {
  const read = () => Object.fromEntries(Object.entries(finBreakpoint).map(([k, q]) => [k, window.matchMedia(q).matches]));
  const [matches, setMatches] = useState<Record<string, boolean>>({});
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const update = () => {
      setMatches(read());
      setWidth(window.innerWidth);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return { matches, width };
}

function Breakpoints() {
  const { matches, width } = useMatches();
  return (
    <Page
      title="Breakpoints"
      intro={`Custom media queries: @media (--fin-bp-lg) in CSS, finBreakpoint.lg in TS (DESIGN.md §3.7). This frame is ${width}px wide.`}
    >
      <p>
        Largest breakpoint matched in CSS: <span className={bp.cssReadout} />
      </p>
      <div className={styles.rows}>
        {Object.entries(finBreakpoint).map(([key, query]) => (
          <div key={key} className={styles.row}>
            <div className={styles.meta}>
              <code className={styles.name}>--fin-bp-{key}</code>
              <code className={styles.detail}>{query}</code>
            </div>
            <span className={styles.status} data-match={matches[key] ?? false}>
              {matches[key] ? 'Matches' : 'Does not match'}
            </span>
          </div>
        ))}
      </div>
    </Page>
  );
}

const meta: Meta = {
  title: 'Foundations/Breakpoints',
  parameters: { layout: 'fullscreen' },
};
export default meta;

export const Queries: StoryObj = {
  render: () => <Breakpoints />,
};
