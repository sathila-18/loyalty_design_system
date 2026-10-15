import type { Meta, StoryObj } from '@storybook/react-vite';
import type { FinSpinnerStatus } from '../Spinner';
import { FinSpinnerWithText } from './FinSpinnerWithText';
import styles from './FinSpinnerWithText.stories.module.css';

type Args = { status: FinSpinnerStatus; loading: boolean; value: number; heading: string; showDescription: boolean; description: string };

const meta: Meta<Args> = {
  title: 'Components/Progress/Spinner with text',
  args: {
    status: 'progress',
    loading: true,
    value: 50,
    heading: 'Importing transactions',
    showDescription: true,
    description: 'This can take a few minutes. You can keep working.',
  },
  argTypes: {
    status: { control: 'inline-radio', options: ['progress', 'success', 'error'], description: 'Figma `Progress`: % / Complete / Error' },
    loading: { control: 'boolean', description: 'Progress with no value: spinning loader (not in Figma)', if: { arg: 'status', eq: 'progress' } },
    value: { control: { type: 'range', min: 0, max: 100 }, if: { arg: 'loading', truthy: false } },
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
  render: ({ status, loading, value, heading, showDescription, description }) => (
    <FinSpinnerWithText
      status={status}
      heading={heading}
      {...(status === 'progress' && !loading ? { value } : {})}
      {...(showDescription ? { description } : {})}
    />
  ),
};
export default meta;

type Story = StoryObj<Args>;

/** In a 1240-wide content area (dashed), it spans the middle 6 of 12 columns: 608 wide. */
export const Playground: Story = {};

/** The Figma spinner-with-text page: Progress 25 / 50 / 75% / Complete / Error, with and without the description. */
export const Variants: Story = {
  name: 'Variants (Figma)',
  render: () => (
    <div className={styles.stack}>
      {[
        { key: '25', props: { value: 25 }, heading: '25% imported' },
        { key: '50', props: { value: 50 }, heading: '50% imported' },
        { key: '75', props: { value: 75 }, heading: '75% imported' },
        { key: 'complete', props: { status: 'success' as const }, heading: 'Import complete' },
        { key: 'error', props: { status: 'error' as const }, heading: 'Import failed' },
      ].map(({ key, props, heading }) =>
        [true, false].map((d) => (
          <FinSpinnerWithText key={`${key}-${d}`} heading={heading} {...props} {...(d ? { description: 'A short description of what’s happening.' } : {})} />
        )),
      )}
    </div>
  ),
};

/** Not in Figma (added at design's request): no value gives the spinning loader. */
export const Loading: Story = {
  render: () => <FinSpinnerWithText heading="Loading members" description="Please wait." />,
};
