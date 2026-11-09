// As NEXTJS-USAGE.md says: the one stylesheet, and the brand and theme on <html>.
import '@finspace-loyalty/ui/index.css';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-brand="sampath" data-theme="light">
      <body>{children}</body>
    </html>
  );
}
