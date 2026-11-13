'use client';

import {
  forwardRef,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react';
import { FinButton } from '../Button';
import {
  addDays,
  addMonths,
  addMonthsToDate,
  endOfWeek,
  isISODate,
  localToday,
  longDate,
  monthGrid,
  monthOf,
  monthTitle,
  nextRange,
  startOfWeek,
  WEEKDAYS,
  type FinDateRange,
} from './calendarDates';

export type { FinDateRange };
import * as styles from './FinCalendar.styles';

interface FinCalendarCommonProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** The earliest date that can be chosen, as YYYY-MM-DD. */
  min?: string;
  /** The latest date that can be chosen, as YYYY-MM-DD. */
  max?: string;
  /** Rules out other dates (weekends, holidays…): return `true` for a date (YYYY-MM-DD) that can't be chosen. */
  isDateDisabled?: (date: string) => boolean;
  /** Months shown side by side. Default 1 (2 for FinDateRangePicker). */
  numberOfMonths?: 1 | 2;
  /** The (first) month shown at first, as YYYY-MM. Default: the chosen date's month, or today's. */
  defaultMonth?: string;
  /** Called with the (first) month shown, as YYYY-MM, when it changes. */
  onMonthChange?: (month: string) => void;
  /**
   * Today, as YYYY-MM-DD (marked, and the month shown when nothing is chosen). Default: the viewer's today, worked out
   * after the first render (so the server and the client agree). Set it in stories and tests.
   */
  today?: string;
  /** The previous month button's name. Default "Previous month". */
  previousLabel?: string;
  /** The next month button's name. Default "Next month". */
  nextLabel?: string;
}

export interface FinCalendarSingleProps extends FinCalendarCommonProps {
  /** One date (default), or a range. */
  mode?: 'single';
  /** The chosen date (controlled), as YYYY-MM-DD; `null` for none. */
  value?: string | null;
  /** The date chosen at first (uncontrolled). */
  defaultValue?: string;
  /** Called with the date chosen, as YYYY-MM-DD. */
  onChange?: (date: string) => void;
}

export interface FinCalendarRangeProps extends FinCalendarCommonProps {
  mode: 'range';
  /** The chosen range (controlled). */
  value?: FinDateRange | null;
  /** The range chosen at first (uncontrolled). */
  defaultValue?: FinDateRange;
  /** Called on each pick: the start first (`to` null), then the whole range. */
  onChange?: (range: FinDateRange) => void;
}

export type FinCalendarProps = FinCalendarSingleProps | FinCalendarRangeProps;

const EMPTY_RANGE: FinDateRange = { from: null, to: null };

/**
 * A calendar (code first, 13 Nov 2026; no Figma component: shadcn's calendar in this system's tokens; DESIGN.md §9).
 * Weeks start on Monday; each month shows six weeks. `mode="single"` picks a date; `mode="range"` a start, then an
 * end, with the days between on a band (previewed while hovering). Dates are YYYY-MM-DD, as FinDateField's.
 * Keyboard as WAI-ARIA's date picker dialog: the arrow keys move by a day or a week, Home / End to the week's start
 * or end, Page Up / Page Down by a month (with Shift a year), Enter or Space chooses. One day is in the tab order.
 * Used on its own or in FinDatePicker and FinDateRangePicker.
 */
export const FinCalendar = forwardRef<HTMLDivElement, FinCalendarProps>(function FinCalendar(props, ref) {
  const {
    mode = 'single',
    value,
    defaultValue,
    onChange,
    min,
    max,
    isDateDisabled,
    numberOfMonths = 1,
    defaultMonth,
    onMonthChange,
    today: todayProp,
    previousLabel = 'Previous month',
    nextLabel = 'Next month',
    className,
    ...rest
  } = props;

  const id = useId();
  const isRange = mode === 'range';

  // The chosen date or range, controlled or not.
  const [ownValue, setOwnValue] = useState<string | FinDateRange | null>(defaultValue ?? null);
  const current = value !== undefined ? value : ownValue;
  const single = !isRange && typeof current === 'string' && isISODate(current) ? current : null;
  const range: FinDateRange = isRange && current && typeof current === 'object' ? current : EMPTY_RANGE;

  // Today: known only after the first render, unless given (no clock during render, for Next.js).
  const [clockToday, setClockToday] = useState<string | null>(null);
  useEffect(() => {
    if (!todayProp) setClockToday(localToday());
  }, [todayProp]);
  const today = todayProp ?? clockToday;

  const anchor = (isRange ? range.from : single) ?? null;
  const [ownMonth, setOwnMonth] = useState<string | null>(() =>
    defaultMonth && /^\d{4}-\d{2}$/.test(defaultMonth) ? defaultMonth : anchor ? monthOf(anchor) : todayProp ? monthOf(todayProp) : null,
  );
  const shownMonth = ownMonth ?? (today ? monthOf(today) : null);
  const shownMonths = shownMonth ? Array.from({ length: numberOfMonths }, (_, i) => addMonths(shownMonth, i)) : [];
  const lastMonth = shownMonths.at(-1);

  const isVisible = (date: string | null | undefined): date is string =>
    !!date && !!shownMonth && !!lastMonth && monthOf(date) >= shownMonth && monthOf(date) <= lastMonth;

  // The day in the tab order (roving focus): the one moved to with the keys, else the chosen one, today or the 1st.
  const [focused, setFocused] = useState<string | null>(null);
  const active = isVisible(focused)
    ? focused
    : isVisible(anchor)
      ? anchor
      : isVisible(today)
        ? today
        : shownMonth
          ? `${shownMonth}-01`
          : null;

  const [hovered, setHovered] = useState<string | null>(null);

  const showMonth = (month: string) => {
    setOwnMonth(month);
    onMonthChange?.(month);
  };

  const isDisabled = (date: string) => (!!min && date < min) || (!!max && date > max) || !!isDateDisabled?.(date);

  const choose = (date: string) => {
    if (isDisabled(date)) return;
    setFocused(date);
    if (isRange) {
      const next = nextRange(range, date);
      if (value === undefined) setOwnValue(next);
      (onChange as FinCalendarRangeProps['onChange'])?.(next);
    } else {
      if (value === undefined) setOwnValue(date);
      (onChange as FinCalendarSingleProps['onChange'])?.(date);
    }
  };

  // After a key moves the day, focus follows it (once its button is rendered).
  const root = useRef<HTMLDivElement | null>(null);
  const moveFocus = useRef(false);
  useLayoutEffect(() => {
    if (!moveFocus.current || !active) return;
    moveFocus.current = false;
    root.current?.querySelector<HTMLButtonElement>(`[data-date="${active}"]`)?.focus();
  }, [active]);

  const moveTo = (date: string) => {
    moveFocus.current = true;
    setFocused(date);
    if (isRange) setHovered(date);
    if (shownMonth && lastMonth) {
      if (monthOf(date) < shownMonth) showMonth(monthOf(date));
      else if (monthOf(date) > lastMonth) showMonth(addMonths(monthOf(date), 1 - numberOfMonths));
    }
  };

  const onGridKeyDown = (event: KeyboardEvent<HTMLTableElement>) => {
    if (!active) return;
    const moves: Record<string, () => string> = {
      ArrowLeft: () => addDays(active, -1),
      ArrowRight: () => addDays(active, 1),
      ArrowUp: () => addDays(active, -7),
      ArrowDown: () => addDays(active, 7),
      Home: () => startOfWeek(active),
      End: () => endOfWeek(active),
      PageUp: () => addMonthsToDate(active, event.shiftKey ? -12 : -1),
      PageDown: () => addMonthsToDate(active, event.shiftKey ? 12 : 1),
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    moveTo(move());
  };

  // The range drawn: the chosen one, or while only the start is chosen, up to the day hovered (a preview).
  const rangeEnd = range.to ?? (range.from && hovered ? hovered : null);
  const [bandFrom, bandTo] =
    range.from && rangeEnd ? (rangeEnd < range.from ? [rangeEnd, range.from] : [range.from, rangeEnd]) : [null, null];

  const canGoBack = !!shownMonth && !(min && addMonths(shownMonth, -1) < monthOf(min));
  const canGoOn = !!lastMonth && !(max && addMonths(lastMonth, 1) > monthOf(max));

  return (
    <div
      {...rest}
      ref={(node) => {
        root.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      className={className ? `${styles.root} ${className}` : styles.root}
      data-mode={mode}
    >
      <div className={styles.months}>
        {shownMonths.map((month, index) => {
          const titleId = `${id}-title-${index}`;
          return (
            <div key={month} className={styles.month}>
              <div className={styles.header}>
                <h2 id={titleId} className={styles.title} aria-live="polite">
                  {monthTitle(month)}
                </h2>
                {index === 0 && (
                  <FinButton
                    className={styles.previous}
                    variant="tertiary"
                    size="small"
                    iconTone="secondary"
                    icon="only-icon"
                    iconName="chevron_left"
                    disabled={!canGoBack}
                    onClick={() => shownMonth && showMonth(addMonths(shownMonth, -1))}
                  >
                    {previousLabel}
                  </FinButton>
                )}
                {index === shownMonths.length - 1 && (
                  <FinButton
                    className={styles.next}
                    variant="tertiary"
                    size="small"
                    iconTone="secondary"
                    icon="only-icon"
                    iconName="chevron_right"
                    disabled={!canGoOn}
                    onClick={() => shownMonth && showMonth(addMonths(shownMonth, 1))}
                  >
                    {nextLabel}
                  </FinButton>
                )}
              </div>
              <table
                role="grid"
                className={styles.grid}
                aria-labelledby={titleId}
                onKeyDown={onGridKeyDown}
                onMouseLeave={() => setHovered(null)}
              >
                <thead>
                  <tr>
                    {WEEKDAYS.map((name) => (
                      <th key={name.short} scope="col" abbr={name.long} className={styles.weekday}>
                        {name.short}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {monthGrid(month).map((week) => (
                    <tr key={week[0]}>
                      {week.map((date) => {
                        const outside = monthOf(date) !== month;
                        // Two months side by side: another month's days are left empty (they're in the other grid).
                        if (outside && numberOfMonths > 1) return <td key={date} className={styles.cell.none} />;
                        const disabled = isDisabled(date);
                        const isEnd = isRange ? date === range.from || date === range.to : date === single;
                        const inBand = !!bandFrom && !!bandTo && bandFrom !== bandTo && date >= bandFrom && date <= bandTo;
                        const chosen = isRange ? !!range.from && !!range.to && date >= range.from && date <= range.to : isEnd;
                        const cell = !inBand
                          ? styles.cell.none
                          : date === bandFrom
                            ? styles.cell.start
                            : date === bandTo
                              ? styles.cell.end
                              : styles.cell.band;
                        const look = isEnd
                          ? styles.day.selected
                          : disabled
                            ? styles.day.disabled
                            : inBand
                              ? styles.day.band
                              : outside
                                ? styles.day.outside
                                : styles.day.default;
                        const isToday = date === today;
                        return (
                          <td key={date} className={cell} aria-selected={chosen}>
                            <button
                              type="button"
                              className={isToday && !isEnd ? `${look} ${styles.today}` : look}
                              tabIndex={date === active ? 0 : -1}
                              aria-label={longDate(date)}
                              aria-current={isToday ? 'date' : undefined}
                              aria-disabled={disabled || undefined}
                              data-date={date}
                              data-selected={isEnd || undefined}
                              data-in-range={(inBand && !isEnd) || undefined}
                              data-outside={outside || undefined}
                              // FinMenu puts focus here when a picker opens (DESIGN.md §9.64).
                              data-menu-focus={date === active || undefined}
                              onClick={() => choose(date)}
                              onMouseEnter={isRange ? () => setHovered(date) : undefined}
                              onFocus={() => {
                                setFocused(date);
                                if (isRange) setHovered(date);
                              }}
                            >
                              {Number(date.slice(8, 10))}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
});
