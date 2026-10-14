/** Turns a computed color (`rgb()`, `rgba()` or `color(srgb …)`) into `#rrggbb` or `#rrggbbaa`. */
export function toHex(css: string): string {
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
