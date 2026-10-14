import type { Meta, StoryObj } from '@storybook/react-vite';
import { finAliasReference, finPaletteReference } from '@finspace-loyalty/tokens/reference';
import { Notice, Page, Section, Swatch } from './Foundations';
import styles from './Foundations.module.css';

function byGroup<T extends { group: string }>(items: readonly T[]): [string, T[]][] {
  const groups = new Map<string, T[]>();
  for (const item of items) groups.set(item.group, [...(groups.get(item.group) ?? []), item]);
  return [...groups];
}

const meta: Meta = {
  title: 'Foundations/Palette (reference only)',
  parameters: { layout: 'fullscreen' },
};
export default meta;

export const Reference: StoryObj = {
  render: (_, { globals }) => (
    <Page title="Palette (reference only)">
      <Notice>
        Do not use in components. Primitives and alias colors are shown for reference only. Components use the
        semantic colors on the Colors page (DESIGN.md §2, §3.8).
      </Notice>

      <Section title="Primitives (--fin-palette-*)">
        {byGroup(finPaletteReference).map(([group, items]) => (
          <div key={group} className={styles.section}>
            <h3 className={styles.cardTitle}>{group}</h3>
            <div className={styles.grid}>
              {items.map((item) => (
                <Swatch key={item.name} color={`var(${item.name})`} deps={[globals.theme]} />
              ))}
            </div>
          </div>
        ))}
      </Section>

      {Object.entries(finAliasReference).map(([brand, aliases]) => (
        // Alias colors are defined per [data-brand] block, so each brand can be shown here side by side.
        <div key={brand} data-brand={brand} className={styles.section}>
          <Section title={`Alias colors (--fin-color-*), brand: ${brand}`}>
            {byGroup(aliases).map(([group, items]) => (
              <div key={group} className={styles.section}>
                <h3 className={styles.cardTitle}>{group}</h3>
                <div className={styles.grid}>
                  {items.map((item) => (
                    <Swatch
                      key={item.name}
                      color={`var(${item.name})`}
                      note={`→ ${item.value.replace(/^var\((.+)\)$/, '$1')}`}
                      deps={[globals.theme]}
                    />
                  ))}
                </div>
              </div>
            ))}
          </Section>
        </div>
      ))}
    </Page>
  ),
};
