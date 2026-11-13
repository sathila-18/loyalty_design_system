/**
 * Date maths for FinCalendar. Dates are ISO strings (YYYY-MM-DD) and months are YYYY-MM, as FinDateField's; all the
 * maths is in UTC, so nothing depends on the viewer's time zone. ISO strings sort as dates, so `<` compares them.
 * Names are English and fixed (no locale formatting during render, so the server and the client agree).
 */

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

/** Monday first (decided by design 13 Nov 2026). */
export const WEEKDAYS = [
  { short: 'Mo', long: 'Monday' },
  { short: 'Tu', long: 'Tuesday' },
  { short: 'We', long: 'Wednesday' },
  { short: 'Th', long: 'Thursday' },
  { short: 'Fr', long: 'Friday' },
  { short: 'Sa', long: 'Saturday' },
  { short: 'Su', long: 'Sunday' },
] as const;

const pad = (n: number, length = 2) => String(n).padStart(length, '0');

const toUTC = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number) as [number, number, number];
  return new Date(Date.UTC(y, m - 1, d));
};

const fromUTC = (date: Date) => `${pad(date.getUTCFullYear(), 4)}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;

/** A whole, real ISO date ("2026-02-31" isn't). */
export function isISODate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return fromUTC(toUTC(value)) === value;
}

/** The viewer's today, in their own time zone. Only call it in an effect or an event handler. */
export function localToday(): string {
  const now = new Date();
  return `${pad(now.getFullYear(), 4)}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export const monthOf = (iso: string) => iso.slice(0, 7);

export function addDays(iso: string, days: number): string {
  const date = toUTC(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return fromUTC(date);
}

export function addMonths(month: string, count: number): string {
  const [y, m] = month.split('-').map(Number) as [number, number];
  const date = new Date(Date.UTC(y, m - 1 + count, 1));
  return fromUTC(date).slice(0, 7);
}

export function daysInMonth(month: string): number {
  const [y, m] = month.split('-').map(Number) as [number, number];
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

/** The same day of the month, `count` months on, kept within the month (31 Jan + 1 month → 28/29 Feb). */
export function addMonthsToDate(iso: string, count: number): string {
  const month = addMonths(monthOf(iso), count);
  const day = Math.min(Number(iso.slice(8, 10)), daysInMonth(month));
  return `${month}-${pad(day)}`;
}

/** 0 for Monday … 6 for Sunday. */
export const weekday = (iso: string) => (toUTC(iso).getUTCDay() + 6) % 7;

export const startOfWeek = (iso: string) => addDays(iso, -weekday(iso));
export const endOfWeek = (iso: string) => addDays(iso, 6 - weekday(iso));

/** Six weeks of dates, from the Monday on or before the 1st (always six, so the calendar never changes height). */
export function monthGrid(month: string): string[][] {
  let day = startOfWeek(`${month}-01`);
  const weeks: string[][] = [];
  for (let w = 0; w < 6; w += 1) {
    const week: string[] = [];
    for (let d = 0; d < 7; d += 1) {
      week.push(day);
      day = addDays(day, 1);
    }
    weeks.push(week);
  }
  return weeks;
}

/** "August 2026". */
export function monthTitle(month: string): string {
  return `${MONTH_NAMES[Number(month.slice(5, 7)) - 1]} ${Number(month.slice(0, 4))}`;
}

/** "Saturday, 1 August 2026": a day button's name. */
export function longDate(iso: string): string {
  return `${WEEKDAYS[weekday(iso)]!.long}, ${Number(iso.slice(8, 10))} ${monthTitle(monthOf(iso))}`;
}

/** A range of dates, as YYYY-MM-DD; `to` is `null` while only the start is chosen. */
export interface FinDateRange {
  from: string | null;
  to: string | null;
}

/** The next pick in a range: a start, then an end (an earlier end swaps them); a whole range starts again. */
export function nextRange(range: FinDateRange, date: string): FinDateRange {
  if (!range.from || range.to) return { from: date, to: null };
  return date < range.from ? { from: date, to: range.from } : { from: range.from, to: date };
}
