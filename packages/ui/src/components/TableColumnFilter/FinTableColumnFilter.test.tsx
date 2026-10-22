import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FinTableColumnFilter } from './FinTableColumnFilter';

const OPTIONS = ['Active', 'Inactive', 'Pending'].map((value) => ({ value, label: value }));

describe('FinTableColumnFilter', () => {
  it('is the down arrow as a button; it points up and opens a filter dialog with the values as checkboxes', async () => {
    const user = userEvent.setup();
    render(<FinTableColumnFilter label="Status" options={OPTIONS} value={[]} onApply={() => {}} />);
    const button = screen.getByRole('button', { name: 'Filter Status' });
    expect(button).toHaveTextContent('keyboard_arrow_down');
    await user.click(button);
    expect(button).toHaveTextContent('keyboard_arrow_up');
    expect(screen.getByRole('dialog', { name: 'Filter Status' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Status' })).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(3);
  });

  it('applies the ticked values only with Apply, and Reset clears the choice', async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();
    render(<FinTableColumnFilter label="Status" options={OPTIONS} value={['Active']} onApply={onApply} />);
    expect(screen.getByRole('button', { name: 'Filter Status, 1 selected' })).toHaveAttribute('data-active');
    await user.click(screen.getByRole('button', { name: /Filter Status/ }));
    expect(screen.getByRole('checkbox', { name: 'Active' })).toBeChecked();
    await user.click(screen.getByRole('checkbox', { name: 'Pending' }));
    expect(onApply).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Apply' }));
    expect(onApply).toHaveBeenCalledWith(['Active', 'Pending']);
    expect(screen.queryByRole('dialog')).toBeNull();
    await user.click(screen.getByRole('button', { name: /Filter Status/ }));
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByRole('checkbox', { name: 'Active' })).not.toBeChecked();
    await user.click(screen.getByRole('button', { name: 'Apply' }));
    expect(onApply).toHaveBeenLastCalledWith([]);
  });

  it('closing without Apply drops the changes', async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();
    render(<FinTableColumnFilter label="Status" options={OPTIONS} value={[]} onApply={onApply} />);
    await user.click(screen.getByRole('button', { name: 'Filter Status' }));
    await user.click(screen.getByRole('checkbox', { name: 'Active' }));
    await user.keyboard('{Escape}');
    expect(onApply).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Filter Status' }));
    expect(screen.getByRole('checkbox', { name: 'Active' })).not.toBeChecked();
  });

  it('radios apply on selection, with no Reset or Apply; "All" clears the filter', async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();
    const { rerender } = render(<FinTableColumnFilter label="Tier" options={OPTIONS} value={[]} onApply={onApply} multiple={false} />);
    await user.click(screen.getByRole('button', { name: 'Filter Tier' }));
    expect(screen.queryByRole('button', { name: 'Apply' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Reset' })).toBeNull();
    expect(screen.getByRole('radio', { name: 'All' })).toBeChecked();
    await user.click(screen.getByRole('radio', { name: 'Pending' }));
    expect(onApply).toHaveBeenLastCalledWith(['Pending']);
    expect(screen.queryByRole('dialog')).toBeNull();
    rerender(<FinTableColumnFilter label="Tier" options={OPTIONS} value={['Pending']} onApply={onApply} multiple={false} />);
    await user.click(screen.getByRole('button', { name: /Filter Tier/ }));
    expect(screen.getByRole('radio', { name: 'Pending' })).toBeChecked();
    await user.click(screen.getByRole('radio', { name: 'All' }));
    expect(onApply).toHaveBeenLastCalledWith([]);
  });

  it('radios chosen with the arrow keys apply as they move, and the menu stays open', async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();
    render(<FinTableColumnFilter label="Tier" options={OPTIONS} value={[]} onApply={onApply} multiple={false} />);
    await user.click(screen.getByRole('button', { name: 'Filter Tier' }));
    screen.getByRole('radio', { name: 'All' }).focus();
    await user.keyboard('{ArrowDown}');
    expect(onApply).toHaveBeenLastCalledWith(['Active']);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('many values get a search (the "All" radio hides while searching)', async () => {
    const user = userEvent.setup();
    const many = Array.from({ length: 12 }, (_, i) => ({ value: `v${i}`, label: `Campaign ${i + 1}` }));
    const onApply = vi.fn();
    render(<FinTableColumnFilter label="Campaign" options={many} value={[]} onApply={onApply} multiple={false} />);
    await user.click(screen.getByRole('button', { name: 'Filter Campaign' }));
    expect(screen.getAllByRole('radio')).toHaveLength(13);
    await user.type(screen.getByRole('searchbox', { name: 'Search Campaign' }), '11');
    expect(screen.getAllByRole('radio')).toHaveLength(1);
    await user.click(screen.getByRole('radio', { name: 'Campaign 11' }));
    expect(onApply).toHaveBeenCalledWith(['v10']);
  });
});
