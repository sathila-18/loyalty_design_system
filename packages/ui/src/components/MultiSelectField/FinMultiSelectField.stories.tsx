import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type FormEvent } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { FinButton } from '../Button';
import type { FinInputBaseSize } from '../InputBase';
import { FinMultiSelectField, type FinMultiSelectFieldOption } from './FinMultiSelectField';
import styles from './FinMultiSelectField.stories.module.css';

const PROVIDERS: FinMultiSelectFieldOption[] = [
  { value: 'slt', label: 'SLT Mobitel' },
  { value: 'dialog', label: 'Dialog' },
  { value: 'hutch', label: 'Hutch' },
  { value: 'airtel', label: 'Airtel' },
  { value: 'keells', label: 'Keells Super' },
  { value: 'cargills', label: 'Cargills Food City' },
  { value: 'ceypetco', label: 'Ceylon Petroleum Corporation (fuel stations island-wide)' },
];

const MANY: FinMultiSelectFieldOption[] = [
  ...PROVIDERS,
  { value: 'arpico', label: 'Arpico Supercentre' },
  { value: 'softlogic', label: 'Softlogic' },
  { value: 'abans', label: 'Abans', disabled: true },
  { value: 'singer', label: 'Singer' },
  { value: 'srilankan', label: 'SriLankan Airlines' },
  { value: 'pickme', label: 'PickMe' },
  { value: 'uber', label: 'Uber' },
  { value: 'daraz', label: 'Daraz' },
];

interface Args {
  size: FinInputBaseSize;
  label: string;
  placeholder: string;
  chosen: number;
  showHelperText: boolean;
  helperText: string;
  error: boolean;
  disabled: boolean;
  searchable: boolean;
}

/**
 * A disabled field's helper text and chips are inactive by design (WCAG exempts the text of disabled controls), as the
 * other field stories (DESIGN.md §9.20) and FinInputChip's. Only those are left out of the a11y check.
 */
const KNOWN_CONTRAST_ISSUES = ['[data-tone="disabled"]', '[data-part="chips"] [data-disabled]'];

/**
 * A multi-select field (Figma Input field-Multi select): click it, or focus it and press Enter, Space or an arrow key,
 * to open the menu, and tick as many options as you like (it stays open). Each chosen option is a chip; its ✕ removes
 * it. On one row, the chips that fit, then "+N" for the rest.
 */
const meta: Meta<Args> = {
  title: 'Components/Input field/Multi select field',
  parameters: { a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
  args: {
    size: 'large',
    label: 'Label',
    placeholder: 'Placeholder text',
    chosen: 0,
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
    chosen: { control: { type: 'range', min: 0, max: PROVIDERS.length, step: 1 }, description: 'How many options are chosen at first (`defaultValue`): Complete' },
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
      <FinMultiSelectField
        key={args.chosen}
        size={args.size}
        label={args.label}
        placeholder={args.placeholder}
        options={PROVIDERS}
        error={args.error}
        disabled={args.disabled}
        searchable={args.searchable}
        onChange={fn()}
        defaultValue={PROVIDERS.slice(0, args.chosen).map((p) => p.value)}
        {...(args.showHelperText ? { helperText: args.helperText } : {})}
      />
    </div>
  ),
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/** Enabled (hover it for Hovered), Complete with one chip (as Figma), more chips than fit, Disabled and Error. */
export const States: Story = {
  name: 'States (Figma)',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className={styles.grid}>
      <FinMultiSelectField label="Label" placeholder="Placeholder text" options={PROVIDERS} helperText="Enabled" />
      <FinMultiSelectField label="Label" placeholder="Placeholder text" options={PROVIDERS} defaultValue={['slt']} helperText="Complete" />
      <FinMultiSelectField label="Label" placeholder="Placeholder text" options={PROVIDERS} defaultValue={['slt', 'dialog', 'hutch', 'airtel', 'keells']} helperText="More than fit: “+N”" />
      <FinMultiSelectField label="Label" placeholder="Placeholder text" options={PROVIDERS} defaultValue={['ceypetco', 'slt']} helperText="A long option first" />
      <FinMultiSelectField label="Label" placeholder="Placeholder text" options={PROVIDERS} helperText="Disabled" disabled />
      <FinMultiSelectField label="Label" placeholder="Placeholder text" options={PROVIDERS} defaultValue={['slt', 'dialog']} helperText="Disabled, chosen" disabled />
      <FinMultiSelectField label="Label" placeholder="Placeholder text" options={PROVIDERS} helperText="Error" error />
      <FinMultiSelectField label="Label" placeholder="Placeholder text" options={PROVIDERS} defaultValue={['slt']} helperText="Error, chosen" error />
    </div>
  ),
};

/** Opened: Focused (the label on the border, the ring, the arrow up) and the menu, which stays open while you tick. */
export const MenuOpen: Story = {
  name: 'Menu open',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className={styles.column}>
      <FinMultiSelectField label="Provider" placeholder="Provider" options={PROVIDERS} defaultValue={['slt', 'dialog']} helperText="Tick every provider that offers it" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole('button', { name: /^Provider/ });
    await userEvent.click(field);
    const list = await within(canvasElement.ownerDocument.body).findByRole('listbox', { name: 'Provider' });
    await expect(list).toHaveAttribute('aria-multiselectable', 'true');
    // Ticking another keeps the menu open and adds a chip.
    await userEvent.click(within(list).getByRole('option', { name: 'Hutch' }));
    await expect(within(canvasElement.ownerDocument.body).getByRole('listbox', { name: 'Provider' })).toBeInTheDocument();
    await expect(field).toHaveAccessibleName('Provider SLT Mobitel, Dialog, Hutch');
  },
};

/** Many chosen: the chips that fit on the row, then "+N"; wider fields show more. */
export const ManyChosen: Story = {
  name: 'Many chosen',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className={styles.form}>
      <FinMultiSelectField label="Provider" options={MANY} defaultValue={MANY.map((o) => o.value).filter((v) => v !== 'abans')} helperText="343 wide" />
      <div className={styles.wide}>
        <FinMultiSelectField label="Provider" options={MANY} defaultValue={MANY.map((o) => o.value).filter((v) => v !== 'abans')} helperText="686 wide" />
      </div>
    </div>
  ),
};

/** Code only: `searchable`, a search field at the top of the menu for long lists. */
export const WithSearch: Story = {
  name: 'With search',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className={styles.column}>
      <FinMultiSelectField label="Provider" placeholder="Provider" options={MANY} searchable helperText="Type in the menu to filter" />
    </div>
  ),
};

/** Large 48 (Figma) and Small 40 (code only). */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className={styles.form}>
      <FinMultiSelectField label="Provider" options={PROVIDERS} defaultValue={['slt', 'dialog']} helperText="Large" />
      <FinMultiSelectField size="small" label="Provider" options={PROVIDERS} defaultValue={['slt', 'dialog']} helperText="Small" />
    </div>
  ),
};

/** In a form: `name` sends each chosen value; a chip's ✕ removes it and focus goes back to the field. */
export const InAForm: Story = {
  name: 'In a form',
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [sent, setSent] = useState<string[]>([]);
    const submit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSent(new FormData(event.currentTarget).getAll('provider').map(String));
    };
    return (
      <form className={styles.form} onSubmit={submit}>
        <FinMultiSelectField label="Provider" placeholder="Provider" name="provider" options={PROVIDERS} defaultValue={['slt', 'dialog']} helperText="Leave it empty for the bank's own rewards" />
        <FinButton type="submit">Save</FinButton>
        <output>Sent: {sent.length ? sent.join(', ') : 'nothing yet'}</output>
      </form>
    );
  },
};
