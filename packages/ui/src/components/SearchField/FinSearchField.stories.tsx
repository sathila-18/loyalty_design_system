import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { userEvent } from 'storybook/test';
import type { FinInputBaseSize } from '../InputBase';
import { FinSearchField } from './FinSearchField';
import styles from './FinSearchField.stories.module.css';

interface Args {
  size: FinInputBaseSize;
  label: string;
  placeholder: string;
  value: string;
  disabled: boolean;
}

/**
 * A search field (Figma Search). The label is never shown but names the box for screen readers. Hover, focus and type
 * in it to see the states; the clear button (or Escape) empties it.
 */
const meta: Meta<Args> = {
  title: 'Components/Search/Search field',
  args: { size: 'large', label: 'Search members', placeholder: 'Search', value: '', disabled: false },
  argTypes: {
    size: { control: 'inline-radio', options: ['large', 'small'], description: 'Large 48 (Figma) or Small 40 (code only)' },
    label: { control: 'text', description: 'Read by screen readers, never shown' },
    placeholder: { control: 'text' },
    value: { control: 'text', description: 'A starting value (Complete)' },
    disabled: { control: 'boolean', description: 'Not in Figma; the native attribute' },
  },
  render: (args) => (
    <div className={styles.column}>
      <FinSearchField
        key={args.value}
        size={args.size}
        label={args.label}
        placeholder={args.placeholder}
        defaultValue={args.value}
        disabled={args.disabled}
      />
    </div>
  ),
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/** The Figma page: Enabled and Complete (hover Enabled for Hovered; see Focus and Typing below). */
export const States: Story = {
  name: 'States (Figma)',
  render: () => (
    <div className={styles.grid}>
      <FinSearchField label="Search, enabled" />
      <FinSearchField label="Search, complete" defaultValue="Olivia James" />
    </div>
  ),
};

/** Focus: the ring and caret, the placeholder hidden. */
export const Focus: Story = {
  render: () => (
    <div className={styles.column}>
      <FinSearchField label="Search members" />
    </div>
  ),
  play: async () => {
    await userEvent.tab();
  },
};

/** Typing: focused with text, and the clear button. */
export const Typing: Story = {
  render: () => (
    <div className={styles.column}>
      <FinSearchField label="Search members" />
    </div>
  ),
  play: async () => {
    await userEvent.tab();
    await userEvent.keyboard('Olivia');
  },
};

/** Large (48, Figma) and Small (40, code only, 20 icons). */
export const Sizes: Story = {
  render: () => (
    <div className={styles.stack}>
      <FinSearchField label="Search, large" defaultValue="Olivia James" />
      <FinSearchField label="Search, small" defaultValue="Olivia James" size="small" />
    </div>
  ),
};

const MEMBERS = ['Olivia James', 'Noah Perera', 'Amara Silva', 'Liam Fernando', 'Maya Jayasinghe'];

/** Filtering a list as you type; the clear button (or Escape) shows everything again. */
export const Filtering: Story = {
  render: function Filtering() {
    const [query, setQuery] = useState('');
    const matches = MEMBERS.filter((name) => name.toLowerCase().includes(query.trim().toLowerCase()));
    return (
      <div className={styles.stack}>
        <FinSearchField label="Search members" placeholder="Search members" value={query} onChange={(event) => setQuery(event.target.value)} />
        <ul aria-live="polite">
          {matches.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>
    );
  },
};
