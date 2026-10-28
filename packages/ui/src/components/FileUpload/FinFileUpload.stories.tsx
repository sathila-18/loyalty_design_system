import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { FinFileUpload, type FinFileUploadSize, type FinFileUploadState } from './FinFileUpload';
import styles from './FinFileUpload.stories.module.css';

/** A disabled upload's text is inactive by design (WCAG exempts the text of disabled controls), as the other fields. */
const KNOWN_CONTRAST_ISSUES = ['[data-disabled] [data-disabled]'];

const DESCRIPTION = (
  <>
    (JPEG, PNG)
    <br />
    Max file size: 5 MB
  </>
);
const ACCEPT = '.jpg,.jpeg,.png,image/jpeg,image/png';
const MAX = 5 * 1024 * 1024;

interface Args {
  size: FinFileUploadSize;
  state: FinFileUploadState;
  heading: string;
  fileName: string;
  progress: number;
  errorMessage: string;
  disabled: boolean;
}

/**
 * Upload one file (Figma File uploads `775:4280`; DESIGN.md §9). Upload opens the file picker, or drop a file on the
 * box (it turns purple while one is over it). The page sets the state as it uploads: Uploading, Complete, Error.
 */
const meta: Meta<Args> = {
  title: 'Components/Input field/File upload',
  parameters: { a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
  args: { size: 'large', state: 'enabled', heading: 'Upload badge icon', fileName: 'logo.png', progress: 25, errorMessage: 'Upload failed', disabled: false },
  argTypes: {
    size: { control: 'inline-radio', options: ['large', 'small'], description: 'Figma `Size` → `size`' },
    state: { control: 'inline-radio', options: ['enabled', 'uploading', 'complete', 'error'], description: 'Figma `State` → `state`' },
    heading: { control: 'text', description: '`heading` (Enabled)' },
    fileName: { control: 'text', description: '`fileName` (Complete)', if: { arg: 'state', eq: 'complete' } },
    progress: { control: { type: 'range', min: 0, max: 100 }, description: '`progress` (Uploading)', if: { arg: 'state', eq: 'uploading' } },
    errorMessage: { control: 'text', description: '`errorMessage` (Error)', if: { arg: 'state', eq: 'error' } },
    disabled: { control: 'boolean', description: '`disabled` (code only)' },
  },
  render: (args) => (
    <div className={styles.frame}>
      <FinFileUpload {...args} description={DESCRIPTION} accept={ACCEPT} maxSize={MAX} />
    </div>
  ),
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};

/** Every Figma variant: Size × State. */
export const Variants: Story = {
  name: 'Variants (Figma)',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className={styles.grid}>
      {(['large', 'small'] as const).map((size) => (
        <div key={size} className={styles.column}>
          <FinFileUpload size={size} heading="Upload badge icon" description={DESCRIPTION} />
          <FinFileUpload size={size} state="uploading" progress={25} heading="Upload badge icon" description={DESCRIPTION} />
          <FinFileUpload size={size} state="complete" fileName="logo.png" heading="Upload badge icon" description={DESCRIPTION} />
          <FinFileUpload size={size} state="error" heading="Upload badge icon" description={DESCRIPTION} />
        </div>
      ))}
    </div>
  ),
};

/** Code only: disabled (greyed, no button, nothing can be dropped). */
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className={styles.column}>
      <FinFileUpload disabled heading="Upload badge icon" description={DESCRIPTION} />
      <FinFileUpload disabled size="small" heading="Upload badge icon" description={DESCRIPTION} />
    </div>
  ),
};

/**
 * Try it: pick or drop a JPEG or PNG up to 5 MB. A fake upload runs (Cancel stops it), then Complete with Delete. A
 * PDF or a file over 5 MB shows the error and why.
 */
export const TryIt: Story = {
  name: 'Try it',
  parameters: { controls: { include: ['size'] } },
  render: function TryIt({ size }) {
    const [state, setState] = useState<FinFileUploadState>('enabled');
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    useEffect(() => {
      if (state !== 'uploading') return undefined;
      const timer = window.setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            window.clearInterval(timer);
            setState('complete');
            return 100;
          }
          return p + 10;
        });
      }, 150);
      return () => window.clearInterval(timer);
    }, [state]);
    return (
      <div className={styles.frame}>
        <FinFileUpload
          size={size}
          state={state}
          heading="Upload badge icon"
          description={DESCRIPTION}
          accept={ACCEPT}
          maxSize={MAX}
          progress={progress}
          {...(file ? { fileName: file.name } : {})}
          errorMessage={error}
          onFileSelect={(f) => {
            setFile(f);
            setProgress(0);
            setState('uploading');
          }}
          onFileReject={(message) => {
            setError(message);
            setState('error');
          }}
          onCancel={() => setState('enabled')}
          onDelete={() => {
            setFile(null);
            setState('enabled');
          }}
        />
      </div>
    );
  },
};

/** A long file name wraps. */
export const LongFileName: Story = {
  name: 'Long file name',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className={styles.column}>
      <FinFileUpload state="complete" fileName="loyalty-programme-badge-icon-final-version-2026-10-28-approved.png" heading="Upload badge icon" description={DESCRIPTION} />
      <FinFileUpload size="small" state="complete" fileName="loyalty-programme-badge-icon-final-version-2026-10-28-approved.png" heading="Upload badge icon" description={DESCRIPTION} />
    </div>
  ),
};
