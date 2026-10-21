import { getCountries, getCountryCallingCode, type CountryCode } from 'libphonenumber-js';
import { describe, expect, it } from 'vitest';
import { finDialCodes } from './finDialCodes';
import { finFlags } from './finFlags';

describe('finDialCodes', () => {
  it('matches libphonenumber-js for every flag country (rerun `pnpm dial-codes` if not)', () => {
    const library = new Set<string>(getCountries());
    const expected = Object.fromEntries(
      Object.keys(finFlags)
        .filter((code) => library.has(code))
        .map((code) => [code, `+${getCountryCallingCode(code as CountryCode)}`]),
    );
    expect(finDialCodes).toEqual(expected);
  });

  it('has Sri Lanka, as Figma', () => {
    expect(finDialCodes.LK).toBe('+94');
  });
});
