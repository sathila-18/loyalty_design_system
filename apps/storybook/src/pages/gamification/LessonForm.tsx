import { useId, type FormEvent } from 'react';
import {
  FinListCheckboxFilled,
  FinListCheckboxGroup,
  FinListToggleFilled,
  FinSelectField,
  FinSideSheet,
  FinTextArea,
  FinTextBox,
  FinTextField,
} from '@finspace-loyalty/ui';
import { ConnectionError, SaveError } from '../common/PageStates';
import { DiscardDialog } from './DiscardDialog';
import { TIERS, TRIGGERS, padded, type Lesson } from './focusAreaModel';
import styles from './FocusAreas.module.css';
import { useSheetForm } from './useSheetForm';

/** What the form saves: the page adds the lesson at `order`, or updates it when editing. */
export interface LessonValues {
  topic: string;
  description: string;
  exampleTopic: string;
  exampleDescription: string;
  trigger: string | null;
  tiers: string[];
  order: number;
  published: boolean;
}

export interface LessonFormProps {
  open: boolean;
  /** Edit: the lesson whose values fill the form. Leave it out to add one. */
  lesson?: Lesson;
  /** The focus area it belongs to, under the title. */
  focusArea: string;
  /** How many lessons the focus area has: Order offers 1 to that (and one more when adding). */
  total: number;
  onClose: () => void;
  /** Saves the values; `false` means it failed (the sheet stays open with the save error). */
  onSave: (values: LessonValues) => boolean | void;
  /** The connection is down: the network or server error at the top, and Save off. */
  offline?: boolean;
}

const ERRORS = { topic: 'Enter a topic', description: 'Enter a description', trigger: 'Choose a trigger event' };

/**
 * Lessons → Add (Figma `420:43923`, DESIGN.md §8.6) and Edit (the same, filled; code first): topic, description,
 * example topic and description, the trigger event after success, tiers, order, and a Published toggle (decided 28
 * Oct 2026). The page remounts it (`key`) each time it opens.
 */
export function LessonForm({ open, lesson, focusArea, total, onClose, onSave, offline = false }: LessonFormProps) {
  const editing = lesson !== undefined;
  const places = editing ? total : total + 1;
  const form = useSheetForm(
    {
      topic: lesson?.topic ?? '',
      description: lesson?.description ?? '',
      exampleTopic: lesson?.exampleTopic ?? '',
      exampleDescription: lesson?.exampleDescription ?? '',
      trigger: lesson?.trigger ?? null,
      tiers: lesson?.tiers ?? [],
      order: String(lesson?.order ?? places),
      published: lesson?.published ?? false,
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
    if (!form.check({ topic: !v.topic.trim(), description: !v.description.trim(), trigger: !v.trigger })) return;
    const saved = onSave({
      ...v,
      topic: v.topic.trim(),
      description: v.description.trim(),
      exampleTopic: v.exampleTopic.trim(),
      exampleDescription: v.exampleDescription.trim(),
      order: Number(v.order),
    });
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
        closeButton={false}
        title={<FinTextBox type="h4" heading={editing ? 'Edit lesson' : 'Add lesson'} headingLevel={2} description={focusArea} truncateHeading />}
        buttonDock={{
          secondaryButton: { label: 'Cancel', onClick: requestClose },
          primaryButton: editing
            ? { label: 'Save', type: 'submit', form: formId, disabled: !form.changed || offline }
            : { label: 'Save lesson', type: 'submit', form: formId, disabled: offline },
        }}
      >
        <form id={formId} className={styles.form} noValidate onSubmit={submit}>
          {offline ? <ConnectionError /> : form.saveFailed && <SaveError />}
          <fieldset className={styles.section}>
            <legend className={styles.legend}>Lesson</legend>
            <div className={styles.group}>
              <FinTextField size="small" ref={ref('topic')} label="Topic" placeholder="Topic" value={v.topic} onChange={(e) => set('topic', e.target.value, 'topic')} {...helper('topic')} />
              <FinTextArea
                ref={ref('description')}
                label="Description"
                placeholder="Description"
                value={v.description}
                onChange={(e) => set('description', e.target.value, 'description')}
                {...helper('description')}
              />
            </div>
          </fieldset>
          <fieldset className={styles.section}>
            <legend className={styles.legend}>Example</legend>
            <div className={styles.group}>
              <FinTextField size="small" label="Example topic (optional)" placeholder="Example topic (optional)" value={v.exampleTopic} onChange={(e) => set('exampleTopic', e.target.value)} />
              <FinTextArea
                label="Example description (optional)"
                placeholder="Example description (optional)"
                value={v.exampleDescription}
                onChange={(e) => set('exampleDescription', e.target.value)}
              />
            </div>
          </fieldset>
          <fieldset className={styles.section}>
            <legend className={styles.legend}>After the lesson</legend>
            <div className={styles.group}>
              <div className={styles.row}>
                <FinSelectField size="small"
                  ref={ref('trigger')}
                  label="Trigger event (after success)"
                  placeholder="Trigger event (after success)"
                  options={TRIGGERS.map((t) => ({ value: t, label: t }))}
                  value={v.trigger}
                  onChange={(next) => set('trigger', next, 'trigger')}
                  {...helper('trigger')}
                />
                <FinSelectField size="small"
                  label="Order"
                  placeholder="Order"
                  options={Array.from({ length: places }, (_, i) => ({ value: String(i + 1), label: padded(i + 1) }))}
                  value={v.order}
                  onChange={(next) => set('order', next ?? v.order)}
                />
              </div>
              <div className={styles.panel}>
                <p className={styles.panelTitle} aria-hidden="true">
                  Tiers
                </p>
                <FinListCheckboxGroup label="Tiers" value={v.tiers} onValueChange={(next) => set('tiers', next)} size="small">
                  {TIERS.map((t) => (
                    <FinListCheckboxFilled key={t} value={t} title={t} />
                  ))}
                </FinListCheckboxGroup>
              </div>
            </div>
          </fieldset>
          <fieldset className={styles.section}>
            <legend className={styles.legend}>Status</legend>
            <FinListToggleFilled
              size="small"
              title="Published"
              description="Members can see this lesson in its focus area"
              checked={v.published}
              onCheckedChange={(on) => set('published', on)}
            />
          </fieldset>
        </form>
      </FinSideSheet>
      <DiscardDialog open={form.discarding} editing={editing} item="lesson" onKeep={() => form.setDiscarding(false)} onDiscard={close} />
    </>
  );
}
