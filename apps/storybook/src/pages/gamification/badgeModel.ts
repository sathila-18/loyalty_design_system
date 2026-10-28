/** Badges members earn (DESIGN.md §8.6, Gamification → Badges), and fake data for the stories. */

/** A badge's icon: the uploaded file's name and where to show it from. */
export interface BadgeIcon {
  fileName: string;
  url: string;
}

export interface Badge {
  id: number;
  name: string;
  icon: BadgeIcon;
  /** Inactive badges are hidden from the badge lists in Add reward and Add focus area (Figma's note). */
  active: boolean;
}

/**
 * A placeholder badge icon for the stories: a coloured disc with the name's first letter, as an SVG data URL. The
 * real icons are uploaded artwork (content, not design), so the stories draw their own.
 */
export function placeholderIcon(name: string, colour: string): BadgeIcon {
  const letter = (name.trim()[0] ?? '?').toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="${colour}"/><text x="24" y="31" font-family="Inter, sans-serif" font-size="22" font-weight="700" text-anchor="middle" fill="#ffffff">${letter}</text></svg>`;
  return { fileName: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`, url: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}` };
}

/** Artwork colours for the placeholders (not design tokens: they stand in for uploaded images). */
const COLOURS = ['#e8a600', '#625bff', '#16a34a', '#dc2626', '#0891b2', '#9333ea', '#ea580c'];

/** Figma's four (`420:49815`), as the screen has them, then more: a long name, inactive ones. */
const NAMES: [string, boolean][] = [
  ['Early adopter', true],
  ['Top server', true],
  ['Streak keeper', true],
  ['Festive 2026', false],
  ['Budget builder', true],
  ['Smart spender', true],
  ['Safe saver', true],
  ['Credit champion', false],
  ['Security star', true],
  ['Loyal member', true],
  ['First transfer', true],
  ['Bill pay pro', true],
  ['Weekend warrior', false],
  ['Five-year customer with every product, every tier and every reward unlocked', true],
  ['Referral hero', true],
  ['Night owl', false],
  ['Big spender', true],
  ['Round-up saver', true],
  ['Travel explorer', true],
  ['Charity champion', true],
];

export const ALL_BADGES: Badge[] = NAMES.map(([name, active], i) => ({ id: i + 1, name, active, icon: placeholderIcon(name, COLOURS[i % COLOURS.length]!) }));

export const FIGMA_BADGES = ALL_BADGES.slice(0, 4);
