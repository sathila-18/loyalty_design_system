'use client';

import { forwardRef, useRef, useState, type HTMLAttributes, type KeyboardEvent } from 'react';
import type { FinIconName } from '../../icons/finIcons';
import { FinTooltip } from '../Tooltip';
import { FinSegmentBase, type FinSegmentBaseSize } from '../SegmentBase';
import * as styles from './FinSegmentedButton.styles';

export interface FinSegmentedButtonOption {
  /** The value this segment stands for. */
  value: string;
  /** The segment's label. */
  label: string;
  /** A 20px leading icon (icons only, as the segment base). Needed with `iconOnly`. */
  icon?: FinIconName;
  /** Makes just this segment unavailable (decided 19 Oct 2026); it uses the segment's Disabled look. */
  disabled?: boolean;
}

/**
 * Code only (2 Nov 2026): `radio` (default) is a radio group with its own tab stop; `menuitemradio` is the same choice
 * inside a FinMenu: a group of menu item radios the menu moves focus to (↑/↓ land on the selected one), ←/→ move
 * between them and Enter, Space or a click picks one. Picking doesn't close the menu.
 */
export type FinSegmentedButtonBehavior = 'radio' | 'menuitemradio';

/** `medium` (default, Figma's), `small` or `xsmall` (both code only, 2 Nov 2026). */
export type FinSegmentedButtonSize = FinSegmentBaseSize;

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
    /**
     * Code only (2 Nov 2026): the segments show only their icons (every option needs `icon`), 36 squares, and the track
     * is as wide as they are instead of filling its container. Each label stays as the segment's name.
     */
    iconOnly?: boolean;
    /**
     * Code only (3 Nov 2026): with `iconOnly`, each segment shows its label in a single line FinTooltip (above it) on
     * hover and keyboard focus. The label is already the segment's name, so the tooltip doesn't describe it again.
     */
    tooltips?: boolean;
    /** Default `radio`. See FinSegmentedButtonBehavior. */
    behavior?: FinSegmentedButtonBehavior;
    /**
     * Default `medium` (Figma: track padding Space-XS, gap Space-L, Radius-L). `small` (code only, 2 Nov 2026): small
     * segments on a track with gap Space-XS and Radius-M, 40 tall (icon only: 36, three icons 100 wide). `xsmall` (code
     * only, 2 Nov 2026): xsmall segments side by side, the track no padding or gap, Radius-S: 24 tall (icon only, three
     * icons: 72 × 24), for a menu row.
     */
    size?: FinSegmentedButtonSize;
  };

/**
 * A single choice between a few options (Figma Segmented button; DESIGN.md §9): FinSegmentBase segments on a track.
 * A radio group: one tab stop (the selected segment); the arrow keys move and select, wrapping; Home and End jump
 * to the ends; disabled segments are skipped. In a menu (`behavior="menuitemradio"`), menu item radios: ←/→ move,
 * Enter or Space picks. `ref` goes to the track.
 */
export const FinSegmentedButton = forwardRef<HTMLDivElement, FinSegmentedButtonProps>(function FinSegmentedButton(
  { options, value, defaultValue, onValueChange, disabled = false, name, label, iconOnly = false, tooltips = false, behavior = 'radio', size = 'medium', className, ...rest },
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

  const inMenu = behavior === 'menuitemradio';

  // Arrow keys move and select (wrapping), Home / End jump to the ends; disabled segments are skipped. In a menu,
  // only ←/→, and they move without picking (Enter or Space picks); ↑/↓, Home and End are the menu's.
  const onSegmentKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const at = enabledIndexes.indexOf(index);
    if (at === -1) return;
    const last = enabledIndexes.length - 1;
    if (inMenu) {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      const to = (at + (event.key === 'ArrowRight' ? 1 : -1) + enabledIndexes.length) % enabledIndexes.length;
      segments.current[enabledIndexes[to]!]?.focus();
      return;
    }
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
      role={inMenu ? 'group' : 'radiogroup'}
      aria-label={label}
      aria-disabled={disabled || undefined}
      className={[
        iconOnly ? styles.display.iconOnly : styles.display.fill,
        styles.size[size],
        disabled ? styles.fill.disabled : styles.fill.enabled,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-disabled={disabled || undefined}
      data-icon-only={iconOnly || undefined}
      data-size={size === 'medium' ? undefined : size}
    >
      {options.map((option, i) => {
        const segment = (
          <FinSegmentBase
            key={option.value}
            ref={(el) => {
              segments.current[i] = el;
            }}
            className={iconOnly ? styles.segment.iconOnly : styles.segment.fill}
            role={inMenu ? 'menuitemradio' : 'radio'}
            aria-checked={option.value === selected}
            selected={option.value === selected}
            disabled={disabled || option.disabled === true}
            tabIndex={!inMenu && i === tabStop ? 0 : -1}
            iconOnly={iconOnly}
            size={size}
            {...(option.icon ? { leadingIcon: option.icon } : {})}
            onClick={() => choose(i)}
            onKeyDown={(event) => onSegmentKeyDown(event, i)}
          >
            {option.label}
          </FinSegmentBase>
        );
        return iconOnly && tooltips ? (
          <FinTooltip key={option.value} content={option.label} describesTrigger={false}>
            {segment}
          </FinTooltip>
        ) : (
          segment
        );
      })}
      {name !== undefined && selected !== undefined && <input type="hidden" name={name} value={selected} />}
    </div>
  );
});
