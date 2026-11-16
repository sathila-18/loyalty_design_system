/**
 * The custom brand (DESIGN.md §3.12): one admin-chosen colour, `--fin-custom-primary`, generates the Primary scale
 * (50–900) and the Primary dark group with CSS relative colour syntax. This file is the single definition: build.ts
 * writes the CSS from it, and `checkBrandColor` and the Storybook page compute the same colours from it in JS.
 *
 * Every step takes only the input's hue and (scaled, capped) chroma: `oklch(from <input> L min(calc(c * k), cap) h)`.
 * Most steps have a fixed lightness L, so contrast holds for any hue. Step 500 and dark-fill keep the input's own
 * lightness, clamped to [LMIN, LMAX]: LMAX is the highest lightness where white text (and action text on the Light
 * panels) passes 4.5:1 for every hue; 600 / 700 and the dark fills' hover and press are fixed steps darker.
 * Proven for 58 inputs × 5 input lightnesses under both clipping and CSS gamut mapping (DESIGN.md §3.12).
 */

/** The CSS custom property the app sets (on `<html>`, with `data-brand="custom"`). */
export const CUSTOM_PRIMARY_PROPERTY = '--fin-custom-primary';
/** Used when the property isn't set: Finspace's primary. */
export const CUSTOM_PRIMARY_FALLBACK = '#625bff';
/** The CSS fallback, as a token so the generated CSS has no raw colour. */
const FALLBACK_VAR = 'var(--fin-palette-electric-indigo-500)';

/** Step 500 / dark-fill lightness range (OKLCH L). */
export const LMIN = 0.3;
export const LMAX = 0.47;
/** A colour moved less than this (OKLab ΔE) looks the same: below it, `adjusted` is false. */
export const JND = 0.02;

/** A step: a fixed lightness `l`, or `delta` from the clamped input lightness; chroma = min(c × k, cap). */
export type CustomStep = ({ l: number } | { delta: number }) & { k: number; cap: number };

export const CUSTOM_SCALE = {
  '50': { l: 0.97, k: 0.12, cap: 0.03 },
  '100': { l: 0.93, k: 0.3, cap: 0.06 },
  '200': { l: 0.87, k: 0.5, cap: 0.1 },
  '300': { l: 0.78, k: 0.75, cap: 0.14 },
  '400': { l: 0.58, k: 0.9, cap: 0.18 },
  '500': { delta: 0, k: 1, cap: 0.2 },
  '600': { delta: -0.05, k: 1, cap: 0.2 },
  '700': { delta: -0.11, k: 0.95, cap: 0.18 },
  '800': { l: 0.3, k: 0.85, cap: 0.15 },
  '900': { l: 0.24, k: 0.7, cap: 0.12 },
} as const satisfies Record<string, CustomStep>;

export const CUSTOM_DARK = {
  action: { l: 0.8, k: 0.8, cap: 0.14 },
  hovered: { l: 0.85, k: 0.6, cap: 0.11 },
  pressed: { l: 0.9, k: 0.4, cap: 0.08 },
  focus: { l: 0.74, k: 0.8, cap: 0.15 },
  fill: { delta: 0, k: 1, cap: 0.2 },
  'fill-hovered': { delta: -0.05, k: 1, cap: 0.2 },
  'fill-pressed': { delta: -0.11, k: 0.95, cap: 0.18 },
} as const satisfies Record<string, CustomStep>;

export type CustomScaleStep = keyof typeof CUSTOM_SCALE;
export type CustomDarkStep = keyof typeof CUSTOM_DARK;

// ---------------------------------------------------------------------------
// CSS
// ---------------------------------------------------------------------------

const num = (n: number) => String(Number(n.toFixed(4)));

/** The CSS value of a step: `oklch(from var(--fin-custom-primary, …) L min(calc(c * k), cap) h)`. */
export function customStepCss(step: CustomStep): string {
  const clamped = `clamp(${num(LMIN)}, l, ${num(LMAX)})`;
  const l = 'l' in step ? num(step.l) : step.delta === 0 ? clamped : `calc(${clamped} - ${num(-step.delta)})`;
  return `oklch(from var(${CUSTOM_PRIMARY_PROPERTY}, ${FALLBACK_VAR}) ${l} min(calc(c * ${num(step.k)}), ${num(step.cap)}) h)`;
}

// ---------------------------------------------------------------------------
// Colour maths (OKLab, Björn Ottosson; WCAG 2 contrast). sRGB in 0–1.
// ---------------------------------------------------------------------------

type Rgb = [number, number, number];
export interface Oklch {
  l: number;
  c: number;
  h: number;
}

const toLinear = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const toGamma = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);

/** `#rgb` or `#rrggbb` → sRGB (0–1), or null. */
export function parseHex(hex: string): Rgb | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const h = m[1]!.length === 3 ? [...m[1]!].map((x) => x + x).join('') : m[1]!;
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as Rgb;
}

export function toHex(rgb: Rgb): string {
  return `#${rgb.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, '0')).join('')}`;
}

export function rgbToOklch(rgb: Rgb): Oklch {
  const [r, g, b] = rgb.map(toLinear) as Rgb;
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { l: L, c: Math.hypot(A, B), h: ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360 };
}

/** OKLCH → linear sRGB (may be out of 0–1). */
function oklchToLinear({ l: L, c, h }: Oklch): Rgb {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

const inGamut = (rgb: Rgb) => rgb.every((v) => v >= -1e-6 && v <= 1 + 1e-6);

/** OKLCH → sRGB, out-of-gamut colours brought in by lowering chroma at the same L and h (CSS Color 4). */
export function oklchToRgb(color: Oklch): Rgb {
  if (color.l >= 1) return [1, 1, 1];
  if (color.l <= 0) return [0, 0, 0];
  let lin = oklchToLinear(color);
  if (!inGamut(lin)) {
    let lo = 0;
    let hi = color.c;
    for (let i = 0; i < 32; i++) {
      const mid = (lo + hi) / 2;
      if (inGamut(oklchToLinear({ ...color, c: mid }))) lo = mid;
      else hi = mid;
    }
    lin = oklchToLinear({ ...color, c: lo });
  }
  return lin.map((v) => toGamma(Math.min(1, Math.max(0, v)))) as Rgb;
}

/** WCAG 2 relative luminance of an sRGB colour. */
export function luminance(rgb: Rgb): number {
  const [r, g, b] = rgb.map(toLinear) as Rgb;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2 contrast ratio between two hex colours. */
export function contrastRatio(a: string, b: string): number {
  const [ya, yb] = [a, b].map((x) => luminance(parseHex(x) ?? [0, 0, 0]));
  return (Math.max(ya!, yb!) + 0.05) / (Math.min(ya!, yb!) + 0.05);
}

/** OKLab distance (ΔE OK) between two hex colours. */
export function deltaE(a: string, b: string): number {
  const lab = (hex: string) => {
    const { l, c, h } = rgbToOklch(parseHex(hex) ?? [0, 0, 0]);
    return [l, c * Math.cos((h * Math.PI) / 180), c * Math.sin((h * Math.PI) / 180)];
  };
  const [p, q] = [lab(a), lab(b)];
  return Math.hypot(p[0]! - q[0]!, p[1]! - q[1]!, p[2]! - q[2]!);
}

function stepColor(input: Oklch, step: CustomStep): string {
  const base = Math.min(Math.max(input.l, LMIN), LMAX);
  const l = 'l' in step ? step.l : base + step.delta;
  return toHex(oklchToRgb({ l, c: Math.min(input.c * step.k, step.cap), h: input.h }));
}

/** The generated colours for an input colour, as the browser computes them (with CSS gamut mapping). */
export function resolveCustomScale(input: string): {
  scale: Record<CustomScaleStep, string>;
  dark: Record<CustomDarkStep, string>;
} | null {
  const rgb = parseHex(input);
  if (!rgb) return null;
  const o = rgbToOklch(rgb);
  const map = <T extends Record<string, CustomStep>>(steps: T) =>
    Object.fromEntries(Object.entries(steps).map(([k, s]) => [k, stepColor(o, s)])) as Record<keyof T, string>;
  return { scale: map(CUSTOM_SCALE), dark: map(CUSTOM_DARK) };
}

export interface BrandColorCheck {
  /** The colour the admin chose. */
  input: string;
  /** The primary button's colour that results (`bg-action-primary`, step 500). */
  button: string;
  /** How far the button colour is from the input (OKLab ΔE; 0 = the same). */
  deltaE: number;
  /** True when the difference is visible (ΔE ≥ 0.02): the settings screen can say "adjusted for readability". */
  adjusted: boolean;
  /** Whether the lightness was raised (very dark input) or lowered (too light for white text), if at all. */
  lightness: 'kept' | 'raised' | 'lowered';
}

/**
 * Reports how the custom brand changes an admin's colour (DESIGN.md §3.12). It never blocks: every input gives a
 * readable scale. Returns null for something that isn't a hex colour.
 */
export function checkBrandColor(input: string): BrandColorCheck | null {
  const rgb = parseHex(input);
  if (!rgb) return null;
  const resolved = resolveCustomScale(input)!;
  const button = resolved.scale['500'];
  const hex = toHex(rgb);
  const d = deltaE(hex, button);
  const { l } = rgbToOklch(rgb);
  return {
    input: hex,
    button,
    deltaE: Number(d.toFixed(4)),
    adjusted: d >= JND,
    lightness: l > LMAX ? 'lowered' : l < LMIN ? 'raised' : 'kept',
  };
}
