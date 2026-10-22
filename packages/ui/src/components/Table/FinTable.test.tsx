import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FinTable, type FinTableColumn } from './FinTable';

interface Member {
  id: number;
  name: string;
  status: 'Active' | 'Inactive';
}

const members: Member[] = Array.from({ length: 23 }, (_, index) => ({
  id: index + 1,
  name: `Member ${index + 1}`,
  status: index % 2 === 0 ? 'Active' : 'Inactive',
}));

const columns: FinTableColumn<Member>[] = [
  { key: 'name', header: 'Name' },
  { key: 'status', header: 'Status', type: 'badge', badgeTone: (m) => (m.status === 'Active' ? 'success' : 'neutral') },
  { key: 'profile', header: 'Profile', type: 'link', value: () => 'View profile', href: (m) => `/members/${m.id}` },
];

const bodyRows = () => within(screen.getAllByRole('rowgroup')[1] as HTMLElement).queryAllByRole('row');

describe('FinTable', () => {
  it('shows a named table with the header, the first page of rows and the footer', () => {
    render(<FinTable label="Members" columns={columns} rows={members} getRowId={(m) => m.id} />);
    expect(screen.getByRole('table', { name: 'Members' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(bodyRows()).toHaveLength(10);
    expect(screen.getByText('Showing 1–10 of 23 entries in page 1')).toBeInTheDocument();
    expect(screen.getByText('Member 1').closest('[data-tone]')).toBeNull();
    expect(screen.getAllByText('Active')[0]?.closest('[data-tone="success"]')).not.toBeNull();
    expect(screen.getAllByRole('link', { name: 'View profile' })[0]).toHaveAttribute('href', '/members/1');
  });

  it('pages through the rows (client pagination)', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<FinTable label="Members" columns={columns} rows={members} getRowId={(m) => m.id} onPageChange={onPageChange} />);
    await user.click(screen.getByRole('button', { name: /page 3/i }));
    expect(onPageChange).toHaveBeenCalledWith(3);
    expect(bodyRows()).toHaveLength(3);
    expect(screen.getByText('Member 21')).toBeInTheDocument();
  });

  it('changes the rows per page from the footer menu, keeping the first row shown in view', async () => {
    const user = userEvent.setup();
    const onRowsPerPageChange = vi.fn();
    const onPageChange = vi.fn();
    render(
      <FinTable
        label="Members"
        columns={columns}
        rows={members}
        getRowId={(m) => m.id}
        defaultPage={3}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />,
    );
    expect(screen.getByText('Member 21')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /^Rows per page:\s*10$/ }));
    await user.click(screen.getByRole('option', { name: '25' }));
    expect(onRowsPerPageChange).toHaveBeenCalledWith(25);
    expect(onPageChange).toHaveBeenLastCalledWith(1);
    expect(bodyRows()).toHaveLength(23);
    expect(screen.getByRole('button', { name: /^Rows per page:\s*25$/ })).toBeInTheDocument();
  });

  it('sorts by a column: ascending, descending, then back to the original order; back to page 1', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    const sortable: FinTableColumn<Member>[] = [{ key: 'name', header: 'Name', sortable: true }, columns[1]!];
    render(<FinTable label="Members" columns={sortable} rows={members} getRowId={(m) => m.id} defaultPage={2} onSortChange={onSortChange} />);
    const sortButton = screen.getByRole('button', { name: /^Name/ });
    await user.click(sortButton);
    expect(onSortChange).toHaveBeenLastCalledWith({ key: 'name', direction: 'ascending' });
    expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute('aria-sort', 'ascending');
    expect(within(bodyRows()[1]!).getByText('Member 2')).toBeInTheDocument();
    await user.click(sortButton);
    expect(within(bodyRows()[0]!).getByText('Member 23')).toBeInTheDocument();
    await user.click(sortButton);
    expect(onSortChange).toHaveBeenLastCalledWith(null);
    expect(within(bodyRows()[0]!).getByText('Member 1')).toBeInTheDocument();
  });

  it('filters by a column from its down arrow, counting only the matching rows', async () => {
    const user = userEvent.setup();
    const onFiltersChange = vi.fn();
    const filterable: FinTableColumn<Member>[] = [columns[0]!, { ...columns[1]!, filter: {} }];
    render(<FinTable label="Members" columns={filterable} rows={members} getRowId={(m) => m.id} onFiltersChange={onFiltersChange} />);
    await user.click(screen.getByRole('button', { name: 'Filter Status' }));
    expect(screen.getAllByRole('checkbox', { name: /Active|Inactive/ })).toHaveLength(2);
    await user.click(screen.getByRole('checkbox', { name: 'Inactive' }));
    await user.click(screen.getByRole('button', { name: 'Apply' }));
    expect(onFiltersChange).toHaveBeenCalledWith({ status: ['Inactive'] });
    expect(bodyRows()).toHaveLength(10);
    expect(screen.getByText('Showing 1–10 of 11 entries in page 1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Filter Status, 1 selected' })).toBeInTheDocument();
  });

  it('row actions: a last ⋮ column with an empty header (named for screen readers) that opens the row\'s menu', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onRowClick = vi.fn();
    render(
      <FinTable
        label="Members"
        columns={columns}
        rows={members}
        getRowId={(m) => m.id}
        onRowClick={onRowClick}
        rowActions={(m) => [
          { label: 'Edit', icon: 'edit', onSelect: onEdit },
          { label: 'Delete', onSelect: () => {}, disabled: m.id === 1, separator: true },
        ]}
      />,
    );
    const headers = screen.getAllByRole('columnheader');
    expect(headers.at(-1)).toHaveAccessibleName('Actions');
    expect(within(headers.at(-1)!).getByText('Actions').closest('[data-hidden]')).not.toBeNull();
    const button = screen.getByRole('button', { name: 'More actions for Member 1' });
    expect(button.closest('td')).toBe(within(bodyRows()[0]!).getAllByRole('cell').at(-1));
    await user.click(button);
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeDisabled();
    await user.click(screen.getByRole('menuitem', { name: 'Edit' }));
    expect(onEdit).toHaveBeenCalledWith(members[0]);
    expect(onRowClick).not.toHaveBeenCalled();
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('row actions at the start: the ⋮ column comes first, after the select column', () => {
    render(
      <FinTable label="Members" columns={columns} rows={members} getRowId={(m) => m.id} rowActionsPosition="start" rowActions={[{ label: 'Edit', onSelect: () => {} }]} />,
    );
    const cells = within(bodyRows()[0]!).getAllByRole('cell');
    expect(within(cells[1]!).getByRole('button', { name: 'More actions for Member 1' })).toBeInTheDocument();
    expect(cells[0]!.querySelector('input[type="checkbox"]')).not.toBeNull();
  });

  it('marks when content is scrolled under the fixed ⋮ column, for its shadow', () => {
    render(<FinTable label="Members" columns={columns} rows={members} getRowId={(m) => m.id} rowActions={[{ label: 'Edit', onSelect: () => {} }]} />);
    const scroller = screen.getByRole('table').parentElement!;
    Object.defineProperty(scroller, 'scrollWidth', { configurable: true, value: 1200 });
    Object.defineProperty(scroller, 'clientWidth', { configurable: true, value: 600 });
    fireEvent.scroll(scroller);
    expect(scroller).toHaveAttribute('data-hidden-end');
    expect(scroller).not.toHaveAttribute('data-hidden-start');
    scroller.scrollLeft = 600;
    fireEvent.scroll(scroller);
    expect(scroller).not.toHaveAttribute('data-hidden-end');
    expect(scroller).toHaveAttribute('data-hidden-start');
  });

  it('shows a toolbar above the table: a small search and the main action', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <FinTable
        label="Members"
        columns={columns}
        rows={members}
        getRowId={(m) => m.id}
        toolbar={{ search: { label: 'Search members' }, actionLabel: 'Add member', onAction }}
      />,
    );
    const search = screen.getByRole('searchbox', { name: 'Search members' });
    expect(search.compareDocumentPosition(screen.getByRole('table')) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(search.closest('[data-size]')).toHaveAttribute('data-size', 'small');
    await user.click(screen.getByRole('button', { name: 'Add member' }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('shows the given rows as the current page (server pagination)', () => {
    render(
      <FinTable label="Members" columns={columns} rows={members.slice(10, 20)} totalRows={95} page={2} getRowId={(m) => m.id} />,
    );
    expect(bodyRows()).toHaveLength(10);
    expect(screen.getByText('Member 11')).toBeInTheDocument();
    expect(screen.getByText('Showing 11–20 of 95 entries in page 2')).toBeInTheDocument();
  });

  it('"select all" acts on the current page, and selection is kept across pages', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <FinTable label="Members" columns={columns} rows={members} getRowId={(m) => m.id} onSelectionChange={onSelectionChange} />,
    );
    await user.click(screen.getByRole('checkbox', { name: 'Select all rows' }));
    expect(onSelectionChange).toHaveBeenLastCalledWith([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    await user.click(screen.getByRole('button', { name: /page 2/i }));
    expect(screen.getByRole('checkbox', { name: 'Select all rows' })).not.toBeChecked();
    await user.click(screen.getByRole('checkbox', { name: 'Select Member 11' }));
    expect(onSelectionChange).toHaveBeenLastCalledWith([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    expect(screen.getByRole('checkbox', { name: 'Select all rows' })).toHaveProperty('indeterminate', true);
  });

  it('opens a row with onRowClick, but selects rows on click once any row is selected', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    render(<FinTable label="Members" columns={columns} rows={members} getRowId={(m) => m.id} onRowClick={onRowClick} />);
    await user.click(screen.getByText('Member 2'));
    expect(onRowClick).toHaveBeenCalledWith(members[1]);

    await user.click(screen.getByRole('checkbox', { name: 'Select Member 1' }));
    await user.click(screen.getByText('Member 3'));
    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('checkbox', { name: 'Select Member 3' })).toBeChecked();
    await user.click(screen.getByText('Member 3'));
    expect(screen.getByRole('checkbox', { name: 'Select Member 3' })).not.toBeChecked();

    await user.click(screen.getByRole('checkbox', { name: 'Select Member 1' }));
    await user.click(screen.getByText('Member 4'));
    expect(onRowClick).toHaveBeenLastCalledWith(members[3]);
  });

  it('runs a column action for its row, without opening the row', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const onRowClick = vi.fn();
    render(
      <FinTable
        label="Members"
        columns={[{ key: 'name', header: 'Name', action: { label: (m) => `Edit ${m.name}`, onAction } }]}
        rows={members}
        getRowId={(m) => m.id}
        onRowClick={onRowClick}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Edit Member 2' }));
    expect(onAction).toHaveBeenCalledWith(members[1]);
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it('without selection, has no select cells', () => {
    render(<FinTable label="Members" columns={columns} rows={members} getRowId={(m) => m.id} selectable={false} />);
    expect(screen.queryByRole('checkbox')).toBeNull();
  });

  it('with no rows, shows the header and "Showing 0 of 0 entries"', () => {
    render(<FinTable label="Members" columns={columns} rows={[]} getRowId={(m: Member) => m.id} />);
    expect(bodyRows()).toHaveLength(0);
    expect(screen.getByText('Showing 0 of 0 entries')).toBeInTheDocument();
  });
});
