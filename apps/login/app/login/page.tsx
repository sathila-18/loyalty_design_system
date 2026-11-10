import { FinTextBox } from '@finspace-loyalty/ui';
import type { Metadata } from 'next';
import { AppLogo } from '@/components/AppLogo';
import { SignInPage } from '@/components/SignInPage';
import { BRAND } from '@/lib/brand';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = { title: 'Login' };

// Figma `135:4939`: the logo, 16 above the Text Box (Display Medium-H2), 32 above the form.
export default function LoginPage() {
  return (
    <SignInPage artwork="trophy">
      <div className="flex flex-col gap-4xl">
        <div className="flex flex-col gap-xl">
          <AppLogo brand={BRAND} />
          <FinTextBox type="h2" headingLevel={1} heading="Get started now!" description="Please enter the login credentials here" />
        </div>
        <LoginForm />
      </div>
    </SignInPage>
  );
}
