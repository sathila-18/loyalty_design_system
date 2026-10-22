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

  it('single choice uses radios; many values get a search', async () => {
    const user = userEvent.setup();
    const many = Array.from({ length: 12 }, (_, i) => ({ value: `v${i}`, label: `Campaign ${i + 1}` }));
    const onApply = vi.fn();
    render(<FinTableColumnFilter label="Campaign" options={many} value={[]} onApply={onApply} multiple={false} />);
    await user.click(screen.getByRole('button', { name: 'Filter Campaign' }));
    expect(screen.getAllByRole('radio')).toHaveLength(12);
    await user.type(screen.getByRole('searchbox', { name: 'Search Campaign' }), '11');
    expect(screen.getAllByRole('radio')).toHaveLength(1);
    await user.click(screen.getByRole('radio', { name: 'Campaign 11' }));
    await user.click(screen.getByRole('button', { name: 'Apply' }));
    expect(onApply).toHaveBeenCalledWith(['v10']);
  });
});
