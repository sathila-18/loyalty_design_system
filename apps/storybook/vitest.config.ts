import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

// Runs every story in a real browser with the a11y check (WCAG 2.2 AA), once per theme.
// Uses the installed Google Chrome, so no Playwright browser download is needed.
const themeProject = (theme: 'light' | 'dark') => ({
  extends: true,
  plugins: [storybookTest({ configDir: '.storybook' })],
  test: {
    name: `a11y-${theme}`,
    provide: { theme },
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
    projects: [themeProject('light'), themeProject('dark')],
  },
});
