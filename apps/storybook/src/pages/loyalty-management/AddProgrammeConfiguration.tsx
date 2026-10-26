import { useRef, useState, type FormEvent } from 'react';
import { FinListToggleFilled, FinSelectField, FinSideSheet, FinTextBox, FinTextField } from '@finspace-loyalty/ui';
import styles from './ProgrammeConfiguration.module.css';

/** What the add form saves (the page adds the row). */
export interface NewProgrammeConfig {
  segment: string;
  loyalty: boolean;
  expiryMonths: number;
  cashConversion: boolean;
  pointsPerUnit: number;
  unitValue: number;
  minConversion: number;
}

export interface AddProgrammeConfigurationProps {
  open: boolean;
  onClose: () => void;
  /** The segments without a configuration: the only ones offered. */
  segments: string[];
  onSave: (config: NewProgrammeConfig) => void;
}

type Field = 'segment' | 'expiry' | 'points' | 'value' | 'minimum';

const FORM_ID = 'add-programme-configuration';
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

/**
 * Programme configuration → Add (Figma `312:15899`, DESIGN.md §8.6): a side sheet with the form for one segment.
 * Errors show under the fields after Save; the first one is focused. Every field is needed, cash conversion on or off
 * (decided 26 Oct 2026: its fields stay enabled).
 */
export function AddProgrammeConfiguration({ open, onClose, segments, onSave }: AddProgrammeConfigurationProps) {
  const [segment, setSegment] = useState<string | null>(null);
  const [active, setActive] = useState(true);
  const [expiry, setExpiry] = useState('');
  const [cash, setCash] = useState(false);
  const [points, setPoints] = useState('');
  const [value, setValue] = useState('');
  const [minimum, setMinimum] = useState('');
  const [errors, setErrors] = useState<Partial<Record<Field, boolean>>>({});
  const refs = useRef<Partial<Record<Field, HTMLElement | null>>>({});

  const reset = () => {
    setSegment(null);
    setActive(true);
    setExpiry('');
    setCash(false);
    setPoints('');
    setValue('');
    setMinimum('');
    setErrors({});
  };
  const close = () => {
    reset();
    onClose();
  };
  const clear = (field: Field) => setErrors((current) => ({ ...current, [field]: false }));

  const submit = (event: FormEvent) => {
    event.preventDefault();
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
    onSave({
      segment: segment!,
      loyalty: active,
      expiryMonths: Number(expiry),
      cashConversion: cash,
      pointsPerUnit: Number(points),
      unitValue: Number(value),
      minConversion: Number(minimum),
    });
    close();
  };

  const helper = (field: Field, text?: string) => (errors[field] ? { error: true, helperText: ERRORS[field] } : text ? { helperText: text } : {});

  return (
    <FinSideSheet
      open={open}
      onClose={close}
      // No close button: Cancel closes it (decided 26 Oct 2026); Esc and a click on the scrim still do.
      closeButton={false}
      title={<FinTextBox type="h3" heading="Add programme configuration" headingLevel={2} description="Applies to one customer segment" truncateHeading />}
      buttonDock={{
        secondaryButton: { label: 'Cancel', onClick: close },
        primaryButton: { label: 'Save configuration', type: 'submit', form: FORM_ID },
      }}
    >
      <form id={FORM_ID} className={styles.form} noValidate onSubmit={submit}>
        <fieldset className={styles.section}>
          <legend className={styles.legend}>Segment</legend>
          <FinSelectField
            ref={(node) => {
              refs.current.segment = node;
            }}
            label="Segment"
            placeholder="Segment"
            options={segments.map((s) => ({ value: s, label: s }))}
            value={segment}
            onChange={(next) => {
              setSegment(next);
              clear('segment');
            }}
            {...(segments.length === 0
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
          <FinTextField
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
              <FinTextField
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
              <FinTextField
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
            <FinTextField
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
