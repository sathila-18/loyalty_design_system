import { oklchToRgb, toHex as rgbToHex } from '@finspace-loyalty/tokens/custom-brand';

/** `oklch(L C H)` (the custom brand's computed colours) → `#rrggbb`, with the browser's gamut mapping. */
function oklchHex(css: string): string | null {
  const m = /^oklch\(([^)]+)\)$/.exec(css);
  if (!m) return null;
  const [l = '0', c = '0', h = '0'] = m[1]!.split('/')[0]!.trim().split(/\s+/);
  const n = (v: string, scale = 1) => (v === 'none' ? 0 : v.endsWith('%') ? (parseFloat(v) / 100) * scale : parseFloat(v));
  return rgbToHex(oklchToRgb({ l: n(l), c: n(c, 0.4), h: n(h) }));
}

/** Turns a computed color (`rgb()`, `rgba()`, `color(srgb …)` or `oklch()`) into `#rrggbb` or `#rrggbbaa`. */
export function toHex(css: string): string {
  const oklch = oklchHex(css);
  if (oklch) return oklch;
  let channels: number[] | undefined;
  const rgb = /^rgba?\(([^)]+)\)$/.exec(css);
  const srgb = /^color\(srgb ([^)]+)\)$/.exec(css);
  if (rgb) {
    const [r = 0, g = 0, b = 0, a = 1] = rgb[1]!.split(/[\s,/]+/).filter(Boolean).map(Number);
    channels = [r, g, b, a * 255];
  } else if (srgb) {
    const [r = 0, g = 0, b = 0, a = 1] = srgb[1]!.split(/[\s/]+/).filter(Boolean).map(Number);
    channels = [r * 255, g * 255, b * 255, a * 255];
  }
  if (!channels) return css;
  const hex = channels.map((c) => Math.round(c).toString(16).padStart(2, '0'));
  return `#${hex.slice(0, 3).join('')}${hex[3] === 'ff' ? '' : hex[3]}`;
}

/** `var(--fin-bg-primary)` → `--fin-bg-primary` */
export const varName = (ref: string) => ref.replace(/^var\((.+)\)$/, '$1');
