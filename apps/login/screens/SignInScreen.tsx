'use client';

import { FinSignInLayout } from '@finspace-loyalty/ui';
import type { ReactNode } from 'react';
import { useLoginPlatform, type LoginArtwork } from './platform';

/*
 * Every screen's shell: FinSignInLayout with the artwork from the platform (the library ships none). Login: the
 * laptop photo with the portal's title and description (Figma Admin UI V2, changed by design 19 Nov 2026); Reset
 * password: the trophy with the same text; the detective alone (Forgot password and the two confirmations), as Login
 * Option 02.
 */
const PORTAL = {
  title: 'Customer Engagement Management Portal',
  description:
    'Start your journey toward stronger customer engagement with our innovative loyalty and gamification solutions. Build meaningful interactions, reward participation, and create lasting customer relationships.',
};
const TEXT: Record<LoginArtwork, { title?: string; description?: string }> = {
  laptop: PORTAL,
  trophy: PORTAL,
  detective: {},
};

export function SignInScreen({ artwork, children }: { artwork: LoginArtwork; children: ReactNode }) {
  const { Artwork } = useLoginPlatform();
  return (
    <FinSignInLayout image={<Artwork artwork={artwork} />} imageTitle={TEXT[artwork].title} imageDescription={TEXT[artwork].description}>
      {children}
    </FinSignInLayout>
  );
}
