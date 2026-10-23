import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type UIEvent } from 'react';
import { fn } from 'storybook/test';
import { FinTextBox } from '../TextBox';
import { FinButtonDock } from './FinButtonDock';
import styles from './FinButtonDock.stories.module.css';

const NOTE = 'This phrase symbolizes the smooth and uninterrupted flow of communication signals.';

interface Args {
  sticky: boolean;
  showAccessory: boolean;
  accessory: string;
  showTertiary: boolean;
  tertiaryLabel: string;
  showSecondary: boolean;
  secondaryLabel: string;
  showPrimary: boolean;
  primaryLabel: string;
  destructive: boolean;
}

/**
 * The bar of actions at the bottom of a side sheet, dialog or form (Figma Button dock; DESIGN.md §9): an optional note
 * above Large buttons, Tertiary first, then Secondary and Primary sharing the width.
 */
const meta: Meta<Args> = {
  title: 'Components/Button dock',
  parameters: { layout: 'padded' },
  args: {
    sticky: false,
    showAccessory: true,
    accessory: NOTE,
    showTertiary: true,
    tertiaryLabel: 'Text here',
    showSecondary: true,
    secondaryLabel: 'Text here',
    showPrimary: true,
    primaryLabel: 'Text here',
    destructive: false,
  },
  argTypes: {
    sticky: { control: 'boolean', description: 'Figma `Sticky` (`sticky`: Shadow/Sticky upward)' },
    showAccessory: { control: 'boolean', description: 'Figma `Show Accessory` (`accessory`)' },
    accessory: { control: 'text', description: "The accessory's text (a Text Box description)", if: { arg: 'showAccessory' } },
    showTertiary: { control: 'boolean', description: 'Figma `Show Tertiary Button` (`tertiaryButton`)' },
    tertiaryLabel: { control: 'text', description: "The Tertiary button's label", if: { arg: 'showTertiary' } },
    showSecondary: { control: 'boolean', description: 'Figma `Show Secondary Button` (`secondaryButton`)' },
    secondaryLabel: { control: 'text', description: "The Secondary button's label", if: { arg: 'showSecondary' } },
    showPrimary: { control: 'boolean', description: 'Figma `Show Primary Button` (`primaryButton`)' },
    primaryLabel: { control: 'text', description: "The Primary button's label", if: { arg: 'showPrimary' } },
    destructive: { control: 'boolean', description: 'Code only: the Primary button `tone: "destructive"` (remove and delete actions)' },
  },
  render: ({ sticky, showAccessory, accessory, showTertiary, tertiaryLabel, showSecondary, secondaryLabel, showPrimary, primaryLabel, destructive }) => (
    <div className={styles.frame}>
      <FinButtonDock
        sticky={sticky}
        {...(showAccessory ? { accessory } : {})}
        {...(showTertiary ? { tertiaryButton: { label: tertiaryLabel, onClick: fn() } } : {})}
        {...(showSecondary ? { secondaryButton: { label: secondaryLabel, onClick: fn() } } : {})}
        {...(showPrimary ? { primaryButton: { label: primaryLabel, onClick: fn(), ...(destructive ? { tone: 'destructive' as const } : {}) } } : {})}
      />
    </div>
  ),
};
export default meta;

type Story = StoryObj<Args>;

/** Every Figma option on, Figma's placeholder text. */
export const Playground: Story = {};

/** Figma's two variants: Sticky False and True (the shadow falls upward, onto the content above). */
export const Variants: Story = {
  name: 'Sticky (Figma)',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className={styles.stack}>
      {[false, true].map((sticky) => (
        <FinButtonDock
          key={String(sticky)}
          sticky={sticky}
          accessory={NOTE}
          tertiaryButton={{ label: 'Text here' }}
          secondaryButton={{ label: 'Text here' }}
          primaryButton={{ label: 'Text here' }}
        />
      ))}
    </div>
  ),
};

/** Real uses: a form's Cancel and Save; Reset, Cancel and Apply; a remove confirmation with a destructive Primary button. */
export const Scenarios: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className={styles.stack}>
      <FinButtonDock secondaryButton={{ label: 'Cancel' }} primaryButton={{ label: 'Save', type: 'submit' }} />
      <FinButtonDock tertiaryButton={{ label: 'Reset' }} secondaryButton={{ label: 'Cancel' }} primaryButton={{ label: 'Apply' }} />
      <FinButtonDock
        accessory="The configuration for VIP will be removed. Members keep the points they've earned."
        secondaryButton={{ label: 'Cancel' }}
        primaryButton={{ label: 'Remove', tone: 'destructive' }}
      />
      <FinButtonDock primaryButton={{ label: 'Done' }} />
    </div>
  ),
};

/**
 * Sticky in use: the dock is pinned at the bottom of a panel and turns Sticky while content is under it (scroll the
 * panel; at the end of the content the shadow goes). What the side sheet will do.
 */
export const StickyInAPanel: Story = {
  name: 'Sticky in a panel',
  parameters: { controls: { disable: true } },
  render: function StickyInAPanel() {
    const [contentBelow, setContentBelow] = useState(true);
    const onScroll = (event: UIEvent<HTMLDivElement>) => {
      const el = event.currentTarget;
      setContentBelow(el.scrollTop + el.clientHeight < el.scrollHeight - 1);
    };
    return (
      <div className={styles.panel}>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a scrollable region must be focusable (WCAG 2.1.1) */}
        <div className={styles.panelBody} onScroll={onScroll} tabIndex={0} role="region" aria-label="Panel content">
          {Array.from({ length: 8 }, (_, i) => (
            <FinTextBox key={i} type="h6" headingLevel={2} heading={`Section ${i + 1}`} description="Content that scrolls under the dock." />
          ))}
        </div>
        <FinButtonDock sticky={contentBelow} secondaryButton={{ label: 'Cancel' }} primaryButton={{ label: 'Save' }} />
      </div>
    );
  },
};
