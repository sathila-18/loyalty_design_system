import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { finBrands, finThemes, type FinBrand, type FinTheme } from '@finspace-loyalty/tokens';

// Runs every story in a real browser with the a11y check (WCAG 2.2 AA), once per brand × theme
// (DESIGN.md §3.10). Uses the installed Google Chrome, so no Playwright browser download is needed.
const project = (brand: FinBrand, theme: FinTheme) => ({
  extends: true,
  plugins: [storybookTest({ configDir: '.storybook' })],
  test: {
    name: `a11y-${brand}-${theme}`,
    provide: { brand, theme },
    setupFiles: ['.storybook/vitest.setup.ts'],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({ launchOptions: { channel: 'chrome' } }),
      instances: [{ browser: 'chromium' as const }],
    },
  },
});

export default defineConfig({
  test: {
    projects: finBrands.flatMap((brand) => finThemes.map((theme) => project(brand, theme))),
  },
});
