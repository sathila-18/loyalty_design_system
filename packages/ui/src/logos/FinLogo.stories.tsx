import type { Meta, StoryObj } from '@storybook/react-vite';
import { FinLogo, type FinLogoColour, type FinLogoSize } from './FinLogo';
import { FIN_LOGO_BRANDS } from './finLogos';
import styles from './FinLogo.stories.module.css';

const SIZES: FinLogoSize[] = ['small', 'medium', 'large'];

/**
 * A brand's logo (Figma Foundation – Loyalty › Logo, Logo sizes). `colour="auto"` follows the Theme toolbar: Colored in
 * Light, White in Dark. Switch the theme (or Side by side) to see it change. Finspace and Burgundy have no logo yet.
 */
const meta: Meta<typeof FinLogo> = {
  title: 'Components/Logo',
  component: FinLogo,
  args: { brand: 'sampath', size: 'small', colour: 'auto', showText: true, decorative: false },
  argTypes: {
    brand: { control: 'inline-radio', options: [...FIN_LOGO_BRANDS], description: 'The brand (Figma: one Logo sizes set per brand)' },
    size: { control: 'inline-radio', options: SIZES, description: 'Figma `Size`: heights 40 / 56 / 80' },
    colour: {
      control: 'inline-radio',
      options: ['auto', 'coloured', 'white'] satisfies FinLogoColour[],
      description: 'Figma `Style`; `auto` (code only): Colored in Light, White in Dark',
    },
    showText: { control: 'boolean', description: 'Figma `Type`: With text / Without text' },
    decorative: { control: 'boolean', description: 'Next to a visible brand name: hidden from screen readers' },
    label: { control: 'text', description: 'The image name; default the brand name' },
  },
};
export default meta;

type Story = StoryObj<typeof FinLogo>;

export const Playground: Story = {};

/** The Figma Logo sizes reference: every size, With and Without text. Colored on a light panel, White on a dark one. */
export const Sizes: Story = {
  name: 'Sizes (Figma)',
  render: () => (
    <div className={styles.grid}>
      {(['coloured', 'white'] as const).map((colour) => (
        <div key={colour} className={styles.panel} data-theme={colour === 'white' ? 'dark' : 'light'}>
          {SIZES.map((size) => (
            <div key={size} className={styles.row}>
              <FinLogo brand="sampath" size={size} colour={colour} />
              <FinLogo brand="sampath" size={size} colour={colour} showText={false} />
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};
