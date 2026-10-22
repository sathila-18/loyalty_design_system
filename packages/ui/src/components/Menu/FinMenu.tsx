'use client';

import { autoUpdate, flip, offset, shift, size, useFloating } from '@floating-ui/react-dom';
import {
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { flushSync } from 'react-dom';
import { FinDivider } from '../Divider';
import styles from './FinMenu.module.css';

/**
 * What the menu is for (code only; Figma shows the look):
 * - `action`: a trigger reveals actions; one is taken and the menu closes (`role="menu"`, arrow keys).
 * - `filter`: opened from a filter chip; controls are adjusted, then applied (a non-modal dialog, Tab).
 * - `navigation`: destinations; choosing one goes there (`<nav>` of links).
 */
export type FinMenuKind = 'action' | 'filter' | 'navigation';

/** `content`: fits its content, never narrower than the trigger. `trigger`: the trigger's width (fields). Or any CSS length. */
export type FinMenuWidth = 'content' | 'trigger' | (string & {});

export type FinMenuPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

/** The props FinMenu gives its trigger (also accepted by a trigger render function). */
export interface FinMenuTriggerProps {
  ref: (node: HTMLElement | null) => void;
  id: string;
  'aria-expanded': boolean;
  'aria-controls': string | undefined;
  'aria-haspopup': 'menu' | 'dialog' | undefined;
  onClick: (event: MouseEvent<HTMLElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

export interface FinMenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
  /** What the menu is for. Default `action`. */
  kind?: FinMenuKind;
  /** The element that opens it (a FinButton, chip…), or a function that spreads the given props on one. */
  trigger: ReactElement<Record<string, unknown>> | ((props: FinMenuTriggerProps) => ReactNode);
  /** Figma `conten` slot: the rows (any list rows, with or without lines), FinMenuDivider, any content. */
  children: ReactNode;
  /** Kept at the bottom while the content scrolls (filter buttons). Code first: Figma has one slot (22 Oct 2026). */
  footer?: ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Uncontrolled: open at first. Default `false`. */
  defaultOpen?: boolean;
  /** Called when the menu asks to open or close (trigger, Escape, outside click, a chosen action or link). */
  onOpenChange?: (open: boolean) => void;
  /** The menu's accessible name. Default: the trigger's. */
  label?: string;
  /** Default `content`. */
  width?: FinMenuWidth;
  /** A fixed limit (CSS length). Without it, the menu fits the space between the trigger and the window edge. */
  maxHeight?: string;
  /** Default `bottom-start`; it flips when there isn't room. */
  placement?: FinMenuPlacement;
}

const MenuKindContext = createContext<FinMenuKind>('action');

/** A line between groups of rows: a separator in an action or navigation list, a FinDivider in a filter menu. */
export function FinMenuDivider() {
  const kind = useContext(MenuKindContext);
  if (kind === 'filter') return <FinDivider />;
  return (
    <li role="separator" className={styles.separator}>
      <FinDivider decorative />
    </li>
  );
}

const FOCUSABLE = 'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
const ITEM = { action: '[role="menuitem"]:not(:disabled)', navigation: 'a[href]', filter: FOCUSABLE } as const;

/** A length custom property of an element, in px (a token, so values stay in CSS). */
function cssPx(element: Element, property: string) {
  return parseFloat(getComputedStyle(element).getPropertyValue(property)) || 0;
}

function setRef<T>(ref: Ref<T> | undefined, value: T) {
  if (typeof ref === 'function') ref(value);
  else if (ref) (ref as { current: T }).current = value;
}

/**
 * A menu (Figma standard-menu `Type=Normal`; DESIGN.md §9): a surface (`bg-primary`, `border-subtle`, Radius-M,
 * Shadow/Menu) holding any rows, placed 4 (Space-XS) from its trigger in the top layer. It flips when there isn't
 * room, never grows past the window (the content scrolls; the footer stays), and closes with Escape or a click
 * outside, returning focus to the trigger.
 */
export function FinMenu({
  kind = 'action',
  trigger,
  children,
  footer,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  label,
  width = 'content',
  maxHeight,
  placement = 'bottom-start',
  className,
  ...rest
}: FinMenuProps) {
  const [openState, setOpenState] = useState(defaultOpen);
  const open = openProp ?? openState;
  const triggerId = useId();
  const menuId = useId();
  // Where focus goes when the menu opens from the arrow keys (state, so nothing reads a ref during render).
  const [focusOnOpen, setFocusOnOpen] = useState<'first' | 'last' | null>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setOpenState(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  // The trigger and menu elements, kept in state (callback refs) and handed to Floating UI.
  const [triggerEl, setTriggerEl] = useState<HTMLElement | null>(null);
  const [menuEl, setMenuEl] = useState<HTMLDivElement | null>(null);

  const { x, y, isPositioned } = useFloating<HTMLElement>({
    open,
    elements: { reference: triggerEl, floating: menuEl },
    placement,
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
    middleware: [
      // The gap (Space-XS) and the room kept from the window edge (Space-M) come from the menu's CSS tokens.
      offset(({ elements: { floating } }) => cssPx(floating, '--menu-gap')),
      flip(({ elements: { floating } }) => ({ padding: cssPx(floating, '--menu-edge') })),
      shift(({ elements: { floating } }) => ({ padding: cssPx(floating, '--menu-edge') })),
      size(({ elements: { floating } }) => ({
        padding: cssPx(floating, '--menu-edge'),
        apply({ availableHeight, rects, elements: { floating } }) {
          floating.style.setProperty('--menu-available-height', `${Math.max(0, availableHeight)}px`);
          floating.style.setProperty('--menu-trigger-width', `${rects.reference.width}px`);
        },
      })),
    ],
  });

  const close = useCallback(
    (returnFocus: boolean) => {
      flushSync(() => setOpen(false));
      if (returnFocus) triggerEl?.focus();
    },
    [setOpen, triggerEl],
  );

  const items = useCallback(
    () => Array.from(menuEl?.querySelectorAll<HTMLElement>(ITEM[kind]) ?? []),
    [kind, menuEl],
  );

  // Show in the top layer.
  useLayoutEffect(() => {
    if (open && menuEl && typeof menuEl.showPopover === 'function' && !menuEl.matches(':popover-open')) menuEl.showPopover();
  }, [open, menuEl]);

  // Move focus in once it's placed (it's hidden until then, and hidden elements can't take focus).
  useLayoutEffect(() => {
    if (!open || !menuEl || !isPositioned) return;
    const list = items();
    const current = menuEl.querySelector<HTMLElement>('[aria-current="page"]');
    const target = focusOnOpen === 'last' ? list.at(-1) : kind === 'navigation' && current ? current : list[0];
    target?.focus();
    // Only when it's first placed after opening, not on later changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPositioned]);

  // Closed by the app (Apply) or a chosen row while focus was inside: the menu is gone, so focus returns to the trigger.
  const focusInside = useRef(false);
  useEffect(() => {
    if (open || !focusInside.current) return;
    focusInside.current = false;
    if (!document.activeElement || document.activeElement === document.body) triggerEl?.focus();
  }, [open, triggerEl]);

  // Close on a pointer press outside the menu and its trigger.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (menuEl?.contains(target) || triggerEl?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open, setOpen, menuEl, triggerEl]);

  const moveFocus = (step: 1 | -1 | 'first' | 'last') => {
    const list = items();
    if (list.length === 0) return;
    const index = list.indexOf(document.activeElement as HTMLElement);
    const next =
      step === 'first' ? 0 : step === 'last' ? list.length - 1 : (index + step + list.length) % list.length;
    list[next]?.focus();
  };

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      close(true);
      return;
    }
    if (kind === 'filter') return;
    const keys: Record<string, 1 | -1 | 'first' | 'last'> = { ArrowDown: 1, ArrowUp: -1, Home: 'first', End: 'last' };
    const step = keys[event.key];
    if (step !== undefined) {
      event.preventDefault();
      moveFocus(step);
    } else if (event.key === 'Tab' && kind === 'action') {
      // Leave the menu: focus goes on from the trigger.
      close(true);
    }
  };

  // An action or link was chosen: close (after its own click handler has run).
  const onMenuClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (kind === 'action' && target.closest('[role="menuitem"]:not(:disabled)')) close(true);
    if (kind === 'navigation' && target.closest('a[href]')) close(false);
  };

  // Focus left both the menu and its trigger (Tab out of a filter or navigation menu): close.
  const onMenuBlur = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget as Node | null;
    if (!next || menuEl?.contains(next)) return;
    focusInside.current = false;
    if (triggerEl?.contains(next)) return;
    setOpen(false);
  };

  const triggerProps: FinMenuTriggerProps = {
    ref: setTriggerEl,
    id: triggerId,
    'aria-expanded': open,
    'aria-controls': open ? menuId : undefined,
    'aria-haspopup': kind === 'action' ? 'menu' : kind === 'filter' ? 'dialog' : undefined,
    onClick: () => {
      setFocusOnOpen(null);
      setOpen(!open);
    },
    onKeyDown: (event) => {
      if (kind === 'filter' || (event.key !== 'ArrowDown' && event.key !== 'ArrowUp')) return;
      event.preventDefault();
      setFocusOnOpen(event.key === 'ArrowUp' ? 'last' : 'first');
      if (open) moveFocus(event.key === 'ArrowUp' ? 'last' : 'first');
      else setOpen(true);
    },
  };

  let triggerNode: ReactNode;
  if (typeof trigger === 'function') triggerNode = trigger(triggerProps);
  else {
    const own = trigger.props as {
      ref?: Ref<HTMLElement>;
      onClick?: (event: MouseEvent<HTMLElement>) => void;
      onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
    };
    triggerNode = cloneElement(trigger, {
      ...triggerProps,
      ref: (node: HTMLElement | null) => {
        triggerProps.ref(node);
        setRef(own.ref, node);
      },
      onClick: (event: MouseEvent<HTMLElement>) => {
        own.onClick?.(event);
        triggerProps.onClick(event);
      },
      onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
        own.onKeyDown?.(event);
        triggerProps.onKeyDown(event);
      },
    });
  }

  const name = label ? { 'aria-label': label } : { 'aria-labelledby': triggerId };
  const positioned = isPositioned;
  const vars = {
    '--menu-x': `${x}px`,
    '--menu-y': `${y}px`,
    ...(maxHeight ? { '--menu-max-height': maxHeight } : {}),
    ...(width !== 'content' && width !== 'trigger' ? { '--menu-width': width } : {}),
  } as CSSProperties;

  let body: ReactNode;
  if (kind === 'action')
    body = (
      <ul role="menu" id={menuId} {...name} className={styles.list}>
        {children}
      </ul>
    );
  else if (kind === 'navigation')
    body = (
      <nav id={menuId} {...name}>
        <ul className={styles.list}>{children}</ul>
      </nav>
    );
  else body = children;

  return (
    <>
      {triggerNode}
      {open && (
        // The menu handles keys and clicks for its own items (delegated); its role is the list's or the dialog's.
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          {...rest}
          ref={setMenuEl}
          popover="manual"
          className={className ? `${styles.menu} ${className}` : styles.menu}
          data-kind={kind}
          data-width={width === 'content' || width === 'trigger' ? width : 'custom'}
          data-positioned={positioned || undefined}
          data-max-height={maxHeight ? '' : undefined}
          style={vars}
          onKeyDown={onMenuKeyDown}
          onClick={onMenuClick}
          onFocus={() => {
            focusInside.current = true;
          }}
          onBlur={onMenuBlur}
          {...(kind === 'filter' ? { role: 'dialog', id: menuId, ...name } : {})}
        >
          <MenuKindContext.Provider value={kind}>
            <div className={styles.content}>{body}</div>
          </MenuKindContext.Provider>
          {footer !== undefined && footer !== null && <div className={styles.footer}>{footer}</div>}
        </div>
      )}
    </>
  );
}
