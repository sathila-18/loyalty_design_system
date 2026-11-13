import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { addMonthsToDate, isISODate, longDate, monthGrid, nextRange, weekday } from './calendarDates';
import { FinCalendar } from './FinCalendar';

const TODAY = '2026-08-12';
const day = (name: string) => screen.getByRole('button', { name });

describe('calendar dates', () => {
  it('starts weeks on Monday and always shows six', () => {
    const weeks = monthGrid('2026-08');
    expect(weeks).toHaveLength(6);
    expect(weeks[0]![0]).toBe('2026-07-27');
    expect(weekday('2026-08-03')).toBe(0);
  });

  it('keeps a month move within the month and checks real dates', () => {
    expect(addMonthsToDate('2026-01-31', 1)).toBe('2026-02-28');
    expect(isISODate('2026-02-31')).toBe(false);
    expect(longDate('2026-08-01')).toBe('Saturday, 1 August 2026');
  });

  it('picks a range: a start, then an end (an earlier end swaps them), then starts again', () => {
    expect(nextRange({ from: null, to: null }, '2026-08-10')).toEqual({ from: '2026-08-10', to: null });
    expect(nextRange({ from: '2026-08-10', to: null }, '2026-08-05')).toEqual({ from: '2026-08-05', to: '2026-08-10' });
    expect(nextRange({ from: '2026-08-05', to: '2026-08-10' }, '2026-08-20')).toEqual({ from: '2026-08-20', to: null });
  });
});

describe('FinCalendar', () => {
  it('is a grid named by its month, with weekday headers and named days', () => {
    render(<FinCalendar today={TODAY} />);
    expect(screen.getByRole('grid', { name: 'August 2026' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Mo' })).toHaveAttribute('abbr', 'Monday');
    expect(day('Wednesday, 12 August 2026')).toHaveAttribute('aria-current', 'date');
  });

  it('chooses a date with a click and marks it selected', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FinCalendar today={TODAY} onChange={onChange} />);
    await user.click(day('Saturday, 1 August 2026'));
    expect(onChange).toHaveBeenCalledWith('2026-08-01');
    expect(day('Saturday, 1 August 2026').closest('td')).toHaveAttribute('aria-selected', 'true');
  });

  it('has one day in the tab order: the chosen one', () => {
    render(<FinCalendar today={TODAY} defaultValue="2026-08-20" />);
    expect(day('Thursday, 20 August 2026')).toHaveAttribute('tabindex', '0');
    expect(day('Wednesday, 12 August 2026')).toHaveAttribute('tabindex', '-1');
  });

  it('moves with the keys and changes month at the edges', async () => {
    const user = userEvent.setup();
    render(<FinCalendar today={TODAY} defaultValue="2026-08-31" />);
    day('Monday, 31 August 2026').focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('grid', { name: 'September 2026' })).toBeInTheDocument();
    expect(day('Tuesday, 1 September 2026')).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(day('Tuesday, 25 August 2026')).toHaveFocus();
    await user.keyboard('{Home}');
    expect(day('Monday, 24 August 2026')).toHaveFocus();
    await user.keyboard('{End}');
    expect(day('Sunday, 30 August 2026')).toHaveFocus();
    await user.keyboard('{PageDown}');
    expect(day('Wednesday, 30 September 2026')).toHaveFocus();
    await user.keyboard('{Shift>}{PageUp}{/Shift}');
    expect(day('Tuesday, 30 September 2025')).toHaveFocus();
  });

  it('chooses with Enter', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FinCalendar today={TODAY} onChange={onChange} />);
    day('Wednesday, 12 August 2026').focus();
    await user.keyboard('{ArrowRight}{Enter}');
    expect(onChange).toHaveBeenCalledWith('2026-08-13');
  });

  it('shows the previous and next months with the buttons', async () => {
    const user = userEvent.setup();
    render(<FinCalendar today={TODAY} />);
    await user.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByRole('grid', { name: 'September 2026' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Previous month' }));
    await user.click(screen.getByRole('button', { name: 'Previous month' }));
    expect(screen.getByRole('grid', { name: 'July 2026' })).toBeInTheDocument();
  });

  it("doesn't choose a date outside min / max or ruled out, and stops the month buttons at the limits", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FinCalendar today={TODAY} min="2026-08-05" max="2026-08-25" isDateDisabled={(d) => d === '2026-08-10'} onChange={onChange} />);
    await user.click(day('Monday, 3 August 2026'));
    await user.click(day('Monday, 10 August 2026'));
    expect(onChange).not.toHaveBeenCalled();
    expect(day('Monday, 3 August 2026')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('button', { name: 'Previous month' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next month' })).toBeDisabled();
  });

  it('picks a range with two clicks and marks the days between', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FinCalendar mode="range" today={TODAY} onChange={onChange} />);
    await user.click(day('Monday, 10 August 2026'));
    expect(onChange).toHaveBeenLastCalledWith({ from: '2026-08-10', to: null });
    await user.click(day('Thursday, 13 August 2026'));
    expect(onChange).toHaveBeenLastCalledWith({ from: '2026-08-10', to: '2026-08-13' });
    expect(day('Tuesday, 11 August 2026')).toHaveAttribute('data-in-range');
    expect(day('Tuesday, 11 August 2026').closest('td')).toHaveAttribute('aria-selected', 'true');
    expect(day('Friday, 14 August 2026').closest('td')).toHaveAttribute('aria-selected', 'false');
  });

  it('shows two months side by side, without the other month’s days', () => {
    render(<FinCalendar mode="range" numberOfMonths={2} today={TODAY} />);
    expect(screen.getByRole('grid', { name: 'August 2026' })).toBeInTheDocument();
    expect(screen.getByRole('grid', { name: 'September 2026' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Tuesday, 1 September 2026' })).toHaveLength(1);
  });

  it('works out today itself when not given', () => {
    render(<FinCalendar />);
    expect(screen.getAllByRole('grid')).toHaveLength(1);
    expect(document.querySelector('[aria-current="date"]')).not.toBeNull();
  });
});
