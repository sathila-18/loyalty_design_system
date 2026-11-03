import type { Meta, StoryObj } from '@storybook/react-vite';
import { FinButton } from '../Button';
import { FinTooltip, type FinTooltipPlacement, type FinTooltipType } from './FinTooltip';
import styles from './FinTooltip.stories.module.css';

interface Args {
  type: FinTooltipType;
  content: string;
  heading: string;
  description: string;
  placement: FinTooltipPlacement;
}

const HEADING = 'Points expiry';
const DESCRIPTION = 'Points expire 36 months after they’re earned, unless the member’s tier keeps them longer.';

/**
 * A tooltip (Figma Plain Tooltip, Look=Black; DESIGN.md §9): hover a trigger for 250 ms, or Tab to it, to see it.
 * Escape closes it; the pointer can move onto it. It describes its trigger for screen readers and holds text only.
 */
const meta: Meta<Args> = {
  title: 'Components/Tooltips/Plain tooltip',
  args: { type: 'single-line', content: 'Supporting text', heading: HEADING, description: DESCRIPTION, placement: 'top' },
  argTypes: {
    type: { control: 'inline-radio', options: ['single-line', 'rich'], description: 'Figma `Type` (Single line, Rich tooltip)' },
    content: { control: 'text', description: 'Single line: the text (`content`)', if: { arg: 'type', eq: 'single-line' } },
    heading: { control: 'text', description: 'Rich: the Text Box heading (`heading`)', if: { arg: 'type', eq: 'rich' } },
    description: { control: 'text', description: 'Rich: the Text Box description (`description`)', if: { arg: 'type', eq: 'rich' } },
    placement: { control: 'inline-radio', options: ['top', 'bottom', 'left', 'right'], description: '`placement` (code only); it flips when there isn’t room' },
  },
  render: ({ type, content, heading, description, placement }) => (
    <div className={styles.stage}>
      {type === 'rich' ? (
        <FinTooltip type="rich" heading={heading} description={description} placement={placement}>
          <FinButton icon="only-icon" iconName="info" variant="secondary">
            About points expiry
          </FinButton>
        </FinTooltip>
      ) : (
        <FinTooltip content={content} placement={placement}>
          <FinButton variant="secondary">Hover or focus me</FinButton>
        </FinTooltip>
      )}
    </div>
  ),
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/** Figma's two types, open: Single line (Caption L) and Rich tooltip (a Text Box, H6 and Body M, 343 wide). */
export const Types: Story = {
  name: 'Types (Figma)',
  render: () => (
    <div className={styles.stage}>
      <FinTooltip content="Supporting text" placement="bottom" defaultOpen>
        <FinButton variant="secondary">Single line</FinButton>
      </FinTooltip>
      <FinTooltip type="rich" heading={HEADING} description={DESCRIPTION} placement="bottom" defaultOpen>
        <FinButton variant="secondary">Rich tooltip</FinButton>
      </FinTooltip>
    </div>
  ),
};

/** `placement` (code only): top (default), bottom, left and right, 4 (Space-XS) from the trigger. */
export const Placements: Story = {
  render: () => (
    <div className={styles.cross}>
      {(['top', 'left', 'right', 'bottom'] as const).map((placement) => (
        <div key={placement}>
          <FinTooltip content={`On the ${placement}`} placement={placement} defaultOpen>
            <FinButton variant="secondary">{placement.charAt(0).toUpperCase() + placement.slice(1)}</FinButton>
          </FinTooltip>
        </div>
      ))}
    </div>
  ),
};

/** Single line text longer than 343 wraps (decided 3 Nov 2026), so it never runs off the window. */
export const LongText: Story = {
  name: 'Long text',
  render: () => (
    <div className={styles.stage}>
      <FinTooltip
        content="Members in this segment earn points at the base rate until they reach the next tier, then at that tier’s rate."
        placement="bottom"
        defaultOpen
      >
        <FinButton variant="secondary">Earn rate</FinButton>
      </FinTooltip>
    </div>
  ),
};

/** Asked for on top, at the top of the window: there isn't room, so it flips below. */
export const Flips: Story = {
  name: 'Flips at the edge',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className={styles.edge}>
      <FinTooltip content="No room above, so below" defaultOpen>
        <FinButton variant="secondary">At the top</FinButton>
      </FinTooltip>
    </div>
  ),
};

/** The usual trigger: an icon only button, whose tooltip adds to its name. Tab to it or hover it. */
export const OnIconButtons: Story = {
  name: 'On icon buttons',
  render: () => (
    <div className={styles.stage}>
      <FinTooltip content="Edit this tier">
        <FinButton icon="only-icon" iconName="edit" variant="secondary">
          Edit
        </FinButton>
      </FinTooltip>
      <FinTooltip content="Remove this tier">
        <FinButton icon="only-icon" iconName="cancel" variant="secondary" tone="destructive">
          Remove
        </FinButton>
      </FinTooltip>
    </div>
  ),
};
