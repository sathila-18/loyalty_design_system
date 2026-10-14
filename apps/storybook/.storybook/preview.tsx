import type { Decorator, Preview } from '@storybook/react-vite';
import { finBrands, finThemes, type FinBrand, type FinTheme } from '@finspace-loyalty/tokens';
// The same stylesheet apps get (tokens, fonts, reset), from source so changes reload live.
import '../../../packages/ui/src/styles/index.css';
import styles from './preview.module.css';

type ThemeGlobal = FinTheme | 'side-by-side';

const title = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Theme and brand go on <html> (DESIGN.md §3.0). Side by side sets data-theme on two panels instead. */
const withThemeAndBrand: Decorator = (Story, { globals }) => {
  const theme = globals.theme as ThemeGlobal;
  const root = document.documentElement;
  root.dataset.brand = globals.brand as FinBrand;
  root.dataset.theme = theme === 'side-by-side' ? finThemes[0] : theme;

  if (theme !== 'side-by-side') return <Story />;
  return (
    <div className={styles.sideBySide}>
      {finThemes.map((t) => (
        <div key={t} className={styles.panel} data-theme={t}>
          <Story />
        </div>
      ))}
    </div>
  );
};

const preview: Preview = {
  decorators: [withThemeAndBrand],
  globalTypes: {
    theme: {
      description: 'Theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        dynamicTitle: true,
        items: [
          ...finThemes.map((t) => ({ value: t, title: title(t) })),
          { value: 'side-by-side', title: 'Side by side' },
        ],
      },
    },
    brand: {
      description: 'Brand',
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        dynamicTitle: true,
        items: finBrands.map((b) => ({ value: b, title: title(b) })),
      },
    },
  },
  initialGlobals: { theme: finThemes[0], brand: finBrands[0] },
  parameters: {
    // Page background comes from the theme (reset.css), not Storybook's backgrounds tool.
    backgrounds: { disable: true },
    options: {
      storySort: { order: ['Foundations', ['Colors', 'Typography', 'Spacing', 'Radius', 'Shadows', 'Grid', 'Breakpoints', 'Palette (reference only)'], 'Components'] },
    },
  },
};

export default preview;
