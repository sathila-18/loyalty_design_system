import type { Meta, StoryObj } from '@storybook/react-vite';
import { FinCaption, type FinCaptionSize, type FinCaptionThickness } from './FinCaption';
import styles from './FinCaption.stories.module.css';

const SIZES: FinCaptionSize[] = ['small', 'medium', 'large'];
const THICKNESSES: FinCaptionThickness[] = ['heavy', 'light'];
const title = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const meta: Meta<typeof FinCaption> = {
  title: 'Components/List/Caption',
  component: FinCaption,
  args: { children: 'Caption', size: 'small', thickness: 'heavy' },
  argTypes: {
    children: { control: 'text', description: 'The text' },
    size: { control: 'inline-radio', options: SIZES, description: 'Figma `Size`' },
    thickness: { control: 'inline-radio', options: THICKNESSES, description: 'Figma `Thickness`' },
  },
};
export default meta;

type Story = StoryObj<typeof FinCaption>;

export const Playground: Story = {};

/** The Figma Caption page: every Size and Thickness. */
export const Variants: Story = {
  name: 'Sizes and thickness (Figma)',
  render: () => (
    <div className={styles.table}>
      <span />
      {THICKNESSES.map((t) => (
        <span key={t}>{title(t)}</span>
      ))}
      {SIZES.map((size) => [
        <span key={size} className={styles.rowLabel}>
          {title(size)}
        </span>,
        ...THICKNESSES.map((thickness) => (
          <FinCaption key={`${size}-${thickness}`} size={size} thickness={thickness}>
            Caption
          </FinCaption>
        )),
      ])}
    </div>
  ),
};

/** Long captions wrap onto more lines (decided 15 Oct 2026). */
export const LongText: Story = {
  name: 'Long text',
  render: () => (
    <div className={styles.narrow}>
      <FinCaption thickness="light" size="medium">
        Points expire 12 months after they’re earned unless the member makes another purchase before then.
      </FinCaption>
    </div>
  ),
};
