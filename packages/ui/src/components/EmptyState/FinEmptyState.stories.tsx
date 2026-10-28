import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { finIcons, type FinIconName } from '../../icons/finIcons';
import { FinEmptyState, type FinEmptyStateSize } from './FinEmptyState';
import styles from './FinEmptyState.stories.module.css';

const HEADING = 'The blue signal flows through the network.';
const DESCRIPTION =
  'This phrase symbolizes the smooth and uninterrupted flow of communication signals within a telecommunication system, emphasizing reliability, efficiency, and seamless connectivity.';

interface Args {
  size: FinEmptyStateSize;
  icon: FinIconName;
  heading: string;
  showDescription: boolean;
  description: string;
  showButton: boolean;
  buttonLabel: string;
}

/**
 * What a page or area shows when it has nothing to show (Figma Empty state; DESIGN.md §9): an icon, a heading and a
 * description, and an optional Primary button, centred in its container across and down, 4 grid columns wide at most.
 */
const meta: Meta<Args> = {
  title: 'Components/Empty state',
  args: {
    size: 'medium',
    icon: 'person',
    heading: HEADING,
    showDescription: true,
    description: DESCRIPTION,
    showButton: true,
    buttonLabel: 'Text here',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['small', 'medium'], description: 'Figma `Size` (`size`)' },
    icon: { control: 'select', options: finIcons, description: 'Figma `Icon Slot`: the icon in the container (`icon`)' },
    heading: { control: 'text', description: 'The Text Box heading (`heading`)' },
    showDescription: { control: 'boolean', description: 'The Text Box description (`description`)' },
    description: { control: 'text', description: 'The description text', if: { arg: 'showDescription' } },
    showButton: { control: 'boolean', description: 'Figma `Show Button Group` (`action`)' },
    buttonLabel: { control: 'text', description: "The button's label", if: { arg: 'showButton' } },
  },
  render: ({ size, icon, heading, showDescription, description, showButton, buttonLabel }) => (
    <FinEmptyState
      size={size}
      icon={icon}
      heading={heading}
      {...(showDescription ? { description } : {})}
      {...(showButton ? { action: { label: buttonLabel, onClick: fn() } } : {})}
    />
  ),
};
export default meta;
type Story = StoryObj<Args>;

/** Figma's defaults (Medium, with the `person` placeholder icon). */
export const Playground: Story = {};

/** Both Figma sizes, Medium then Small, as in the component set. */
export const Sizes: Story = {
  name: 'Sizes (Figma)',
  render: () => (
    <div className={styles.figma}>
      {(['medium', 'small'] as const).map((size) => (
        <FinEmptyState key={size} size={size} icon="person" heading={HEADING} description={DESCRIPTION} action={{ label: 'Text here', onClick: fn() }} />
      ))}
    </div>
  ),
};

/** Real uses in a wide, 480-tall area: nothing added yet (Medium, with the main action) and no search results (Small). Each sits in the middle, 4 grid columns wide. */
export const Scenarios: Story = {
  render: () => (
    <div className={styles.figma}>
      <div className={styles.area}>
        <FinEmptyState
          icon="loyalty"
          heading="No programme configurations yet"
          description="Add a configuration to set the loyalty and cash conversion rules for a customer segment."
          action={{ label: 'Add programme configuration', onClick: fn() }}
        />
      </div>
      <div className={styles.area}>
        <FinEmptyState
          icon="sports_esports"
          heading="No lessons yet"
          description="With leadingIcon (code only): the plus before an Add button's label."
          action={{ label: 'Add lesson', leadingIcon: 'add', onClick: fn() }}
        />
      </div>
      <div className={styles.area}>
        <FinEmptyState
          size="small"
          icon="search"
          heading="No segments match “Platinum”"
          description="Check the spelling, or clear the search and filters."
          action={{ label: 'Clear search and filters', onClick: fn() }}
        />
      </div>
    </div>
  ),
};

/** Only a heading: no description and no button. */
export const HeadingOnly: Story = {
  name: 'Heading only',
  args: { size: 'small', icon: 'search', heading: 'No results', showDescription: false, showButton: false },
};
