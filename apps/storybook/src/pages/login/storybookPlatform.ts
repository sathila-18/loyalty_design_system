import type { FinBrand } from '@finspace-loyalty/tokens';
import * as mockAuth from '@finspace-loyalty/login/auth';
import type { LoginAuth, LoginPlatform } from '@finspace-loyalty/login/screens';
import { StoryArtwork, StoryLink } from './StoryLoginParts';
import { logNavigation, storyHref } from './storyRoutes';

/*
 * Storybook's side of the shared login screens (CLAUDE.md "Login work"): plain links, <img> artwork and the mock auth
 * (StoryLoginParts.tsx). `auth` replaces mock calls for one story (a sign-in that never answers, for Submitting).
 */
export function storybookPlatform(brand: FinBrand, auth: Partial<LoginAuth> = {}): LoginPlatform {
  return {
    brand,
    Link: StoryLink,
    href: storyHref,
    navigate: (route) => {
      const href = storyHref(route);
      if (href.startsWith('/?path=') && window.top) window.top.location.href = href;
      else logNavigation(route);
    },
    Artwork: StoryArtwork,
    auth: { ...mockAuth, ...auth },
  };
}
