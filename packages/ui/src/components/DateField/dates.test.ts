import { describe, expect, it } from 'vitest';
import { formatDate, maskDate, parseDate } from './dates';

describe('dates', () => {
  it('masks digits as DD/MM/YYYY as they are typed, ignoring other characters', () => {
    expect(maskDate('0')).toBe('0');
    expect(maskDate('010')).toBe('01/0');
    expect(maskDate('01082026')).toBe('01/08/2026');
    expect(maskDate('01.08.2026')).toBe('01/08/2026');
    expect(maskDate('010820261')).toBe('01/08/2026');
  });

  it('parses whole, real dates only', () => {
    expect(parseDate('01/08/2026')).toBe('2026-08-01');
    expect(parseDate('29/02/2028')).toBe('2028-02-29');
    expect(parseDate('29/02/2026')).toBeNull();
    expect(parseDate('31/04/2026')).toBeNull();
    expect(parseDate('01/13/2026')).toBeNull();
    expect(parseDate('01/08/20')).toBeNull();
    expect(parseDate('')).toBeNull();
  });

  it('formats ISO dates for the field', () => {
    expect(formatDate('2027-08-01')).toBe('01/08/2027');
    expect(formatDate('')).toBe('');
    expect(formatDate(null)).toBe('');
    expect(formatDate('August')).toBe('');
  });
});
