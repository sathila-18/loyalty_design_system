/**
 * The token proof (DESIGN.md §3.11): which utility should give which token. Read from the generated theme.css, so
 * every token the theme maps is checked. Used by test/tailwind-theme.test.ts (compiled CSS, in Node) and by the
 * Storybook page Foundations/Tailwind utilities (computed values in a real browser, every brand × theme).
 */

/** How to compare the utility's computed value with the token's. */
export type ProofKind = 'value' | 'ring' | 'shadow' | 'font';

export interface ProofCase {
  /** The classes, without the fin: prefix. Rings need a width as well as a colour. */
  classes: string[];
  /** The class whose rule must use the token. */
  utility: string;
  token: string;
  /** The CSS property compared in the browser. */
  property: string;
  kind: ProofKind;
  /** Theme group, for the report. */
  group: string;
}

type Mapping = { utilities: string[]; property: string; kind?: ProofKind; extra?: string; group: string };

/**
 * The naming rule (DESIGN.md §3.11): which token group a namespace's plain keys come from. A colour key may name
 * another group first (bg-fg-active → --fin-fg-active). Namespaces without a default group always name it.
 */
const DEFAULT_GROUP: Record<string, string | undefined> = {
  'background-color': 'bg',
  'text-color': 'text',
  fg: 'fg',
  'border-color': 'border',
  'outline-color': 'border',
  'ring-color': 'border',
  'inset-ring-color': 'border',
  spacing: 'space',
  width: 'size',
  height: 'size',
  size: 'size',
  'min-width': 'size',
  'max-width': 'size',
  'min-height': 'size',
  'max-height': 'size',
  'flex-basis': 'size',
  radius: 'radius',
  shadow: 'shadow',
};
const COLOUR_GROUPS = ['bg', 'text', 'border', 'fg', 'alpha'];

/** The token a utility must give, from its name alone (not from the theme), so a wrong mapping is caught. */
function expectedToken(ns: string, key: string) {
  const named = COLOUR_GROUPS.find((g) => key.startsWith(`${g}-`));
  if (named && ns !== 'spacing' && !ns.endsWith('width') && !ns.endsWith('height') && ns !== 'size' && ns !== 'flex-basis') return `--fin-${key}`;
  const group = DEFAULT_GROUP[ns];
  if (!group) throw new Error(`tailwind-proof: --${ns}-${key} must name its token group (e.g. ${ns}-fg-…)`);
  return `--fin-${group}-${key}`;
}

/** Theme namespace → the utilities that read it, and the property they set. */
const NAMESPACES: Record<string, Mapping[]> = {
  'background-color': [{ utilities: ['bg'], property: 'background-color', group: 'Background' }],
  'text-color': [{ utilities: ['text'], property: 'color', group: 'Text' }],
  fg: [{ utilities: ['fg'], property: 'color', group: 'Icon colour' }],
  'border-color': [{ utilities: ['border'], property: 'border-top-color', group: 'Border' }],
  'outline-color': [{ utilities: ['outline'], property: 'outline-color', group: 'Outline' }],
  'ring-color': [{ utilities: ['ring'], property: 'box-shadow', kind: 'ring', extra: 'ring-2', group: 'Ring' }],
  'inset-ring-color': [{ utilities: ['inset-ring'], property: 'box-shadow', kind: 'ring', extra: 'inset-ring-2', group: 'Inset ring' }],
  fill: [{ utilities: ['fill'], property: 'fill', group: 'SVG fill' }],
  stroke: [{ utilities: ['stroke'], property: 'stroke', group: 'SVG stroke' }],
  'caret-color': [{ utilities: ['caret'], property: 'caret-color', group: 'Caret' }],
  spacing: [
    { utilities: ['p'], property: 'padding-top', group: 'Spacing' },
    { utilities: ['m'], property: 'margin-top', group: 'Spacing' },
    { utilities: ['gap'], property: 'row-gap', group: 'Spacing' },
  ],
  width: [{ utilities: ['w'], property: 'width', group: 'Size' }],
  height: [{ utilities: ['h'], property: 'height', group: 'Size' }],
  size: [{ utilities: ['size'], property: 'width', group: 'Size' }],
  'min-width': [{ utilities: ['min-w'], property: 'min-width', group: 'Size' }],
  'max-width': [{ utilities: ['max-w'], property: 'max-width', group: 'Size' }],
  'min-height': [{ utilities: ['min-h'], property: 'min-height', group: 'Size' }],
  'max-height': [{ utilities: ['max-h'], property: 'max-height', group: 'Size' }],
  'flex-basis': [{ utilities: ['basis'], property: 'flex-basis', group: 'Size' }],
  radius: [{ utilities: ['rounded'], property: 'border-top-left-radius', group: 'Radius' }],
  shadow: [{ utilities: ['shadow'], property: 'box-shadow', kind: 'shadow', group: 'Shadow' }],
};

/** Every utility the theme defines, with the token its name says it gives. */
export function proofCases(themeCss: string): ProofCase[] {
  const cases: ProofCase[] = [];
  for (const [, namespace, key] of themeCss.matchAll(/^ {2}--([a-z-]+?)-([a-z0-9-]+): var\((--fin-[a-z0-9-]+)\);$/gm)) {
    // Longest namespace first: "inset-ring-color" before "ring-color", "min-width" before "width".
    const ns = Object.keys(NAMESPACES)
      .sort((a, b) => b.length - a.length)
      .find((n) => `${namespace}-${key}`.startsWith(`${n}-`));
    if (!ns) throw new Error(`tailwind-proof: unknown theme namespace in --${namespace}-${key}`);
    const k = `${namespace}-${key}`.slice(ns.length + 1);
    const token = expectedToken(ns, k);
    for (const m of NAMESPACES[ns]!) {
      for (const u of m.utilities) {
        const utility = `${u}-${k}`;
        cases.push({ classes: m.extra ? [m.extra, utility] : [utility], utility, token, property: m.property, kind: m.kind ?? 'value', group: m.group });
      }
    }
  }
  for (const [, name] of themeCss.matchAll(/^@utility font-([a-z0-9-]+) \{$/gm)) {
    cases.push({ classes: [`font-${name}`], utility: `font-${name}`, token: `--fin-font-${name}`, property: 'font', kind: 'font', group: 'Text style' });
  }
  return cases;
}

/** Tailwind defaults and things the theme must not give: none of these may produce CSS. */
export const NOT_IN_THEME = [
  'bg-red-500', 'bg-white', 'bg-black', 'text-gray-700', 'border-slate-200', 'fg-red-500',
  // No spacing multiplier: numbers are only the --fin-size-* tokens (w-64 and size-4 exist: --fin-size-64, -4).
  'p-4', 'p-1', 'm-2', 'gap-6', 'w-10', 'h-10', 'size-5', 'w-72',
  'text-sm', 'text-lg', 'font-bold', 'font-sans', 'leading-6', 'tracking-wide',
  'rounded', 'rounded-lg', 'rounded-md', 'shadow', 'shadow-md', 'shadow-lg',
  'max-w-md', 'max-w-screen-lg', 'md:p-m', 'lg:p-m', 'xl:p-m', '2xl:p-m',
  // Brand and theme come from the tokens.
  'dark:bg-primary',
  // Palette and alias tokens were never mapped.
  'bg-primary-500', 'text-palette-gray-500', 'bg-color-primary-500',
];
