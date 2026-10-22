import { finDialCodes } from '../../flags/finDialCodes';
import { finFlags, type FinFlagCountry } from '../../flags/finFlags';

/** Every country with a dial code (the ones a phone number can have), sorted by name. */
export const FIN_PHONE_COUNTRIES = (Object.keys(finFlags) as FinFlagCountry[])
  .filter((code) => finDialCodes[code] !== undefined)
  .sort((a, b) => finFlags[a].localeCompare(finFlags[b], 'en'));

/**
 * How well a country matches what's typed in the country search (decided 22 Oct 2026), or `null` when it doesn't: its
 * name from the start (0: "uni" → United Kingdom), its ISO code ("lk") or dial code ("94" or "+94", from the start)
 * (1), a word in its name from the start (2: "kingdom"), or anywhere in its name (3: "lanka"). Case and spaces don't
 * matter. Lower is better; the search lists the best first, alphabetical within each.
 */
export function countryMatchRank(code: FinFlagCountry, query: string): number | null {
  const q = query.trim().toLowerCase();
  if (q === '') return 0;
  const name = finFlags[code].toLowerCase();
  if (name.startsWith(q)) return 0;
  const digits = q.replace(/^\+/, '').replace(/\s/g, '');
  const dial = finDialCodes[code]?.replace(/^\+/, '');
  if (code.toLowerCase() === q || (/^\d+$/.test(digits) && dial !== undefined && dial.startsWith(digits))) return 1;
  if (name.split(/[\s(-]+/).some((word) => word.startsWith(q))) return 2;
  if (name.includes(q)) return 3;
  return null;
}

/** The countries matching what's typed, best match first (see countryMatchRank). */
export function searchCountries(query: string): FinFlagCountry[] {
  return FIN_PHONE_COUNTRIES.map((code) => ({ code, rank: countryMatchRank(code, query) }))
    .filter((match): match is { code: FinFlagCountry; rank: number } => match.rank !== null)
    .sort((a, b) => a.rank - b.rank)
    .map((match) => match.code);
}
