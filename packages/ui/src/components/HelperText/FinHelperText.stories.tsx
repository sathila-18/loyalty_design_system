import type { Meta, StoryObj } from '@storybook/react-vite';
import { FinHelperText, type FinHelperTextTone } from './FinHelperText';
import styles from './FinHelperText.stories.module.css';

const TONES: FinHelperTextTone[] = ['default', 'success', 'warning', 'error', 'disabled'];
const title = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * The `disabled` tone is the message of a disabled field: inactive by design (WCAG exempts the text of disabled
 * controls), like the Badge's disabled tone (DESIGN.md §9.10, §9.20). Only disabled helper text is left out of the
 * a11y check; every other tone is checked.
 */
const KNOWN_CONTRAST_ISSUES = ['[data-tone="disabled"]'];

const meta: Meta<typeof FinHelperText> = {
  title: 'Components/Text box/Helper text',
  component: FinHelperText,
  args: { children: 'Helper text here', tone: 'default', showIcon: true, announce: false },
  argTypes: {
    children: { control: 'text', description: 'Figma `Text`' },
    tone: { control: 'select', options: TONES, description: 'Figma `State`' },
    showIcon: { control: 'boolean', description: 'Figma `Show Leading Icon`' },
    announce: { control: 'boolean', description: 'role="alert": read as soon as it appears' },
  },
  parameters: { a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
  decorators: [
    (Story) => (
      <div className={styles.frame}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof FinHelperText>;

export const Playground: Story = {};

/** The Figma Helper text content page: every State (tone), with and without the leading icon. */
export const States: Story = {
  name: 'States (Figma)',
  render: () => (
    <div className={styles.table}>
      <span />
      <span>Show Leading Icon</span>
      <span>No icon</span>
      {TONES.map((tone) => [
        <span key={tone} className={styles.rowLabel}>
          {title(tone)}
        </span>,
        <FinHelperText key={`${tone}-icon`} tone={tone}>
          Helper text here
        </FinHelperText>,
        <FinHelperText key={`${tone}-plain`} tone={tone} showIcon={false}>
          Helper text here
        </FinHelperText>,
      ])}
    </div>
  ),
};

/**
 * Under a field: the input points to the message with `aria-describedby`, so it's read when the person reaches the
 * field. Long messages wrap; the icon stays beside the first line.
 */
export const WithAField: Story = {
  name: 'With a field',
  render: () => (
    <div className={styles.field}>
      <label htmlFor="story-card" className={styles.label}>
        Card number
      </label>
      <input id="story-card" className={styles.input} aria-invalid="true" aria-describedby="story-card-help" defaultValue="4111 1111" />
      <FinHelperText id="story-card-help" tone="error">
        This card number is too short. Enter all 16 digits printed on the front of the card, without spaces or dashes.
      </FinHelperText>
    </div>
  ),
};
