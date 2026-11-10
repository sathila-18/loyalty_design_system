import type { Meta, StoryObj } from '@storybook/react-vite';
import { FinButton } from '../Button';
import { FinPasswordField } from '../PasswordField';
import { FinTextBox } from '../TextBox';
import { FinTextField } from '../TextField';
import { FinSignInLayout } from './FinSignInLayout';
import styles from './FinSignInLayout.stories.module.css';

/* The login app's artwork (apps/login/public/sign-in, served by Storybook's staticDirs). The library ships none. */
const ARTWORK = { trophy: '/sign-in/trophy.jpg', detective: '/sign-in/detective.jpg' } as const;

const TITLE = 'Customer Engagement Management Portal';
const DESCRIPTION =
  'Start your journey toward stronger customer engagement with our innovative loyalty and gamification solutions. Build meaningful interactions, reward participation, and create lasting customer relationships.';

/** A stand-in form, as Figma's login screen: a Text Box, two fields and the button. */
function SampleForm() {
  return (
    <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
      <FinTextBox type="h2" headingLevel={1} heading="Get started now!" description="Please enter the login credentials here" />
      <div className={styles.fields}>
        <FinTextField label="User name/ email" />
        <FinPasswordField label="Password" />
      </div>
      <FinButton type="submit">Login</FinButton>
    </form>
  );
}

interface Args {
  artwork: keyof typeof ARTWORK;
  imageTitle: string;
  imageDescription: string;
}

/**
 * The page shell for sign-in screens (code first, DESIGN.md §9.84). From 1024 the image panel is on the left (inset 24,
 * Radius-XL) and the form column on the right, 4 of the 12 grid columns wide (never under 343), centred. Below 1024
 * only the form shows, centred. Use the viewport menu, or narrow the canvas.
 */
const meta = {
  title: 'Components/Layout/Sign in layout',
  parameters: { layout: 'fullscreen' },
  argTypes: {
    artwork: { control: 'inline-radio', options: Object.keys(ARTWORK), description: 'The story\'s artwork (the `image` slot).' },
    imageTitle: { control: 'text', description: 'The heading over the artwork. Empty: none.' },
    imageDescription: { control: 'text', description: 'The text under it. Empty: none.' },
  },
  args: { artwork: 'trophy', imageTitle: TITLE, imageDescription: DESCRIPTION },
  render: ({ artwork, imageTitle, imageDescription }) => (
    <FinSignInLayout
      image={<img className={styles.image} src={ARTWORK[artwork]} alt="" />}
      imageTitle={imageTitle || undefined}
      imageDescription={imageDescription || undefined}
    >
      <SampleForm />
    </FinSignInLayout>
  ),
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<typeof meta>;

/** As Figma's login screen (`135:4939`): the trophy artwork with the portal's title and description. */
export const Playground: Story = {};

/** As Figma's forgot password screens (`435:90303`): the artwork alone, no text or scrim. */
export const ImageOnly: Story = { args: { artwork: 'detective', imageTitle: '', imageDescription: '' } };

/** A long title and description: the text grows up from the bottom, 48 from the panel's edges. */
export const LongText: Story = {
  args: {
    imageTitle: 'Customer engagement, loyalty and gamification management portal for every branch',
    imageDescription: `${DESCRIPTION} ${DESCRIPTION}`,
  },
};

/** At 1024, the narrowest two-half width: the form column is 343 (4 columns would be 309). */
export const At1024: Story = { name: 'At 1024', globals: { viewport: { value: 'desktop1024', isRotated: false } } };

/** Below 1024 (here 768): no image panel; the form is centred, up to 343, with a 16 gutter. */
export const Narrow: Story = { globals: { viewport: { value: 'narrow768', isRotated: false } } };
