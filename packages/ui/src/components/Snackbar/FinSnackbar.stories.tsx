import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { FinButton } from '../Button';
import { FinTextBox } from '../TextBox';
import { FinSnackbar, type FinSnackbarTone } from './FinSnackbar';
import { FinSnackbarRegion } from './FinSnackbarRegion';
import styles from './FinSnackbar.stories.module.css';

const SINGLE = 'Single-line snackbar';
const LONG = 'Snackbars with longer messages will wrap and the action will move below the text.';
const TONES: FinSnackbarTone[] = ['neutral', 'success', 'warning', 'error'];

interface Args {
  tone: FinSnackbarTone;
  lines: 'single' | 'two';
  message: string;
  showIcon: boolean;
  showButton: boolean;
  buttonLabel: string;
  showClose: boolean;
}

/**
 * A short message about something that just happened, with an optional action (Figma Snackbar; DESIGN.md §9). In an
 * app, snackbars go in a FinSnackbarRegion at the top right of the window ("In a page"). Neutral is dark in Light and
 * light in Dark (`bg-direct`).
 */
const meta: Meta<Args> = {
  title: 'Components/Snackbar',
  args: { tone: 'neutral', lines: 'single', message: SINGLE, showIcon: true, showButton: true, buttonLabel: 'Text here', showClose: true },
  argTypes: {
    tone: { control: 'inline-radio', options: TONES, description: 'Figma `State` (`tone`)' },
    lines: { control: 'inline-radio', options: ['single', 'two'], description: 'Figma `# of lines` (`lines`)' },
    message: { control: 'text', description: 'The message (`children`)' },
    showIcon: { control: 'boolean', description: 'Figma `Show Leading Icon` (`showIcon`)' },
    showButton: { control: 'boolean', description: 'Figma `Show Button` (`action`)' },
    buttonLabel: { control: 'text', description: "The button's label", if: { arg: 'showButton' } },
    showClose: { control: 'boolean', description: 'Figma `Show Close` (`onClose`)' },
  },
  render: ({ tone, lines, message, showIcon, showButton, buttonLabel, showClose }) => (
    <FinSnackbar
      tone={tone}
      lines={lines}
      showIcon={showIcon}
      duration={null}
      {...(showButton ? { action: { label: buttonLabel, onClick: fn() } } : {})}
      {...(showClose ? { onClose: fn() } : {})}
    >
      {message}
    </FinSnackbar>
  ),
};
export default meta;
type Story = StoryObj<Args>;

/** Figma's defaults. In code it's as wide as its content. */
export const Playground: Story = {};

/** Every Figma variant (`State` × `# of lines`), drawn 343 wide as in the component set. */
export const AllVariants: Story = {
  name: 'All variants (Figma)',
  render: () => (
    <div className={styles.figma}>
      {TONES.flatMap((tone) =>
        (['single', 'two'] as const).map((lines) => (
          <FinSnackbar key={`${tone}-${lines}`} tone={tone} lines={lines} duration={null} action={{ label: 'Text here', onClick: fn() }} onClose={fn()}>
            {lines === 'single' ? SINGLE : LONG}
          </FinSnackbar>
        )),
      )}
    </div>
  ),
};

/** Only a message, with a close button, as on the Programme configuration removed screen. */
export const MessageAndClose: Story = {
  name: 'Message and close',
  args: { tone: 'success', message: 'Segment removed', showButton: false },
};

/** No buttons: the message keeps 16 from the right edge. */
export const MessageOnly: Story = {
  name: 'Message only',
  args: { showButton: false, showClose: false },
};

let count = 0;

/**
 * In a page: snackbars appear at the top right, up to 3 grid columns wide (try the viewports), the newest on top.
 * Without an action they close after 6 seconds (the time starts again after the pointer or focus leaves); with
 * "Undo" they stay until closed.
 */
export const InAPage: Story = {
  name: 'In a page',
  parameters: { layout: 'fullscreen' },
  render: function InAPage() {
    const [items, setItems] = useState<{ id: number; tone: FinSnackbarTone; text: string; undo: boolean }[]>([
      { id: 0, tone: 'success', text: 'Segment removed', undo: false },
    ]);
    const add = (tone: FinSnackbarTone, text: string, undo = false) => setItems((current) => [...current, { id: ++count, tone, text, undo }]);
    const remove = (id: number) => setItems((current) => current.filter((item) => item.id !== id));
    return (
      <div className={styles.page}>
        <FinTextBox type="h4" heading="Programme configuration" description="Show snackbars from here." />
        <div className={styles.buttons}>
          <FinButton variant="secondary" onClick={() => add('neutral', 'Configuration saved as a draft')}>
            Neutral
          </FinButton>
          <FinButton variant="secondary" onClick={() => add('success', 'Segment removed', true)}>
            Success with Undo
          </FinButton>
          <FinButton variant="secondary" onClick={() => add('warning', 'Points expire in 7 days for 120 members')}>
            Warning
          </FinButton>
          <FinButton variant="secondary" onClick={() => add('error', "Couldn't save the configuration. Try again.")}>
            Error
          </FinButton>
        </div>
        <FinSnackbarRegion>
          {items.map((item) => (
            <FinSnackbar
              key={item.id}
              tone={item.tone}
              onClose={() => remove(item.id)}
              {...(item.undo ? { action: { label: 'Undo', onClick: () => remove(item.id) } } : {})}
            >
              {item.text}
            </FinSnackbar>
          ))}
        </FinSnackbarRegion>
      </div>
    );
  },
};
