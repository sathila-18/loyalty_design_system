import { useId, useRef, useState, type FormEvent } from 'react';
import { FinListToggleFilled, FinSelectField, FinSideSheet, FinTextBox, FinTextField } from '@finspace-loyalty/ui';
import { ConnectionError, SaveError } from '../common/PageStates';
import type { ProgrammeConfig } from './ProgrammeConfiguration';
import styles from './ProgrammeConfiguration.module.css';

/** What the form saves (the page adds the row, or updates it when editing). */
export interface ProgrammeConfigValues {
  segment: string;
  loyalty: boolean;
  expiryMonths: number;
  cashConversion: boolean;
  pointsPerUnit: number;
  unitValue: number;
  minConversion: number;
}

export interface ProgrammeConfigurationFormProps {
  open: boolean;
  onClose: () => void;
  /** Edit: the configuration whose values fill the form. Leave it out to add one. */
  config?: ProgrammeConfig;
  /** The segments without a configuration: the only ones offered (and, when editing, the configuration's own). */
  segments: string[];
  /** Saves the values; `false` means it failed (the form stays open with the save error). */
  onSave: (values: ProgrammeConfigValues) => boolean | void;
  /** The connection is down: the network or server error at the top, and Save off (Pages/Common states). */
  offline?: boolean;
}

type Field = 'segment' | 'expiry' | 'points' | 'value' | 'minimum';

const WHOLE = /^\d+$/;
const AMOUNT = /^\d+(\.\d{1,2})?$/;
const above0 = (text: string, pattern: RegExp) => pattern.test(text.trim()) && Number(text) > 0;

const ERRORS: Record<Field, string> = {
  segment: 'Choose a segment',
  expiry: 'Enter a whole number of months above 0',
  points: 'Enter a whole number of points above 0',
  value: 'Enter an amount above 0',
  minimum: 'Enter a whole number of points above 0',
};

/** The form's starting values: empty to add, the configuration's to edit. */
function initialValues(config?: ProgrammeConfig) {
  return {
    segment: config?.segment ?? null,
    active: config?.loyalty ?? true,
    expiry: config ? String(config.expiryMonths) : '',
    cash: config?.cashConversion ?? false,
    points: config ? String(config.pointsPerUnit) : '',
    value: config ? (config.unitValue ?? 1).toFixed(2) : '',
    minimum: config ? String(config.minConversion) : '',
  };
}

/**
 * Programme configuration → Add (Figma `312:15899`, DESIGN.md §8.6) and Edit (code first, no Figma; decided 27 Oct
 * 2026): a side sheet with the form for one segment. Edit starts with the configuration's values; its Save stays
 * disabled until a value differs from them. Errors show under the fields after Save; the first one is focused. Every
 * field is needed, cash conversion on or off (decided 26 Oct 2026: its fields stay enabled). The page remounts it
 * (`key`) for each configuration it edits.
 */
export function ProgrammeConfigurationForm({ open, onClose, config, segments, onSave, offline = false }: ProgrammeConfigurationFormProps) {
  const initial = initialValues(config);
  const [segment, setSegment] = useState<string | null>(initial.segment);
  const [active, setActive] = useState(initial.active);
  const [expiry, setExpiry] = useState(initial.expiry);
  const [cash, setCash] = useState(initial.cash);
  const [points, setPoints] = useState(initial.points);
  const [value, setValue] = useState(initial.value);
  const [minimum, setMinimum] = useState(initial.minimum);
  const [errors, setErrors] = useState<Partial<Record<Field, boolean>>>({});
  const [saveFailed, setSaveFailed] = useState(false);
  const refs = useRef<Partial<Record<Field, HTMLElement | null>>>({});
  const formId = useId();

  const current = { segment, active, expiry, cash, points, value, minimum };
  const changed = (Object.keys(initial) as (keyof typeof initial)[]).some((key) => current[key] !== initial[key]);
  const options = config && !segments.includes(config.segment) ? [config.segment, ...segments] : segments;

  const reset = () => {
    setSegment(initial.segment);
    setActive(initial.active);
    setExpiry(initial.expiry);
    setCash(initial.cash);
    setPoints(initial.points);
    setValue(initial.value);
    setMinimum(initial.minimum);
    setErrors({});
    setSaveFailed(false);
  };
  const close = () => {
    reset();
    onClose();
  };
  const clear = (field: Field) => setErrors((current) => ({ ...current, [field]: false }));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSaveFailed(false);
    const found: Partial<Record<Field, boolean>> = {
      segment: !segment,
      expiry: !above0(expiry, WHOLE),
      points: !above0(points, WHOLE),
      value: !above0(value, AMOUNT),
      minimum: !above0(minimum, WHOLE),
    };
    setErrors(found);
    const first = (Object.keys(found) as Field[]).find((field) => found[field]);
    if (first) {
      refs.current[first]?.focus();
      return;
    }
    const saved = onSave({
      segment: segment!,
      loyalty: active,
      expiryMonths: Number(expiry),
      cashConversion: cash,
      pointsPerUnit: Number(points),
      unitValue: Number(value),
      minConversion: Number(minimum),
    });
    if (saved === false) {
      setSaveFailed(true);
      return;
    }
    close();
  };

  const helper = (field: Field, text?: string) => (errors[field] ? { error: true, helperText: ERRORS[field] } : text ? { helperText: text } : {});

  return (
    <FinSideSheet
      open={open}
      onClose={close}
      // No close button: Cancel closes it (decided 26 Oct 2026); Esc and a click on the scrim still do.
      closeButton={false}
      title={
        <FinTextBox
          type="h4"
          heading={config ? 'Edit programme configuration' : 'Add programme configuration'}
          headingLevel={2}
          description="Applies to one customer segment"
          truncateHeading
        />
      }
      buttonDock={{
        secondaryButton: { label: 'Cancel', onClick: close },
        primaryButton: config
          ? { label: 'Save', type: 'submit', form: formId, disabled: !changed || offline }
          : { label: 'Save configuration', type: 'submit', form: formId, disabled: offline },
      }}
    >
      <form id={formId} className={styles.form} noValidate onSubmit={submit}>
        {offline ? <ConnectionError /> : saveFailed && <SaveError />}
        <fieldset className={styles.section}>
          <legend className={styles.legend}>Segment</legend>
          <FinSelectField size="small"
            ref={(node) => {
              refs.current.segment = node;
            }}
            label="Segment"
            placeholder="Segment"
            options={options.map((s) => ({ value: s, label: s }))}
            value={segment}
            onChange={(next) => {
              setSegment(next);
              clear('segment');
            }}
            {...(options.length === 0
              ? { helperText: 'Every segment already has a configuration' }
              : helper('segment', 'Segments that already have a configuration are not listed'))}
          />
        </fieldset>

        <fieldset className={styles.section}>
          <legend className={styles.legend}>Status</legend>
          <FinListToggleFilled size="small" title="Active" description="Members in this segment earn and use points" checked={active} onCheckedChange={setActive} />
        </fieldset>

        <fieldset className={styles.section}>
          <legend className={styles.legend}>Points</legend>
          <FinTextField size="small"
            ref={(node) => {
              refs.current.expiry = node;
            }}
            label="Points expiry"
            placeholder="Points expiry"
            suffix="Months"
            inputMode="numeric"
            value={expiry}
            onChange={(e) => {
              setExpiry(e.target.value);
              clear('expiry');
            }}
            {...helper('expiry', 'Counted from the date each point is earned')}
          />
        </fieldset>

        <fieldset className={styles.section}>
          <legend className={styles.legend}>Cash conversion</legend>
          <div className={styles.group}>
            <FinListToggleFilled size="small" title="Allow points to be converted to account credit" checked={cash} onCheckedChange={setCash} />
            <div className={styles.row}>
              <FinTextField size="small"
                ref={(node) => {
                  refs.current.points = node;
                }}
                label="Conversion rate"
                placeholder="Conversion rate"
                suffix="Points"
                inputMode="numeric"
                value={points}
                onChange={(e) => {
                  setPoints(e.target.value);
                  clear('points');
                }}
                {...helper('points')}
              />
              <FinTextField size="small"
                ref={(node) => {
                  refs.current.value = node;
                }}
                label="Equal rate"
                placeholder="Equal rate"
                suffix="LKR"
                inputMode="decimal"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  clear('value');
                }}
                {...helper('value')}
              />
            </div>
            <FinTextField size="small"
              ref={(node) => {
                refs.current.minimum = node;
              }}
              label="Minimum per conversion"
              placeholder="Minimum per conversion"
              suffix="Points"
              inputMode="numeric"
              value={minimum}
              onChange={(e) => {
                setMinimum(e.target.value);
                clear('minimum');
              }}
              {...helper('minimum')}
            />
          </div>
        </fieldset>
      </form>
    </FinSideSheet>
  );
}
