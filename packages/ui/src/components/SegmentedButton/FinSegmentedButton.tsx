'use client';

import { forwardRef, useRef, useState, type HTMLAttributes, type KeyboardEvent } from 'react';
import type { FinIconName } from '../../icons/finIcons';
import { FinSegmentBase } from '../SegmentBase';
import styles from './FinSegmentedButton.module.css';

export interface FinSegmentedButtonOption {
  /** The value this segment stands for. */
  value: string;
  /** The segment's label. */
  label: string;
  /** A 20px leading icon (icons only, as the segment base). */
  icon?: FinIconName;
  /** Makes just this segment unavailable (decided 19 Oct 2026); it uses the segment's Disabled look. */
  disabled?: boolean;
}

/** The group's name: a visible label elsewhere (`aria-labelledby`), or `label` read by screen readers only. */
type FinSegmentedButtonName = { label: string; 'aria-labelledby'?: never } | { label?: never; 'aria-labelledby': string };

export type FinSegmentedButtonProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'aria-labelledby'> &
  FinSegmentedButtonName & {
    /** The segments, at least two (Figma shows up to three; no maximum, decided 19 Oct 2026). */
    options: [FinSegmentedButtonOption, FinSegmentedButtonOption, ...FinSegmentedButtonOption[]];
    /** The selected value. Controlled. */
    value?: string;
    /** The start value when uncontrolled. Default: the first segment that isn't disabled. */
    defaultValue?: string;
    /** Called with the new value when another segment is chosen. */
    onValueChange?: (value: string) => void;
    /** Figma `State=Disabled`: the whole control. */
    disabled?: boolean;
    /** Submits the selected value in a form, under this name. */
    name?: string;
  };

/**
 * A single choice between a few options (Figma Segmented button; DESIGN.md §9): FinSegmentBase segments on a track.
 * A radio group: one tab stop (the selected segment); the arrow keys move and select, wrapping; Home and End jump
 * to the ends; disabled segments are skipped. `ref` goes to the track.
 */
export const FinSegmentedButton = forwardRef<HTMLDivElement, FinSegmentedButtonProps>(function FinSegmentedButton(
  { options, value, defaultValue, onValueChange, disabled = false, name, label, className, ...rest },
  ref,
) {
  const firstEnabled = options.find((o) => !o.disabled)?.value;
  const [inner, setInner] = useState(defaultValue ?? firstEnabled);
  const selected = value ?? inner;
  const segments = useRef<(HTMLButtonElement | null)[]>([]);

  const enabledIndexes = disabled ? [] : options.flatMap((o, i) => (o.disabled ? [] : [i]));
  const selectedIndex = options.findIndex((o) => o.value === selected);
  // The one tab stop: the selected segment, or the first enabled one if that's unavailable.
  const tabStop = enabledIndexes.includes(selectedIndex) ? selectedIndex : enabledIndexes[0];

  const choose = (index: number, focus = false) => {
    const next = options[index]!.value;
    if (focus) segments.current[index]?.focus();
    if (next === selected) return;
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };

  // Arrow keys move and select (wrapping), Home / End jump to the ends; disabled segments are skipped.
  const onSegmentKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const at = enabledIndexes.indexOf(index);
    if (at === -1) return;
    const last = enabledIndexes.length - 1;
    const step: Record<string, number> = { ArrowRight: at + 1, ArrowDown: at + 1, ArrowLeft: at - 1, ArrowUp: at - 1, Home: 0, End: last };
    if (!(event.key in step)) return;
    event.preventDefault();
    const to = (step[event.key]! + enabledIndexes.length) % enabledIndexes.length;
    choose(enabledIndexes[to]!, true);
  };

  return (
    <div
      {...rest}
      ref={ref}
      role="radiogroup"
      aria-label={label}
      aria-disabled={disabled || undefined}
      className={className ? `${styles.track} ${className}` : styles.track}
      data-disabled={disabled || undefined}
    >
      {options.map((option, i) => (
        <FinSegmentBase
          key={option.value}
          ref={(el) => {
            segments.current[i] = el;
          }}
          className={styles.segment}
          role="radio"
          aria-checked={option.value === selected}
          selected={option.value === selected}
          disabled={disabled || option.disabled === true}
          tabIndex={i === tabStop ? 0 : -1}
          {...(option.icon ? { leadingIcon: option.icon } : {})}
          onClick={() => choose(i)}
          onKeyDown={(event) => onSegmentKeyDown(event, i)}
        >
          {option.label}
        </FinSegmentBase>
      ))}
      {name !== undefined && selected !== undefined && <input type="hidden" name={name} value={selected} />}
    </div>
  );
});
