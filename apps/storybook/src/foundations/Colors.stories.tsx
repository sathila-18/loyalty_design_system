import type { Meta, StoryObj } from '@storybook/react-vite';
import { finColor } from '@finspace-loyalty/tokens';
import { Page, Section, Swatch } from './Foundations';
import styles from './Foundations.module.css';

const GROUPS = [
  ['Background', 'bg'],
  ['Text', 'text'],
  ['Border', 'border'],
  ['Foreground (icons)', 'fg'],
  ['Alpha', 'alpha'],
] as const;

const meta: Meta = {
  title: 'Foundations/Colors',
  parameters: { layout: 'fullscreen' },
};
export default meta;

export const Semantic: StoryObj = {
  render: (_, { globals }) => (
    <Page
      title="Colors"
      intro="Semantic colors: the only colors components use. Values follow the theme and brand in the toolbar (DESIGN.md §3.3)."
    >
      {GROUPS.map(([label, prefix]) => (
        <Section key={prefix} title={label}>
          <div className={styles.grid}>
            {Object.entries(finColor)
              .filter(([key]) => key.startsWith(prefix))
              .map(([key, color]) => (
                <Swatch key={key} color={color} deps={[globals.theme, globals.brand]} />
              ))}
          </div>
        </Section>
      ))}
    </Page>
  ),
};
