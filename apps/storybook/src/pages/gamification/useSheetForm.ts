import { useCallback, useState } from 'react';

/**
 * What the Focus areas side sheets share: the form's values (starting from `initial`), which fields are wrong and the
 * first one focused, whether anything changed (Edit's Save; the discard dialog), a failed save, and the discard
 * dialog. `messages` lists the checked fields and their errors.
 */
export function useSheetForm<V extends object, F extends string>(initial: V, messages: Record<F, string>) {
  const [start] = useState(initial);
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Partial<Record<F, boolean>>>({});
  const [saveFailed, setSaveFailed] = useState(false);
  const [discarding, setDiscarding] = useState(false);
  // The fields' elements, so a wrong one can be focused; one ref callback per field, made once.
  const [fields] = useState(() => {
    const nodes = new Map<F, HTMLElement | null>();
    const bindings = Object.fromEntries(
      (Object.keys(messages) as F[]).map((field) => [field, (node: HTMLElement | null) => void nodes.set(field, node)]),
    ) as Record<F, (node: HTMLElement | null) => void>;
    return { focus: (field: F) => nodes.get(field)?.focus(), bind: (field: F) => bindings[field] };
  });

  const changed = JSON.stringify(values) !== JSON.stringify(start);

  /** Sets a value; with `field`, its error goes. The same function every render (effects can depend on it). */
  const set = useCallback(<K extends keyof V>(key: K, value: V[K], field?: F) => {
    setValues((current) => ({ ...current, [key]: value }));
    if (field) setErrors((current) => ({ ...current, [field]: false }));
  }, []);
  /** A field's error props (or its helper text when it's fine). */
  const helper = (field: F, text?: string) => (errors[field] ? { error: true, helperText: messages[field] } : text ? { helperText: text } : {});
  /** Shows the errors found and focuses the first; `true` when there are none. */
  const check = (found: Partial<Record<F, boolean>>) => {
    setErrors(found);
    const first = (Object.keys(found) as F[]).find((field) => found[field]);
    if (first) fields.focus(first);
    return !first;
  };

  return {
    values,
    set,
    errors,
    setErrors,
    helper,
    check,
    ref: fields.bind,
    focus: fields.focus,
    changed,
    saveFailed,
    setSaveFailed,
    discarding,
    setDiscarding,
  };
}
