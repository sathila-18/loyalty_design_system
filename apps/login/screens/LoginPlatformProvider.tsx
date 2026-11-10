'use client';

import type { ReactNode } from 'react';
import { LoginPlatformContext, type LoginPlatform } from './platform';

/** Gives the screens what they need from where they run (platform.ts): apps/login's NextLoginPlatform, or Storybook's decorator. */
export function LoginPlatformProvider({ value, children }: { value: LoginPlatform; children: ReactNode }) {
  return <LoginPlatformContext.Provider value={value}>{children}</LoginPlatformContext.Provider>;
}
