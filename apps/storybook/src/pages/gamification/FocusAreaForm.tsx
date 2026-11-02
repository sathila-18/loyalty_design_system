import { useId, type FormEvent } from 'react';
import { FinListToggleFilled, FinSelectField, FinSideSheet, FinTextArea, FinTextField } from '@finspace-loyalty/ui';
import { ConnectionError, SaveError } from '../common/PageStates';
import { DiscardDialog } from './DiscardDialog';
import { BADGES, padded, type FocusArea } from './focusAreaModel';
import styles from './FocusAreas.module.css';
import { useSheetForm } from './useSheetForm';

/** What the form saves: the page adds the focus area at `order`, or updates it when editing. */
export interface FocusAreaValues {
  name: string;
  description: string;
  badge: string | null;
  order: number;
  published: boolean;
}

export interface FocusAreaFormProps {
  open: boolean;
  /** Edit: the focus area whose values fill the form. Leave it out to add one. */
  area?: FocusArea;
  /** How many focus areas there are: Order offers 1 to that (and one more when adding). */
  total: number;
  onClose: () => void;
  /** Saves the values; `false` means it failed (the sheet stays open with the save error). */
  onSave: (values: FocusAreaValues) => boolean | void;
  /** The connection is down: the network or server error at the top, and Save off. */
  offline?: boolean;
}

const ERRORS = { name: 'Enter a focus area name', description: 'Enter a short description' };

/**
 * Focus areas → Add (Figma `420:40932`, DESIGN.md §8.6) and Edit (the same, filled; code first): name, short
 * description, badge after completion and order, and a Published toggle (decided 28 Oct 2026: the screens' lists
 * have Draft / Published but the form had no status; off is Draft). The page remounts it (`key`) each time it opens.
 */
export function FocusAreaForm({ open, area, total, onClose, onSave, offline = false }: FocusAreaFormProps) {
  const editing = area !== undefined;
  const places = editing ? total : total + 1;
  const form = useSheetForm(
    {
      name: area?.name ?? '',
      description: area?.description ?? '',
      badge: area?.badge ?? null,
      order: String(area?.order ?? places),
      published: area?.published ?? false,
    },
    ERRORS,
  );
  const { values: v, set, helper, ref } = form;
  const formId = useId();

  const close = () => {
    form.setDiscarding(false);
    onClose();
  };
  const requestClose = () => (form.changed ? form.setDiscarding(true) : close());

  const submit = (event: FormEvent) => {
    event.preventDefault();
    form.setSaveFailed(false);
    if (!form.check({ name: !v.name.trim(), description: !v.description.trim() })) return;
    const saved = onSave({ name: v.name.trim(), description: v.description.trim(), badge: v.badge, order: Number(v.order), published: v.published });
    if (saved === false) {
      form.setSaveFailed(true);
      return;
    }
    onClose();
  };

  return (
    <>
      <FinSideSheet
        open={open}
        onClose={requestClose}
        // No close button, as the other add forms: Cancel closes it; Esc and a click on the scrim still do (and ask first).
        closeButton={false}
        title={editing ? 'Edit focus area' : 'Add focus area'}
        buttonDock={{
          secondaryButton: { label: 'Cancel', onClick: requestClose },
          primaryButton: editing
            ? { label: 'Save', type: 'submit', form: formId, disabled: !form.changed || offline }
            : { label: 'Save focus area', type: 'submit', form: formId, disabled: offline },
        }}
      >
        <form id={formId} className={styles.form} noValidate onSubmit={submit}>
          {offline ? <ConnectionError /> : form.saveFailed && <SaveError />}
          <fieldset className={styles.section}>
            <legend className={styles.legend}>Details</legend>
            <div className={styles.group}>
              <FinTextField size="small" ref={ref('name')} label="Focus area name" placeholder="Focus area name" value={v.name} onChange={(e) => set('name', e.target.value, 'name')} {...helper('name')} />
              <FinTextArea
                ref={ref('description')}
                label="Short description"
                placeholder="Short description"
                value={v.description}
                onChange={(e) => set('description', e.target.value, 'description')}
                {...helper('description')}
              />
              <div className={styles.row}>
                <FinSelectField size="small"
                  label="Badge after completion (optional)"
                  placeholder="Badge after completion (optional)"
                  options={BADGES.map((b) => ({ value: b, label: b }))}
                  value={v.badge}
                  onChange={(next) => set('badge', next)}
                />
                <FinSelectField size="small"
                  label="Order"
                  placeholder="Order"
                  options={Array.from({ length: places }, (_, i) => ({ value: String(i + 1), label: padded(i + 1) }))}
                  value={v.order}
                  onChange={(next) => set('order', next ?? v.order)}
                  helperText="The others move down to make room"
                />
              </div>
            </div>
          </fieldset>
          <fieldset className={styles.section}>
            <legend className={styles.legend}>Status</legend>
            <FinListToggleFilled
              size="small"
              title="Published"
              description="Members can see this focus area and its published lessons"
              checked={v.published}
              onCheckedChange={(on) => set('published', on)}
            />
          </fieldset>
        </form>
      </FinSideSheet>
      <DiscardDialog open={form.discarding} editing={editing} item="focus area" onKeep={() => form.setDiscarding(false)} onDiscard={close} />
    </>
  );
}
