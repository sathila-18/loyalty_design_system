import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinDateField } from './FinDateField';

describe('FinDateField', () => {
  it('is a text field named by its label, with a DD/MM/YYYY placeholder and a calendar button', () => {
    render(<FinDateField label="Start date" />);
    const input = screen.getByRole('textbox', { name: 'Start date' });
    expect(input).toHaveAttribute('placeholder', 'DD/MM/YYYY');
    expect(input).toHaveAttribute('inputmode', 'numeric');
    expect(screen.getByRole('button', { name: 'Choose date' })).toBeInTheDocument();
  });

  it('adds the slashes while typing and reports the ISO date once it is whole', async () => {
    const onChange = vi.fn();
    render(<FinDateField label="Start date" onChange={onChange} />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, '0108202');
    expect(input).toHaveValue('01/08/202');
    expect(onChange).toHaveBeenLastCalledWith(null);
    await userEvent.type(input, '6');
    expect(input).toHaveValue('01/08/2026');
    expect(onChange).toHaveBeenLastCalledWith('2026-08-01');
  });

  it('shows the date it starts with, and a new value from the page', () => {
    const { rerender } = render(<FinDateField label="End date" value="2027-08-01" />);
    expect(screen.getByRole('textbox')).toHaveValue('01/08/2027');
    rerender(<FinDateField label="End date" value="2027-12-31" />);
    expect(screen.getByRole('textbox')).toHaveValue('31/12/2027');
    rerender(<FinDateField label="End date" value={null} />);
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('keeps what is typed when controlled', async () => {
    function Controlled() {
      const [date, setDate] = useState<string | null>(null);
      return <FinDateField label="Start date" value={date} onChange={setDate} />;
    }
    render(<Controlled />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, '31122026');
    expect(input).toHaveValue('31/12/2026');
  });

  it('shows its own error when left with a date that is not whole or real, and clears it on typing', async () => {
    render(<FinDateField label="Start date" helperText="The first day it can be claimed" />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, '31022026');
    await userEvent.tab();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Enter a date as DD/MM/YYYY');
    await userEvent.type(input, '{Backspace}');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(input).toHaveAccessibleDescription('The first day it can be claimed');
  });

  it('checks min and max when left, with the dates as shown', async () => {
    render(<FinDateField label="End date" min="2026-08-01" max="2027-08-01" />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, '01072026');
    await userEvent.tab();
    expect(input).toHaveAccessibleDescription('Choose a date from 01/08/2026');
    await userEvent.clear(input);
    await userEvent.type(input, '02082027');
    await userEvent.tab();
    expect(input).toHaveAccessibleDescription('Choose a date until 01/08/2027');
  });

  it('lets the page own the error and the messages', async () => {
    const { rerender } = render(<FinDateField label="End date" error helperText="End date is before the start date" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('End date is before the start date');
    rerender(<FinDateField label="End date" messages={{ invalid: 'Use DD/MM/YYYY' }} />);
    await userEvent.type(input, '12');
    await userEvent.tab();
    expect(input).toHaveAccessibleDescription('Use DD/MM/YYYY');
  });

  it('fills the field from the browser picker, and keeps the hidden picker out of the way', () => {
    const onChange = vi.fn();
    const { container } = render(<FinDateField label="Start date" onChange={onChange} min="2026-01-01" />);
    const native = container.querySelector('input[type="date"]') as HTMLInputElement;
    expect(native).toHaveAttribute('tabindex', '-1');
    expect(native).toHaveAttribute('aria-hidden', 'true');
    expect(native).toHaveAttribute('min', '2026-01-01');
    fireEvent.change(native, { target: { value: '2026-08-01' } });
    expect(screen.getByRole('textbox')).toHaveValue('01/08/2026');
    expect(onChange).toHaveBeenLastCalledWith('2026-08-01');
  });

  it('opens the picker from the calendar button, and is fully disabled when disabled', async () => {
    const { container, rerender } = render(<FinDateField label="Start date" />);
    const native = container.querySelector('input[type="date"]') as HTMLInputElement & { showPicker: () => void };
    native.showPicker = vi.fn();
    await userEvent.click(screen.getByRole('button', { name: 'Choose date' }));
    expect(native.showPicker).toHaveBeenCalled();
    rerender(<FinDateField label="Start date" disabled pickerLabel="Pick a start date" />);
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Pick a start date' })).toBeDisabled();
  });

  it('keeps the rest of the format behind the digits while typing', async () => {
    const { container } = render(<FinDateField label="Start date" />);
    const hint = () => container.querySelector('[aria-hidden="true"]:has(> span)') as HTMLElement;
    expect(hint()).toHaveTextContent(/^DD\/MM\/YYYY$/);
    await userEvent.type(screen.getByRole('textbox'), '010');
    expect(hint().lastChild?.textContent).toBe('M/YYYY');
    expect(hint().firstElementChild).toHaveTextContent('01/0');
  });
});
