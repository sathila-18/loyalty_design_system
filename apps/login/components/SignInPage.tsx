import { FinSignInLayout } from '@finspace-loyalty/ui';
import Image, { type StaticImageData } from 'next/image';
import type { ReactNode } from 'react';
import detective from '@/public/sign-in/detective.jpg';
import trophy from '@/public/sign-in/trophy.jpg';

/*
 * Every screen's shell: FinSignInLayout with the app's artwork (the library ships none). As Figma's Login Option 02:
 * the trophy with the portal's title and description (Login, Reset password), the detective alone (Forgot password and
 * the two confirmations). next/image serves each at the panel's size, as WebP or AVIF.
 */
const ARTWORK = {
  trophy: {
    image: trophy,
    title: 'Customer Engagement Management Portal',
    description:
      'Start your journey toward stronger customer engagement with our innovative loyalty and gamification solutions. Build meaningful interactions, reward participation, and create lasting customer relationships.',
  },
  detective: { image: detective },
} satisfies Record<string, { image: StaticImageData; title?: string; description?: string }>;

export type Artwork = keyof typeof ARTWORK;

export function SignInPage({ artwork, children }: { artwork: Artwork; children: ReactNode }) {
  const art: { image: StaticImageData; title?: string; description?: string } = ARTWORK[artwork];
  return (
    <FinSignInLayout
      // The panel is half the window from 1024 (hidden below), less its 24 inset.
      image={<Image src={art.image} alt="" fill sizes="50vw" priority placeholder="blur" />}
      imageTitle={art.title}
      imageDescription={art.description}
    >
      {children}
    </FinSignInLayout>
  );
}
