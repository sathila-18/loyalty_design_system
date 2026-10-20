import { render, screen, within } from '@testing-library/react';
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
