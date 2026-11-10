'use client';

import { FinTextBox } from '@finspace-loyalty/ui';
import { AppLogo } from './AppLogo';
import { LoginForm } from './LoginForm';
import { useLoginPlatform } from './platform';
import { SignInScreen } from './SignInScreen';

// Figma `135:4939`: the logo, 16 above the Text Box (Display Medium-H2), 32 above the form.
export function LoginScreen() {
  const { brand } = useLoginPlatform();
  return (
    <SignInScreen artwork="trophy">
      <div className="flex flex-col gap-4xl">
        <div className="flex flex-col gap-xl">
          <AppLogo brand={brand} />
          <FinTextBox type="h2" headingLevel={1} heading="Get started now!" description="Please enter the login credentials here" />
        </div>
        <LoginForm />
      </div>
    </SignInScreen>
  );
}
