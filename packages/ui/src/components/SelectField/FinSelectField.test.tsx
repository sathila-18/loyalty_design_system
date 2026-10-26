import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinSelectField, type FinSelectFieldOption } from './FinSelectField';

const OPTIONS: FinSelectFieldOption[] = [
  { value: 'staff', label: 'Staff' },
  { value: 'vip', label: 'VIP' },
  { value: 'dormant', label: 'Dormant accounts', disabled: true },
  { value: 'regular', label: 'Regular' },
];

const field = () => screen.getByRole('button', { name: /^Segment/ });

describe('FinSelectField', () => {
  it('is a button named by its label and the chosen option, that opens a listbox', () => {
    render(<FinSelectField label="Segment" placeholder="Choose" options={OPTIONS} defaultValue="vip" helperText="Helper" />);
    expect(field()).toHaveAccessibleName('Segment VIP');
    expect(field()).toHaveAttribute('aria-haspopup', 'listbox');
    expect(field()).toHaveAttribute('aria-expanded', 'false');
    expect(field()).toHaveAccessibleDescription('Helper');
  });

  it('shows the placeholder until an option is chosen', () => {
    render(<FinSelectField label="Segment" placeholder="Choose a segment" options={OPTIONS} />);
    expect(field()).toHaveTextContent('Choose a segment');
  });

  it('opens on click, chooses an option, closes and reports it', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FinSelectField label="Segment" placeholder="Choose" options={OPTIONS} onChange={onChange} />);
    expect(screen.getByText('keyboard_arrow_down')).toBeInTheDocument();
    await user.click(field());
    expect(screen.getByRole('listbox', { name: 'Segment' })).toBeInTheDocument();
    expect(screen.getByText('keyboard_arrow_up')).toBeInTheDocument();
    await user.click(screen.getByRole('option', { name: 'Regular' }));
    expect(onChange).toHaveBeenCalledWith('regular');
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(field()).toHaveTextContent('Regular');
    expect(field()).toHaveFocus();
  });

  it('after a mouse-opened menu closes, is quiet (not Focused) until the keyboard is used on it', async () => {
    const user = userEvent.setup();
    render(<FinSelectField label="Segment" options={OPTIONS} />);
    await user.click(field());
    await user.click(screen.getByRole('option', { name: 'VIP' }));
    expect(field()).toHaveFocus();
    expect(field()).toHaveAttribute('data-quiet');
    await user.keyboard('{ArrowDown}');
    expect(field()).not.toHaveAttribute('data-quiet');
    await user.keyboard('{Escape}');
    expect(field()).not.toHaveAttribute('data-quiet');
  });

  it('works with the keyboard: arrow keys open and move, Enter chooses', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FinSelectField label="Segment" options={OPTIONS} onChange={onChange} />);
    await user.tab();
    expect(field()).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenCalledOnce();
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('marks the chosen option Selected and a disabled one as disabled', async () => {
    const user = userEvent.setup();
    render(<FinSelectField label="Segment" options={OPTIONS} defaultValue="staff" />);
    await user.click(field());
    expect(screen.getByRole('option', { name: 'Staff' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('option', { name: 'Dormant accounts' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('is controlled with value and onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FinSelectField label="Segment" options={OPTIONS} value="staff" onChange={onChange} />);
    await user.click(field());
    await user.click(screen.getByRole('option', { name: 'VIP' }));
    expect(onChange).toHaveBeenCalledWith('vip');
    expect(field()).toHaveTextContent('Staff');
  });

  it('sends the chosen value with a form', () => {
    const { container } = render(
      <form>
        <FinSelectField label="Segment" name="segment" options={OPTIONS} defaultValue="vip" />
      </form>,
    );
    expect(new FormData(container.querySelector('form')!).get('segment')).toBe('vip');
  });

  it('is disabled when there are no options, or when disabled', async () => {
    const { rerender } = render(<FinSelectField label="Segment" options={[]} />);
    expect(field()).toBeDisabled();
    rerender(<FinSelectField label="Segment" options={OPTIONS} disabled />);
    expect(field()).toBeDisabled();
  });

  it('filters the options with the search field when searchable', async () => {
    const user = userEvent.setup();
    render(<FinSelectField label="Segment" options={OPTIONS} searchable searchLabel="Search segments" noResultsText="No segments found" />);
    await user.click(field());
    await user.type(screen.getByRole('searchbox', { name: 'Search segments' }), 'reg');
    expect(screen.getAllByRole('option')).toHaveLength(1);
    await user.type(screen.getByRole('searchbox'), 'xyz');
    expect(screen.getByRole('status')).toHaveTextContent('No segments found');
  });

  it('reads the error message with the field, and passes ref to the button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<FinSelectField ref={ref} label="Segment" options={OPTIONS} error helperText="Choose a segment" />);
    expect(ref.current).toBe(field());
    expect(field()).toHaveAccessibleDescription('Choose a segment');
  });
});
