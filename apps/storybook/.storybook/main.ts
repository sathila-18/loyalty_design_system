import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.stories.tsx', '../../../packages/ui/src/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  core: { disableTelemetry: true },
  // Pages import '@finspace-loyalty/ui' like an app; take it from source (as the component stories do), so pages
  // get the components' CSS and every change reloads live, without building the library first.
  viteFinal: (viteConfig) => ({
    ...viteConfig,
    resolve: {
      ...viteConfig.resolve,
      alias: [
        { find: /^@finspace-loyalty\/ui$/, replacement: fileURLToPath(new URL('../../../packages/ui/src/index.ts', import.meta.url)) },
        ...(Array.isArray(viteConfig.resolve?.alias) ? viteConfig.resolve.alias : Object.entries(viteConfig.resolve?.alias ?? {}).map(([find, replacement]) => ({ find, replacement }))),
      ],
    },
  }),
};

export default config;
