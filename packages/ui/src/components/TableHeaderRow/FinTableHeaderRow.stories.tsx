import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { FinTableHeaderCell } from '../TableHeaderCell';
import { FinTableHeaderRow, type FinTableHeaderRowProps } from './FinTableHeaderRow';
import styles from './FinTableHeaderRow.stories.module.css';

/** A header row is a `<tr>`, so each story puts it in a table's `<thead>`. */
const Header = ({ children }: { children: ReactNode }) => (
  <table className={styles.table}>
    <thead>{children}</thead>
  </table>
);

/** Figma's Slot: Grey header cells titled "Table title", no checkbox; the trailing arrow is each cell's own. */
const figmaCells = (count: number, trailingIcon = false) =>
  Array.from({ length: count }, (_, index) => (
    <FinTableHeaderCell key={index} type="grey" checkbox={false} trailingIcon={trailingIcon}>
      Table title
    </FinTableHeaderCell>
  ));

type Selection = 'none' | 'some' | 'all';

interface Args extends Pick<FinTableHeaderRowProps, 'selectCell'> {
  columns: number;
  trailingIcon: boolean;
  selection: Selection;
}

/**
 * Known contrast failure (DESIGN.md §10 #3, raised 19 Oct 2026): in Dark, the Grey cell's title (`text-tertiary` on
 * `bg-tertiary`) is 4.08:1. Only those titles, in Dark, are left out of the a11y check.
 */
const KNOWN_CONTRAST_ISSUES = ['html[data-theme="dark"] th[data-type="grey"] [data-size]'];

/** INTERNAL: part of the table (FinTable). Matches Figma's properties (DESIGN.md §9). */
const meta: Meta<Args> = {
  title: 'Internal/Table/Header row',
  args: { selectCell: true, columns: 6, trailingIcon: false, selection: 'none' },
  argTypes: {
    selectCell: { control: 'boolean', description: 'Figma `Select Cell`' },
    columns: { control: { type: 'number', min: 1, max: 10 }, description: 'Figma `Cell Slot` (the header cells)' },
    trailingIcon: {
      control: 'boolean',
      description: 'Figma `Show trailing icon` on the header cells (a prop of each FinTableHeaderCell, so per column in code)',
    },
    selection: {
      control: 'inline-radio',
      options: ['none', 'some', 'all'],
      description: 'The "select all" checkbox: no rows, some rows (mixed) or all rows selected',
    },
  },
  parameters: { layout: 'padded', a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
  render: ({ columns, trailingIcon, selection, ...args }) => (
    <Header>
      <FinTableHeaderRow
        {...args}
        checked={selection === 'all'}
        indeterminate={selection === 'some'}
        onCheckedChange={() => undefined}
      >
        {figmaCells(columns, trailingIcon)}
      </FinTableHeaderRow>
    </Header>
  ),
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/** The Figma Header row: the select cell and six "Table title" cells. */
export const Figma: Story = {
  render: () => (
    <Header>
      <FinTableHeaderRow>{figmaCells(6)}</FinTableHeaderRow>
    </Header>
  ),
};

/** Select Cell off: only the Slot's cells. */
export const WithoutSelectCell: Story = {
  name: 'Without select cell',
  render: () => (
    <Header>
      <FinTableHeaderRow selectCell={false}>{figmaCells(6)}</FinTableHeaderRow>
    </Header>
  ),
};

/** Real titles, with the trailing arrow on some columns, and some rows selected. */
export const Example: Story = {
  render: () => (
    <Header>
      <FinTableHeaderRow indeterminate onCheckedChange={() => undefined}>
        <FinTableHeaderCell type="grey" checkbox={false}>
          Customer
        </FinTableHeaderCell>
        <FinTableHeaderCell type="grey" checkbox={false}>
          Card number
        </FinTableHeaderCell>
        <FinTableHeaderCell type="grey" checkbox={false} trailingIcon>
          Tier
        </FinTableHeaderCell>
        <FinTableHeaderCell type="grey" checkbox={false} trailingIcon>
          Status
        </FinTableHeaderCell>
        <FinTableHeaderCell type="grey" checkbox={false}>
          Points
        </FinTableHeaderCell>
      </FinTableHeaderRow>
    </Header>
  ),
};
