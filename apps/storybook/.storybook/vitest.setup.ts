import * as a11yAnnotations from '@storybook/addon-a11y/preview';
import { setProjectAnnotations } from '@storybook/react-vite';
import { inject } from 'vitest';
import * as projectAnnotations from './preview';

import type { FinBrand, FinTheme } from '@finspace-loyalty/tokens';

declare module 'vitest' {
  export interface ProvidedContext {
    brand: FinBrand;
    theme: FinTheme;
  }
}

// Each Vitest project (a11y-<brand>-<theme>) runs all stories with its brand and theme as the toolbar globals.
setProjectAnnotations([
  a11yAnnotations,
  projectAnnotations,
  { initialGlobals: { brand: inject('brand'), theme: inject('theme') } },
]);
