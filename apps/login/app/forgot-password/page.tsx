import { FinTextBox } from '@finspace-loyalty/ui';
import { SignInPage } from '@/components/SignInPage';

// Placeholder until step 4 (the Forgot password screen), so the Login screen's link has somewhere to go.
export default function ForgotPasswordPage() {
  return (
    <SignInPage artwork="detective">
      <FinTextBox type="h2" headingLevel={1} heading="Forgot password" description="This screen comes in the next step." />
    </SignInPage>
  );
}
