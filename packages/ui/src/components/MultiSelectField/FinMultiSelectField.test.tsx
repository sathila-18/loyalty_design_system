import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinMultiSelectField, type FinMultiSelectFieldOption } from './FinMultiSelectField';

const OPTIONS: FinMultiSelectFieldOption[] = [
  { value: 'slt', label: 'SLT Mobitel' },
  { value: 'dialog', label: 'Dialog' },
  { value: 'abans', label: 'Abans', disabled: true },
  { value: 'hutch', label: 'Hutch' },
];

const field = () => screen.getByRole('button', { name: /^Provider/ });
const chips = (container: HTMLElement) => container.querySelector('[data-part="chips"]');

describe('FinMultiSelectField', () => {
  it('is a button named by its label and every chosen option, that opens a multi-select listbox', () => {
    render(<FinMultiSelectField label="Provider" placeholder="Choose" options={OPTIONS} defaultValue={['slt', 'dialog']} helperText="Helper" />);
    expect(field()).toHaveAccessibleName('Provider SLT Mobitel, Dialog');
    expect(field()).toHaveAttribute('aria-haspopup', 'listbox');
    expect(field()).toHaveAccessibleDescription('Helper');
  });

  it('shows the placeholder until something is chosen, then a chip per option with a ✕', () => {
    const { container, rerender } = render(<FinMultiSelectField label="Provider" placeholder="Choose providers" options={OPTIONS} value={[]} />);
    expect(field()).toHaveTextContent('Choose providers');
    expect(chips(container)).toBeNull();
    rerender(<FinMultiSelectField label="Provider" placeholder="Choose providers" options={OPTIONS} value={['slt', 'hutch']} />);
    const row = within(chips(container) as HTMLElement);
    expect(row.getByRole('button', { name: 'Remove SLT Mobitel' })).toBeInTheDocument();
    expect(row.getByRole('button', { name: 'Remove Hutch' })).toBeInTheDocument();
    expect(container.querySelector('[data-part="chips"] [data-variant]')).toHaveAttribute('data-variant', 'unselected-border');
  });

  it('ticks and unticks options; the menu stays open', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FinMultiSelectField label="Provider" options={OPTIONS} defaultValue={['slt']} onChange={onChange} />);
    await user.click(field());
    const list = screen.getByRole('listbox', { name: 'Provider' });
    expect(list).toHaveAttribute('aria-multiselectable', 'true');
    expect(within(list).getByRole('option', { name: 'SLT Mobitel' })).toHaveAttribute('aria-selected', 'true');
    await user.click(within(list).getByRole('option', { name: 'Dialog' }));
    expect(onChange).toHaveBeenLastCalledWith(['slt', 'dialog']);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await user.click(within(list).getByRole('option', { name: 'SLT Mobitel' }));
    expect(onChange).toHaveBeenLastCalledWith(['dialog']);
    await user.click(within(list).getByRole('option', { name: 'Abans' }));
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('works with the keyboard: arrow keys open and move, Space and Enter tick, Escape closes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FinMultiSelectField label="Provider" options={OPTIONS} onChange={onChange} />);
    field().focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: 'SLT Mobitel' })).toHaveFocus();
    await user.keyboard(' ');
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenLastCalledWith(['slt', 'dialog']);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(field()).toHaveFocus();
  });

  it("removes an option with its chip's ✕ and puts focus back on the field", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FinMultiSelectField label="Provider" options={OPTIONS} defaultValue={['slt', 'dialog']} onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'Remove SLT Mobitel' }));
    expect(onChange).toHaveBeenCalledWith(['dialog']);
    expect(field()).toHaveAccessibleName('Provider Dialog');
    expect(field()).toHaveFocus();
  });

  it('sends each chosen value with the form under `name`', () => {
    const { container } = render(
      <form>
        <FinMultiSelectField label="Provider" name="provider" options={OPTIONS} defaultValue={['slt', 'hutch']} />
      </form>,
    );
    expect(new FormData(container.querySelector('form')!).getAll('provider')).toEqual(['slt', 'hutch']);
  });

  it('is disabled with no options or `disabled`, its chips too; the ref goes to the button', () => {
    const ref = createRef<HTMLButtonElement>();
    const { unmount } = render(<FinMultiSelectField ref={ref} label="Provider" options={[]} />);
    expect(field()).toBeDisabled();
    expect(ref.current).toBe(field());
    unmount();
    render(<FinMultiSelectField label="Provider" options={OPTIONS} defaultValue={['slt']} disabled />);
    expect(field()).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Remove SLT Mobitel' })).toBeDisabled();
  });

  it('filters the menu with `searchable`', async () => {
    const user = userEvent.setup();
    render(<FinMultiSelectField label="Provider" options={OPTIONS} searchable />);
    await user.click(field());
    await user.type(screen.getByRole('searchbox', { name: 'Search' }), 'dia');
    const shown = screen.getAllByRole('option');
    expect(shown).toHaveLength(1);
    expect(shown[0]).toHaveAccessibleName('Dialog');
  });
});
