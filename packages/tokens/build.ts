/**
 * Token build: tokens/design.tokens.json (TokensBrücke export) → packages/tokens/dist/.
 * Spec: DESIGN.md §3.8 (naming, scoping) and §3.9 (export quirks).
 *
 * The export is first normalised into a flat set of tokens, one per CSS variable, grouped by layer:
 *   palette (Primitives) → color + font (brand modes) → semantic (theme modes).
 * Style Dictionary then resolves references and writes the files, keeping references between
 * layers as var() so brand and theme can be switched on <html>.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import StyleDictionary from 'style-dictionary';
import type { Dictionary, TransformedToken } from 'style-dictionary/types';

const here = dirname(fileURLToPath(import.meta.url));
const SOURCE = join(here, '../../tokens/design.tokens.json');
const DIST = join(here, 'dist');
const PREFIX = 'fin';

/** Single-mode collections export `mode: {}`, so the brand needs a name (§3.9). */
const SINGLE_MODE_BRAND = 'finspace';
/** `Primitives/Sizes` exported as breakpoints only (§3.7). Other sizes ≥ 343 are mobile widths. */
const BREAKPOINTS: Record<string, string> = {
  'Size-1024': 'md',
  'Size-1280': 'lg',
  'Size-1440': 'xl',
  'Size-1920': 'xxl',
};
const SKIPPED_SIZES = new Set(['Size-343', 'Size-375']);
/** `Body L` → `body-large` (text style `Body/Large`, §3.4). */
const SIZE_WORDS: Record<string, string> = { XL: 'xlarge', L: 'large', M: 'medium', S: 'small' };
const TYPE_PARTS: Record<string, string> = {
  'Font family': 'family',
  'Font weight': 'weight',
  'Font size': 'size',
  'Line height': 'line-height',
};
/** Added after every font family so text never falls back to the browser's serif (§3.4). Figma only has the family. */
const FONT_FALLBACK = 'system-ui, sans-serif';
const EXPECTED = { tokens: 434, textStyles: 23 };

// ---------------------------------------------------------------------------
// 1. Read the export
// ---------------------------------------------------------------------------

type RawValue = string | number | { value: number; unit: string } | { components: string; alpha: number };
interface RawToken {
  $type: string;
  $value: RawValue;
  $extensions?: { mode?: Record<string, RawValue> };
}
interface Source {
  path: string[];
  token: RawToken;
}

function collect(node: Record<string, unknown>, path: string[] = []): Source[] {
  if ('$value' in node) return [{ path, token: node as unknown as RawToken }];
  return Object.entries(node)
    .filter(([key]) => !key.startsWith('$'))
    .flatMap(([key, child]) => collect(child as Record<string, unknown>, [...path, key]));
}

const sources = collect(JSON.parse(readFileSync(SOURCE, 'utf8')) as Record<string, unknown>);
if (sources.length !== EXPECTED.tokens) {
  throw new Error(`Expected ${EXPECTED.tokens} variables in the export, found ${sources.length}`);
}

// ---------------------------------------------------------------------------
// 2. Name every variable: layer + key → `--fin-<layer>-<key>` (§3.8)
// ---------------------------------------------------------------------------

type Layer = 'palette' | 'color' | 'font' | 'space' | 'radius' | 'size' | 'semantic' | 'breakpoint';

const kebab = (s: string) => s.trim().replace(/[\s_]+/g, '-').toLowerCase();
const textStyle = (group: string) => {
  const [kind = '', size = ''] = group.split(/ (.*)/);
  return kebab(`${kind}-${SIZE_WORDS[size] ?? size}`);
};

/** Returns null for variables that aren't generated. */
function place({ path }: Source): { layer: Layer; key: string } | null {
  const [collection, group] = path;
  const leaf = path.at(-1)!.replace(/ \d+$/, ''); // `LineHeight-64px 2` → `LineHeight-64px`
  const parent = path.at(-2)!;

  switch (collection) {
    case 'Primitives':
      if (group === 'Colors') return { layer: 'palette', key: kebab(leaf) };
      if (group === 'Sizes') {
        if (SKIPPED_SIZES.has(leaf)) return null;
        if (BREAKPOINTS[leaf]) return { layer: 'breakpoint', key: BREAKPOINTS[leaf] };
        return { layer: 'palette', key: kebab(leaf) };
      }
      // Typography: `Font style/Primary` is the family (§3.9)
      return {
        layer: 'palette',
        key: {
          'Font style': `font-family-${kebab(leaf)}`,
          'Font Weight': `font-weight-${kebab(leaf)}`,
          'Font Size': `font-size-${kebab(leaf.replace(/^FontSize-/, ''))}`,
          'Line Height': `line-height-${kebab(leaf.replace(/^LineHeight-/, ''))}`,
        }[parent]!,
      };
    case 'Alias Colors':
      return { layer: 'color', key: kebab(leaf) }; // drops `Colors/Fintech/<group>` (§10 #12)
    case 'Alias Typography':
      return { layer: 'font', key: `${textStyle(group!)}-${TYPE_PARTS[leaf]}` };
    case 'Alias Spacing & Radius':
      return { layer: group === 'Radius' ? 'radius' : 'space', key: kebab(leaf.replace(/^(Space|Radius)-/, '')) };
    case 'Color collection':
      return { layer: 'semantic', key: kebab(leaf) };
  }
  throw new Error(`Unknown collection: ${path.join('/')}`);
}

const placed = new Map<string, { layer: Layer; key: string; source: Source }>();
const taken = new Set<string>();
for (const source of sources) {
  const spot = place(source);
  if (!spot) continue;
  const id = `${spot.layer}.${spot.key}`;
  if (taken.has(id)) throw new Error(`Two variables map to ${id}`);
  taken.add(id);
  placed.set(source.path.join('.'), { ...spot, source });
}

// ---------------------------------------------------------------------------
// 3. Normalise values (§3.9) and split by mode
// ---------------------------------------------------------------------------

const round = (n: number, digits: number) => Number(n.toFixed(digits));

function reference(ref: string): string {
  const target = placed.get(ref.slice(1, -1));
  if (!target) throw new Error(`Unresolved reference ${ref}`);
  return `{${target.layer}.${target.key}}`;
}

function normalise(value: RawValue, source: Source): string | number {
  if (typeof value === 'string') {
    if (value.startsWith('{')) return reference(value);
    return source.path.at(-2) === 'Font style' ? `${value}, ${FONT_FALLBACK}` : value;
  }
  if (typeof value === 'number') return value;
  if ('alpha' in value) {
    // Decided 14 Oct 2026: color-mix only (§3.9). Keeps the alias as a variable so it follows the brand.
    return `color-mix(in srgb, ${reference(value.components)} ${round(value.alpha * 100, 2)}%, transparent)`;
  }
  const parent = source.path.at(-2);
  if (parent === 'Font Weight') return value.value; // `{ value: 700, unit: 'px' }` → 700
  const n = parent === 'Line Height' ? round(value.value, 1) : value.value;
  return `${n}${value.unit}`;
}

/** Mode names for a collection, or [undefined] when it has a single mode (`mode: {}`). */
function modesOf(collection: string): (string | undefined)[] {
  const first = sources.find((s) => s.path[0] === collection);
  const names = Object.keys(first?.token.$extensions?.mode ?? {});
  return names.length ? names : [undefined];
}

type Tree = Record<string, Record<string, { $type: string; $value: string | number }>>;

/** All tokens, with brand and theme layers taken from the given modes. */
function tree(brand: string | undefined, theme: string | undefined): Tree {
  const out: Tree = {};
  for (const { layer, key, source } of placed.values()) {
    const collection = source.path[0];
    const mode = collection === 'Color collection' ? theme : layer === 'color' || layer === 'font' ? brand : undefined;
    const raw = mode ? source.token.$extensions!.mode![mode]! : source.token.$value;
    (out[layer] ??= {})[key] = { $type: source.token.$type, $value: normalise(raw, source) };
    // Fixed sizes (§3.8): every Primitives/Sizes value is also exposed as --fin-size-<n>, for
    // dimensions that must not follow the spacing scale (icon sizes). Spacing uses --fin-space-*.
    const size = layer === 'palette' && /^size-(\d+)$/.exec(key);
    if (size) (out.size ??= {})[size[1]!] = { $type: 'dimension', $value: `{palette.${key}}` };
  }
  return out;
}

const brands = [...new Set([...modesOf('Alias Colors'), ...modesOf('Alias Typography')])];
if (brands.length > 1 && brands.includes(undefined)) {
  throw new Error('Alias Colors and Alias Typography must have the same brand modes');
}
const themes = modesOf('Color collection');
if (themes.join() !== 'Light,Dark') throw new Error(`Expected Light/Dark modes, found ${themes.join()}`);

// Text-style shorthands, one per Alias Typography group (§3.8, §4.1)
const styles = [...new Set([...placed.values()].filter((t) => t.layer === 'font').map((t) => textStyle(t.source.path[1]!)))];
if (styles.length !== EXPECTED.textStyles) {
  throw new Error(`Expected ${EXPECTED.textStyles} text styles, found ${styles.length}`);
}
function withTextStyles(t: Tree): Tree {
  for (const style of styles) {
    const part = (p: string) => `{font.${style}-${p}}`;
    t.font![style] = {
      $type: 'typography',
      $value: `${part('weight')} ${part('size')} / ${part('line-height')} ${part('family')}`,
    };
  }
  return t;
}

// ---------------------------------------------------------------------------
// 4. Formats
// ---------------------------------------------------------------------------

const layer = (token: TransformedToken) => token.path[0] as Layer;
const camel = (key: string) =>
  key.replace(/^(\d+)xl$/, 'x$1l').replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase()); // `2xl` → `x2l`
const HEADER = '/**\n * Generated by packages/tokens/build.ts from tokens/design.tokens.json.\n * Do not edit by hand.\n */\n';

StyleDictionary.registerTransform({
  name: 'fin/name',
  type: 'name',
  transform: (token) => {
    const [l, key] = token.path as [Layer, string];
    return [PREFIX, l === 'semantic' ? '' : l, key].filter(Boolean).join('-');
  },
});

StyleDictionary.registerFormat({
  name: 'fin/ts',
  format: ({ dictionary }: { dictionary: Dictionary }) => {
    const group = (name: string, from: Layer, keep: (key: string) => boolean = () => true) => {
      const rows = dictionary.allTokens
        .filter((t) => layer(t) === from && keep(t.path[1]!))
        .map((t) => `  ${camel(t.path[1]!)}: 'var(--${t.name})',`);
      return `export const ${name} = {\n${rows.join('\n')}\n} as const;\n`;
    };
    return [
      HEADER,
      group('finColor', 'semantic'),
      group('finSpace', 'space'),
      group('finRadius', 'radius'),
      group('finSize', 'size'),
      group('finFont', 'font', (key) => styles.includes(key)),
      `export const finBrands = ${JSON.stringify(brands.map(brandName))} as const;`,
      `export type FinBrand = (typeof finBrands)[number];\n`,
      `export const finThemes = ${JSON.stringify(themes.map((t) => themeName(t!)))} as const;`,
      `export type FinTheme = (typeof finThemes)[number];\n`,
    ].join('\n');
  },
});

const query = (t: TransformedToken) => `(min-width: ${t.$value})`;
StyleDictionary.registerFormat({
  name: 'fin/custom-media',
  format: ({ dictionary }: { dictionary: Dictionary }) =>
    HEADER + dictionary.allTokens.map((t) => `@custom-media --fin-bp-${t.path[1]} ${query(t)};`).join('\n') + '\n',
});
StyleDictionary.registerFormat({
  name: 'fin/ts-breakpoints',
  format: ({ dictionary }: { dictionary: Dictionary }) =>
    HEADER +
    'export const finBreakpoint = {\n' +
    dictionary.allTokens.map((t) => `  ${t.path[1]}: '${query(t)}',`).join('\n') +
    '\n} as const;\n',
});

/** Formats one tree; returns each file's output in order. */
async function render(tokens: Tree, files: { format: string; filter?: Layer[]; selector?: string }[]) {
  const sd = new StyleDictionary({
    tokens,
    log: { verbosity: 'silent', warnings: 'disabled' },
    platforms: {
      out: {
        transforms: ['fin/name'],
        files: files.map(({ format, filter, selector }, i) => ({
          destination: `${i}`,
          format,
          ...(filter && { filter: (t: TransformedToken) => filter.includes(layer(t)) }),
          options: { selector, outputReferences: true, showFileHeader: false },
        })),
      },
    },
  });
  const outputs = await sd.formatPlatform('out');
  return outputs.map((o) => String(o.output));
}

/**
 * Palette and alias colors for the Storybook "Palette (reference only)" page.
 * A separate entry point (`@finspace-loyalty/tokens/reference`) so components never import them.
 */
function referenceFile(): string {
  const cssName = (l: Layer, key: string) => `--${PREFIX}-${l}-${key}`;
  const colors = [...placed.values()].filter((t) => t.source.path[0] === 'Primitives' && t.source.path[1] === 'Colors');
  const palette = colors.map((t) => ({ name: cssName('palette', t.key), group: t.source.path.at(-2)! }));
  const alias = Object.fromEntries(
    brands.map((brand) => [
      brandName(brand),
      [...placed.values()]
        .filter((t) => t.layer === 'color')
        .map((t) => {
          const value = String(normalise(brand ? t.source.token.$extensions!.mode![brand]! : t.source.token.$value, t.source));
          const ref = /^\{palette\.(.+)\}$/.exec(value);
          return { name: cssName('color', t.key), group: t.source.path.at(-2)!, value: ref ? `var(${cssName('palette', ref[1]!)})` : value };
        }),
    ]),
  );
  const json = (v: unknown) => JSON.stringify(v, null, 2);
  return (
    HEADER.replace(' */', ' *\n * REFERENCE ONLY: do not use in components. Components use semantic colors (finColor).\n */') +
    `\nexport const finPaletteReference = ${json(palette)} as const;\n` +
    `\nexport const finAliasReference = ${json(alias)} as const;\n`
  );
}

// ---------------------------------------------------------------------------
// 5. Write dist/
// ---------------------------------------------------------------------------

const brandName = (mode: string | undefined) => kebab(mode ?? SINGLE_MODE_BRAND);
const themeName = (mode: string) => mode.toLowerCase();
const css = 'css/variables';

const blocks: string[] = [];
const [primitives, ts, customMedia, tsBreakpoints] = await render(withTextStyles(tree(brands[0], themes[0])), [
  { format: css, filter: ['palette', 'space', 'radius', 'size'], selector: ':root' },
  { format: 'fin/ts' },
  { format: 'fin/custom-media', filter: ['breakpoint'] },
  { format: 'fin/ts-breakpoints', filter: ['breakpoint'] },
]);
blocks.push(primitives!);

for (const [i, brand] of brands.entries()) {
  const [block] = await render(withTextStyles(tree(brand, themes[0])), [
    { format: css, filter: ['color', 'font'], selector: `${i === 0 ? ':root,\n' : ''}[data-brand="${brandName(brand)}"]` },
  ]);
  blocks.push(block!);
}
for (const [i, theme] of themes.entries()) {
  const [block] = await render(withTextStyles(tree(brands[0], theme)), [
    { format: css, filter: ['semantic'], selector: `${i === 0 ? ':root,\n' : ''}[data-theme="${themeName(theme!)}"]` },
  ]);
  blocks.push(block!);
}

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST);
const write = (file: string, content: string) => writeFileSync(join(DIST, file), content);
write('tokens.css', HEADER + '\n' + blocks.join('\n'));
write('tokens.ts', ts!);
write('breakpoints.css', customMedia!);
write('breakpoints.ts', tsBreakpoints!);
write('reference.ts', referenceFile());

console.log(`tokens: ${placed.size} variables, ${styles.length} text styles, brands [${brands.map(brandName)}], themes [${themes.map((t) => themeName(t!))}]`);
