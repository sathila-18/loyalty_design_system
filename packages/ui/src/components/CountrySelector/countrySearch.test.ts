import { describe, expect, it } from 'vitest';
import { countryMatchRank, FIN_PHONE_COUNTRIES, searchCountries } from './countrySearch';

describe('country search', () => {
  it('lists every country with a dial code, sorted by name', () => {
    expect(FIN_PHONE_COUNTRIES.length).toBeGreaterThan(200);
    expect(FIN_PHONE_COUNTRIES.indexOf('LK')).toBeLessThan(FIN_PHONE_COUNTRIES.indexOf('SD'));
    expect(FIN_PHONE_COUNTRIES).not.toContain('AQ');
  });

  it('matches by name, ISO code or dial code, ignoring case and spaces', () => {
    expect(countryMatchRank('LK', 'Sri')).toBe(0);
    expect(countryMatchRank('LK', ' lk ')).toBe(1);
    expect(countryMatchRank('LK', '+94')).toBe(1);
    expect(countryMatchRank('LK', '94')).toBe(1);
    expect(countryMatchRank('GB', 'kingdom')).toBe(2);
    expect(countryMatchRank('LK', 'anka')).toBe(3);
    expect(countryMatchRank('LK', 'france')).toBeNull();
    expect(countryMatchRank('LK', '')).toBe(0);
  });

  it('lists names starting with the text first', () => {
    const found = searchCountries('uni');
    expect(found.slice(0, 3)).toEqual(['AE', 'GB', 'US']);
    expect(found).toContain('TN');
    expect(found.indexOf('TN')).toBeGreaterThan(found.indexOf('US'));
  });
});
