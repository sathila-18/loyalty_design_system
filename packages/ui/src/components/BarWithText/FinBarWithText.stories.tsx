import type { Meta, StoryObj } from '@storybook/react-vite';
import { FinBarWithText } from './FinBarWithText';
import styles from './FinBarWithText.stories.module.css';

type Args = { value: number; heading: string; showDescription: boolean; description: string };

const meta: Meta<Args> = {
  title: 'Components/Progress/Bar with text',
  args: {
    value: 25,
    heading: 'Uploading members',
    showDescription: true,
    description: 'This can take a few minutes. You can keep working; we’ll let you know when it’s done.',
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 }, description: 'Figma `Progress` (any value)' },
    heading: { control: 'text' },
    showDescription: { control: 'boolean', description: 'Figma `Description`' },
    description: { control: 'text', if: { arg: 'showDescription' } },
  },
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className={styles.contentArea}>
        <Story />
      </div>
    ),
  ],
  render: ({ value, heading, showDescription, description }) => (
    <FinBarWithText value={value} heading={heading} {...(showDescription ? { description } : {})} />
  ),
};
export default meta;

type Story = StoryObj<Args>;

/** In a 1240-wide content area (shown dashed), it spans the middle 6 of 12 columns: 608 wide. */
export const Playground: Story = {};

/** The Figma bar-with-text page: Progress 25 / 50 / 75 / 100%, with and without the description. */
export const Variants: Story = {
  name: 'Variants (Figma)',
  render: () => (
    <div className={styles.stack}>
      {[25, 50, 75, 100].map((v) =>
        [true, false].map((d) => (
          <FinBarWithText
            key={`${v}-${d}`}
            value={v}
            heading={`${v}% uploaded`}
            {...(d ? { description: 'This can take a few minutes. You can keep working.' } : {})}
          />
        )),
      )}
    </div>
  ),
};
