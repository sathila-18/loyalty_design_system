'use client';

import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react-dom';
import {
  cloneElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useState,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { FinTextBox } from '../TextBox';
import * as styles from './FinTooltip.styles';

/** Figma `Type`: `single-line` (Single line, Caption L) or `rich` (Rich tooltip, a Text Box with a heading). */
export type FinTooltipType = 'single-line' | 'rich';

/** Code only: the side of the trigger it opens on (default `top`); it flips when there isn't room. */
export type FinTooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

/** How long the pointer rests on the trigger before it opens (decided by design 3 Nov 2026). */
const OPEN_DELAY = 250;
/** How long it waits after the pointer leaves, so the pointer can move onto the tooltip (WCAG 1.4.13). */
const CLOSE_DELAY = 100;

interface FinTooltipBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'content'> {
  /** The trigger: one element that takes a ref, focus and pointer events (a button, a link, an icon button). */
  children: ReactElement<Record<string, unknown>>;
  /** Code only: the side of the trigger (default `top`). */
  placement?: FinTooltipPlacement;
  /** Open (controlled). Without it, hover and focus open it. */
  open?: boolean;
  /** Open at the start (uncontrolled). */
  defaultOpen?: boolean;
  /** Called when it asks to open or close (hover, focus, Escape). */
  onOpenChange?: (open: boolean) => void;
  /**
   * Code only (3 Nov 2026): the trigger is described by the tooltip (`aria-describedby`; default `true`). `false` when
   * the tooltip only repeats the trigger's own name (an icon only control named by its label): screen readers don't
   * hear it twice, and the tooltip is hidden from them (`aria-hidden`).
   */
  describesTrigger?: boolean;
}

interface FinTooltipSingleLineProps extends FinTooltipBaseProps {
  /** Figma `Type=Single line` (the default). */
  type?: 'single-line';
  /** The text (Figma's "Supporting text"). */
  content: ReactNode;
  heading?: never;
  description?: never;
}

interface FinTooltipRichProps extends FinTooltipBaseProps {
  /** Figma `Type=Rich tooltip`. */
  type: 'rich';
  /** The Text Box's heading (Headline Small-H6). */
  heading?: ReactNode;
  /** The Text Box's description (Body M). */
  description?: ReactNode;
  content?: never;
}

export type FinTooltipProps = FinTooltipSingleLineProps | FinTooltipRichProps;

/**
 * Only one tooltip is open at a time (3 Nov 2026): opening one closes the last (say, the one under a resting pointer
 * when the keyboard moves focus to another trigger). Set in effects only, never at import or render.
 */
let closeOpenTooltip: (() => void) | null = null;

/** A length custom property of an element, in px (a token, so values stay in CSS). */
function cssPx(element: Element, property: string) {
  return parseFloat(getComputedStyle(element).getPropertyValue(property)) || 0;
}

function setRef<T>(ref: Ref<T> | undefined, value: T) {
  if (typeof ref === 'function') ref(value);
  else if (ref) (ref as { current: T }).current = value;
}

/** Focus from the keyboard (not a click): only then does focus open it. */
function isFocusVisible(element: Element) {
  try {
    return element.matches(':focus-visible');
  } catch {
    return true;
  }
}

/**
 * A tooltip (Figma Plain Tooltip, Look=Black; DESIGN.md §9): `bg-direct`, `text-inverse`, Radius-S, no arrow, 4
 * (Space-XS) from its trigger in the top layer. It opens 250 ms after the pointer rests on the trigger, or at once
 * when the trigger gets keyboard focus; it closes when the pointer leaves (it can move onto the tooltip), on blur and
 * on Escape. Never on touch. One is open at a time. The trigger is described by it (`aria-describedby`); it holds text only.
 */
export function FinTooltip({
  children,
  type = 'single-line',
  content,
  heading,
  description,
  placement = 'top',
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  describesTrigger = true,
  className,
  id: idProp,
  ...rest
}: FinTooltipProps) {
  const autoId = useId();
  const id = idProp ?? `fin-tooltip-${autoId}`;
  const [openState, setOpenState] = useState(defaultOpen);
  const open = openProp ?? openState;
  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setOpenState(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  // The pending open or close (one at a time), as state: an effect runs its timer, and a new one (or `clear`) replaces it.
  const [pending, setPending] = useState<{ open: boolean; delay: number } | null>(null);
  const clear = useCallback(() => setPending(null), []);
  const later = (next: boolean, delay: number) => setPending({ open: next, delay });
  useEffect(() => {
    if (!pending) return;
    const id = setTimeout(() => {
      setPending(null);
      setOpen(pending.open);
    }, pending.delay);
    return () => clearTimeout(id);
  }, [pending, setOpen]);

  const [triggerEl, setTriggerEl] = useState<HTMLElement | null>(null);
  const [tooltipEl, setTooltipEl] = useState<HTMLDivElement | null>(null);

  const { x, y, isPositioned } = useFloating<HTMLElement>({
    open,
    elements: { reference: triggerEl, floating: open ? tooltipEl : null },
    placement,
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
    middleware: [
      // The gap (Space-XS) and the room kept from the window edge (Space-M) come from the tooltip's CSS tokens.
      offset(({ elements: { floating } }) => cssPx(floating, '--tooltip-gap')),
      flip(({ elements: { floating } }) => ({ padding: cssPx(floating, '--tooltip-edge') })),
      shift(({ elements: { floating } }) => ({ padding: cssPx(floating, '--tooltip-edge') })),
    ],
  });

  // Show in the top layer while open.
  useLayoutEffect(() => {
    if (!tooltipEl || typeof tooltipEl.showPopover !== 'function') return;
    const shown = tooltipEl.matches(':popover-open');
    if (open && !shown) tooltipEl.showPopover();
    if (!open && shown) tooltipEl.hidePopover();
  }, [open, tooltipEl]);

  // One at a time: this one, once open, closes any other.
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    closeOpenTooltip?.();
    closeOpenTooltip = close;
    return () => {
      if (closeOpenTooltip === close) closeOpenTooltip = null;
    };
  }, [open, setOpen]);

  // Escape closes it, wherever focus is (WCAG 1.4.13: dismissable without moving the pointer or focus). Caught first
  // (capture) and kept there, so inside a menu or dialog the first Escape closes only the tooltip, the next the menu.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.stopPropagation();
      clear();
      setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [open, setOpen, clear]);

  const own = children.props as {
    ref?: Ref<HTMLElement>;
    'aria-describedby'?: string;
    onPointerEnter?: (event: PointerEvent<HTMLElement>) => void;
    onPointerLeave?: (event: PointerEvent<HTMLElement>) => void;
    onPointerDown?: (event: PointerEvent<HTMLElement>) => void;
    onFocus?: (event: FocusEvent<HTMLElement>) => void;
    onBlur?: (event: FocusEvent<HTMLElement>) => void;
  };

  const trigger = cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      setTriggerEl(node);
      setRef(own.ref, node);
    },
    'aria-describedby': !describesTrigger ? own['aria-describedby'] : own['aria-describedby'] ? `${own['aria-describedby']} ${id}` : id,
    onPointerEnter: (event: PointerEvent<HTMLElement>) => {
      own.onPointerEnter?.(event);
      if (event.pointerType === 'touch') return;
      if (open) clear();
      else later(true, OPEN_DELAY);
    },
    onPointerLeave: (event: PointerEvent<HTMLElement>) => {
      own.onPointerLeave?.(event);
      if (event.pointerType === 'touch') return;
      if (open) later(false, CLOSE_DELAY);
      else clear();
    },
    // Pressing the trigger acts on it; the tooltip gets out of the way.
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      own.onPointerDown?.(event);
      clear();
      if (open) setOpen(false);
    },
    onFocus: (event: FocusEvent<HTMLElement>) => {
      own.onFocus?.(event);
      if (!isFocusVisible(event.currentTarget)) return;
      clear();
      setOpen(true);
    },
    onBlur: (event: FocusEvent<HTMLElement>) => {
      own.onBlur?.(event);
      clear();
      if (open) setOpen(false);
    },
  });

  const vars = { '--tooltip-x': `${x}px`, '--tooltip-y': `${y}px` } as CSSProperties;

  return (
    <>
      {trigger}
      {/* Always in the page (hidden when closed), so the trigger's description is there before it opens. */}
      <div
        {...rest}
        ref={setTooltipEl}
        id={id}
        role="tooltip"
        aria-hidden={describesTrigger ? undefined : true}
        popover="manual"
        hidden={!open}
        className={className ? `${styles.type[type]} ${className}` : styles.type[type]}
        data-type={type}
        data-positioned={(open && isPositioned) || undefined}
        style={vars}
        onPointerEnter={(event) => {
          if (event.pointerType !== 'touch') clear();
        }}
        onPointerLeave={(event) => {
          if (event.pointerType !== 'touch') later(false, CLOSE_DELAY);
        }}
      >
        {type === 'rich' ? (
          <FinTextBox className={styles.textBox} type="h6" tone="inverse" heading={heading} description={description} />
        ) : (
          content
        )}
      </div>
    </>
  );
}
