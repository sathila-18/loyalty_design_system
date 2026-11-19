import '@finspace-loyalty/login/screens/screens.css';
import { TenantScreen, organisationInitials } from '@finspace-loyalty/login/screens';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { withLoginPlatform } from './withLoginPlatform';

/**
 * Select your organisation (design's screenshot, 19 Nov 2026; Storybook only): after sign-in, an account with several
 * organisations picks one. The Login screen's shell, laptop photo and header; each organisation a filled list card
 * (initials, name, chevron); "Back to login" opens the Login story. Choosing one shows a demo banner. Use the viewport
 * menu for 1440, 1280, 1024 and 768 (no image).
 */
const meta = {
  title: 'Pages/Login/Tenant',
  component: TenantScreen,
  decorators: [withLoginPlatform],
  parameters: { layout: 'fullscreen' },
  args: {
    organisations: [
      { id: 'testname1', name: 'testname1' },
      { id: 'testname2', name: 'testname2' },
    ],
  },
} satisfies Meta<typeof TenantScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** As design's screenshot: two organisations. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Select your organisation' })).toBeInTheDocument();
    await expect(canvas.getAllByRole('button', { name: /testname/ })).toHaveLength(2);
    await expect(organisationInitials('testname1')).toBe('TE');
    await expect(organisationInitials('Bank of Ceylon')).toBe('BC');
  },
};

/** Eight organisations, with names of several words (initials from the first and last words). */
export const ManyOrganisations: Story = {
  name: 'Many organisations',
  args: {
    organisations: [
      'Bank of Ceylon',
      'Sampath Bank',
      'Commercial Bank',
      'Hatton National Bank',
      'Seylan Bank',
      'Nations Trust Bank',
      'DFCC Bank',
      'Pan Asia Bank',
    ].map((name) => ({ id: name, name })),
  },
};

/** A long name wraps onto more lines in its card (decided by design 19 Nov 2026). */
export const LongNames: Story = {
  name: 'Long names',
  args: {
    organisations: [
      { id: 'long', name: 'Finspace Loyalty Programme for Retail and Corporate Banking Customers, Western Province' },
      { id: 'short', name: 'testname2' },
    ],
  },
};

/** An organisation chosen: the demo banner (in the real app it opens that organisation's dashboard). */
export const Chosen: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /testname1/ }));
    await expect(canvas.getByText(/Opening testname1/)).toBeInTheDocument();
  },
};
