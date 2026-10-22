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
 * - `select`: a value is chosen from options (a `listbox` of `option` rows; the chosen one Selected), then it closes.
 *   For dropdowns such as rows per page, the country selector and the select fields.
 */
export type FinMenuKind = 'action' | 'filter' | 'navigation' | 'select';

/** `content`: fits its content, never narrower than the trigger. `trigger`: the trigger's width (fields). Or any CSS length. */
export type FinMenuWidth = 'content' | 'trigger' | (string & {});

export type FinMenuPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

/** The props FinMenu gives its trigger (also accepted by a trigger render function). */
export interface FinMenuTriggerProps {
  ref: (node: HTMLElement | null) => void;
  id: string;
  'aria-expanded': boolean;
  'aria-controls': string | undefined;
  'aria-haspopup': 'menu' | 'dialog' | 'listbox' | undefined;
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
  /**
   * Kept at the top while the content scrolls (a search field). Code first (22 Oct 2026). In a select menu, typing
   * moves into a field here (it isn't focused on open); ArrowDown moves into the options and Enter chooses the first.
   */
  header?: ReactNode;
  /** Placed against, and `width="trigger"` measured from, this element instead of the trigger (a field's box). */
  anchor?: HTMLElement | null;
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
const ITEM = {
  action: '[role="menuitem"]:not(:disabled)',
  navigation: 'a[href]',
  filter: FOCUSABLE,
  select: '[role="option"]:not([aria-disabled="true"])',
} as const;

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
  header,
  anchor,
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
  /**
   * Where focus goes when the menu opens. Opened with the keyboard: the first (or last) row, with its focus ring.
   * Opened with a pointer, or by the app: the menu itself (`container`), so no ring shows until the keyboard is used;
   * the arrow keys and Tab work from there. State, so nothing reads a ref during render.
   */
  const [focusOnOpen, setFocusOnOpen] = useState<'first' | 'last' | 'container'>('container');

  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setOpenState(next);
      if (!next) setFocusOnOpen('container');
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  // The trigger and menu elements, kept in state (callback refs) and handed to Floating UI.
  const [triggerEl, setTriggerEl] = useState<HTMLElement | null>(null);
  const [menuEl, setMenuEl] = useState<HTMLDivElement | null>(null);

  const { x, y, isPositioned } = useFloating<HTMLElement>({
    open,
    elements: { reference: anchor ?? triggerEl, floating: menuEl },
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
    const current = menuEl.querySelector<HTMLElement>(
      kind === 'select' ? '[role="option"][aria-selected="true"]' : '[aria-current="page"]',
    );
    // A select with a search field: the chosen option scrolled into view. The field stays in its default state (not
    // focused, decided 22 Oct 2026); typing moves into it (see onMenuKeyDown).
    const field = menuEl.querySelector<HTMLElement>('[data-menu-header] input');
    if (kind === 'select' && field) current?.scrollIntoView?.({ block: 'center' });
    const target =
      focusOnOpen === 'container'
        ? menuEl.querySelector<HTMLElement>('[data-menu-focus]') ?? menuEl
        : kind === 'select' && current
          ? current
          : focusOnOpen === 'last'
            ? list.at(-1)
            : kind === 'navigation' && current
              ? current
              : list[0];
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
    // -1: focus is on the menu itself (opened with a pointer), so ArrowDown goes to the first row (a select's chosen
    // option), ArrowUp the last.
    const index = list.indexOf(document.activeElement as HTMLElement);
    const chosen = kind === 'select' ? list.findIndex((el) => el.getAttribute('aria-selected') === 'true') : -1;
    if (index === -1 && chosen !== -1 && (step === 1 || step === -1)) {
      list[chosen]?.focus();
      return;
    }
    const next =
      step === 'first' || (index === -1 && step === 1)
        ? 0
        : step === 'last' || (index === -1 && step === -1)
          ? list.length - 1
          : (index + step + list.length) % list.length;
    list[next]?.focus();
  };

  // Select: typing jumps to the next option starting with the letters typed (within half a second of each other).
  const typed = useRef({ text: '', at: 0 });
  const typeAhead = (key: string) => {
    const now = Date.now();
    typed.current = { text: (now - typed.current.at < 500 ? typed.current.text : '') + key.toLowerCase(), at: now };
    const list = items();
    const start = list.indexOf(document.activeElement as HTMLElement);
    const text = typed.current.text;
    // One letter repeated cycles through the options starting with it; more letters match from the current one.
    const repeat = text.length > 1 && [...text].every((c) => c === text[0]);
    const query = repeat ? text[0]! : text;
    const ordered = [...list.slice(start + (text.length === 1 || repeat ? 1 : 0)), ...list.slice(0, start + (text.length === 1 || repeat ? 1 : 0))];
    ordered.find((el) => (el.textContent ?? '').trim().toLowerCase().startsWith(query))?.focus();
  };

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    // A search field's Escape first clears its text (it prevents the default); the next one closes.
    if (event.key === 'Escape' && !event.defaultPrevented) {
      event.preventDefault();
      event.stopPropagation();
      close(true);
      return;
    }
    if (kind === 'filter' || event.key === 'Escape') return;
    const inHeader = (event.target as HTMLElement).closest('[data-menu-header]') !== null;
    if (inHeader) {
      // In the search field: only ArrowDown / ArrowUp (into the options) and Enter (the first option) are the menu's.
      const list = items();
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        moveFocus(event.key === 'ArrowDown' ? 1 : -1);
      } else if (event.key === 'Enter' && kind === 'select' && list[0]) {
        event.preventDefault();
        list[0].click();
      } else if (event.key === 'Tab' && !event.shiftKey && kind === 'select') {
        close(true);
      }
      return;
    }
    const keys: Record<string, 1 | -1 | 'first' | 'last'> = { ArrowDown: 1, ArrowUp: -1, Home: 'first', End: 'last' };
    const step = keys[event.key];
    const option = kind === 'select' ? (document.activeElement as HTMLElement | null)?.closest<HTMLElement>('[role="option"]') : null;
    const headerField = menuEl?.querySelector<HTMLElement>('[data-menu-header] input');
    if (step === -1 && headerField && items()[0] === document.activeElement) {
      // Up from the first option: back to the search field.
      event.preventDefault();
      headerField.focus();
    } else if (step !== undefined) {
      event.preventDefault();
      moveFocus(step);
    } else if (option && (event.key === 'Enter' || event.key === ' ')) {
      // An option isn't a button: Enter and Space choose it as a click does.
      event.preventDefault();
      option.click();
    } else if (kind === 'select' && headerField && event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      // With a search field, typing goes into it (the character lands there) and filters.
      headerField.focus();
    } else if (kind === 'select' && event.key.length === 1 && /\S/.test(event.key)) {
      typeAhead(event.key);
    } else if (event.key === 'Tab' && (kind === 'action' || kind === 'select')) {
      // Leave the menu: focus goes on from the trigger.
      close(true);
    }
  };

  // An action or link was chosen: close (after its own click handler has run).
  const onMenuClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (kind === 'action' && target.closest('[role="menuitem"]:not(:disabled)')) close(true);
    if (kind === 'navigation' && target.closest('a[href]')) close(false);
    if (kind === 'select' && target.closest('[role="option"]:not([aria-disabled="true"])')) close(true);
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
    'aria-haspopup': kind === 'action' ? 'menu' : kind === 'filter' ? 'dialog' : kind === 'select' ? 'listbox' : undefined,
    // A click from Enter or Space has no pointer (`detail` 0): keyboard, so the first row gets focus and its ring.
    onClick: (event) => {
      setFocusOnOpen(event.detail === 0 ? 'first' : 'container');
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
      <ul role="menu" id={menuId} {...name} className={`${styles.list} ${styles.focusTarget}`} tabIndex={-1} data-menu-focus>
        {children}
      </ul>
    );
  else if (kind === 'select')
    body = (
      <ul role="listbox" id={menuId} {...name} className={`${styles.list} ${styles.focusTarget}`} tabIndex={-1} data-menu-focus>
        {children}
      </ul>
    );
  else if (kind === 'navigation')
    body = (
      <nav id={menuId} {...name} className={styles.focusTarget} tabIndex={-1} data-menu-focus>
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
          {...(kind === 'filter' ? { role: 'dialog', id: menuId, tabIndex: -1, ...name } : {})}
        >
          <MenuKindContext.Provider value={kind}>
            {header !== undefined && header !== null && (
              <div className={styles.header} data-menu-header>
                {header}
              </div>
            )}
            <div className={styles.content}>{body}</div>
          </MenuKindContext.Provider>
          {footer !== undefined && footer !== null && <div className={styles.footer}>{footer}</div>}
        </div>
      )}
    </>
  );
}
