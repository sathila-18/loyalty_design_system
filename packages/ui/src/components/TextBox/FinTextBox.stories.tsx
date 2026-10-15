import type { Meta, StoryObj } from '@storybook/react-vite';
import { FinTextBox, type FinTextBoxAlign, type FinTextBoxType } from './FinTextBox';
import styles from './FinTextBox.stories.module.css';

const TYPES: FinTextBoxType[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const ALIGNS: FinTextBoxAlign[] = ['left', 'center', 'right'];
const TYPE_NAME: Record<FinTextBoxType, string> = {
  h1: 'Display Large-H1',
  h2: 'Display Medium-H2',
  h3: 'Display Small-H3',
  h4: 'Headline Large-H4',
  h5: 'Headline Medium-H5',
  h6: 'Headline Small-H6',
};
const HEADING = 'The blue signal flows through the network.';
const DESCRIPTION =
  'This phrase symbolizes the smooth and uninterrupted flow of communication signals within a telecommunication system, emphasizing reliability, efficiency, and seamless connectivity.';

type Args = {
  type: FinTextBoxType;
  align: FinTextBoxAlign;
  showLabel: boolean;
  label: string;
  labelBadge: boolean;
  labelBadgeLabel: string;
  showHeading: boolean;
  heading: string;
  showDescription: boolean;
  description: string;
};

const meta: Meta<Args> = {
  title: 'Components/Text box/Text box',
  args: {
    type: 'h3',
    align: 'left',
    showLabel: true,
    label: 'Label text',
    labelBadge: false,
    labelBadgeLabel: 'New',
    showHeading: true,
    heading: HEADING,
    showDescription: true,
    description: DESCRIPTION,
  },
  argTypes: {
    type: { control: 'select', options: TYPES, description: 'Figma `Type` (the look)' },
    align: { control: 'inline-radio', options: ALIGNS, description: 'Figma `Alignment`' },
    showLabel: { control: 'boolean', description: 'Figma `Show Label`' },
    label: { control: 'text', if: { arg: 'showLabel' } },
    labelBadge: { control: 'boolean', description: 'The Label’s `Show badge` (exposed by Figma’s Text Box)', if: { arg: 'showLabel' } },
    labelBadgeLabel: { control: 'text', description: 'Required with the badge: what the dot means', if: { arg: 'labelBadge' } },
    showHeading: { control: 'boolean', description: 'Figma `Show Heading`' },
    heading: { control: 'text', if: { arg: 'showHeading' } },
    showDescription: { control: 'boolean', description: 'Figma `Show Description`' },
    description: { control: 'text', if: { arg: 'showDescription' } },
  },
  decorators: [
    (Story) => (
      <div className={styles.frame}>
        <Story />
      </div>
    ),
  ],
  render: (a) => (
    <FinTextBox
      type={a.type}
      align={a.align}
      {...(a.showLabel ? { label: a.label } : {})}
      {...(a.showLabel && a.labelBadge ? { labelBadge: true as const, labelBadgeLabel: a.labelBadgeLabel } : {})}
      {...(a.showHeading ? { heading: a.heading } : {})}
      {...(a.showDescription ? { description: a.description } : {})}
    />
  ),
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/** The Figma Text Box page: every Type in every Alignment (342px wide, as the Figma frames). */
export const TypesAndAlignments: Story = {
  name: 'Types and alignments (Figma)',
  decorators: [(Story) => <Story />],
  render: () => (
    <div className={styles.grid}>
      {TYPES.map((type) =>
        ALIGNS.map((align) => (
          <figure key={`${type}-${align}`} className={styles.cell}>
            <figcaption className={styles.caption}>
              {TYPE_NAME[type]}, {align}
            </figcaption>
            <FinTextBox type={type} align={align} label="Label text" heading={HEADING} description={DESCRIPTION} />
          </figure>
        )),
      )}
    </div>
  ),
};

/** Figma's Show Label / Show Heading / Show Description: a part shows when it's passed. */
export const Parts: Story = {
  name: 'Parts on and off',
  render: () => (
    <div className={styles.stack}>
      <FinTextBox type="h4" heading="Heading only" />
      <FinTextBox type="h4" label="Label text" heading="Label and heading" />
      <FinTextBox type="h4" heading="Heading and description" description="A short description under the heading." />
      <FinTextBox type="h4" label="Required details" labelBadge labelBadgeLabel="Required" heading="With the label’s badge" />
    </div>
  ),
};

/** `headingLevel` changes the element (for the page's heading order), never the look: both look like H3. */
export const HeadingLevel: Story = {
  name: 'Heading level',
  render: () => (
    <div className={styles.stack}>
      <FinTextBox type="h3" heading="type h3 → <h3> (default)" />
      <FinTextBox type="h3" headingLevel={2} heading="type h3, headingLevel 2 → <h2>" />
    </div>
  ),
};
