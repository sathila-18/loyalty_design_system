import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import { FinTableCell } from '../TableCell';
import { FinTableRow, type FinTableRowProps } from './FinTableRow';
import styles from './FinTableRow.stories.module.css';

/** A row is a `<tr>`, so each story puts it in a table's `<tbody>`. */
const Body = ({ children }: { children: ReactNode }) => (
  <table className={styles.table}>
    <tbody>{children}</tbody>
  </table>
);

/** Figma's Cell Slot: "Table cell text" cells, no checkbox. */
const figmaCells = (count: number) =>
  Array.from({ length: count }, (_, index) => (
    <FinTableCell key={index} leadingAccessories={false}>
      Table cell text
    </FinTableCell>
  ));

interface Args extends Pick<FinTableRowProps, 'selected' | 'selectCell'> {
  columns: number;
  clickable: boolean;
}

/**
 * Known contrast failures, accepted by design (DESIGN.md §10 #3, 20 Oct 2026): a Link cell on a Selected row
 * (`text-action` on `bg-active`, 4.13:1 Light / 3.95:1 Dark, the same pair as Selected chips); and in Light, the cell
 * text on a Selected row while hovered (`text-secondary` on `bg-active-hover`, 3.80:1; hover isn't part of the run).
 * Only links on Selected rows are left out of the check.
 */
const KNOWN_CONTRAST_ISSUES = ['tr[data-selected] a'];

const meta: Meta<Args> = {
  title: 'Internal/Table/Table row',
  args: { selected: false, selectCell: true, columns: 6, clickable: false },
  argTypes: {
    selected: { control: 'boolean', description: 'Figma `State=Selected` (Hovered is the mouse)' },
    selectCell: { control: 'boolean', description: 'Figma `Select Cell`' },
    columns: { control: { type: 'number', min: 1, max: 10 }, description: 'Figma `Cell Slot` (the data cells)' },
    clickable: { control: 'boolean', description: 'onRowClick set: the row opens details (pointer, focusable)' },
  },
  parameters: { layout: 'padded', a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
  render: ({ columns, clickable, ...args }) => (
    <Body>
      <FinTableRow {...args} {...(clickable ? { onRowClick: () => undefined } : {})}>
        {figmaCells(columns)}
      </FinTableRow>
    </Body>
  ),
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/** The Figma Table row page: Default and Selected (hover a row to see Hovered and Selected - Hovered). */
export const States: Story = {
  name: 'States (Figma)',
  render: () => (
    <Body>
      <FinTableRow>{figmaCells(6)}</FinTableRow>
      <FinTableRow selected>{figmaCells(6)}</FinTableRow>
    </Body>
  ),
};

const members = [
  { name: 'Ann Perera', tier: 'Gold', status: 'Active' },
  { name: 'Ravi Fernando', tier: 'Silver', status: 'Inactive' },
  { name: 'Mala Silva', tier: 'Platinum', status: 'Active' },
];

/**
 * Rows that open details: click a row (or Tab to it and press Enter) and the line below says which one opened, as a
 * side sheet would. The checkbox, the link and the edit button do their own job instead.
 */
export const Interactive: Story = {
  render: function Interactive() {
    const [selected, setSelected] = useState<string[]>(['Mala Silva']);
    const [opened, setOpened] = useState('none');
    const [edited, setEdited] = useState('none');
    return (
      <>
        <Body>
          {members.map(({ name, tier, status }) => (
            <FinTableRow
              key={name}
              selected={selected.includes(name)}
              onSelectedChange={(on) => setSelected((list) => (on ? [...list, name] : list.filter((item) => item !== name)))}
              checkboxLabel={`Select ${name}`}
              onRowClick={() => setOpened(name)}
            >
              <FinTableCell leadingAccessories={false}>{name}</FinTableCell>
              <FinTableCell type="badge" badgeTone={status === 'Active' ? 'success' : 'neutral'} leadingAccessories={false}>
                {status}
              </FinTableCell>
              <FinTableCell leadingAccessories={false} action actionLabel={`Edit ${name}'s tier`} onAction={() => setEdited(name)}>
                {tier}
              </FinTableCell>
              <FinTableCell type="link" href="#" leadingAccessories={false}>
                View profile
              </FinTableCell>
            </FinTableRow>
          ))}
        </Body>
        <p>
          Details opened: {opened} · Tier edited: {edited}
        </p>
      </>
    );
  },
};

/** Select Cell off: only the Cell Slot's cells. */
export const WithoutSelectCell: Story = {
  name: 'Without select cell',
  render: () => (
    <Body>
      <FinTableRow selectCell={false}>{figmaCells(6)}</FinTableRow>
      <FinTableRow selectCell={false} selected>
        {figmaCells(6)}
      </FinTableRow>
    </Body>
  ),
};
