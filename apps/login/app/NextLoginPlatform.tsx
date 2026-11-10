'use client';

import type { FinBrand } from '@finspace-loyalty/tokens';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, type ReactNode } from 'react';
import * as mockAuth from '@/lib/auth';
import detective from '@/public/sign-in/detective.jpg';
import trophy from '@/public/sign-in/trophy.jpg';
import { LoginPlatformProvider, type LoginArtwork, type LoginPlatform, type LoginRoute } from '@/screens';

/*
 * The Next.js side of the shared screens (CLAUDE.md "Login work"): next/link, next/image, the router and the auth.
 * To connect the real API, replace `mockAuth` here (or the bodies in lib/auth.ts) with calls of the same signatures.
 */
const ROUTES: Record<LoginRoute, string> = {
  login: '/login',
  'forgot-password': '/forgot-password',
  'forgot-password-sent': '/forgot-password/sent',
  'reset-password': '/reset-password',
  'reset-password-done': '/reset-password/done',
};

const IMAGES = { trophy, detective };

/* The panel is half the window from 1024 (hidden below), less its 24 inset; next/image serves WebP or AVIF at that size. */
function NextArtwork({ artwork }: { artwork: LoginArtwork }) {
  return <Image src={IMAGES[artwork]} alt="" fill sizes="50vw" priority placeholder="blur" />;
}

export function NextLoginPlatform({ brand, children }: { brand: FinBrand; children: ReactNode }) {
  const router = useRouter();
  const platform = useMemo<LoginPlatform>(
    () => ({
      brand,
      Link,
      href: (route) => ROUTES[route],
      navigate: (route) => router.push(ROUTES[route]),
      Artwork: NextArtwork,
      auth: mockAuth,
    }),
    [brand, router],
  );
  return <LoginPlatformProvider value={platform}>{children}</LoginPlatformProvider>;
}
