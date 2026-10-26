import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type FormEvent } from 'react';
import { fn, userEvent } from 'storybook/test';
import { FinButton } from '../Button';
import type { FinInputBaseSize } from '../InputBase';
import { FinSelectField, type FinSelectFieldOption } from './FinSelectField';
import styles from './FinSelectField.stories.module.css';

const SEGMENTS: FinSelectFieldOption[] = [
  { value: 'staff', label: 'Staff' },
  { value: 'vip', label: 'VIP' },
  { value: 'regular', label: 'Regular' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'premier', label: 'Premier banking customers (Colombo and Kandy branches)' },
];

const MANY: FinSelectFieldOption[] = [
  ...SEGMENTS,
  { value: 'seniors', label: 'Senior citizens' },
  { value: 'students', label: 'Students' },
  { value: 'dormant', label: 'Dormant accounts', disabled: true },
  { value: 'cards', label: 'Credit card holders' },
  { value: 'joiners', label: 'New joiners' },
  { value: 'sme', label: 'SME' },
  { value: 'pensioners', label: 'Pensioners' },
  { value: 'diaspora', label: 'Overseas Sri Lankans' },
  { value: 'youth', label: 'Youth savers' },
  { value: 'women', label: 'Women in business' },
];

interface Args {
  size: FinInputBaseSize;
  label: string;
  placeholder: string;
  value: string;
  showHelperText: boolean;
  helperText: string;
  error: boolean;
  disabled: boolean;
  searchable: boolean;
}

/**
 * A disabled field's helper text is inactive by design (WCAG exempts the text of disabled controls), as the Text field
 * stories (DESIGN.md §9.20). Only that is left out of the a11y check.
 */
const KNOWN_CONTRAST_ISSUES = ['[data-tone="disabled"]'];

/**
 * A select field (Figma Input field-select): click it, or focus it and press Enter, Space or an arrow key, to open the
 * menu of options. Hover and focus it to see the states; choose an option for Complete.
 */
const meta: Meta<Args> = {
  title: 'Components/Input field/Select field',
  parameters: { a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
  args: {
    size: 'large',
    label: 'Label',
    placeholder: 'Placeholder text',
    value: '',
    showHelperText: true,
    helperText: 'Helper text here',
    error: false,
    disabled: false,
    searchable: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['large', 'small'], description: 'Large 48 (Figma) or Small 40 (code only)' },
    label: { control: 'text', description: 'Figma `Show Label` (on the border once focused or chosen)' },
    placeholder: { control: 'text', description: 'Figma `Show Placeholder text`' },
    value: { control: 'select', options: ['', ...SEGMENTS.map((s) => s.value)], description: 'The option chosen at first (`defaultValue`): Complete' },
    showHelperText: { control: 'boolean', description: 'Figma `Show Helper text`' },
    helperText: { control: 'text', if: { arg: 'showHelperText' } },
    error: { control: 'boolean', description: 'The error look (from the input field base)' },
    disabled: { control: 'boolean', description: 'Disabled (from the input field base)' },
    searchable: { control: 'boolean', description: 'Code only: a search field at the top of the menu (`searchable`)' },
  },
  decorators: [
    (Story) => (
      <div className={styles.stage}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <div className={styles.column}>
      <FinSelectField
        key={args.value}
        size={args.size}
        label={args.label}
        placeholder={args.placeholder}
        options={SEGMENTS}
        error={args.error}
        disabled={args.disabled}
        searchable={args.searchable}
        onChange={fn()}
        {...(args.value ? { defaultValue: args.value } : {})}
        {...(args.showHelperText ? { helperText: args.helperText } : {})}
      />
    </div>
  ),
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/** Enabled (hover it for Hovered), Complete, Disabled and Error. Focused and Typing: see Menu open. */
export const States: Story = {
  name: 'States (Figma)',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className={styles.grid}>
      <FinSelectField label="Label" placeholder="Placeholder text" options={SEGMENTS} helperText="Enabled" />
      <FinSelectField label="Label" placeholder="Placeholder text" options={SEGMENTS} defaultValue="staff" helperText="Complete" />
      <FinSelectField label="Label" placeholder="Placeholder text" options={SEGMENTS} helperText="Disabled" disabled />
      <FinSelectField label="Label" placeholder="Placeholder text" options={SEGMENTS} defaultValue="staff" helperText="Disabled, chosen" disabled />
      <FinSelectField label="Label" placeholder="Placeholder text" options={SEGMENTS} helperText="Error" error />
      <FinSelectField label="Label" placeholder="Placeholder text" options={SEGMENTS} defaultValue="premier" helperText="A long option ends in “…”" />
    </div>
  ),
};

/** Open: the field is Focused (the label, the ring), the arrow points up, the chosen option is Selected. */
export const MenuOpen: Story = {
  name: 'Menu open',
  args: { value: 'vip' },
  play: async ({ canvasElement }) => {
    await userEvent.click(canvasElement.querySelector('button')!);
  },
};

/** More options than fit: the menu scrolls; a disabled option can't be chosen. */
export const ManyOptions: Story = {
  name: 'Many options',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className={styles.column}>
      <FinSelectField label="Segment" placeholder="Segment" options={MANY} helperText="Dormant accounts can't be chosen" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(canvasElement.querySelector('button')!);
  },
};

/** Code only: a search field at the top of the menu filters the options as you type. */
export const WithSearch: Story = {
  name: 'With search',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className={styles.column}>
      <FinSelectField label="Segment" placeholder="Segment" options={MANY} searchable searchLabel="Search segments" searchPlaceholder="Search segments" noResultsText="No segments found" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(canvasElement.querySelector('button')!);
  },
};

/** No options: the field is disabled (decided 26 Oct 2026); the helper text says why. */
export const NoOptions: Story = {
  name: 'No options',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className={styles.column}>
      <FinSelectField label="Segment" placeholder="Segment" options={[]} helperText="Every segment already has a configuration" />
    </div>
  ),
};

/** Large (48, Figma) and Small (40, code only). */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className={styles.grid}>
      <FinSelectField label="Large" placeholder="Large" options={SEGMENTS} helperText="Helper text here" />
      <FinSelectField size="small" label="Small" placeholder="Small" options={SEGMENTS} helperText="Helper text here" />
    </div>
  ),
};

/** In a form: the chosen value is sent with it (`name`). Choose a segment and submit. */
export const InAForm: Story = {
  name: 'In a form',
  parameters: { controls: { disable: true } },
  render: function InAForm() {
    const [sent, setSent] = useState<string | null>(null);
    const [error, setError] = useState(false);
    return (
      <form
        className={styles.form}
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const segment = String(new FormData(event.currentTarget).get('segment') ?? '');
          setError(!segment);
          setSent(segment || null);
        }}
      >
        <FinSelectField
          label="Segment"
          placeholder="Segment"
          name="segment"
          options={SEGMENTS}
          error={error}
          helperText={error ? 'Choose a segment' : sent ? `Sent: segment=${sent}` : 'Required'}
          onChange={() => setError(false)}
        />
        <div>
          <FinButton type="submit">Submit</FinButton>
        </div>
      </form>
    );
  },
};
