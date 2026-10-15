'use client';

import { forwardRef, useState, type ChangeEvent, type CSSProperties, type InputHTMLAttributes } from 'react';
import styles from './FinSlider.module.css';

export interface FinSliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'children' | 'value' | 'defaultValue' | 'min' | 'max' | 'step'> {
  /** Accessible name, visually hidden (like Toggle and Radio). */
  label: string;
  /** Controlled value (with `onChange`). */
  value?: number;
  /** Uncontrolled start value (default `min`). */
  defaultValue?: number;
  /** Lowest value (default 0). The screen sets the range for its scenario (decided 15 Oct 2026). */
  min?: number;
  /** Highest value (default 100). */
  max?: number;
  /** Step between values (default 1). */
  step?: number;
  /** What screen readers say instead of the number, for example "50 points". */
  valueText?: string;
}

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

/**
 * A slider (Figma slider, was dragger; DESIGN.md §9). A native `<input type="range">`, so dragging, clicking the
 * track, the keyboard and screen readers work as for any slider; `ref` goes to the input. Fills its container.
 */
export const FinSlider = forwardRef<HTMLInputElement, FinSliderProps>(function FinSlider(
  { label, value, defaultValue, min = 0, max = 100, step = 1, valueText, onChange, className, style, ...rest },
  ref,
) {
  const [inner, setInner] = useState(() => defaultValue ?? min);
  const current = clamp(value ?? inner, min, max);
  const fraction = max > min ? (current - min) / (max - min) : 0;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (value === undefined) setInner(Number(event.target.value));
    onChange?.(event);
  };

  return (
    <input
      {...rest}
      ref={ref}
      type="range"
      aria-label={label}
      {...(valueText ? { 'aria-valuetext': valueText } : {})}
      min={min}
      max={max}
      step={step}
      value={current}
      onChange={handleChange}
      className={className ? `${styles.slider} ${className}` : styles.slider}
      style={{ ...style, '--fraction': fraction } as CSSProperties}
    />
  );
});
