import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import {
  FinButton,
  FinDateField,
  FinDialog,
  FinHelperText,
  FinListCheckboxFilled,
  FinListCheckboxGroup,
  FinListRadioFilled,
  FinListRadioGroup,
  FinListToggleFilled,
  FinNotificationBanner,
  FinSelectField,
  FinSideSheet,
  FinStepper,
  FinTable,
  FinTextArea,
  FinTextField,
  type FinTableColumn,
} from '@finspace-loyalty/ui';
import { ConnectionError, SaveError } from '../common/PageStates';
import {
  ALL_SEGMENTS,
  ALL_TIERS,
  BADGES,
  CLAIM_DURATIONS,
  EMPTY,
  EVENTS,
  PROVIDERS,
  SEGMENTS,
  STEPS,
  TIERS,
  rewardDetailsFrom,
  type Eligibility,
  type GiveOn,
  type RewardDetails,
  type RewardType,
  type Rule,
  type ValueType,
} from './rewardDetails';
import type { Reward, RewardStatus } from './rewards';
import styles from './RewardCatalog.module.css';


/** What the form saves: the page adds the row, or updates it when editing. */
export interface AddRewardValues {
  name: string;
  /** The provider: the list's Partner; none for the bank's own rewards ("N/A"). */
  partner?: string;
  /** Max total uses of the campaign: the list's User limit (assumed, DESIGN.md §8.6); none means no limit. */
  userLimit?: number;
  /** Add: Draft or Published. Edit leaves it out: the reward keeps its status. */
  status?: Extract<RewardStatus, 'Draft' | 'Published'>;
  details: RewardDetails;
}


export interface AddRewardFormProps {
  open: boolean;
  /** Edit: the reward whose details fill the form. Leave it out to add one. */
  reward?: Reward;
  onClose: () => void;
  /** Saves the reward; `false` means it failed (the sheet stays open with the save error). */
  onSave: (values: AddRewardValues) => boolean | void;
  /** The connection is down: the network or server error at the top, and Next's checks still run but nothing saves. */
  offline?: boolean;
}

type Field =
  | 'name'
  | 'event'
  | 'start'
  | 'end'
  | 'amount'
  | 'maxCapacity'
  | 'minTransaction'
  | 'count'
  | 'pointsCost'
  | 'promoCode'
  | 'claimDuration'
  | 'claimsPerCustomer'
  | 'maxUses'
  | 'tiers'
  | 'segments'
  | 'rules'
  | 'ruleSegment'
  | 'ruleTier'
  | 'headline'
  | 'description';

const WHOLE = /^\d+$/;
const AMOUNT = /^\d+(\.\d{1,2})?$/;
const above0 = (text: string, pattern: RegExp) => pattern.test(text.trim()) && Number(text) > 0;
const percent = (text: string) => above0(text, AMOUNT) && Number(text) <= 100;

/** The amount field follows Type and Value (the screens `367:19964`, `388:31740`, `388:32199`, `388:32669`). */
function amountField(type: RewardType, valueType: ValueType) {
  if (type === 'discount') {
    return valueType === 'fixed'
      ? { label: 'Discount amount', suffix: 'LKR', error: 'Enter an amount above 0' }
      : { label: 'Discount amount', suffix: '%', error: 'Enter a percentage from 0.01 to 100' };
  }
  return valueType === 'fixed'
    ? { label: 'Points awarded', suffix: 'Points', error: 'Enter a whole number of points above 0' }
    : { label: 'Points rate', suffix: '%', error: 'Enter a percentage from 0.01 to 100' };
}

/** The fields each step checks, in the order they're shown; `true` marks a wrong one. */
function stepErrors(step: number, v: RewardDetails): Partial<Record<Field, boolean>> {
  switch (step) {
    case 0: {
      const amountOk = (v.type === 'cashback' && v.valueType === 'fixed' ? above0(v.amount, WHOLE) : v.valueType === 'fixed' ? above0(v.amount, AMOUNT) : percent(v.amount));
      return {
        name: !v.name.trim(),
        event: !v.event,
        start: !v.start,
        end: !v.lifetime && (!v.end || (!!v.start && v.end < v.start)),
        amount: !amountOk,
        maxCapacity: v.valueType === 'percentage' && v.maxCapacity.trim() !== '' && !above0(v.maxCapacity, v.type === 'cashback' ? WHOLE : AMOUNT),
      };
    }
    case 1:
      return {
        minTransaction: !above0(v.minTransaction, AMOUNT),
        count: v.giveOn === 'nth' && !above0(v.count, WHOLE),
        pointsCost: !above0(v.pointsCost, WHOLE),
        promoCode: v.promo && !v.promoCode.trim(),
        claimDuration: !v.claimDuration,
        claimsPerCustomer: !above0(v.claimsPerCustomer, WHOLE),
        maxUses: v.maxUses.trim() !== '' && !above0(v.maxUses, WHOLE),
      };
    case 2:
      return {
        tiers: v.eligibility === 'tiers' && v.tiers.length === 0,
        segments: v.eligibility === 'segments' && v.segments.length === 0,
        rules: v.eligibility === 'rules' && v.rules.length === 0,
      };
    default:
      return { headline: !v.headline.trim(), description: !v.description.trim() };
  }
}

const ERRORS: Partial<Record<Field, string>> = {
  name: 'Enter a reward name',
  event: 'Choose an event',
  start: 'Choose a start date',
  end: 'Choose an end date on or after the start date',
  maxCapacity: 'Enter an amount above 0, or leave it empty',
  minTransaction: 'Enter an amount above 0',
  count: 'Enter a whole number above 0',
  pointsCost: 'Enter a whole number of points above 0',
  promoCode: 'Enter the promo code',
  claimDuration: 'Choose a duration',
  claimsPerCustomer: 'Enter a whole number above 0',
  maxUses: 'Enter a whole number above 0, or leave it empty',
  tiers: 'Choose at least one tier',
  segments: 'Choose at least one segment',
  rules: 'Add at least one rule',
  ruleSegment: 'Choose a segment',
  ruleTier: 'Choose a tier',
  headline: 'Enter a headline',
  description: 'Enter a description',
};

const ruleColumns: FinTableColumn<Rule>[] = [
  { key: 'segment', header: 'Segment' },
  { key: 'tier', header: 'Tier' },
];

/**
 * Reward catalog → Add reward (Figma `367:19964`–`409:36106`, DESIGN.md §8.6): the screens' four-step page, in a side
 * sheet like the other add forms (decided 28 Oct 2026). FinStepper (`fill`) at the top; done steps and the header's back
 * button go back. Next checks the step (errors under the fields, the first focused); Publish checks the last step;
 * Save as draft needs only the name. Cancel, Esc or a scrim click with changes asks first (a discard dialog). Section
 * titles have no numbers (decided 28 Oct 2026).
 * Edit (code first, decided 28 Oct 2026): the same sheet, "Edit reward", filled with the reward's details; every step is
 * done and clickable (FinStepper `doneSteps="all"`); Cancel / Save on every step, Save disabled until something changes;
 * Save checks every step and opens the first one with an error. The page remounts it (`key`) each time it opens.
 */
export function AddRewardForm({ open, reward, onClose, onSave, offline = false }: AddRewardFormProps) {
  const editing = reward !== undefined;
  const [initial] = useState<RewardDetails>(() => (reward ? (reward.details ?? rewardDetailsFrom(reward)) : EMPTY));
  const [v, setDetails] = useState<RewardDetails>(initial);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Partial<Record<Field, boolean>>>({});
  const [saveFailed, setSaveFailed] = useState(false);
  const [discarding, setDiscarding] = useState(false);
  const [ruleSegment, setRuleSegment] = useState<string | null>(null);
  const [ruleTier, setRuleTier] = useState<string | null>(null);
  const [ruleDuplicate, setRuleDuplicate] = useState(false);
  const stepRef = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const formId = useId();
  const tiersErrorId = useId();
  const segmentsErrorId = useId();
  const rulesErrorId = useId();

  const changed = (Object.keys(initial) as (keyof RewardDetails)[]).some((key) => JSON.stringify(v[key]) !== JSON.stringify(initial[key]));
  // A partner from the list that isn't one of the options (the stories' fake rows) is offered too.
  const providers = initial.provider && !PROVIDERS.includes(initial.provider) ? [initial.provider, ...PROVIDERS] : PROVIDERS;
  const amount = amountField(v.type, v.valueType);

  // A new step: focus it, so screen readers hear it and the body starts at the top.
  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    stepRef.current?.focus();
  }, [step]);

  const set = <K extends keyof RewardDetails>(key: K, value: RewardDetails[K], field?: Field) => {
    setDetails((current) => ({ ...current, [key]: value }));
    if (field) setErrors((current) => ({ ...current, [field]: false }));
  };
  // The fields' elements, so a wrong one can be focused; one ref callback per field, made once.
  const [fields] = useState(() => {
    const nodes = new Map<Field, HTMLElement | null>();
    const bindings = Object.fromEntries(
      Object.keys(ERRORS).map((field) => [field, (node: HTMLElement | null) => void nodes.set(field as Field, node)]),
    ) as Record<Field, (node: HTMLElement | null) => void>;
    return { focus: (field: Field) => nodes.get(field)?.focus(), bind: (field: Field) => bindings[field] };
  });
  const ref = fields.bind;
  const helper = (field: Field, text?: string) => (errors[field] ? { error: true, helperText: ERRORS[field] } : text ? { helperText: text } : {});

  const goTo = (next: number) => {
    moved.current = true;
    setErrors({});
    setStep(next);
  };
  const check = (which: number) => {
    const found = stepErrors(which, v);
    setErrors(found);
    const first = (Object.keys(found) as Field[]).find((field) => found[field]);
    if (first) fields.focus(first);
    return !first;
  };

  const close = () => {
    setDiscarding(false);
    onClose();
  };
  const requestClose = () => (changed ? setDiscarding(true) : close());

  const save = (status?: AddRewardValues['status']) => {
    setSaveFailed(false);
    const saved = onSave({
      name: v.name.trim(),
      ...(v.provider ? { partner: v.provider } : {}),
      ...(v.maxUses.trim() ? { userLimit: Number(v.maxUses) } : {}),
      ...(status ? { status } : {}),
      details: { ...v, name: v.name.trim() },
    });
    if (saved === false) {
      setSaveFailed(true);
      return;
    }
    onClose();
  };
  const saveDraft = () => {
    if (!v.name.trim()) {
      if (step !== 0) {
        moved.current = false;
        setStep(0);
      }
      setErrors({ name: true });
      // After the step renders.
      requestAnimationFrame(() => fields.focus('name'));
      return;
    }
    save('Draft');
  };
  // Edit: every step is checked; the first one with an error opens, its first wrong field focused.
  const saveEdit = () => {
    for (let which = 0; which < STEPS.length; which += 1) {
      const found = stepErrors(which, v);
      const first = (Object.keys(found) as Field[]).find((field) => found[field]);
      if (!first) continue;
      setErrors(found);
      if (which !== step) {
        moved.current = false;
        setStep(which);
      }
      requestAnimationFrame(() => fields.focus(first));
      return;
    }
    save();
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (editing) return saveEdit();
    if (!check(step)) return;
    if (step < STEPS.length - 1) goTo(step + 1);
    else save('Published');
  };

  const addRule = () => {
    const missing = { ruleSegment: !ruleSegment, ruleTier: !ruleTier };
    setErrors((current) => ({ ...current, ...missing }));
    if (missing.ruleSegment) return fields.focus('ruleSegment');
    if (missing.ruleTier) return fields.focus('ruleTier');
    if (v.rules.some((r) => r.segment === ruleSegment && r.tier === ruleTier)) {
      setRuleDuplicate(true);
      return;
    }
    const id = v.rules.reduce((max, r) => Math.max(max, r.id), 0) + 1;
    set('rules', [...v.rules, { id, segment: ruleSegment!, tier: ruleTier! }], 'rules');
    setRuleSegment(null);
    setRuleTier(null);
  };

  const last = step === STEPS.length - 1;

  return (
    <>
      <FinSideSheet
        open={open}
        onClose={requestClose}
        // No close button, as the other add forms: Cancel closes it; Esc and a click on the scrim still do (and ask first).
        closeButton={false}
        title={editing ? 'Edit reward' : 'Add reward'}
        backButton={step > 0}
        onBack={() => goTo(step - 1)}
        backLabel={`Back to ${STEPS[step - 1] ?? ''}`}
        buttonDock={
          editing
            ? {
                secondaryButton: { label: 'Cancel', onClick: requestClose },
                primaryButton: { label: 'Save', type: 'submit', form: formId, disabled: !changed || offline },
              }
            : {
                ...(last ? { tertiaryButton: { label: 'Save as draft', onClick: saveDraft, disabled: offline } } : {}),
                secondaryButton: { label: 'Cancel', onClick: requestClose },
                primaryButton: last
                  ? { label: 'Publish', type: 'submit', form: formId, disabled: offline }
                  : { label: 'Next', type: 'submit', form: formId },
              }
        }
      >
        <form id={formId} className={styles.form} noValidate onSubmit={submit}>
          <FinStepper steps={STEPS} current={step} width="fill" doneSteps={editing ? 'all' : 'before'} onStepClick={goTo} />
          {offline ? <ConnectionError /> : saveFailed && <SaveError />}
          <div ref={stepRef} tabIndex={-1} className={styles.step} role="group" aria-label={`Step ${step + 1} of ${STEPS.length}: ${STEPS[step]}`}>
            {step === 0 && (
              <>
                <fieldset className={styles.section}>
                  <legend className={styles.legend}>Basic details</legend>
                  <div className={styles.group}>
                    <FinTextField size="small" ref={ref('name')} label="Reward name" placeholder="Reward name" value={v.name} onChange={(e) => set('name', e.target.value, 'name')} {...helper('name')} />
                    <FinSelectField size="small"
                      ref={ref('event')}
                      label="Event"
                      placeholder="Event"
                      options={EVENTS.map((o) => ({ value: o, label: o }))}
                      value={v.event}
                      onChange={(next) => set('event', next, 'event')}
                      {...helper('event')}
                    />
                  </div>
                </fieldset>
                <fieldset className={styles.section}>
                  <legend className={styles.legend}>Availability</legend>
                  <div className={styles.group}>
                    <FinSelectField size="small"
                      label="Provider (optional)"
                      placeholder="Provider (optional)"
                      options={providers.map((o) => ({ value: o, label: o }))}
                      value={v.provider}
                      onChange={(next) => set('provider', next)}
                      helperText="Leave it empty for the bank's own rewards"
                    />
                    <FinListToggleFilled
                      size="small"
                      title="Run for lifetime"
                      description="The reward has no end date"
                      checked={v.lifetime}
                      onCheckedChange={(on) => set('lifetime', on, 'end')}
                    />
                    <div className={styles.row}>
                      <FinDateField size="small" ref={ref('start')} label="Start date" value={v.start} onChange={(date) => set('start', date, 'start')} {...helper('start')} />
                      {!v.lifetime && (
                        <FinDateField size="small"
                          ref={ref('end')}
                          label="End date"
                          value={v.end}
                          {...(v.start ? { min: v.start } : {})}
                          onChange={(date) => set('end', date, 'end')}
                          {...helper('end')}
                        />
                      )}
                    </div>
                  </div>
                </fieldset>
                <fieldset className={styles.section}>
                  <legend className={styles.legend}>Reward value</legend>
                  <div className={styles.group}>
                    <div className={styles.panel}>
                      <p className={styles.panelTitle} aria-hidden="true">
                        Type
                      </p>
                      <FinListRadioGroup label="Type" value={v.type} onValueChange={(next) => set('type', next as RewardType, 'amount')} size="small">
                        <FinListRadioFilled value="discount" title="Discount" />
                        <FinListRadioFilled value="cashback" title="Cash back" description="Points are earned" />
                      </FinListRadioGroup>
                    </div>
                    <div className={styles.panel}>
                      <p className={styles.panelTitle} aria-hidden="true">
                        Value
                      </p>
                      <FinListRadioGroup label="Value" value={v.valueType} onValueChange={(next) => set('valueType', next as ValueType, 'amount')} size="small">
                        <FinListRadioFilled value="fixed" title="Fixed amount" />
                        <FinListRadioFilled value="percentage" title="Percentage" />
                      </FinListRadioGroup>
                    </div>
                    <FinTextField size="small"
                      ref={ref('amount')}
                      label={amount.label}
                      placeholder={amount.label}
                      suffix={amount.suffix}
                      inputMode="decimal"
                      value={v.amount}
                      onChange={(e) => set('amount', e.target.value, 'amount')}
                      {...(errors.amount ? { error: true, helperText: amount.error } : {})}
                    />
                    {v.valueType === 'percentage' && (
                      <FinTextField size="small"
                        ref={ref('maxCapacity')}
                        label="Maximum capacity (optional)"
                        placeholder="Maximum capacity (optional)"
                        suffix={v.type === 'discount' ? 'LKR' : 'Points'}
                        inputMode="decimal"
                        value={v.maxCapacity}
                        onChange={(e) => set('maxCapacity', e.target.value, 'maxCapacity')}
                        {...helper('maxCapacity', 'The most one claim can give')}
                      />
                    )}
                  </div>
                </fieldset>
              </>
            )}

            {step === 1 && (
              <>
                <fieldset className={styles.section}>
                  <legend className={styles.legend}>Qualifying transaction</legend>
                  <div className={styles.group}>
                    <FinTextField size="small"
                      ref={ref('minTransaction')}
                      label="Minimum transaction value"
                      placeholder="Minimum transaction value"
                      suffix="LKR"
                      inputMode="decimal"
                      value={v.minTransaction}
                      onChange={(e) => set('minTransaction', e.target.value, 'minTransaction')}
                      {...helper('minTransaction')}
                    />
                    <div className={styles.panel}>
                      <p className={styles.panelTitle} aria-hidden="true">
                        Give the reward
                      </p>
                      <FinListRadioGroup label="Give the reward" value={v.giveOn} onValueChange={(next) => set('giveOn', next as GiveOn, 'count')} size="small">
                        <FinListRadioFilled value="every" title="On every qualifying event" />
                        <FinListRadioFilled value="nth" title="On the nth qualifying event" />
                      </FinListRadioGroup>
                    </div>
                    {v.giveOn === 'nth' && (
                      <FinTextField size="small"
                        ref={ref('count')}
                        label="Count of event"
                        placeholder="Count of event"
                        suffix="th qualifying event"
                        inputMode="numeric"
                        value={v.count}
                        onChange={(e) => set('count', e.target.value, 'count')}
                        {...helper('count')}
                      />
                    )}
                  </div>
                </fieldset>
                <fieldset className={styles.section}>
                  <legend className={styles.legend}>Cost to the customer</legend>
                  <div className={styles.group}>
                    <FinTextField size="small"
                      ref={ref('pointsCost')}
                      label="Points cost"
                      placeholder="Points cost"
                      suffix="Points"
                      inputMode="numeric"
                      value={v.pointsCost}
                      onChange={(e) => set('pointsCost', e.target.value, 'pointsCost')}
                      {...helper('pointsCost')}
                    />
                    <FinListToggleFilled
                      size="small"
                      title="Customer must enter a promo code"
                      description="Customers enter a promo code to claim the reward"
                      checked={v.promo}
                      onCheckedChange={(on) => set('promo', on, 'promoCode')}
                    />
                    {v.promo && (
                      <FinTextField size="small"
                        ref={ref('promoCode')}
                        label="Promo code"
                        placeholder="Promo code"
                        value={v.promoCode}
                        onChange={(e) => set('promoCode', e.target.value, 'promoCode')}
                        {...helper('promoCode')}
                      />
                    )}
                  </div>
                </fieldset>
                <fieldset className={styles.section}>
                  <legend className={styles.legend}>Limits</legend>
                  <div className={styles.group}>
                    <div className={styles.row}>
                      <FinSelectField size="small"
                        ref={ref('claimDuration')}
                        label="Maximum claim duration"
                        placeholder="Maximum claim duration"
                        options={CLAIM_DURATIONS.map((o) => ({ value: o, label: o }))}
                        value={v.claimDuration}
                        onChange={(next) => set('claimDuration', next, 'claimDuration')}
                        {...helper('claimDuration')}
                      />
                      <FinTextField size="small"
                        ref={ref('claimsPerCustomer')}
                        label="Maximum claims per customer"
                        placeholder="Maximum claims per customer"
                        inputMode="numeric"
                        value={v.claimsPerCustomer}
                        onChange={(e) => set('claimsPerCustomer', e.target.value, 'claimsPerCustomer')}
                        {...helper('claimsPerCustomer')}
                      />
                    </div>
                    <FinTextField size="small"
                      ref={ref('maxUses')}
                      label="Max total uses of campaign (optional)"
                      placeholder="Max total uses of campaign (optional)"
                      suffix="Uses"
                      inputMode="numeric"
                      value={v.maxUses}
                      onChange={(e) => set('maxUses', e.target.value, 'maxUses')}
                      {...helper('maxUses', 'Leave it empty for no limit')}
                    />
                  </div>
                </fieldset>
              </>
            )}

            {step === 2 && (
              <>
                <fieldset className={styles.section}>
                  <legend className={styles.legend}>Who can claim this reward</legend>
                  <div className={styles.panel}>
                    <p className={styles.panelTitle} aria-hidden="true">
                      Type
                    </p>
                    <FinListRadioGroup label="Type" value={v.eligibility} onValueChange={(next) => set('eligibility', next as Eligibility)} size="small">
                      <FinListRadioFilled value="all" title="All customers" description="All tiers and segments" />
                      <FinListRadioFilled value="tiers" title="Tier only" />
                      <FinListRadioFilled value="segments" title="Segment only" />
                      <FinListRadioFilled value="rules" title="Rules" description="Segments and tiers" />
                    </FinListRadioGroup>
                  </div>
                </fieldset>

                {v.eligibility === 'tiers' && (
                  <div className={styles.panel}>
                    <p className={styles.panelTitle} aria-hidden="true">
                      Tiers
                    </p>
                    <div className={styles.group}>
                      <FinListCheckboxGroup
                        label="Tiers"
                        value={v.tiers}
                        onValueChange={(next) => set('tiers', next, 'tiers')}
                        size="small"
                        {...(errors.tiers ? { 'aria-describedby': tiersErrorId } : {})}
                      >
                        {TIERS.map((t, i) => (
                          <FinListCheckboxFilled key={t} value={t} title={t} {...(i === 0 ? { ref: ref('tiers') } : {})} />
                        ))}
                      </FinListCheckboxGroup>
                      {errors.tiers && (
                        <FinHelperText id={tiersErrorId} tone="error">
                          {ERRORS.tiers}
                        </FinHelperText>
                      )}
                    </div>
                  </div>
                )}

                {v.eligibility === 'segments' && (
                  <div className={styles.panel}>
                    <p className={styles.panelTitle} aria-hidden="true">
                      Segments
                    </p>
                    <div className={styles.group}>
                      <FinListCheckboxGroup
                        label="Segments"
                        value={v.segments}
                        onValueChange={(next) => set('segments', next, 'segments')}
                        size="small"
                        {...(errors.segments ? { 'aria-describedby': segmentsErrorId } : {})}
                      >
                        {SEGMENTS.map((s, i) => (
                          <FinListCheckboxFilled key={s} value={s} title={s} {...(i === 0 ? { ref: ref('segments') } : {})} />
                        ))}
                      </FinListCheckboxGroup>
                      {errors.segments && (
                        <FinHelperText id={segmentsErrorId} tone="error">
                          {ERRORS.segments}
                        </FinHelperText>
                      )}
                    </div>
                  </div>
                )}

                {v.eligibility === 'rules' && (
                  <fieldset className={styles.section}>
                    <legend className={styles.legend}>Create a rule</legend>
                    <div className={styles.group}>
                      <FinNotificationBanner tone="warning">
                        Each list also offers all segments or all tiers.
                      </FinNotificationBanner>
                      <div className={styles.row}>
                        <FinSelectField size="small"
                          ref={ref('ruleSegment')}
                          label="Segment"
                          placeholder="Segment"
                          options={[ALL_SEGMENTS, ...SEGMENTS].map((o) => ({ value: o, label: o }))}
                          value={ruleSegment}
                          onChange={(next) => {
                            setRuleSegment(next);
                            setRuleDuplicate(false);
                            setErrors((current) => ({ ...current, ruleSegment: false }));
                          }}
                          {...helper('ruleSegment')}
                        />
                        <FinSelectField size="small"
                          ref={ref('ruleTier')}
                          label="Tier"
                          placeholder="Tier"
                          options={[ALL_TIERS, ...TIERS].map((o) => ({ value: o, label: o }))}
                          value={ruleTier}
                          onChange={(next) => {
                            setRuleTier(next);
                            setRuleDuplicate(false);
                            setErrors((current) => ({ ...current, ruleTier: false }));
                          }}
                          {...(ruleDuplicate ? { error: true, helperText: 'This rule is already added' } : helper('ruleTier'))}
                        />
                      </div>
                      <FinButton ref={ref('rules')} variant="secondary" size="medium" icon="leading" iconName="add" onClick={addRule} {...(errors.rules ? { 'aria-describedby': rulesErrorId } : {})}>
                        Add rule
                      </FinButton>
                      {errors.rules && (
                        <FinHelperText id={rulesErrorId} tone="error">
                          {ERRORS.rules}
                        </FinHelperText>
                      )}
                      {v.rules.length > 0 && (
                        <FinTable
                          label="Added rules"
                          columns={ruleColumns}
                          rows={v.rules}
                          getRowId={(r) => r.id}
                          getRowLabel={(r) => `${r.segment}, ${r.tier}`}
                          selectable={false}
                          footer={false}
                          hover={false}
                          rowActions={[
                            {
                              label: 'Remove',
                              icon: 'delete',
                              destructive: true,
                              onSelect: (rule) => set('rules', v.rules.filter((r) => r.id !== rule.id)),
                            },
                          ]}
                        />
                      )}
                    </div>
                  </fieldset>
                )}

                <fieldset className={styles.section}>
                  <legend className={styles.legend}>Badge</legend>
                  <FinSelectField size="small"
                    label="Badge after completion (optional)"
                    placeholder="Badge after completion (optional)"
                    options={BADGES.map((o) => ({ value: o, label: o }))}
                    value={v.badge}
                    onChange={(next) => set('badge', next)}
                  />
                </fieldset>
              </>
            )}

            {step === 3 && (
              <>
                <fieldset className={styles.section}>
                  <legend className={styles.legend}>Offer text, shown in the reward catalogue</legend>
                  <div className={styles.group}>
                    <FinTextField size="small" ref={ref('headline')} label="Headline" placeholder="Headline" value={v.headline} onChange={(e) => set('headline', e.target.value, 'headline')} {...helper('headline')} />
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
                  <legend className={styles.legend}>Notifications</legend>
                  <FinListToggleFilled
                    size="small"
                    title="Push notification"
                    description="When a customer earns the reward"
                    checked={v.push}
                    onCheckedChange={(on) => set('push', on)}
                  />
                </fieldset>
              </>
            )}
          </div>
        </form>
      </FinSideSheet>
      <FinDialog
        open={discarding}
        onClose={() => setDiscarding(false)}
        title={editing ? 'Discard your changes?' : 'Discard this reward?'}
        secondaryButton={{ label: 'Keep editing', onClick: () => setDiscarding(false) }}
        primaryButton={{ label: 'Discard', tone: 'destructive', onClick: close }}
      >
        {editing ? 'Your changes to this reward will be lost.' : 'What you\u2019ve entered will be lost.'}
      </FinDialog>
    </>
  );
}
