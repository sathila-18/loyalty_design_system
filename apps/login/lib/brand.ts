// The brand and theme for this deployment (NEXTJS-USAGE.md §4: one site per bank, set once on <html>).
// Set FIN_BRAND / FIN_THEME in the environment (.env.local, or the shell); the defaults match Figma.
const BRANDS = ['finspace', 'burgundy', 'sampath'] as const;
const THEMES = ['light', 'dark'] as const;
export type Brand = (typeof BRANDS)[number];
export type Theme = (typeof THEMES)[number];

const pick = <T extends string>(value: string | undefined, allowed: readonly T[], fallback: T): T =>
  allowed.includes(value as T) ? (value as T) : fallback;

export const BRAND: Brand = pick(process.env.FIN_BRAND, BRANDS, 'finspace');
export const THEME: Theme = pick(process.env.FIN_THEME, THEMES, 'light');
