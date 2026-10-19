import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import type { FinChipSize } from '../ChipBase';
import { FinInputChip } from './FinInputChip';
import styles from './FinInputChip.stories.module.css';

const SIZES: FinChipSize[] = ['xsmall', 'small', 'large'];

/**
 * Disabled chips are exempt from contrast (WCAG 1.4.3), but the check can't tell: the chip is a span and only its ✕ is
 * a disabled control. So disabled input chips are left out of the a11y check; every other chip is checked.
 */
const DISABLED_CHIPS = ['[data-disabled]'];

const meta: Meta<typeof FinInputChip> = {
  title: 'Components/Chips/Input chip',
  component: FinInputChip,
  args: { children: 'Gold', size: 'small', disabled: false, onRemove: () => {} },
  argTypes: {
    children: { control: 'text', description: 'The chosen value' },
    size: { control: 'inline-radio', options: SIZES },
    disabled: { control: 'boolean' },
  },
  parameters: { a11y: { context: { include: ['body'], exclude: DISABLED_CHIPS } } },
};
export default meta;

type Story = StoryObj<typeof FinInputChip>;

export const Playground: Story = {};

/** Every size, with and without a leading icon, and disabled. Only the ✕ is a button. */
export const Sizes: Story = {
  render: () => (
    <div className={styles.table}>
      {SIZES.map((size) => [
        <span key={`${size}-name`}>{size}</span>,
        <FinInputChip key={`${size}-a`} size={size} onRemove={() => {}}>
          Gold
        </FinInputChip>,
        <FinInputChip key={`${size}-b`} size={size} leadingIcon="person" onRemove={() => {}}>
          Sathila De Silva
        </FinInputChip>,
        <FinInputChip key={`${size}-c`} size={size} disabled onRemove={() => {}}>
          Gold
        </FinInputChip>,
      ])}
    </div>
  ),
};

/**
 * In a multi-select field (a stand-in here): click a ✕, or Tab to it and press Delete or Backspace. Focus moves to
 * the next chip's ✕, or to the field when none is left.
 */
export const InAField: Story = {
  name: 'In a field',
  render: function InAFieldStory() {
    const [values, setValues] = useState(['Gold', 'Silver', 'Platinum']);
    const refs = useRef<(HTMLButtonElement | null)[]>([]);
    const field = useRef<HTMLInputElement>(null);
    const remove = (i: number) => {
      setValues((v) => v.filter((_, j) => j !== i));
      requestAnimationFrame(() => (refs.current[i] ?? refs.current[i - 1] ?? field.current)?.focus());
    };
    return (
      <div className={styles.field}>
        {values.map((v, i) => (
          <FinInputChip
            key={v}
            size="xsmall"
            ref={(el) => {
              refs.current[i] = el;
            }}
            onRemove={() => remove(i)}
          >
            {v}
          </FinInputChip>
        ))}
        <input ref={field} className={styles.input} aria-label="Tiers" placeholder="Add a tier" />
      </div>
    );
  },
};
