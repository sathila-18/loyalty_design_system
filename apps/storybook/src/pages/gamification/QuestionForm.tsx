import { useId, useRef, useState, type FormEvent } from 'react';
import {
  FinButton,
  FinHelperText,
  FinListCheckboxFilled,
  FinListCheckboxGroup,
  FinListRadioFilled,
  FinListRadioGroup,
  FinNotificationBanner,
  FinSideSheet,
  FinTextArea,
  FinTextBox,
  FinTextField,
} from '@finspace-loyalty/ui';
import { ConnectionError, SaveError } from '../common/PageStates';
import { DiscardDialog } from './DiscardDialog';
import { TIERS, nextId, type AnswerOption, type Question } from './focusAreaModel';
import styles from './FocusAreas.module.css';
import { useSheetForm } from './useSheetForm';

/** What the form saves: the page adds the question at the end, or updates it when editing. */
export type QuestionValues = Omit<Question, 'id'>;

export interface QuestionFormProps {
  open: boolean;
  /** Edit: the question whose values fill the form. Leave it out to add one. */
  question?: Question;
  /** The lesson it belongs to, under the title. */
  lesson: string;
  onClose: () => void;
  /** Saves the values; `false` means it failed (the sheet stays open with the save error). */
  onSave: (values: QuestionValues) => boolean | void;
  /** The connection is down: the network or server error at the top, and Save off. */
  offline?: boolean;
}

const MAX_OPTIONS = 4;
/** The screen's question rules (kept as Figma has them, decided 28 Oct 2026). */
const RULES = [
  'Exactly one option is correct.',
  'Between 2 and 4 options per question.',
  'Points are awarded per correct answer, at the lesson rate.',
  'A question with no correct option blocks saving.',
];
const WHOLE = /^\d+$/;

const ERRORS = {
  text: 'Enter the question',
  newOption: 'Enter the option',
  options: 'Add at least 2 options',
  correct: 'Choose the correct option',
  explanation: 'Enter the explanation',
  points: 'Enter a whole number of points above 0',
};

/**
 * Questions → Add (Figma `420:46735`, DESIGN.md §8.6) and Edit (the same, filled; code first). The screen's Question
 * rule, then the question, tiers, the answer options, the explanation and the points. Answer options (decided 28 Oct
 * 2026; the screen doesn't show how one is typed): type it in Option and press Add option (up to 4); each becomes a
 * radio card, the radio marks the correct one, the bin beside it removes it. Save checks the rules: 2 to 4 options,
 * exactly one correct. The page remounts it (`key`) each time it opens.
 */
export function QuestionForm({ open, question, lesson, onClose, onSave, offline = false }: QuestionFormProps) {
  const editing = question !== undefined;
  const form = useSheetForm(
    {
      text: question?.text ?? '',
      tiers: question?.tiers ?? [],
      options: question?.options ?? ([] as AnswerOption[]),
      correct: question ? String(question.correct) : '',
      explanation: question?.explanation ?? '',
      points: question ? String(question.points) : '',
    },
    ERRORS,
  );
  const { values: v, set, helper, ref, errors, setErrors } = form;
  const [newOption, setNewOption] = useState('');
  const [duplicate, setDuplicate] = useState(false);
  const formId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const optionsErrorId = useId();
  const full = v.options.length >= MAX_OPTIONS;

  const close = () => {
    form.setDiscarding(false);
    onClose();
  };
  const requestClose = () => (form.changed || newOption.trim() ? form.setDiscarding(true) : close());

  const addOption = () => {
    const text = newOption.trim();
    if (!text) {
      setErrors((current) => ({ ...current, newOption: true }));
      form.focus('newOption');
      return;
    }
    if (v.options.some((o) => o.text.toLowerCase() === text.toLowerCase())) {
      setDuplicate(true);
      form.focus('newOption');
      return;
    }
    const id = nextId(v.options);
    set('options', [...v.options, { id, text }], 'options');
    setNewOption('');
    // The 4th option turns Option off: focus the new option's radio instead of losing focus.
    if (v.options.length + 1 >= MAX_OPTIONS) requestAnimationFrame(() => formRef.current?.querySelector<HTMLInputElement>(`input[type="radio"][value="${id}"]`)?.focus());
  };
  const removeOption = (option: AnswerOption) => {
    set('options', v.options.filter((o) => o.id !== option.id));
    if (v.correct === String(option.id)) set('correct', '');
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    form.setSaveFailed(false);
    const found = {
      text: !v.text.trim(),
      options: v.options.length < 2,
      correct: v.options.length >= 2 && !v.correct,
      explanation: !v.explanation.trim(),
      points: !(WHOLE.test(v.points.trim()) && Number(v.points) > 0),
    };
    // Too few options: focus Option, to add another.
    if (found.options && !found.text) {
      setErrors(found);
      form.focus('newOption');
      return;
    }
    if (!form.check(found)) return;
    const saved = onSave({ text: v.text.trim(), tiers: v.tiers, options: v.options, correct: Number(v.correct), explanation: v.explanation.trim(), points: Number(v.points) });
    if (saved === false) {
      form.setSaveFailed(true);
      return;
    }
    onClose();
  };

  const optionsError = errors.options ? ERRORS.options : errors.correct ? ERRORS.correct : null;

  return (
    <>
      <FinSideSheet
        open={open}
        onClose={requestClose}
        closeButton={false}
        title={<FinTextBox type="h4" heading={editing ? 'Edit question' : 'Add question'} headingLevel={2} description={lesson} truncateHeading />}
        buttonDock={{
          secondaryButton: { label: 'Cancel', onClick: requestClose },
          primaryButton: editing
            ? { label: 'Save', type: 'submit', form: formId, disabled: !form.changed || offline }
            : { label: 'Save question', type: 'submit', form: formId, disabled: offline },
        }}
      >
        <form ref={formRef} id={formId} className={styles.form} noValidate onSubmit={submit}>
          {offline ? <ConnectionError /> : form.saveFailed && <SaveError />}
          <FinNotificationBanner tone="info" title="Question rule">
            {/* The banner's text is a paragraph, so the rules are list items made of spans (a <ul> can't go in a <p>). */}
            <span role="list" className={styles.rules}>
              {RULES.map((rule) => (
                <span key={rule} role="listitem" className={styles.rule}>
                  {rule}
                </span>
              ))}
            </span>
          </FinNotificationBanner>
          <fieldset className={styles.section}>
            <legend className={styles.legend}>Question</legend>
            <div className={styles.group}>
              <FinTextField size="small" ref={ref('text')} label="Question" placeholder="Question" value={v.text} onChange={(e) => set('text', e.target.value, 'text')} {...helper('text')} />
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
            <legend className={styles.legend}>Answer options</legend>
            <div className={styles.panel}>
              <p className={styles.panelTitle} aria-hidden="true">
                Select the correct one
              </p>
              <div className={styles.fieldWithButton}>
                <FinTextField size="small"
                  ref={ref('newOption')}
                  label="Option"
                  placeholder="Option"
                  value={newOption}
                  disabled={full}
                  onChange={(e) => {
                    setNewOption(e.target.value);
                    setDuplicate(false);
                    setErrors((current) => ({ ...current, newOption: false }));
                  }}
                  onKeyDown={(e) => {
                    // Enter adds the option instead of saving the question.
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addOption();
                    }
                  }}
                  {...(duplicate ? { error: true, helperText: 'This option is already added' } : helper('newOption'))}
                />
                {/* Primary, as the screen (a Secondary's purple text is under 4.5:1 on the grey panel). */}
                <FinButton size="medium" icon="leading" iconName="add" onClick={addOption} disabled={full}>
                  Add option
                </FinButton>
              </div>
              {/* Not the disabled field's helper text, whose disabled grey is too light on the panel. */}
              {full && <FinHelperText>A question has up to 4 options. Remove one to add another.</FinHelperText>}
              {v.options.length > 0 && (
                <FinListRadioGroup
                  label="Correct option"
                  value={v.correct}
                  onValueChange={(next) => set('correct', next, 'correct')}
                  size="small"
                  className={styles.group}
                  {...(optionsError ? { 'aria-describedby': optionsErrorId } : {})}
                >
                  {v.options.map((option) => (
                    <div key={option.id} className={styles.option}>
                      <FinListRadioFilled value={String(option.id)} title={option.text} />
                      {/* Destructive: red, as the ⋮ menus' Remove (FinButton has no destructive Tertiary; its `error` content tone). */}
                      <FinButton variant="tertiary" size="small" icon="only-icon" iconName="delete" contentTone="error" onClick={() => removeOption(option)}>
                        {`Remove “${option.text}”`}
                      </FinButton>
                    </div>
                  ))}
                </FinListRadioGroup>
              )}
              {optionsError && (
                <FinHelperText id={optionsErrorId} tone="error">
                  {optionsError}
                </FinHelperText>
              )}
            </div>
          </fieldset>
          <fieldset className={styles.section}>
            <legend className={styles.legend}>After answering</legend>
            <div className={styles.group}>
              <FinTextArea
                ref={ref('explanation')}
                label="Explanation shown after answering"
                placeholder="Explanation shown after answering"
                value={v.explanation}
                onChange={(e) => set('explanation', e.target.value, 'explanation')}
                {...helper('explanation')}
              />
              <FinTextField size="small"
                ref={ref('points')}
                label="Points per correct answer"
                placeholder="Points per correct answer"
                suffix="Points"
                inputMode="numeric"
                value={v.points}
                onChange={(e) => set('points', e.target.value, 'points')}
                {...helper('points')}
              />
            </div>
          </fieldset>
        </form>
      </FinSideSheet>
      <DiscardDialog open={form.discarding} editing={editing} item="question" onKeep={() => form.setDiscarding(false)} onDiscard={close} />
    </>
  );
}
