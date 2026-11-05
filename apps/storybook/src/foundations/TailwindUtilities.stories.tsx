import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { compile } from 'tailwindcss';
import utilitiesCss from 'tailwindcss/utilities.css?raw';
import tailwindCss from '../../../../packages/ui/src/styles/tailwind.css?raw';
import themeCss from '../../../../packages/ui/src/styles/theme.css?raw';
import { proofCases, type ProofCase } from '../../../../packages/ui/test/tailwind-proof';
import { Notice, Page, Section } from './Foundations';
import styles from './Foundations.module.css';

/**
 * The token proof in a real browser (DESIGN.md §3.11): every utility the theme defines is compiled with Tailwind
 * (from the library's own tailwind.css and theme.css), applied to an element, and its computed value compared with
 * an element styled with the token directly. pnpm test:a11y runs it in every brand × theme; it fails on any
 * difference. Switch Brand and Theme in the toolbar to check by hand.
 */

const FILES: Record<string, string> = { 'tailwindcss/utilities.css': utilitiesCss, './theme.css': themeCss };
const cases = proofCases(themeCss);

interface Result {
  c: ProofCase;
  utility: string;
  token: string;
  ok: boolean;
}

/** Splits a computed box-shadow list and drops Tailwind's empty layers (transparent, all zero). */
const shadows = (value: string) =>
  value
    .split(/,(?![^(]*\))/)
    .map((s) => s.trim())
    .filter((s) => s !== 'none' && !/^rgba\(0, 0, 0, 0\)( 0px){4}$/.test(s));

const FONT_PARTS = ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'fontStyle'] as const;

function measure(c: ProofCase, el: HTMLElement, ref: HTMLElement): Result {
  const tokenValue = getComputedStyle(el).getPropertyValue(c.token).trim();
  if (c.kind === 'ring') ref.style.boxShadow = `${c.utility.startsWith('inset') ? 'inset ' : ''}0 0 0 2px var(${c.token})`;
  else ref.style.setProperty(c.property, `var(${c.token})`);
  const a = getComputedStyle(el);
  const b = getComputedStyle(ref);
  let utility: string;
  let token: string;
  if (c.kind === 'font') {
    utility = FONT_PARTS.map((p) => a[p]).join(' · ');
    token = FONT_PARTS.map((p) => b[p]).join(' · ');
  } else if (c.kind === 'ring' || c.kind === 'shadow') {
    utility = shadows(a.boxShadow).join(', ');
    token = shadows(b.boxShadow).join(', ');
  } else {
    utility = a.getPropertyValue(c.property);
    token = b.getPropertyValue(c.property);
  }
  // A token that doesn't resolve would match an empty utility: count it as a failure.
  return { c, utility, token, ok: tokenValue !== '' && utility === token };
}

function Proof({ brand, theme }: { brand: string; theme: string }) {
  const [css, setCss] = useState<string>();
  const [results, setResults] = useState<Result[]>();
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let live = true;
    void (async () => {
      const compiler = await compile(tailwindCss, {
        base: '/',
        async loadStylesheet(id) {
          const content = FILES[id];
          if (content === undefined) throw new Error(`Tailwind utilities page: unexpected @import "${id}"`);
          return { path: id, base: '/', content };
        },
      });
      if (live) setCss(compiler.build(cases.flatMap((c) => c.classes.map((cl) => `fin:${cl}`))));
    })();
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    if (!css || !box.current) return;
    const pairs = [...box.current.querySelectorAll<HTMLElement>('[data-case]')];
    setResults(pairs.map((el) => measure(cases[Number(el.dataset.case)]!, el, el.nextElementSibling as HTMLElement)));
  }, [css, brand, theme]);

  const failures = results?.filter((r) => !r.ok) ?? [];
  const groups = [...new Set(cases.map((c) => c.group))];

  return (
    <Page
      title="Tailwind utilities"
      intro="Every utility in the Tailwind theme, checked against its token in this brand and theme: the computed value with the utility must equal the computed value with var(--fin-*) (DESIGN.md §3.11)."
    >
      {css && <style>{css}</style>}
      <div ref={box} aria-hidden="true" className={styles.offscreen}>
        {css &&
          cases.map((c, i) => (
            <div key={i}>
              <div data-case={i} className={c.classes.map((cl) => `fin:${cl}`).join(' ')} />
              <div />
            </div>
          ))}
      </div>
      <Section title="Result">
        {!results ? (
          <Notice>Compiling…</Notice>
        ) : (
          <p className={styles.status} data-match={failures.length === 0} data-testid="tailwind-proof-result">
            {failures.length === 0
              ? `All ${results.length} utilities match their tokens (${brand}, ${theme}).`
              : `${failures.length} of ${results.length} utilities don't match their tokens (${brand}, ${theme}).`}
          </p>
        )}
      </Section>
      {results && (
        <Section title="By group">
          <div className={styles.rows}>
            {groups.map((g) => {
              const inGroup = results.filter((r) => r.c.group === g);
              const ok = inGroup.filter((r) => r.ok).length;
              return (
                <div key={g} className={styles.row}>
                  <code className={styles.name}>{g}</code>
                  <span className={styles.status} data-match={ok === inGroup.length}>
                    {ok} / {inGroup.length} match
                  </span>
                </div>
              );
            })}
          </div>
        </Section>
      )}
      {failures.length > 0 && (
        <Section title="Differences">
          <div className={styles.rows}>
            {failures.map((r) => (
              <div key={r.c.utility} className={styles.row}>
                <code className={styles.name}>fin:{r.c.utility}</code>
                <code className={styles.detail}>
                  {r.c.token}: utility {r.utility || '(empty)'} · token {r.token || '(empty)'}
                </code>
              </div>
            ))}
          </div>
        </Section>
      )}
    </Page>
  );
}

const meta: Meta = {
  title: 'Foundations/Tailwind utilities',
  parameters: { layout: 'fullscreen' },
};
export default meta;

export const TokenProof: StoryObj = {
  name: 'Token proof',
  render: (_, { globals }) => <Proof brand={String(globals.brand)} theme={String(globals.theme)} />,
  play: async ({ canvasElement }) => {
    const result = await within(canvasElement).findByTestId('tailwind-proof-result', {}, { timeout: 10_000 });
    await expect(result).toHaveTextContent(`All ${cases.length} utilities match their tokens`);
  },
};
