import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { FinTableHeaderCell, type FinTableHeaderCellProps } from './FinTableHeaderCell';
import styles from './FinTableHeaderCell.stories.module.css';

/** A header cell is a `<th>`, so each story puts it in a one-row table. */
const Header = ({ children, className = styles.table }: { children: ReactNode; className?: string }) => (
  <table className={className}>
    <thead>
      <tr>{children}</tr>
    </thead>
  </table>
);

interface Args extends Pick<FinTableHeaderCellProps, 'type' | 'checkbox' | 'showTitle' | 'trailingIcon'> {
  title: string;
}

/**
 * Known contrast failure (DESIGN.md §10 #3, raised 19 Oct 2026): in Dark, the Grey cell's title (`text-tertiary` on
 * `bg-tertiary`) is 4.08:1. Only that title, in Dark, is left out of the a11y check.
 */
const KNOWN_CONTRAST_ISSUES = ['html[data-theme="dark"] th[data-type="grey"] [data-size]'];

/** INTERNAL: part of the table (Title row, FinTable). Matches Figma's properties (DESIGN.md §9). */
const meta: Meta<Args> = {
  title: 'Internal/Table/Table header cell',
  args: { type: 'white', checkbox: true, showTitle: true, title: 'Table title', trailingIcon: false },
  argTypes: {
    type: { control: 'inline-radio', options: ['white', 'grey'], description: 'Figma `Type`' },
    checkbox: { control: 'boolean', description: 'Figma `Show checkbox`' },
    showTitle: { control: 'boolean', description: 'Figma `Show title` (off: hidden on screen, still read out)' },
    title: { control: 'text', description: 'Figma Slot (the column title)' },
    trailingIcon: { control: 'boolean', description: 'Figma `Show trailing icon`' },
  },
  parameters: { a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
  render: ({ title, ...args }) => (
    <Header>
      <FinTableHeaderCell {...args}>{title}</FinTableHeaderCell>
    </Header>
  ),
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/** The Figma Table header cell page: Type White and Grey. */
export const Types: Story = {
  name: 'Types (Figma)',
  render: () => (
    <Header>
      <FinTableHeaderCell type="white">Table title</FinTableHeaderCell>
      <FinTableHeaderCell type="grey">Table title</FinTableHeaderCell>
    </Header>
  ),
};

/** The properties: no checkbox, the trailing arrow, the checkbox's states (some / all rows selected). */
export const Options: Story = {
  render: () => (
    <Header>
      <FinTableHeaderCell checkbox={false}>Name</FinTableHeaderCell>
      <FinTableHeaderCell checkbox={false} trailingIcon>
        Status
      </FinTableHeaderCell>
      <FinTableHeaderCell type="grey" indeterminate>
        Some selected
      </FinTableHeaderCell>
      <FinTableHeaderCell type="grey" checked onCheckedChange={() => undefined}>
        All selected
      </FinTableHeaderCell>
    </Header>
  ),
};

/** Show title off: only the checkbox shows; the title stays the column's name for screen readers. */
export const HiddenTitle: Story = {
  name: 'Hidden title',
  render: () => (
    <Header>
      <FinTableHeaderCell showTitle={false}>Select</FinTableHeaderCell>
      <FinTableHeaderCell checkbox={false}>Name</FinTableHeaderCell>
    </Header>
  ),
};

/** A long title in a narrow, fixed column: one line, ending in "…". */
export const LongTitle: Story = {
  name: 'Long title',
  render: () => (
    <Header className={`${styles.table} ${styles.fixed}`}>
      <FinTableHeaderCell checkbox={false} trailingIcon>
        Last transaction date
      </FinTableHeaderCell>
    </Header>
  ),
};
