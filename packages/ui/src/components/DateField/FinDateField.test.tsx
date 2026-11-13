import { render, screen } from '@testing-library/react';
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

  it('opens our calendar from the calendar button, on the typed date, and fills the field from it', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FinDateField label="Start date" today="2026-08-12" defaultValue="2026-08-01" onChange={onChange} />);
    const button = screen.getByRole('button', { name: 'Choose date' });
    expect(button).toHaveAttribute('aria-haspopup', 'dialog');
    await user.click(button);
    expect(screen.getByRole('dialog', { name: 'Choose date' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Saturday, 1 August 2026' })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Friday, 14 August 2026' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('textbox')).toHaveValue('14/08/2026');
    expect(onChange).toHaveBeenLastCalledWith('2026-08-14');
    // Focus goes back to the text, not the calendar button (decided by design 13 Nov 2026).
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('greys out dates outside min and max in the calendar', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FinDateField label="End date" today="2026-08-12" min="2026-08-05" onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'Choose date' }));
    const early = screen.getByRole('button', { name: 'Monday, 3 August 2026' });
    expect(early).toHaveAttribute('aria-disabled', 'true');
    await user.click(early);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('works with the keyboard: Enter opens on today, the arrows move, Escape returns to the text', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FinDateField label="Start date" today="2026-08-12" onChange={onChange} />);
    screen.getByRole('button', { name: 'Choose date' }).focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: 'Wednesday, 12 August 2026' })).toHaveFocus();
    await user.keyboard('{ArrowRight}{Enter}');
    expect(onChange).toHaveBeenLastCalledWith('2026-08-13');
    expect(screen.getByRole('textbox')).toHaveFocus();
    screen.getByRole('button', { name: 'Choose date' }).focus();
    await user.keyboard('{Enter}');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it("doesn't flag a half-typed date while the calendar is open", async () => {
    const user = userEvent.setup();
    render(<FinDateField label="Start date" today="2026-08-12" />);
    await user.type(screen.getByRole('textbox'), '0108');
    await user.click(screen.getByRole('button', { name: 'Choose date' }));
    expect(screen.queryByText('Enter a date as DD/MM/YYYY')).toBeNull();
  });

  it('is fully disabled when disabled', async () => {
    const user = userEvent.setup();
    render(<FinDateField label="Start date" disabled pickerLabel="Pick a start date" />);
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Pick a start date' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Pick a start date' }));
    expect(screen.queryByRole('dialog')).toBeNull();
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
