import type { Decorator, Preview } from '@storybook/react-vite';
import { finBrands, finThemes, type FinBrand, type FinTheme } from '@finspace-loyalty/tokens';
// The same stylesheet apps get (tokens, fonts, reset), from source so changes reload live.
import '../../../packages/ui/src/styles/index.css';
// The Tailwind utilities of the components, stories and pages (DESIGN.md §3.11).
import './tailwind.css';
import { colorContrastSelector } from './brandContrastExceptions';
import styles from './preview.module.css';

/**
 * After a deploy, a tab opened before it still asks for the old build's files, which are gone: Safari shows
 * "Importing a module script failed", Chrome "Failed to fetch dynamically imported module". Vite fires
 * `vite:preloadError` then; reloading the preview picks up the new build (Vite's advice). At most once every 10
 * seconds, so a file that's really missing shows Storybook's error instead of reloading forever.
 */
const RELOADED_AT = 'fin-preview-reloaded-at';
window.addEventListener('vite:preloadError', (event) => {
  let last = 0;
  try {
    last = Number(sessionStorage.getItem(RELOADED_AT)) || 0;
  } catch {
    // No storage (private window, blocked): reload anyway; the guard is only lost.
  }
  if (Date.now() - last < 10_000) return;
  try {
    sessionStorage.setItem(RELOADED_AT, String(Date.now()));
  } catch {
    // As above.
  }
  event.preventDefault();
  window.location.reload();
});

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

/**
 * Wait for the fonts before a story renders. Without the icon font, a glyph is plain text ("edit"),
 * and the a11y check judges it as words: contrast as text, and button text missing from the label.
 * Both brand fonts are loaded (Inter; Hanken Grotesk for Sampath, DESIGN.md §3.4), so switching
 * brand in the toolbar never measures text in the fallback font.
 */
const loadFonts = async () => {
  await Promise.all([
    document.fonts.load('24px "Material Symbols Rounded"', 'home'),
    ...[400, 500, 600, 700].map((weight) => document.fonts.load(`${weight} 16px Inter`)),
    ...[400, 500, 600, 700, 800].map((weight) => document.fonts.load(`${weight} 16px "Hanken Grotesk"`)),
  ]);
};

const preview: Preview = {
  decorators: [withThemeAndBrand],
  loaders: [loadFonts],
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
    // WCAG 2.2 AA (CLAUDE.md). 'error' fails the story's test in pnpm test:a11y.
    a11y: {
      test: 'error',
      options: { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } },
      // Brand contrast exceptions accepted by design (DESIGN.md §10): color-contrast only, only on the listed
      // elements, only for that brand and theme (brandContrastExceptions.ts).
      config: { rules: [{ id: 'color-contrast', selector: colorContrastSelector() }] },
    },
    // Page background comes from the theme (reset.css), not Storybook's backgrounds tool.
    backgrounds: { disable: true },
    // The page widths (DESIGN.md §4.4): every page is checked at these. Figma's screens are 1920 × 1080.
    viewport: {
      options: {
        desktop1920: { name: '1920 × 1080 (Figma)', styles: { width: '1920px', height: '1080px' }, type: 'desktop' },
        desktop1440: { name: '1440 × 900', styles: { width: '1440px', height: '900px' }, type: 'desktop' },
        desktop1280: { name: '1280 × 800', styles: { width: '1280px', height: '800px' }, type: 'desktop' },
        desktop1024: { name: '1024 × 768 (side nav minimized)', styles: { width: '1024px', height: '768px' }, type: 'desktop' },
      },
    },
    options: {
      storySort: { order: ['Foundations', ['Colors', 'Typography', 'Spacing', 'Radius', 'Shadows', 'Grid', 'Breakpoints', 'Tailwind utilities', 'Palette (reference only)'], 'Pages', 'Components', 'Internal'] },
    },
  },
};

export default preview;
