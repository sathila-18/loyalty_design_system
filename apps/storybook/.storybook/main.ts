import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.stories.tsx', '../../../packages/ui/src/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  core: { disableTelemetry: true },
  // Pages import '@finspace-loyalty/ui' like an app; take it from source (as the component stories do), so pages
  // get the components' CSS and every change reloads live, without building the library first.
  // Tailwind (DESIGN.md §3.11): one compile for everything, from .storybook/tailwind.css. The library's
  // components.css (imported by its index.ts, which the pages use) is pointed at it, so it isn't compiled twice.
  viteFinal: (viteConfig) => ({
    ...viteConfig,
    plugins: [...(viteConfig.plugins ?? []), tailwindcss()],
    resolve: {
      ...viteConfig.resolve,
      alias: [
        { find: /^\.\/styles\/components\.css$/, replacement: fileURLToPath(new URL('./tailwind.css', import.meta.url)) },
        { find: /^@finspace-loyalty\/ui$/, replacement: fileURLToPath(new URL('../../../packages/ui/src/index.ts', import.meta.url)) },
        ...(Array.isArray(viteConfig.resolve?.alias) ? viteConfig.resolve.alias : Object.entries(viteConfig.resolve?.alias ?? {}).map(([find, replacement]) => ({ find, replacement }))),
      ],
    },
  }),
};

export default config;
