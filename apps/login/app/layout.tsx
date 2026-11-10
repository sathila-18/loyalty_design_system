// As NEXTJS-USAGE.md says: one stylesheet (the library and the app's Tailwind, globals.css), and the brand and theme on <html>.
import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { BRAND, THEME } from '@/lib/brand';
import { NextLoginPlatform } from './NextLoginPlatform';

export const metadata: Metadata = {
  title: { default: 'Sign in', template: '%s · Customer engagement management portal' },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-brand={BRAND} data-theme={THEME}>
      <body>
        <NextLoginPlatform brand={BRAND}>{children}</NextLoginPlatform>
      </body>
    </html>
  );
}
