import '@finspace-loyalty/login/screens/screens.css';
import { finBrands, type FinBrand } from '@finspace-loyalty/tokens';
import { LoginPlatformProvider, LoginScreen, type LoginAuth } from '@finspace-loyalty/login/screens';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { storybookPlatform } from './storybookPlatform';

/**
 * The shared screen (apps/login/screens, also the Next.js app's /login) with Storybook's platform: plain links, the
 * mock auth, the Brand toolbar for the logo. `parameters.loginAuth` replaces mock calls for one story.
 */
const withLoginPlatform: Decorator = (Story, { globals, parameters }) => {
  const brand = finBrands.includes(globals['brand'] as FinBrand) ? (globals['brand'] as FinBrand) : 'finspace';
  return (
    <LoginPlatformProvider value={storybookPlatform(brand, parameters['loginAuth'] as Partial<LoginAuth> | undefined)}>
      <Story />
    </LoginPlatformProvider>
  );
};

/**
 * Figma Login Option 02, Login (`135:4939`): FinSignInLayout with the trophy artwork; the logo, "Get started now!",
 * user name/ email and password, Forgot password (a Tertiary link, flush with the fields), Remember me, Login (Medium,
 * the fields' height). Mock auth: any user name, password `wrong` fails, anything else signs in. Use the viewport menu
 * for 1440, 1280, 1024 and 768 (no image).
 */
const meta = {
  title: 'Pages/Login/Login',
  component: LoginScreen,
  decorators: [withLoginPlatform],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof LoginScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const fill = async (canvasElement: HTMLElement, password: string) => {
  const canvas = within(canvasElement);
  await userEvent.type(canvas.getByLabelText('User name/ email'), 'olivia.james@bank.lk');
  await userEvent.type(canvas.getByLabelText('Password', { selector: 'input' }), password);
  await userEvent.click(canvas.getByRole('button', { name: 'Login' }));
  return canvas;
};

/** As Figma: empty fields. */
export const Default: Story = {};

/** Login pressed with both fields empty: an error under each, focus on the first (code first; the screens show none). */
export const EmptyFieldErrors: Story = {
  name: 'Empty-field errors',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Login' }));
    await expect(canvas.getByText('Enter your user name or email')).toBeInTheDocument();
    await expect(canvas.getByText('Enter your password')).toBeInTheDocument();
    await expect(canvas.getByLabelText('User name/ email')).toHaveFocus();
  },
};

/** Password `wrong`: the error banner above the fields (code first). */
export const WrongPassword: Story = {
  name: 'Wrong password',
  play: async ({ canvasElement }) => {
    const canvas = await fill(canvasElement, 'wrong');
    await waitFor(() => expect(canvas.getByText(/incorrect/)).toBeInTheDocument(), { timeout: 3000 });
  },
};

/** While signing in: the button turns off and says "Logging in…" (this story's sign-in never answers). */
export const Submitting: Story = {
  parameters: { loginAuth: { signIn: () => new Promise<never>(() => {}) } satisfies Partial<LoginAuth> },
  play: async ({ canvasElement }) => {
    const canvas = await fill(canvasElement, 'Secret123');
    await expect(canvas.getByRole('button', { name: 'Logging in…' })).toBeDisabled();
  },
};

/** Signed in: the success banner (demo; in the real app this opens the dashboard). */
export const Success: Story = {
  play: async ({ canvasElement }) => {
    const canvas = await fill(canvasElement, 'Secret123');
    await waitFor(() => expect(canvas.getByText(/Signed in/)).toBeInTheDocument(), { timeout: 3000 });
  },
};
