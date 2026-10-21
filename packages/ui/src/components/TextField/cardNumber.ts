import type { FinPaymentMethod } from '../../payment/finPaymentMethods';

/**
 * The card brands FinTextField's Payment field recognises from the number's first digits (their issuer ranges), each
 * with how its number is grouped. Only the card brands in finPaymentMethods; anything else is the default card.
 * Checked in order, so the narrower ranges come first.
 */
const BRANDS: { method: FinPaymentMethod; prefixes: (string | [number, number])[]; groups: number[] }[] = [
  { method: 'amex', prefixes: ['34', '37'], groups: [4, 6, 5] },
  { method: 'dinersclub', prefixes: ['36', '38', '39', [300, 305]], groups: [4, 6, 4] },
  { method: 'discover', prefixes: ['6011', [644, 649], '65'], groups: [4, 4, 4, 4, 3] },
  { method: 'maestro', prefixes: ['5018', '5020', '5038', '5893', '6304', '6759', '6761', '6762', '6763'], groups: [4, 4, 4, 4, 3] },
  { method: 'mastercard', prefixes: [[51, 55], [2221, 2720]], groups: [4, 4, 4, 4] },
  { method: 'unionpay', prefixes: ['62', '81'], groups: [4, 4, 4, 4, 3] },
  { method: 'visa', prefixes: ['4'], groups: [4, 4, 4, 4, 3] },
];

const DEFAULT_GROUPS = [4, 4, 4, 4, 3];

const matches = (digits: string, prefix: string | [number, number]) => {
  if (typeof prefix === 'string') return digits.startsWith(prefix);
  const [from, to] = prefix;
  const length = String(from).length;
  if (digits.length < length) return false;
  const start = Number(digits.slice(0, length));
  return start >= from && start <= to;
};

const brandOf = (digits: string) => BRANDS.find((brand) => brand.prefixes.some((prefix) => matches(digits, prefix)));

/** The card's brand from its digits, or `default` until it's known (or for a brand without a logo). */
export const cardBrand = (digits: string): FinPaymentMethod => brandOf(digits)?.method ?? 'default';

/** Only the digits of what was typed or pasted, at most as many as the brand's number has. */
export const cardDigits = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  const groups = brandOf(digits)?.groups ?? DEFAULT_GROUPS;
  return digits.slice(0, groups.reduce((sum, group) => sum + group, 0));
};

/** The number in the brand's groups, a space between them: `4242 4242 4242 4242`, `3782 822463 10005`. */
export const formatCardNumber = (value: string): string => {
  const digits = cardDigits(value);
  const groups = brandOf(digits)?.groups ?? DEFAULT_GROUPS;
  const parts: string[] = [];
  let start = 0;
  for (const group of groups) {
    if (start >= digits.length) break;
    parts.push(digits.slice(start, start + group));
    start += group;
  }
  return parts.join(' ');
};
