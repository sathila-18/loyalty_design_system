import { redirect } from 'next/navigation';

// The app's only entry point is the login screen.
export default function Home() {
  redirect('/login');
}
