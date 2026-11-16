import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId, useMemo, useState, type CSSProperties } from 'react';
import {
  CUSTOM_DARK,
  CUSTOM_PRIMARY_FALLBACK,
  CUSTOM_SCALE,
  LMAX,
  LMIN,
  checkBrandColor,
  contrastRatio,
  oklchToRgb,
  parseHex,
  resolveCustomScale,
  toHex,
  type CustomStep,
} from '@finspace-loyalty/tokens/custom-brand';
import {
  FinBadge,
  FinButton,
  FinCheckbox,
  FinFilterChip,
  FinListStandard,
  FinNotificationBanner,
  FinPagination,
  FinProgressBar,
  FinRadio,
  FinSlider,
  FinStepper,
  FinTextField,
  FinToggle,
} from '@finspace-loyalty/ui';
import { Page, Section, Swatch } from './Foundations';
import styles from './CustomBrand.module.css';

const PRESETS: [string, string][] = [
  ['Finspace', CUSTOM_PRIMARY_FALLBACK],
  ['Burgundy', '#660033'],
  ['Navy', '#1f2a5c'],
  ['Forest', '#1e5631'],
  ['Sampath orange', '#f47921'],
  ['Sky blue', '#38bdf8'],
  ['Yellow', '#ffff00'],
  ['Near-black', '#0a0a0a'],
];

// The page and panel colours the brand sits on (the same in every brand; DESIGN.md §3.12).
const LIGHT_SURFACES = ['#ffffff', '#f5f5f5', '#ededed'];
const DARK_SURFACES = ['#19191a', '#292929', '#363636'];

/** How a step is made, for the swatch note. */
function recipe(step: CustomStep): string {
  const l = 'l' in step ? `L ${step.l}` : step.delta === 0 ? `L = input, ${LMIN}–${LMAX}` : `L = button − ${-step.delta}`;
  return `${l} · c × ${step.k} ≤ ${step.cap}`;
}

/** The contrast rules for one colour: each rule's worst pair. */
function rules(hex: string) {
  const { scale, dark } = resolveCustomScale(hex)!;
  const min = (pairs: [string, string][]) => Math.min(...pairs.map(([a, b]) => contrastRatio(a, b)));
  return [
    { rule: 'White text on buttons (500, 600, 700)', needed: 4.5, ratio: min(['500', '600', '700'].map((s) => ['#ffffff', scale[s as '500']])) },
    { rule: 'Action text (500) on the Light page and panels', needed: 4.5, ratio: min(LIGHT_SURFACES.map((b) => [scale['500'], b])) },
    { rule: 'Focus ring (400) in Light', needed: 3, ratio: min(LIGHT_SURFACES.map((b) => [scale['400'], b])) },
    { rule: 'Action text (dark-action) on the Dark page and panels', needed: 4.5, ratio: min(DARK_SURFACES.map((b) => [dark.action, b])) },
    { rule: 'Focus ring (dark-focus) in Dark', needed: 3, ratio: min(DARK_SURFACES.map((b) => [dark.focus, b])) },
    { rule: 'White text on Dark buttons (fill, hovered, pressed)', needed: 4.5, ratio: min(['fill', 'fill-hovered', 'fill-pressed'].map((s) => ['#ffffff', dark[s as 'fill']])) },
    { rule: 'Action text on selected fills (50, 100)', needed: 4.5, ratio: min(['50', '100'].map((s) => [scale['500'], scale[s as '50']])) },
  ];
}

/** Every input of the proof: 24 hues × 5 lightnesses, vivid and muted, plus the extremes. */
function proofInputs(): string[] {
  const out: string[] = [];
  for (let h = 0; h < 360; h += 15) {
    for (const l of [0.15, 0.3, 0.45, 0.62, 0.85]) {
      out.push(toHex(oklchToRgb({ l, c: 0.4, h })), toHex(oklchToRgb({ l, c: 0.06, h })));
    }
  }
  return [...out, '#ffff00', '#00ffff', '#0a0a0a', '#f5f5f5', '#000000', '#ffffff', '#0000ff', '#ff0000', '#00ff00', '#ff00ff'];
}

/** Sample components on the custom brand, in one theme. */
function Samples({ theme, color }: { theme: 'light' | 'dark'; color: string }) {
  const name = useId();
  return (
    <section
      className={styles.panel}
      data-brand="custom"
      data-theme={theme}
      style={{ '--fin-custom-primary': color } as CSSProperties}
      aria-label={`Custom brand, ${theme}`}
    >
      <h3 className={styles.panelTitle}>{theme === 'light' ? 'Light' : 'Dark'}</h3>
      <div className={styles.row}>
        <FinButton>Primary</FinButton>
        <FinButton variant="secondary">Secondary</FinButton>
        <FinButton variant="tertiary">Tertiary</FinButton>
        <FinButton variant="link">Link</FinButton>
      </div>
      <div className={styles.row}>
        <FinToggle label="Notifications" defaultChecked />
        <FinCheckbox defaultChecked>Remember me</FinCheckbox>
        <FinRadio label="Gold" name={name} defaultChecked />
        <FinRadio label="Silver" name={name} />
      </div>
      <div className={styles.row}>
        <FinFilterChip defaultSelected>Active</FinFilterChip>
        <FinFilterChip>Inactive</FinFilterChip>
        <FinBadge>Primary</FinBadge>
        <FinBadge tone="info">Info (fixed)</FinBadge>
      </div>
      <FinStepper steps={['Reward', 'Rules', 'Eligibility', 'Review']} current={1} />
      <ul className={styles.list} aria-label="Tiers">
        <FinListStandard as="li" size="small" title="Gold" selected />
        <FinListStandard as="li" size="small" title="Silver" />
      </ul>
      <FinProgressBar label="Profile complete" value={60} />
      <FinSlider label="Points multiplier" defaultValue={40} />
      <FinTextField label="Reward name" defaultValue="Free coffee" />
      <FinPagination pageCount={5} defaultPage={2} label={`Pages, ${theme}`} />
      <FinNotificationBanner tone="info" title="Info stays on a fixed scale">
        Info doesn't follow the custom colour.
      </FinNotificationBanner>
    </section>
  );
}

function CustomBrandPage() {
  const [input, setInput] = useState(CUSTOM_PRIMARY_FALLBACK);
  const [draft, setDraft] = useState(CUSTOM_PRIMARY_FALLBACK);
  const pickerId = useId();
  const check = checkBrandColor(input)!;
  const results = rules(input);
  const proof = useMemo(() => {
    const all = proofInputs().map(rules);
    return all[0]!.map((r, i) => ({ ...r, ratio: Math.min(...all.map((x) => x[i]!.ratio)) }));
  }, []);
  const choose = (hex: string) => {
    setInput(hex);
    setDraft(hex);
  };
  const scope = { '--fin-custom-primary': input } as CSSProperties;

  return (
    <Page
      title="Custom brand"
      intro={
        <>
          An admin picks one colour; <code>data-brand=&quot;custom&quot;</code> with <code>--fin-custom-primary</code> generates the
          Primary scale and the Primary dark group in CSS (DESIGN.md §3.12). Hue and chroma come from the colour; lightness
          is fixed per step, except the button (500), which keeps the colour&apos;s own lightness between {LMIN} and {LMAX}.
          Info stays on Finspace&apos;s scale.
        </>
      }
    >
      <Section title="Brand colour">
        <div className={styles.controls}>
          <div className={styles.picker}>
            <label htmlFor={pickerId} className={styles.pickerLabel}>
              Colour picker
            </label>
            <input id={pickerId} type="color" className={styles.colorInput} value={input} onChange={(e) => choose(e.target.value)} />
          </div>
          <FinTextField
            label="Hex"
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              if (parseHex(e.target.value)) setInput(toHex(parseHex(e.target.value)!));
            }}
            className={styles.hex}
          />
        </div>
        <div className={styles.row} role="group" aria-label="Presets">
          {PRESETS.map(([label, hex]) => (
            <FinFilterChip key={hex} selected={input === hex} onSelectedChange={() => choose(hex)}>
              {label}
            </FinFilterChip>
          ))}
        </div>
        <div className={styles.compare}>
          <div className={styles.compareItem}>
            <span className={styles.bigChip} style={{ '--chip': check.input } as CSSProperties} />
            <span className={styles.meta}>
              <span className={styles.metaTitle}>Chosen</span>
              <code className={styles.code}>{check.input}</code>
            </span>
          </div>
          <div className={styles.compareItem}>
            <span className={styles.bigChip} style={{ '--chip': check.button } as CSSProperties} />
            <span className={styles.meta}>
              <span className={styles.metaTitle}>Button (500)</span>
              <code className={styles.code}>{check.button}</code>
            </span>
          </div>
        </div>
        <FinNotificationBanner tone={check.adjusted ? 'warning' : 'success'} title={check.adjusted ? 'Adjusted for readability' : 'Kept as chosen'}>
          checkBrandColor: ΔE {check.deltaE.toFixed(3)}, lightness {check.lightness}
          {check.adjusted ? ` (the button is ${check.button} so white text and action text stay readable).` : '.'}
        </FinNotificationBanner>
      </Section>

      <Section title="Generated scale (Light: Primary 50–900)">
        <div className={styles.grid} data-brand="custom" style={scope}>
          {Object.entries(CUSTOM_SCALE).map(([step, def]) => (
            <Swatch key={step} color={`var(--fin-color-primary-${step})`} note={recipe(def)} deps={[input]} />
          ))}
        </div>
      </Section>

      <Section title="Generated scale (Primary dark group)">
        <div className={styles.grid} data-brand="custom" style={scope}>
          {Object.entries(CUSTOM_DARK).map(([step, def]) => (
            <Swatch key={step} color={`var(--fin-color-primary-dark-${step})`} note={recipe(def)} deps={[input]} />
          ))}
        </div>
      </Section>

      <Section title="Components">
        <div className={styles.panels}>
          <Samples theme="light" color={input} />
          <Samples theme="dark" color={input} />
        </div>
      </Section>

      <Section title="Contrast">
        <table className={styles.table}>
          <caption className={styles.caption}>
            This colour, and the worst case over every input of the proof (24 hues × 5 lightnesses, vivid and muted, and
            10 extremes; both browser gamut methods are proven in DESIGN.md §3.12).
          </caption>
          <thead>
            <tr>
              <th scope="col">Rule</th>
              <th scope="col">Needed</th>
              <th scope="col">This colour</th>
              <th scope="col">Worst of all inputs</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={r.rule}>
                <th scope="row">{r.rule}</th>
                <td>{r.needed}:1</td>
                <td>
                  {r.ratio.toFixed(2)}:1 {r.ratio >= r.needed ? 'Pass' : 'Fail'}
                </td>
                <td>
                  {proof[i]!.ratio.toFixed(2)}:1 {proof[i]!.ratio >= r.needed ? 'Pass' : 'Fail'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </Page>
  );
}

/**
 * The preset chips sit outside the custom-brand panels, so they show the toolbar's brand: Finspace's selected chip is
 * an accepted exception there (text-action on bg-active, DESIGN.md §10 #3), as in the FilterChip stories.
 */
const KNOWN_CONTRAST_ISSUES = ['html[data-brand="finspace"] [data-variant="selected"]'];

const meta: Meta = {
  title: 'Foundations/Custom brand',
  parameters: { layout: 'fullscreen', a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
};
export default meta;

export const CustomBrand: StoryObj = {
  name: 'Custom brand',
  render: () => <CustomBrandPage />,
};
