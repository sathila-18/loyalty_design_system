import { finBrands, type FinBrand } from '@finspace-loyalty/tokens';
import { LoginPlatformProvider, type LoginAuth } from '@finspace-loyalty/login/screens';
import type { Decorator } from '@storybook/react-vite';
import { storybookPlatform } from './storybookPlatform';

/**
 * The shared screens (apps/login/screens) with Storybook's platform: plain links, the mock auth, the Brand toolbar for
 * the logo. `parameters.loginAuth` replaces mock calls for one story.
 */
export const withLoginPlatform: Decorator = (Story, { globals, parameters }) => {
  const brand = finBrands.includes(globals['brand'] as FinBrand) ? (globals['brand'] as FinBrand) : 'finspace';
  return (
    <LoginPlatformProvider value={storybookPlatform(brand, parameters['loginAuth'] as Partial<LoginAuth> | undefined)}>
      <Story />
    </LoginPlatformProvider>
  );
};
