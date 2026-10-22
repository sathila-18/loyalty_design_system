import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FinTable, type FinTableColumn, type FinTableRowId } from './FinTable';
import styles from './FinTable.stories.module.css';

interface Member {
  id: number;
  name: string;
  card: string;
  tier: 'Silver' | 'Gold' | 'Platinum';
  status: 'Active' | 'Inactive' | 'Pending';
  points: number;
}

const NAMES = ['Ann Perera', 'Ravi Fernando', 'Mala Silva', 'Kasun Jayasinghe', 'Nimali Dias', 'Tharindu Weerasinghe', 'Dilini Gunawardena'];
const TIERS = ['Silver', 'Gold', 'Platinum'] as const;
const STATUSES = ['Active', 'Inactive', 'Pending'] as const;

const makeMembers = (count: number): Member[] =>
  Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `${NAMES[index % NAMES.length] ?? ''}${index >= NAMES.length ? ` ${Math.floor(index / NAMES.length) + 1}` : ''}`,
    card: `4532 •••• •••• ${String(1000 + ((index * 379) % 9000)).padStart(4, '0')}`,
    tier: TIERS[index % 3] ?? 'Silver',
    status: STATUSES[index % 5 === 0 ? 2 : index % 4 === 0 ? 1 : 0] ?? 'Active',
    points: (index * 1373) % 25000,
  }));

const TONES = { Active: 'success', Inactive: 'neutral', Pending: 'warning' } as const;

const columns = (onEditTier: (m: Member) => void = () => undefined): FinTableColumn<Member>[] => [
  { key: 'name', header: 'Customer', minWidth: 160, sortable: true },
  { key: 'card', header: 'Card number', minWidth: 160 },
  { key: 'status', header: 'Status', type: 'badge', badgeTone: (m) => TONES[m.status], width: 160, filter: {} },
  {
    key: 'tier',
    header: 'Tier',
    width: 200,
    sortable: true,
    sortValue: (m) => TIERS.indexOf(m.tier),
    filter: { multiple: false },
    action: { label: (m) => `Edit ${m.name}'s tier`, onAction: onEditTier },
  },
  { key: 'points', header: 'Points', width: 140, sortable: true, sortValue: (m) => m.points, value: (m) => m.points.toLocaleString('en-US') },
  { key: 'profile', header: 'Profile', type: 'link', width: 180, value: () => 'View profile', href: (m) => `#member-${m.id}` },
];

/**
 * Accepted contrast exceptions (DESIGN.md §10 #3): Grey header titles in Dark, a link on a Selected row, and the
 * current page in the pagination. Only those are left out of the a11y check.
 */
const KNOWN_CONTRAST_ISSUES = [
  'html[data-theme="dark"] th[data-type="grey"] [data-size]',
  'tr[data-selected] a',
  'nav [data-selected]',
];

interface Args {
  rowCount: number;
  rowsPerPage: number;
  selectable: boolean;
  clickable: boolean;
}

/**
 * A complete table: Header row, Table rows and the Table footer with pagination, from columns and rows as data
 * (DESIGN.md §9). Click a row to open it; once a row is ticked, clicking rows selects them instead.
 */
const meta: Meta<Args> = {
  title: 'Components/Table',
  args: { rowCount: 45, rowsPerPage: 10, selectable: true, clickable: true },
  argTypes: {
    rowCount: { control: { type: 'number', min: 0, max: 500 }, description: 'Rows in the table' },
    rowsPerPage: { control: { type: 'number', min: 1, max: 50 }, description: 'Rows per page at the start (`defaultRowsPerPage`; the footer menu changes it)' },
    selectable: { control: 'boolean', description: 'Select cells and "select all" (Figma `Select Cell`)' },
    clickable: { control: 'boolean', description: 'onRowClick set: a row click opens its details' },
  },
  parameters: { layout: 'padded', a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
  render: function Playground({ rowCount, rowsPerPage, selectable, clickable }) {
    const [opened, setOpened] = useState('none');
    return (
      <>
        <FinTable
          key={`${rowCount}-${rowsPerPage}`}
          label="Members"
          columns={columns()}
          rows={makeMembers(rowCount)}
          getRowId={(m) => m.id}
          defaultRowsPerPage={rowsPerPage}
          selectable={selectable}
          {...(clickable ? { onRowClick: (m: Member) => setOpened(m.name) } : {})}
        />
        <p className={styles.readout}>Details opened (a side sheet would open): {opened}</p>
      </>
    );
  },
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/**
 * Everything together: tick rows (kept across pages), "select all" for the page, click a row to open it (or, while
 * rows are ticked, to select it), edit a tier, follow a profile link.
 */
export const Members: Story = {
  render: function Members() {
    const [selected, setSelected] = useState<FinTableRowId[]>([]);
    const [opened, setOpened] = useState('none');
    const [edited, setEdited] = useState('none');
    return (
      <>
        <FinTable
          label="Members"
          columns={columns((m) => setEdited(m.name))}
          rows={makeMembers(45)}
          getRowId={(m) => m.id}
          getRowLabel={(m) => m.name}
          selectedIds={selected}
          onSelectionChange={setSelected}
          onRowClick={(m) => setOpened(m.name)}
        />
        <p className={styles.readout}>
          Selected: {selected.length} · Details opened: {opened} · Tier edited: {edited}
        </p>
      </>
    );
  },
};

/**
 * Sort and filter (code first, 22 Oct 2026): click Customer, Tier or Points to sort (ascending, descending, off; the
 * icon turns purple). The down arrow on Status (checkboxes) and Tier (radios) opens the column's filter menu; Apply
 * filters the rows, and the arrow stays purple while a filter is applied. Both go back to page 1.
 */
export const SortAndFilter: Story = {
  name: 'Sort and filter',
  parameters: { controls: { disable: true } },
  render: function SortAndFilter() {
    const [sort, setSort] = useState('none');
    const [filters, setFilters] = useState('none');
    return (
      <>
        <FinTable
          label="Members"
          columns={columns()}
          rows={makeMembers(45)}
          getRowId={(m) => m.id}
          getRowLabel={(m) => m.name}
          onSortChange={(next) => setSort(next ? `${next.key} ${next.direction}` : 'none')}
          onFiltersChange={(next) =>
            setFilters(
              Object.entries(next)
                .filter(([, values]) => values.length > 0)
                .map(([key, values]) => `${key}: ${values.join(', ')}`)
                .join(' · ') || 'none',
            )
          }
        />
        <p className={styles.readout}>
          Sort: {sort} · Filters: {filters}
        </p>
      </>
    );
  },
};

/** Server pagination: the table shows one page of rows and the total comes from the server. */
export const ServerPagination: Story = {
  name: 'Server pagination',
  render: function ServerPagination() {
    const all = makeMembers(240);
    const [page, setPage] = useState(1);
    return (
      <FinTable
        label="Members"
        columns={columns()}
        rows={all.slice((page - 1) * 10, page * 10)}
        totalRows={all.length}
        page={page}
        onPageChange={setPage}
        getRowId={(m) => m.id}
      />
    );
  },
};

/** In a narrow container (480) the columns keep their widths and minimums, so the table scrolls sideways. */
export const Narrow: Story = {
  render: () => (
    <div className={styles.narrow}>
      <FinTable label="Members" columns={columns()} rows={makeMembers(12)} getRowId={(m) => m.id} />
    </div>
  ),
};

/** No rows: the header and "Showing 0 of 0 entries" (an empty state comes with the Empty state component). */
export const NoRows: Story = {
  name: 'No rows',
  render: () => <FinTable label="Members" columns={columns()} rows={[]} getRowId={(m) => m.id} />,
};
