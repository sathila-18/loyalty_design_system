import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FinDatePicker, FinDateRangePicker } from './FinDatePicker';

const TODAY = '2026-08-12';
const day = (name: string) => screen.getByRole('button', { name });

describe('FinDatePicker', () => {
  it('is a button named by its label and the date, that opens a dialog', () => {
    render(<FinDatePicker label="Start date" today={TODAY} defaultValue="2026-08-01" helperText="Helper" />);
    const field = screen.getByRole('button', { name: /^Start date/ });
    expect(field).toHaveAccessibleName('Start date 01/08/2026');
    expect(field).toHaveAttribute('aria-haspopup', 'dialog');
    expect(field).toHaveAccessibleDescription('Helper');
  });

  it('shows the placeholder until a date is chosen', () => {
    render(<FinDatePicker label="Start date" today={TODAY} />);
    expect(screen.getByRole('button', { name: /^Start date/ })).toHaveTextContent('Pick a date');
  });

  it('opens on the chosen day, chooses a date, closes and reports it', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FinDatePicker label="Start date" today={TODAY} defaultValue="2026-08-01" onChange={onChange} name="start" />);
    await user.click(screen.getByRole('button', { name: /^Start date/ }));
    expect(screen.getByRole('dialog', { name: 'Start date' })).toBeInTheDocument();
    expect(day('Saturday, 1 August 2026')).toHaveFocus();
    await user.click(day('Friday, 14 August 2026'));
    expect(onChange).toHaveBeenCalledWith('2026-08-14');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('button', { name: /^Start date/ })).toHaveTextContent('14/08/2026');
    expect(document.querySelector('input[name="start"]')).toHaveValue('2026-08-14');
  });

  it('works with the keyboard: Enter opens on today, the arrows move, Enter chooses, Escape closes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FinDatePicker label="Start date" today={TODAY} onChange={onChange} />);
    screen.getByRole('button', { name: /^Start date/ }).focus();
    await user.keyboard('{Enter}');
    expect(day('Wednesday, 12 August 2026')).toHaveFocus();
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenCalledWith('2026-08-19');
    await user.keyboard('{Enter}');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('button', { name: /^Start date/ })).toHaveFocus();
  });

  it("can't be opened when disabled", async () => {
    const user = userEvent.setup();
    render(<FinDatePicker label="Start date" today={TODAY} disabled />);
    await user.click(screen.getByRole('button', { name: /^Start date/ }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

describe('FinDateRangePicker', () => {
  it('shows the range with an en dash, and two months when open', async () => {
    const user = userEvent.setup();
    render(<FinDateRangePicker label="Campaign dates" today={TODAY} defaultValue={{ from: '2026-08-20', to: '2026-09-04' }} />);
    const field = screen.getByRole('button', { name: /^Campaign dates/ });
    expect(field).toHaveTextContent('20/08/2026 – 04/09/2026');
    await user.click(field);
    expect(screen.getAllByRole('grid')).toHaveLength(2);
  });

  it('reports only a whole range, then closes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FinDateRangePicker label="Campaign dates" today={TODAY} onChange={onChange} fromName="from" toName="to" />);
    await user.click(screen.getByRole('button', { name: /^Campaign dates/ }));
    await user.click(day('Monday, 10 August 2026'));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(day('Thursday, 3 September 2026'));
    expect(onChange).toHaveBeenCalledWith({ from: '2026-08-10', to: '2026-09-03' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.querySelector('input[name="from"]')).toHaveValue('2026-08-10');
    expect(document.querySelector('input[name="to"]')).toHaveValue('2026-09-03');
  });

  it('goes back to the range it had when closed after only a start', async () => {
    const user = userEvent.setup();
    render(<FinDateRangePicker label="Campaign dates" today={TODAY} defaultValue={{ from: '2026-08-20', to: '2026-09-04' }} />);
    await user.click(screen.getByRole('button', { name: /^Campaign dates/ }));
    await user.click(day('Monday, 10 August 2026'));
    await user.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: /^Campaign dates/ })).toHaveTextContent('20/08/2026 – 04/09/2026');
  });
});
