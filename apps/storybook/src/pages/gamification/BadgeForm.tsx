import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { FinFileUpload, FinListToggleFilled, FinSideSheet, FinTextField, type FinFileUploadState } from '@finspace-loyalty/ui';
import { ConnectionError, SaveError } from '../common/PageStates';
import type { Badge, BadgeIcon } from './badgeModel';
import styles from './Badges.module.css';
import { DiscardDialog } from './DiscardDialog';
import { useSheetForm } from './useSheetForm';

/** What the form saves: the page adds the badge, or updates it when editing. */
export interface BadgeValues {
  name: string;
  icon: BadgeIcon;
  active: boolean;
}

export interface BadgeFormProps {
  open: boolean;
  /** Edit: the badge whose values fill the form. Leave it out to add one. */
  badge?: Badge;
  /** The other badges' names: a name already taken is refused. */
  takenNames: string[];
  onClose: () => void;
  /** Saves the values; `false` means it failed (the sheet stays open with the save error). */
  onSave: (values: BadgeValues) => boolean | void;
  /** The connection is down: the network or server error at the top, and Save off. */
  offline?: boolean;
}

const ERRORS = { icon: 'Upload a badge icon', name: 'Enter a badge name' };
const TAKEN = 'A badge with this name already exists';
const ACCEPT = '.jpg,.jpeg,.png,image/jpeg,image/png';
const MAX_SIZE = 5 * 1024 * 1024;
/** How long the stories' fake upload takes, in steps of 10%. */
const STEP_MS = 120;

/**
 * Badges → Add badge (Figma `428:51250`, DESIGN.md §8.6) and Edit (the same, filled; code first): the badge icon in a
 * FinFileUpload (Large; a fake upload in the stories), the name, and an Active toggle card (decided 28 Oct 2026; the
 * screen has a Status select). The icon and the name are needed; Save waits while the icon uploads. The page remounts
 * it (`key`) each time it opens.
 */
export function BadgeForm({ open, badge, takenNames, onClose, onSave, offline = false }: BadgeFormProps) {
  const editing = badge !== undefined;
  const form = useSheetForm({ name: badge?.name ?? '', active: badge?.active ?? true, icon: badge?.icon ?? null }, ERRORS);
  const { values: v, set, helper, ref, errors, setErrors } = form;
  const [upload, setUpload] = useState<{ state: FinFileUploadState; progress: number; file?: File; error?: string }>({ state: badge ? 'complete' : 'enabled', progress: 0 });
  const uploadRef = useRef<HTMLDivElement>(null);
  const formId = useId();

  // The stories' fake upload: 10% a step, then the icon is the file (shown from a local URL).
  useEffect(() => {
    if (upload.state !== 'uploading') return undefined;
    const timer = window.setTimeout(() => {
      if (upload.progress < 100) setUpload((u) => ({ ...u, progress: u.progress + 10 }));
      else if (upload.file) {
        set('icon', { fileName: upload.file.name, url: URL.createObjectURL(upload.file) }, 'icon');
        setUpload({ state: 'complete', progress: 100 });
      }
    }, STEP_MS);
    return () => window.clearTimeout(timer);
  }, [upload, set]);

  const isTaken = (name: string) => takenNames.some((n) => n.toLowerCase() === name.toLowerCase());

  const close = () => {
    form.setDiscarding(false);
    onClose();
  };
  const requestClose = () => (form.changed ? form.setDiscarding(true) : close());

  const submit = (event: FormEvent) => {
    event.preventDefault();
    form.setSaveFailed(false);
    const name = v.name.trim();
    if (!v.icon) {
      setUpload({ state: 'error', progress: 0, error: ERRORS.icon });
      setErrors({ icon: true, name: !name });
      uploadRef.current?.querySelector('button')?.focus();
      return;
    }
    if (!name || isTaken(name)) {
      setErrors({ name: true });
      form.focus('name');
      return;
    }
    const saved = onSave({ name, icon: v.icon, active: v.active });
    if (saved === false) {
      form.setSaveFailed(true);
      return;
    }
    onClose();
  };

  const nameError = errors.name ? (v.name.trim() && isTaken(v.name.trim()) ? TAKEN : ERRORS.name) : null;
  const uploading = upload.state === 'uploading';

  return (
    <>
      <FinSideSheet
        open={open}
        // The close button at the top right, no Cancel (decided by design 28 Oct 2026, unlike the other add forms); it,
        // Esc and a click on the scrim ask first when something changed.
        onClose={requestClose}
        title={editing ? 'Edit badge' : 'Add badge'}
        buttonDock={{
          primaryButton: editing
            ? { label: 'Save', type: 'submit', form: formId, disabled: !form.changed || uploading || offline }
            : { label: 'Save badge', type: 'submit', form: formId, disabled: uploading || offline },
        }}
      >
        <form id={formId} className={styles.form} noValidate onSubmit={submit}>
          {offline ? <ConnectionError /> : form.saveFailed && <SaveError />}
          <fieldset className={styles.section}>
            <legend className={styles.legend}>Badge</legend>
            <div className={styles.group}>
              <div ref={uploadRef}>
                <FinFileUpload
                  heading="Upload badge icon"
                  description={
                    <>
                      (JPEG, PNG)
                      <br />
                      Max file size: 5 MB
                    </>
                  }
                  accept={ACCEPT}
                  maxSize={MAX_SIZE}
                  state={upload.state}
                  progress={upload.progress}
                  {...(v.icon ? { fileName: v.icon.fileName } : {})}
                  {...(upload.error ? { errorMessage: upload.error } : {})}
                  onFileSelect={(file) => {
                    setErrors((current) => ({ ...current, icon: false }));
                    setUpload({ state: 'uploading', progress: 0, file });
                  }}
                  onFileReject={(message) => setUpload({ state: 'error', progress: 0, error: message })}
                  // Cancel goes back to the icon there was (Edit) or none.
                  onCancel={() => setUpload({ state: v.icon ? 'complete' : 'enabled', progress: 0 })}
                  onDelete={() => {
                    set('icon', null);
                    setUpload({ state: 'enabled', progress: 0 });
                  }}
                />
              </div>
              <FinTextField size="small"
                ref={ref('name')}
                label="Badge name"
                placeholder="Badge name"
                value={v.name}
                onChange={(e) => set('name', e.target.value, 'name')}
                {...(nameError ? { error: true, helperText: nameError } : helper('name'))}
              />
            </div>
          </fieldset>
          <fieldset className={styles.section}>
            <legend className={styles.legend}>Status</legend>
            <FinListToggleFilled
              size="small"
              title="Active"
              description="Inactive badges are hidden from the badge list when creating a reward"
              checked={v.active}
              onCheckedChange={(on) => set('active', on)}
            />
          </fieldset>
        </form>
      </FinSideSheet>
      <DiscardDialog open={form.discarding} editing={editing} item="badge" onKeep={() => form.setDiscarding(false)} onDiscard={close} />
    </>
  );
}
