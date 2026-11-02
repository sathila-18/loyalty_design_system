import { useId, useRef, useState, type FormEvent } from 'react';
import { FinSelectField, FinSideSheet, FinTextBox, FinTextField } from '@finspace-loyalty/ui';
import { TIER_LEVELS, type Tier, type TierLevel } from './tiers';
import styles from './TierManagement.module.css';

/** What the form saves (the page adds the row, or updates it when editing). */
export type TierValues = Omit<Tier, 'id'>;

export interface TierFormProps {
  open: boolean;
  onClose: () => void;
  /** Edit: the tier whose values fill the form. Leave it out to add one. */
  tier?: Tier;
  /** Every tier, so a name can't be used twice. */
  tiers: Tier[];
  onSave: (values: TierValues) => void;
}

type Field = 'name' | 'level' | 'upgrade' | 'downgrade' | 'multiplier' | 'status';

const WHOLE = /^\d+$/;
const AMOUNT = /^\d+(\.\d{1,2})?$/;
const STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const ERRORS: Record<Field, string> = {
  name: 'Enter a tier name',
  level: 'Choose a level',
  upgrade: 'Enter a whole number of points',
  downgrade: 'Enter a whole number of points',
  multiplier: 'Enter a number above 0, with up to 2 decimals',
  status: 'Choose a status',
};
const NAME_TAKEN = 'Another tier already has this name';
const DOWNGRADE_TOO_HIGH = 'Enter fewer points than the upgrade threshold';

/** The form's starting values: empty to add, the tier's to edit. */
function initialValues(tier?: Tier) {
  return {
    name: tier?.name ?? '',
    level: (tier?.level ?? null) as string | null,
    upgrade: tier ? String(tier.upgradeThreshold) : '',
    downgrade: tier ? String(tier.downgradeThreshold) : '',
    multiplier: tier ? tier.earnMultiplier.toFixed(2) : '',
    status: (tier ? (tier.active ? 'active' : 'inactive') : null) as string | null,
  };
}

/**
 * Tier management → Add (Figma `345:14560`, DESIGN.md §8.6) and Edit (code first, no Figma; decided 27 Oct 2026): a
 * side sheet with the tier's fields two by two, as Programme configuration's form: no close button, Cancel and Save
 * in the dock, errors under the fields after Save with the first one focused, and Edit's Save disabled until a value
 * changes. Every field is needed. A name is used once; Level offers every level, as Figma's menu (several tiers can share
 * one, decided 27 Oct 2026); the downgrade threshold is below
 * the upgrade threshold (both 0 for an Entry tier). The page remounts it (`key`) for each tier it edits.
 */
export function TierForm({ open, onClose, tier, tiers, onSave }: TierFormProps) {
  const initial = initialValues(tier);
  const [name, setName] = useState(initial.name);
  const [level, setLevel] = useState(initial.level);
  const [upgrade, setUpgrade] = useState(initial.upgrade);
  const [downgrade, setDowngrade] = useState(initial.downgrade);
  const [multiplier, setMultiplier] = useState(initial.multiplier);
  const [status, setStatus] = useState(initial.status);
  const [errors, setErrors] = useState<Partial<Record<Field, string | undefined>>>({});
  const refs = useRef<Partial<Record<Field, HTMLElement | null>>>({});
  const formId = useId();

  const current = { name, level, upgrade, downgrade, multiplier, status };
  const changed = (Object.keys(initial) as (keyof typeof initial)[]).some((key) => current[key] !== initial[key]);

  const reset = () => {
    setName(initial.name);
    setLevel(initial.level);
    setUpgrade(initial.upgrade);
    setDowngrade(initial.downgrade);
    setMultiplier(initial.multiplier);
    setStatus(initial.status);
    setErrors({});
  };
  const close = () => {
    reset();
    onClose();
  };
  const clear = (field: Field) => setErrors((current) => ({ ...current, [field]: undefined }));

  /** Each field's error, if any. */
  const check = (): Partial<Record<Field, string | undefined>> => {
    const trimmed = name.trim();
    const up = WHOLE.test(upgrade.trim()) ? Number(upgrade) : null;
    const down = WHOLE.test(downgrade.trim()) ? Number(downgrade) : null;
    const taken = tiers.some((t) => t.id !== tier?.id && t.name.toLowerCase() === trimmed.toLowerCase());
    const below = up === null || down === null || down < up || (up === 0 && down === 0);
    return {
      name: !trimmed ? ERRORS.name : taken ? NAME_TAKEN : undefined,
      level: !level ? ERRORS.level : undefined,
      upgrade: up === null ? ERRORS.upgrade : undefined,
      downgrade: down === null ? ERRORS.downgrade : !below ? DOWNGRADE_TOO_HIGH : undefined,
      multiplier: !AMOUNT.test(multiplier.trim()) || Number(multiplier) <= 0 ? ERRORS.multiplier : undefined,
      status: !status ? ERRORS.status : undefined,
    };
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const found = check();
    setErrors(found);
    const first = (Object.keys(found) as Field[]).find((field) => found[field]);
    if (first) {
      refs.current[first]?.focus();
      return;
    }
    onSave({
      name: name.trim(),
      level: level as TierLevel,
      upgradeThreshold: Number(upgrade),
      downgradeThreshold: Number(downgrade),
      earnMultiplier: Number(multiplier),
      active: status === 'active',
    });
    close();
  };

  const helper = (field: Field, text?: string) => {
    const error = errors[field];
    return error ? { error: true, helperText: error } : text ? { helperText: text } : {};
  };

  return (
    <FinSideSheet
      open={open}
      onClose={close}
      // No close button: Cancel closes it, as Programme configuration's form (decided 27 Oct 2026; Figma has one).
      closeButton={false}
      title={<FinTextBox type="h4" heading={tier ? 'Edit tier' : 'Add tier'} headingLevel={2} description="Tiers are common to every segment" truncateHeading />}
      buttonDock={{
        secondaryButton: { label: 'Cancel', onClick: close },
        primaryButton: tier ? { label: 'Save', type: 'submit', form: formId, disabled: !changed } : { label: 'Save tier', type: 'submit', form: formId },
      }}
    >
      <form id={formId} className={styles.form} noValidate onSubmit={submit}>
        <FinTextField size="small"
          ref={(node) => {
            refs.current.name = node;
          }}
          label="Tier name"
          placeholder="Tier name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            clear('name');
          }}
          {...helper('name')}
        />
        <FinSelectField size="small"
          ref={(node) => {
            refs.current.level = node;
          }}
          label="Level"
          placeholder="Level"
          options={TIER_LEVELS.map((l) => ({ value: l, label: l }))}
          value={level}
          onChange={(next) => {
            setLevel(next);
            clear('level');
          }}
          {...helper('level')}
        />
        <FinTextField size="small"
          ref={(node) => {
            refs.current.upgrade = node;
          }}
          label="Upgrade threshold"
          placeholder="Upgrade threshold"
          suffix="Points"
          inputMode="numeric"
          value={upgrade}
          onChange={(e) => {
            setUpgrade(e.target.value);
            clear('upgrade');
          }}
          {...helper('upgrade', 'Points needed to reach this tier')}
        />
        <FinTextField size="small"
          ref={(node) => {
            refs.current.downgrade = node;
          }}
          label="Downgrade threshold"
          placeholder="Downgrade threshold"
          suffix="Points"
          inputMode="numeric"
          value={downgrade}
          onChange={(e) => {
            setDowngrade(e.target.value);
            clear('downgrade');
          }}
          {...helper('downgrade', 'Members below this drop a tier')}
        />
        <FinTextField size="small"
          ref={(node) => {
            refs.current.multiplier = node;
          }}
          // Figma's label; a "×" suffix looked like a clear button (decided 27 Oct 2026).
          label="Earn multiplier (×)"
          placeholder="Earn multiplier (×)"
          inputMode="decimal"
          value={multiplier}
          onChange={(e) => {
            setMultiplier(e.target.value);
            clear('multiplier');
          }}
          {...helper('multiplier')}
        />
        <FinSelectField size="small"
          ref={(node) => {
            refs.current.status = node;
          }}
          label="Status"
          placeholder="Status"
          options={STATUSES}
          value={status}
          onChange={(next) => {
            setStatus(next);
            clear('status');
          }}
          {...helper('status')}
        />
      </form>
    </FinSideSheet>
  );
}
