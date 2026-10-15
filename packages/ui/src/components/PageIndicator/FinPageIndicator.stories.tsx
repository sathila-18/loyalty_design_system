import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FinPageIndicator } from './FinPageIndicator';
import styles from './FinPageIndicator.stories.module.css';

type Args = { count: number; active: number; clickable: boolean };

/** Clickable stories keep their own position, like an app would. */
function Stateful({ count, initial }: { count: number; initial: number }) {
  const [active, setActive] = useState(initial);
  return <FinPageIndicator count={count} active={active} onChange={setActive} label="Onboarding steps" />;
}

const meta: Meta<Args> = {
  title: 'Components/Indicator/Page indicator',
  args: { count: 5, active: 2, clickable: true },
  argTypes: {
    count: { control: { type: 'number', min: 1 }, description: 'Figma `Number` (any number, no maximum)' },
    active: { control: { type: 'number', min: 1 }, description: 'Figma `Active` (1-based)' },
    clickable: { control: 'boolean', description: 'Passes `onChange`: the dots become a radio group (Tab, then arrows)' },
  },
  render: ({ count, active, clickable }) =>
    clickable ? <Stateful key={`${count}-${active}`} count={count} initial={active} /> : <FinPageIndicator count={count} active={active} />,
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/** The Figma Indicator set page: every `Number` (3/4/5) and `Active` position, display-only. */
export const ActiveAndNumber: Story = {
  name: 'Active and number (Figma)',
  render: () => (
    <div className={styles.table}>
      {[3, 4, 5].map((count) => (
        <div key={count} className={styles.row}>
          <span className={styles.rowLabel}>Number={count}</span>
          {Array.from({ length: count }, (_, i) => (
            <FinPageIndicator key={i} count={count} active={i + 1} />
          ))}
        </div>
      ))}
    </div>
  ),
};

/**
 * Clickable (decided 15 Oct 2026): click a dot, or Tab to the current one and use the arrow keys, Home and End.
 * The dots keep Figma's spacing, so their hit areas are narrower than 24px; screens must also offer Previous /
 * Next (WCAG 2.5.8 equivalent-control exception, DESIGN.md §9).
 */
export const Clickable: Story = {
  render: () => (
    <div className={styles.table}>
      <Stateful count={3} initial={1} />
      <Stateful count={5} initial={3} />
      <Stateful count={8} initial={6} />
    </div>
  ),
};
