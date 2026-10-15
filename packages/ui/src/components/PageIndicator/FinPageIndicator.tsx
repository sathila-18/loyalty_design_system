'use client';

import { useRef, type HTMLAttributes, type KeyboardEvent } from 'react';
import { FinIndicatorDot } from '../IndicatorDot';
import styles from './FinPageIndicator.module.css';

export interface FinPageIndicatorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  /** Number of positions (Figma `Number` = 3/4/5). Any number from 1, no maximum (decided 15 Oct 2026). */
  count: number;
  /** The current position, 1-based (Figma `Active`). */
  active: number;
  /**
   * Makes the dots clickable (decided 15 Oct 2026): called with the 1-based position. Arrow keys, Home and End
   * move and select. The screen must also offer another way to change position, such as Previous / Next (§9).
   */
  onChange?: (position: number) => void;
  /** Accessible name. Display-only: the whole indicator (default "Step {active} of {count}"). Clickable: the group (default "Steps"). */
  label?: string;
  /** Accessible name of each clickable dot (default "Step {position} of {count}"). */
  dotLabel?: (position: number, count: number) => string;
}

const defaultDotLabel = (position: number, count: number) => `Step ${position} of ${count}`;

/** A row of position dots for steps or slides (Figma Indicator set; DESIGN.md §9). */
export function FinPageIndicator({
  count,
  active,
  onChange,
  label,
  dotLabel = defaultDotLabel,
  className,
  ...rest
}: FinPageIndicatorProps) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const total = Math.max(0, Math.floor(count));
  if (total === 0) return null;
  const current = Math.min(Math.max(1, Math.round(active)), total);
  const positions = Array.from({ length: total }, (_, i) => i + 1);
  const rootClass = className ? `${styles.indicator} ${className}` : styles.indicator;

  if (!onChange) {
    return (
      <div {...rest} role="img" aria-label={label ?? defaultDotLabel(current, total)} className={rootClass}>
        {positions.map((p) => (
          <FinIndicatorDot key={p} selected={p === current} />
        ))}
      </div>
    );
  }

  // Radio group pattern: one tab stop (the current dot); arrows move and select, wrapping at the ends.
  const select = (p: number) => {
    onChange(p);
    buttons.current[p - 1]?.focus();
  };
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const next = { ArrowRight: current + 1, ArrowDown: current + 1, ArrowLeft: current - 1, ArrowUp: current - 1, Home: 1, End: total }[
      event.key
    ];
    if (next === undefined) return;
    event.preventDefault();
    select(((next - 1 + total) % total) + 1);
  };

  return (
    <div
      {...rest}
      role="radiogroup"
      aria-label={label ?? 'Steps'}
      className={rootClass}
      data-interactive
    >
      {positions.map((p) => (
        <FinIndicatorDot
          key={p}
          ref={(el) => {
            buttons.current[p - 1] = el;
          }}
          interactive
          selected={p === current}
          role="radio"
          aria-checked={p === current}
          aria-label={dotLabel(p, total)}
          tabIndex={p === current ? 0 : -1}
          onClick={() => select(p)}
          onKeyDown={onKeyDown}
        />
      ))}
    </div>
  );
}
