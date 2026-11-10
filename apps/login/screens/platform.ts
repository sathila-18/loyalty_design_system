'use client';

import type { FinBrand } from '@finspace-loyalty/tokens';
import { createContext, useContext, type ComponentType, type ElementType } from 'react';
import type { requestPasswordReset, resetPassword, signIn } from '../lib/auth';

/*
 * What the shared screens need from where they run (CLAUDE.md "Login work"). The screens never import Next.js:
 * apps/login provides this with next/link, next/image and the router (app/NextLoginPlatform.tsx); Storybook with
 * plain links, <img> and the mock auth (apps/storybook/src/pages/login/storybookPlatform.tsx).
 */

/** Every screen of the sign-in flow (Figma Login Option 02). */
export type LoginRoute = 'login' | 'forgot-password' | 'forgot-password-sent' | 'reset-password' | 'reset-password-done';

/** The artwork in the image panel. */
export type LoginArtwork = 'trophy' | 'detective';

/** The calls the screens make. The mock is lib/auth.ts; the real API replaces it with the same signatures. */
export interface LoginAuth {
  signIn: typeof signIn;
  requestPasswordReset: typeof requestPasswordReset;
  resetPassword: typeof resetPassword;
}

export interface LoginPlatform {
  /** The deployment's brand (the logo follows it). */
  brand: FinBrand;
  /** The link component for FinButton's `linkAs`: next/link's `Link`, or a plain `<a>`. */
  Link: ElementType;
  /** The address of a screen. */
  href: (route: LoginRoute) => string;
  /** Go to a screen after an action (a form sent). */
  navigate: (route: LoginRoute) => void;
  /** Renders the panel's artwork (next/image, or `<img>`), filling it; decorative (`alt=""`). */
  Artwork: ComponentType<{ artwork: LoginArtwork }>;
  auth: LoginAuth;
}

/** Provided by LoginPlatformProvider. */
export const LoginPlatformContext = createContext<LoginPlatform | null>(null);

export function useLoginPlatform(): LoginPlatform {
  const platform = useContext(LoginPlatformContext);
  if (!platform) throw new Error('The login screens need a <LoginPlatformProvider> (apps/login: app/layout.tsx; Storybook: the Pages/Login decorator).');
  return platform;
}
