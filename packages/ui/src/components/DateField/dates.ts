/**
 * Dates for FinDateField: the field shows DD/MM/YYYY (decided by design 27 Oct 2026; Figma's screens use dots); code
 * passes ISO dates (YYYY-MM-DD), as a native date input does.
 */

const pad = (n: number, length = 2) => String(n).padStart(length, '0');

/** The digits typed, as DD/MM/YYYY so far: "0108" → "01/08", "01082026" → "01/08/2026". At most 8 digits. */
export function maskDate(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join('/');
}

/** DD/MM/YYYY → YYYY-MM-DD, or null when it's incomplete or not a real date (31/02/2026). */
export function parseDate(text: string): string | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
  if (!match) return null;
  const [day, month, year] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(Date.UTC(year, month - 1, day));
  if (year < 1000 || date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return `${pad(year, 4)}-${pad(month)}-${pad(day)}`;
}

/** YYYY-MM-DD → DD/MM/YYYY ("" for anything else). */
export function formatDate(iso: string | null | undefined): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? '');
  return match ? `${match[3]}/${match[2]}/${match[1]}` : '';
}
