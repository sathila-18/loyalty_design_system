import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type FormEvent, type ReactNode } from 'react';
import { fn } from 'storybook/test';
import { FinButton } from '../Button';
import { FinListToggle } from '../ListToggle';
import { FinTextBox } from '../TextBox';
import { FinTextField } from '../TextField';
import { FinSideSheet, type FinSideSheetProps } from './FinSideSheet';
import styles from './FinSideSheet.stories.module.css';

const NOTE = 'This phrase symbolizes the smooth and uninterrupted flow of communication signals.';

interface Args {
  title: string;
  backButton: boolean;
  closeButton: boolean;
  divider: boolean;
  showButtonDock: boolean;
  closeOnOverlayClick: boolean;
}

/** A page behind the sheet, with a button that opens it again after it's closed. Starts open. */
function SheetDemo({ children, ...props }: Omit<FinSideSheetProps, 'open' | 'onClose'> & { children?: ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className={styles.page}>
      <FinTextBox type="h4" heading="Programme configuration" description="The page behind the side sheet. It doesn't scroll while the sheet is open." />
      <div>
        <FinButton onClick={() => setOpen(true)}>Open side sheet</FinButton>
      </div>
      {Array.from({ length: 12 }, (_, i) => (
        <p key={i} className={styles.filler}>
          Page content row {i + 1}
        </p>
      ))}
      <FinSideSheet {...props} open={open} onClose={() => setOpen(false)}>
        {children}
      </FinSideSheet>
    </div>
  );
}

/** Body content for the stories: a few fields, as on the Programme configuration screen. */
function ConfigurationFields({ extra = 0 }: { extra?: number }) {
  return (
    <>
      <FinTextField label="Segment" placeholder="Segment" helperText="Segments that already have a configuration are not listed" />
      <FinListToggle title="Active" description="Applies to one customer segment" />
      <FinTextField label="Points expiry (months)" placeholder="Points expiry (months)" helperText="Counted from the date each point is earned" />
      <FinListToggle title="Allow points to be converted to account credit" />
      <FinTextField label="Minimum per conversion" placeholder="Minimum per conversion" />
      {Array.from({ length: extra }, (_, i) => (
        <FinTextField key={i} label={`Note ${i + 1}`} placeholder={`Note ${i + 1}`} />
      ))}
    </>
  );
}

/**
 * A panel on the right edge of the window, over the page (Figma Side sheet; DESIGN.md §9): the title, the body
 * content, which scrolls, and a Button dock. Its width follows the layout grid: about 600 at every page width (try the
 * viewports). Close it with the close button, Esc or a click on the scrim; "Open side sheet" brings it back.
 */
const meta: Meta<Args> = {
  title: 'Components/Side sheet',
  parameters: { layout: 'fullscreen' },
  args: {
    title: 'Title',
    backButton: false,
    closeButton: true,
    divider: false,
    showButtonDock: true,
    closeOnOverlayClick: true,
  },
  argTypes: {
    title: { control: 'text', description: 'Figma `Title` slot (`title`): a string is the Headline Large-H4 heading (Figma: Display Small-H3), up to two lines' },
    backButton: { control: 'boolean', description: 'Figma `Show Back Button` (`backButton`; off by default in code)' },
    closeButton: { control: 'boolean', description: 'Figma `Show Close Button` (`closeButton`)' },
    divider: { control: 'boolean', description: 'Figma `View Divider` (`divider`)' },
    showButtonDock: { control: 'boolean', description: 'Figma `Show Button Dock` (`buttonDock`)' },
    closeOnOverlayClick: { control: 'boolean', description: 'Code only: a click on the scrim closes the sheet (`closeOnOverlayClick`)' },
  },
  render: ({ title, backButton, closeButton, divider, showButtonDock, closeOnOverlayClick }) => (
    <SheetDemo
      key={`${backButton}-${closeButton}-${divider}-${showButtonDock}-${closeOnOverlayClick}`}
      title={title}
      backButton={backButton}
      onBack={fn()}
      closeButton={closeButton}
      divider={divider}
      closeOnOverlayClick={closeOnOverlayClick}
      {...(showButtonDock
        ? { buttonDock: { accessory: NOTE, secondaryButton: { label: 'Text here', onClick: fn() }, primaryButton: { label: 'Text here', onClick: fn() } } }
        : {})}
    />
  ),
};
export default meta;

type Story = StoryObj<Args>;

/** Figma's defaults, with an empty body (Figma's slot is empty). */
export const Playground: Story = {};

/** Every Figma option on: back button, close button, divider and Button dock. */
export const AllOptions: Story = {
  name: 'All options (Figma)',
  args: { backButton: true, divider: true },
};

/**
 * The Programme configuration add form: a Text Box with a heading and description in the Title slot, fields in the
 * body, and Cancel / Save in the dock. The Save button submits the form through `form`. A stray click on the scrim
 * doesn't close it (`closeOnOverlayClick={false}`).
 */
export const Form: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <SheetDemo
      title={<FinTextBox type="h4" heading="Add programme configuration" headingLevel={2} description="Applies to one customer segment" truncateHeading />}
      closeOnOverlayClick={false}
      buttonDock={{
        secondaryButton: { label: 'Cancel', onClick: fn() },
        primaryButton: { label: 'Save configuration', type: 'submit', form: 'add-configuration' },
      }}
    >
      <form
        id="add-configuration"
        className={styles.form}
        onSubmit={(event: FormEvent) => {
          event.preventDefault();
        }}
      >
        <ConfigurationFields />
      </form>
    </SheetDemo>
  ),
};

/** More content than fits: the body scrolls between the header and the dock, and the dock is Sticky while content is under it. */
export const LongContent: Story = {
  name: 'Long content (sticky dock)',
  parameters: { controls: { disable: true } },
  render: () => (
    <SheetDemo
      title="Edit programme configuration"
      buttonDock={{ secondaryButton: { label: 'Cancel', onClick: fn() }, primaryButton: { label: 'Save', onClick: fn() } }}
    >
      <ConfigurationFields extra={8} />
    </SheetDemo>
  ),
};

/** A long title wraps to two lines, then ends in "…" (decided 26 Oct 2026); screen readers get the whole title. */
export const LongTitle: Story = {
  args: {
    title: 'Programme configuration for the platinum plus customer segment in every region, with joint accounts across several branches',
    backButton: true,
  },
};
