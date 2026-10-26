import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import { fn } from 'storybook/test';
import { FinButton } from '../Button';
import { FinTextBox } from '../TextBox';
import { FinTextField } from '../TextField';
import { FinDialog, type FinDialogProps } from './FinDialog';
import styles from './FinDialog.stories.module.css';

const BODY =
  'This phrase symbolizes the smooth and uninterrupted flow of communication signals within a telecommunication system, emphasizing reliability, efficiency, and seamless connectivity.';

interface Args {
  title: string;
  closeButton: boolean;
  showBodyContent: boolean;
  body: string;
  showLeadingButton: boolean;
  leadingLabel: string;
  showSecondary: boolean;
  secondaryLabel: string;
  showPrimary: boolean;
  primaryLabel: string;
  destructive: boolean;
  closeOnOverlayClick: boolean;
}

/** A page behind the dialog, with a button that opens it again after it's closed. Starts open. */
function DialogDemo({ children, ...props }: Omit<FinDialogProps, 'open' | 'onClose'> & { children?: ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className={styles.page}>
      <FinTextBox type="h4" heading="Programme configuration" description="The page behind the dialog. It doesn't scroll while the dialog is open." />
      <div>
        <FinButton onClick={() => setOpen(true)}>Open dialog</FinButton>
      </div>
      {Array.from({ length: 12 }, (_, i) => (
        <p key={i} className={styles.filler}>
          Page content row {i + 1}
        </p>
      ))}
      <FinDialog {...props} open={open} onClose={() => setOpen(false)}>
        {children}
      </FinDialog>
    </div>
  );
}

/**
 * A dialog box in the middle of the window, over the page (Figma Dialog box; DESIGN.md §9): the title with a close
 * button, the body content and the buttons. Its width follows the layout grid (try the viewports). Close it with the
 * close button, Esc or a click on the scrim; "Open dialog" brings it back.
 */
const meta: Meta<Args> = {
  title: 'Components/Dialog',
  parameters: { layout: 'fullscreen' },
  args: {
    title: 'Dialog title',
    closeButton: true,
    showBodyContent: true,
    body: BODY,
    showLeadingButton: false,
    leadingLabel: 'Text here',
    showSecondary: true,
    secondaryLabel: 'Text here',
    showPrimary: true,
    primaryLabel: 'Text here',
    destructive: false,
    closeOnOverlayClick: true,
  },
  argTypes: {
    title: { control: 'text', description: 'The title (`title`): a string is the Headline Large-H4 heading, and wraps' },
    closeButton: { control: 'boolean', description: 'Figma `Show Trailing Icon` (`closeButton`)' },
    showBodyContent: { control: 'boolean', description: 'Figma `Show Body Content` (`children`)' },
    body: { control: 'text', description: "The body's text (a Text Box description, Body/Large)", if: { arg: 'showBodyContent' } },
    showLeadingButton: { control: 'boolean', description: 'Figma `Show Leading Button` (`leadingButton`)' },
    leadingLabel: { control: 'text', description: "The leading button's label", if: { arg: 'showLeadingButton' } },
    showSecondary: { control: 'boolean', description: 'Figma `Show Button Secondary` (`secondaryButton`)' },
    secondaryLabel: { control: 'text', description: "The Secondary button's label", if: { arg: 'showSecondary' } },
    showPrimary: { control: 'boolean', description: 'Figma `Show Button Primary` (`primaryButton`)' },
    primaryLabel: { control: 'text', description: "The Primary button's label", if: { arg: 'showPrimary' } },
    destructive: { control: 'boolean', description: 'Code only: the Primary button `tone: "destructive"` (remove and delete actions)' },
    closeOnOverlayClick: { control: 'boolean', description: 'Code only: a click on the scrim closes the dialog (`closeOnOverlayClick`)' },
  },
  render: (args) => (
    <DialogDemo
      key={`${args.closeButton}-${args.showBodyContent}-${args.showLeadingButton}-${args.showSecondary}-${args.showPrimary}-${args.closeOnOverlayClick}`}
      title={args.title}
      closeButton={args.closeButton}
      closeOnOverlayClick={args.closeOnOverlayClick}
      {...(args.showLeadingButton ? { leadingButton: { label: args.leadingLabel, onClick: fn() } } : {})}
      {...(args.showSecondary ? { secondaryButton: { label: args.secondaryLabel, onClick: fn() } } : {})}
      {...(args.showPrimary
        ? { primaryButton: { label: args.primaryLabel, onClick: fn(), ...(args.destructive ? { tone: 'destructive' as const } : {}) } }
        : {})}
    >
      {args.showBodyContent ? args.body : undefined}
    </DialogDemo>
  ),
};
export default meta;

type Story = StoryObj<Args>;

/** Figma's defaults: title, close button, body text, Secondary and Primary. */
export const Playground: Story = {};

/** Every Figma option on, with the leading button. */
export const AllOptions: Story = {
  name: 'All options (Figma)',
  args: { showLeadingButton: true },
};

/** The Programme configuration remove dialog: Remove is the destructive Primary (decided 26 Oct 2026). */
export const RemoveConfirmation: Story = {
  name: 'Remove confirmation',
  parameters: { controls: { disable: true } },
  render: () => (
    <DialogDemo
      title="Remove segment"
      secondaryButton={{ label: 'Cancel', onClick: fn() }}
      primaryButton={{ label: 'Remove', tone: 'destructive', onClick: fn() }}
    >
      Are you sure you want to remove the “Staff” segment?
    </DialogDemo>
  ),
};

/** Any content in the body: fields, 12 apart. A stray click on the scrim doesn't close it (`closeOnOverlayClick={false}`). */
export const WithFields: Story = {
  name: 'With fields',
  parameters: { controls: { disable: true } },
  render: () => (
    <DialogDemo
      title="Rename segment"
      closeOnOverlayClick={false}
      secondaryButton={{ label: 'Cancel', onClick: fn() }}
      primaryButton={{ label: 'Save', onClick: fn() }}
    >
      <FinTextBox type="h2" description="The new name shows everywhere the segment is used." />
      <FinTextField label="Segment name" placeholder="Segment name" defaultValue="Staff" />
    </DialogDemo>
  ),
};

/** A long title wraps (decided 26 Oct 2026); content taller than the window scrolls in the body, the title and buttons stay. */
export const LongContent: Story = {
  name: 'Long title and content',
  parameters: { controls: { disable: true } },
  render: () => (
    <DialogDemo
      title="Are you sure you want to remove the platinum plus customer segment from every programme configuration?"
      secondaryButton={{ label: 'Cancel', onClick: fn() }}
      primaryButton={{ label: 'Remove', tone: 'destructive', onClick: fn() }}
    >
      {Array.from({ length: 14 }, (_, i) => (
        <FinTextBox key={i} type="h2" description={`${i + 1}. ${BODY}`} />
      ))}
    </DialogDemo>
  ),
};
