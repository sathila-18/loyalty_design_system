import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.stories.tsx', '../../../packages/ui/src/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs'],
  core: { disableTelemetry: true },
};

export default config;
