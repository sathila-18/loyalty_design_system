import { FinTextBox } from '@finspace-loyalty/ui';
import { SignInPage } from '@/components/SignInPage';

// Step 2: the shell with a placeholder form column; the real login form comes in step 3.
export default function LoginPage() {
  return (
    <SignInPage artwork="trophy">
      <FinTextBox type="h2" headingLevel={1} heading="Get started now!" description="Please enter the login credentials here" />
    </SignInPage>
  );
}
