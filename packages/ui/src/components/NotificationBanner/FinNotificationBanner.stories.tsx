import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { FinNotificationBanner, type FinNotificationBannerTone } from './FinNotificationBanner';
import styles from './FinNotificationBanner.stories.module.css';

const TITLE = 'Notification title';
const DESCRIPTION = 'This phrase symbolizes the smooth and uninterrupted flow.';
const TONES: FinNotificationBannerTone[] = ['info', 'success', 'error', 'warning', 'neutral'];

interface Args {
  tone: FinNotificationBannerTone;
  showTitle: boolean;
  title: string;
  showDescription: boolean;
  description: string;
  showIcon: boolean;
  showButton: boolean;
  buttonLabel: string;
  showClose: boolean;
}

/**
 * A message that stays on the page (Figma Notification; DESIGN.md §9). Usually the description alone; a title only for
 * the rare cases that need one. Fills its container (shown here 343 wide, as Figma, except "Full width").
 */
const meta: Meta<Args> = {
  title: 'Components/Notification banner',
  args: {
    tone: 'info',
    showTitle: false,
    title: TITLE,
    showDescription: true,
    description: DESCRIPTION,
    showIcon: true,
    showButton: true,
    buttonLabel: 'Text here',
    showClose: true,
  },
  argTypes: {
    tone: { control: 'inline-radio', options: TONES, description: 'Figma `Type` (`tone`)' },
    showTitle: { control: 'boolean', description: 'Figma `Show Title` (`title`)' },
    title: { control: 'text', description: 'Figma `Title text` (`title`)', if: { arg: 'showTitle' } },
    showDescription: { control: 'boolean', description: 'Figma `Show Description` (`children`)' },
    description: { control: 'text', description: 'Figma `Description` (`children`)', if: { arg: 'showDescription' } },
    showIcon: { control: 'boolean', description: 'Figma `Show Leading Icon` (`showIcon`)' },
    showButton: { control: 'boolean', description: 'Figma `Show Button` (`action`)' },
    buttonLabel: { control: 'text', description: "The button's label", if: { arg: 'showButton' } },
    showClose: { control: 'boolean', description: 'Figma `Show Close` (`onClose`)' },
  },
  decorators: [
    (Story, { parameters }) => (
      <div className={parameters['fullWidth'] ? styles.full : styles.figma}>
        <Story />
      </div>
    ),
  ],
  render: ({ tone, showTitle, title, showDescription, description, showIcon, showButton, buttonLabel, showClose }) => (
    <FinNotificationBanner
      tone={tone}
      showIcon={showIcon}
      {...(showTitle ? { title } : {})}
      {...(showButton ? { action: { label: buttonLabel, onClick: fn() } } : {})}
      {...(showClose ? { onClose: fn() } : {})}
    >
      {showDescription ? description : undefined}
    </FinNotificationBanner>
  ),
};
export default meta;
type Story = StoryObj<Args>;

/** The usual banner: the description, the button and the close button, without a title. */
export const Playground: Story = {};

/** Every Figma variant (`Type`), with every part shown, as in the component set. */
export const AllVariants: Story = {
  name: 'All variants (Figma)',
  render: () => (
    <>
      {TONES.map((tone) => (
        <FinNotificationBanner key={tone} tone={tone} title={TITLE} action={{ label: 'Text here', onClick: fn() }} onClose={fn()}>
          {DESCRIPTION}
        </FinNotificationBanner>
      ))}
    </>
  ),
};

/** The description alone in every tone, the most common use. */
export const DescriptionOnly: Story = {
  name: 'Description only',
  render: () => (
    <>
      {TONES.map((tone) => (
        <FinNotificationBanner key={tone} tone={tone}>
          {DESCRIPTION}
        </FinNotificationBanner>
      ))}
    </>
  ),
};

/** With a title, for the cases that need one. */
export const WithTitle: Story = {
  name: 'With title',
  args: { showTitle: true },
};

/** Without the icon. */
export const NoIcon: Story = {
  name: 'Without icon',
  args: { showIcon: false },
};

/** Without the close button: the description runs to the right padding. */
export const NoClose: Story = {
  name: 'Without close',
  args: { showClose: false, showButton: false },
};

/** A long description wraps; the icon and close button stay at the top. */
export const LongText: Story = {
  name: 'Long text',
  args: {
    tone: 'warning',
    showTitle: true,
    title: 'Points conversion is paused for every segment until the end of the month',
    description:
      'Members can still earn points, but converting them to account credit is switched off while the new rates are checked. Conversions requested before the pause will still be paid.',
    buttonLabel: 'View the new rates',
  },
};

/** In a page, a banner fills its container. */
export const FullWidth: Story = {
  name: 'Full width',
  parameters: { fullWidth: true },
  args: { tone: 'neutral', description: 'Tiers are common to every segment. Changes apply to every member at the next monthly review.' },
};
