'use client';

import { useId, useRef, useState, type DragEvent, type HTMLAttributes, type ReactNode } from 'react';
import type { FinIconName } from '../../icons/finIcons';
import { FinButton } from '../Button';
import { FinIconContainer, type FinIconContainerTone } from '../IconContainer';
import { FinProgressBar } from '../ProgressBar';
import { FinTextBox, type FinHeadingLevel } from '../TextBox';
import * as styles from './FinFileUpload.styles';
import { formatFileSize } from './fileSize';

/** Figma `Size`. */
export type FinFileUploadSize = 'large' | 'small';
/** Figma `State`: where the upload is. The page sets it (it does the uploading). */
export type FinFileUploadState = 'enabled' | 'uploading' | 'complete' | 'error';

/** What the component says. Override any of them (other wording, another language). */
export interface FinFileUploadLabels {
  upload: string;
  cancel: string;
  delete: string;
  uploading: string;
  failed: string;
  /** A file of a type `accept` doesn't take. */
  wrongType: string;
  /** A file over `maxSize` (given as "5 MB"). */
  tooBig: (maxSize: string) => string;
}

const DEFAULT_LABELS: FinFileUploadLabels = {
  upload: 'Upload',
  cancel: 'Cancel',
  delete: 'Delete',
  uploading: 'Uploading…',
  failed: 'Upload failed',
  wrongType: 'This file type isn’t accepted',
  tooBig: (maxSize) => `This file is larger than ${maxSize}`,
};

export interface FinFileUploadProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  /** Figma `Size` (default `large`): a centred column, or a row with the button on the right. */
  size?: FinFileUploadSize;
  /** Figma `State` (default `enabled`). The page moves it on: uploading while the file goes up, then complete or error. */
  state?: FinFileUploadState;
  /** The title when there's no file yet ("Upload badge icon"). */
  heading: ReactNode;
  /** The text under the title in every state: the accepted types and size ("(JPEG, PNG)", "Max file size: 5 MB"). */
  description?: ReactNode;
  /** The heading element (default 3). Changes the structure only, never the look. */
  headingLevel?: FinHeadingLevel;
  /** Complete: the file's name, the title. */
  fileName?: string;
  /** Uploading: how far it is, 0 to 100. */
  progress?: number;
  /** Error: what went wrong, the title (default "Upload failed"; a file the component refused says why). */
  errorMessage?: string;
  /** The file types taken, as the file input's `accept` (".png,.jpg,.jpeg" or "image/png,image/jpeg"). */
  accept?: string;
  /** The largest file taken, in bytes. */
  maxSize?: number;
  /** Called with a file picked or dropped that passes `accept` and `maxSize`: start uploading it. */
  onFileSelect?: (file: File) => void;
  /** Called with why a picked or dropped file was refused (wrong type, too big): show the error state with it. */
  onFileReject?: (message: string, file: File) => void;
  /** Uploading: Cancel was pressed. */
  onCancel?: () => void;
  /** Complete: Delete was pressed. */
  onDelete?: () => void;
  /** Turns it off: greyed, no button, nothing can be dropped (code only; Figma has no disabled state). */
  disabled?: boolean;
  /** Its wording. */
  labels?: Partial<FinFileUploadLabels>;
}

const STATE_LOOK: Record<FinFileUploadState, { icon: FinIconName; tone: FinIconContainerTone }> = {
  enabled: { icon: 'image', tone: 'info' },
  uploading: { icon: 'image', tone: 'info' },
  complete: { icon: 'check', tone: 'success' },
  error: { icon: 'warning', tone: 'error' },
};

/** Whether `file` is one of `accept`'s types: extensions (".png"), MIME types ("image/png") or groups ("image/*"). */
function accepts(accept: string | undefined, file: File) {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return accept
    .split(',')
    .map((a) => a.trim().toLowerCase())
    .filter(Boolean)
    .some((a) => (a.startsWith('.') ? name.endsWith(a) : a.endsWith('/*') ? type.startsWith(a.slice(0, -1)) : type === a));
}

/**
 * Figma File uploads (DESIGN.md §9): a dashed box to upload one file, with an icon, a title, a description and one
 * button. Enabled: Upload opens the file picker, or a file is dropped on the box (it turns purple while one is dragged
 * over it); the file is checked against `accept` and `maxSize` and handed to the page (`onFileSelect`), or refused
 * with the reason (`onFileReject`). The page sets `state` as it uploads: Uploading (a progress bar and Cancel),
 * Complete (the file's name and a red Delete), Error (what went wrong and Upload again).
 */
export function FinFileUpload({
  size = 'large',
  state = 'enabled',
  heading,
  description,
  headingLevel = 3,
  fileName,
  progress = 0,
  errorMessage,
  accept,
  maxSize,
  onFileSelect,
  onFileReject,
  onCancel,
  onDelete,
  disabled = false,
  labels: customLabels,
  className,
  ...rest
}: FinFileUploadProps) {
  const labels = { ...DEFAULT_LABELS, ...customLabels };
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const textId = useId();
  // A file can be picked or dropped when there's none, or after an error.
  const open = !disabled && (state === 'enabled' || state === 'error');
  const look = STATE_LOOK[state];

  const take = (file: File | undefined) => {
    if (!file) return;
    if (!accepts(accept, file)) onFileReject?.(labels.wrongType, file);
    else if (maxSize !== undefined && file.size > maxSize) onFileReject?.(labels.tooBig(formatFileSize(maxSize)), file);
    else onFileSelect?.(file);
  };

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (!open) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    setDragging(true);
  };
  const onDragLeave = (event: DragEvent<HTMLDivElement>) => {
    // Only when the pointer leaves the box, not when it moves onto a child.
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false);
  };
  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    if (!open) return;
    event.preventDefault();
    setDragging(false);
    take(event.dataTransfer.files[0]);
  };

  const title = state === 'uploading' ? labels.uploading : state === 'complete' ? (fileName ?? heading) : state === 'error' ? (errorMessage ?? labels.failed) : heading;
  // Filled, as Figma's icons here (the image and the warning are solid).
  const icon = <FinIconContainer name={look.icon} tone={disabled ? 'disabled' : look.tone} size={size === 'large' ? 48 : 40} filled />;
  const text = (
    <FinTextBox
      id={textId}
      className={styles.text}
      type="h6"
      align={size === 'large' ? 'center' : 'left'}
      heading={title}
      headingLevel={headingLevel}
      disabled={disabled}
      {...(description !== undefined ? { description } : {})}
    />
  );
  const bar = state === 'uploading' && <FinProgressBar className={styles.bar} size="small" value={Math.min(Math.max(progress, 0), 100)} label={labels.uploading} />;

  let button: ReactNode = null;
  if (!disabled) {
    if (state === 'uploading')
      button = (
        <FinButton variant="tertiary" size="xsmall" icon="leading" iconName="cancel" onClick={onCancel} aria-describedby={textId}>
          {labels.cancel}
        </FinButton>
      );
    else if (state === 'complete')
      button = (
        // Destructive: red, with the bin used for Remove elsewhere (FinButton has no destructive Tertiary; `error` content tone).
        <FinButton variant="tertiary" size="xsmall" icon="leading" iconName="delete" contentTone="error" onClick={onDelete} aria-describedby={textId}>
          {labels.delete}
        </FinButton>
      );
    else
      button = (
        <FinButton variant="tertiary" size="xsmall" icon="leading" iconName="cloud_upload" onClick={() => input.current?.click()} aria-describedby={textId}>
          {labels.upload}
        </FinButton>
      );
  }

  return (
    <div
      {...rest}
      role="group"
      aria-labelledby={textId}
      className={[
        styles.size[size],
        styles.border[disabled ? 'disabled' : dragging ? 'dragging' : state],
        dragging ? styles.fill.dragging : styles.fill.resting,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-size={size}
      data-state={state}
      data-dragging={dragging || undefined}
      data-disabled={disabled || undefined}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* The picker behind Upload: hidden, as the button names and opens it. */}
      <input
        ref={input}
        type="file"
        className={styles.input}
        tabIndex={-1}
        aria-hidden="true"
        disabled={!open}
        {...(accept ? { accept } : {})}
        onChange={(event) => {
          take(event.target.files?.[0]);
          // So the same file can be picked again (after Delete or an error).
          event.target.value = '';
        }}
      />
      {size === 'large' ? (
        <>
          {icon}
          {bar}
          <div className={styles.status.large} aria-live="polite">
            {text}
          </div>
          {button}
        </>
      ) : (
        <>
          <div className={styles.row}>
            <div className={styles.leading}>
              {icon}
              <div className={styles.status.small} aria-live="polite">
                {text}
              </div>
            </div>
            {button}
          </div>
          {bar}
        </>
      )}
    </div>
  );
}
