import type { Metadata } from 'next';
import { LoginScreen } from '@/screens';

export const metadata: Metadata = { title: 'Login' };

// The shared screen (screens/LoginScreen); links, artwork and auth come from NextLoginPlatform (app/layout.tsx).
export default function LoginPage() {
  return <LoginScreen />;
}
