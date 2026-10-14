import * as a11yAnnotations from '@storybook/addon-a11y/preview';
import { setProjectAnnotations } from '@storybook/react-vite';
import { inject } from 'vitest';
import * as projectAnnotations from './preview';

declare module 'vitest' {
  export interface ProvidedContext {
    theme: 'light' | 'dark';
  }
}

// Each Vitest project (a11y-light, a11y-dark) runs all stories with its theme as the toolbar global.
setProjectAnnotations([a11yAnnotations, projectAnnotations, { initialGlobals: { theme: inject('theme') } }]);
