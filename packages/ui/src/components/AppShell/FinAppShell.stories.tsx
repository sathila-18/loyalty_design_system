import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { FinIcon } from '../../icons/FinIcon';
import type { FinSideNavSection } from '../SideNav';
import { FinTextBox } from '../TextBox';
import { FinAppShell } from './FinAppShell';
import styles from './FinAppShell.stories.module.css';

const SECTIONS: FinSideNavSection[] = [
  { icon: 'home', label: 'Dashboard', href: '#dashboard' },
  {
    icon: 'loyalty',
    label: 'Loyalty management',
    pages: [
      { label: 'Programme configuration', href: '#loyalty/programme' },
      { label: 'Tier management', href: '#loyalty/tiers' },
      { label: 'Reward catalog', href: '#loyalty/rewards' },
    ],
  },
  { icon: 'sports_esports', label: 'Gamification', pages: [{ label: 'Focus areas', href: '#gamification/focus' }, { label: 'Badges', href: '#gamification/badges' }] },
  { icon: 'desktop_windows', label: 'System configuration', href: '#system' },
  { icon: 'assignment', label: 'Report management', href: '#reports' },
  { icon: 'supervised_user_circle', label: 'User management', pages: [{ label: 'System users', href: '#users/system' }, { label: 'Role management', href: '#users/roles' }] },
  { icon: 'plagiarism', label: 'System audit', href: '#audit' },
];

const PROFILE = { name: 'Olivia James', email: 'oliviajames@email.com', initials: 'OJ', href: '#account' };

/** The logo slot: a placeholder, as the side nav stories (Figma's `Logo sizes` comes from another library, §10 #25). */
const LogoPlaceholder = () => (
  <span className={styles.logo}>
    <span className={styles.logoImage}>
      <FinIcon name="image" size={36} color="brand" />
    </span>
    <span className={styles.companyName}>Company name</span>
  </span>
);

/** A stand-in for the page content: blocks of text, so the shell's layout and scrolling show. */
function SampleContent({ blocks = 3 }: { blocks?: number }) {
  return (
    <div className={styles.content}>
      {Array.from({ length: blocks }, (_, i) => (
        <section key={i} className={styles.block}>
          <FinTextBox
            type="h5"
            headingLevel={2}
            heading={`Section ${i + 1}`}
            description="Page content goes here: a table, a form or cards. The page lays out its blocks; the shell gives it the side nav, the header and this panel."
          />
        </section>
      ))}
    </div>
  );
}

interface Args {
  title: string;
  description: string;
  blocks: number;
}

/**
 * The page shell (code only, DESIGN.md §9): Skip to content, the side nav, the content panel with the header at its
 * top and the page's content scrolling under it. Use the viewport menu (1920, 1440, 1280, 1024): below 1280 the side
 * nav is minimized; its collapse button changes it until the window crosses 1280.
 */
/**
 * Accepted contrast exceptions (DESIGN.md §10 #3): a selected section's label in the side nav (4.32:1), and the bell's
 * number badge in Dark (3.97:1). Only those are left out of the a11y check, as in the side nav and header stories.
 */
const KNOWN_CONTRAST_ISSUES = ['[data-selected="sub-item"]', 'html[data-theme="dark"] [data-tone="error"]:is([data-shape="circle"], [data-shape="pill"])'];

const meta: Meta<Args> = {
  title: 'Components/Layout/App shell',
  parameters: { layout: 'fullscreen', a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
  globals: { viewport: { value: 'desktop1920', isRotated: false } },
  args: { title: 'Programme configuration', description: 'One configuration per customer segment', blocks: 3 },
  argTypes: {
    title: { control: 'text', description: "The header's title" },
    description: { control: 'text', description: "The header's description" },
    blocks: { control: { type: 'range', min: 1, max: 20 }, description: 'Sample content blocks (more than fit: the content scrolls, the header stays)' },
  },
  render: ({ title, description, blocks }) => (
    <FinAppShell
      sideNav={{ sections: SECTIONS, currentHref: '#loyalty/programme', profile: PROFILE, logo: <LogoPlaceholder /> }}
      header={{ heading: title, bodyContent: description, backButton: false, notificationProps: { notification: 'number', count: 120 } }}
    >
      <SampleContent blocks={blocks} />
    </FinAppShell>
  ),
};
export default meta;

type Story = StoryObj<Args>;

/** At 1920 (Figma's width): the side nav expanded. */
export const Playground: Story = {};

/** At 1024: below 1280 the side nav is minimized. */
export const At1024: Story = {
  name: 'At 1024',
  globals: { viewport: { value: 'desktop1024', isRotated: false } },
};

/** Long content: it scrolls inside the panel; the header stays at the top of the panel, and the side nav in place. */
export const LongContent: Story = {
  name: 'Long content',
  args: { blocks: 14 },
};

/** "Skip to content": the first thing Tab reaches; it appears at the top left and moves focus to the content. */
export const SkipLink: Story = {
  name: 'Skip link',
  play: async () => {
    await userEvent.tab();
  },
};
