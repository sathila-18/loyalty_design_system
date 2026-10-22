'use client';

import { finBreakpoint } from '@finspace-loyalty/tokens/breakpoints';
import { useEffect, useId, useRef, useState, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { FinHeader, type FinHeaderProps } from '../Header';
import { FinSideNav, type FinSideNavProps, type FinSideNavType } from '../SideNav';
import styles from './FinAppShell.module.css';

export interface FinAppShellProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The side nav (FinSideNav's props). Its collapse is the shell's: below 1280 it's minimized, from 1280 expanded. */
  sideNav: Omit<FinSideNavProps, 'type' | 'defaultType' | 'onTypeChange'>;
  /** The page header (FinHeader's props), fixed at the top of the content panel. */
  header: FinHeaderProps;
  /** The page's content, in the `main` landmark. */
  children: ReactNode;
  /** Called when the side nav expands or collapses (the window crossing 1280, or its collapse button). */
  onSideNavTypeChange?: (type: FinSideNavType) => void;
  /** The skip link's text. Default "Skip to content". */
  skipLabel?: string;
}

/**
 * The page shell (code only, DESIGN.md §9): a "Skip to content" link, the side nav (`nav`), and a white content panel
 * with the header (`header`, the banner) fixed at its top and the page's `main` content scrolling under it. The side
 * nav is collapsed below 1280 and expanded from 1280; its collapse button changes it until the window crosses 1280
 * again. The shell fills the window. **Public**: the real app uses it.
 */
export function FinAppShell({ sideNav, header, children, onSideNavTypeChange, skipLabel = 'Skip to content', className, ...rest }: FinAppShellProps) {
  const mainId = useId();
  const mainRef = useRef<HTMLElement>(null);
  const [navType, setNavType] = useState<FinSideNavType>('expanded');

  // The latest callback, for the width listener set up once below.
  const onTypeChangeRef = useRef(onSideNavTypeChange);
  useEffect(() => {
    onTypeChangeRef.current = onSideNavTypeChange;
  });

  const changeNavType = (next: FinSideNavType) => {
    setNavType(next);
    onTypeChangeRef.current?.(next);
  };

  // Collapsed below 1280, expanded from 1280 (DESIGN.md §2 rule 4); crossing 1280 resets a choice made with the button.
  useEffect(() => {
    const query = window.matchMedia(finBreakpoint.lg);
    const update = () => {
      const next: FinSideNavType = query.matches ? 'expanded' : 'minimized';
      setNavType(next);
      onTypeChangeRef.current?.(next);
    };
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  // The link moves focus to the content (and keeps the address bar as it is).
  const skip = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    mainRef.current?.focus();
  };

  return (
    <div {...rest} className={className ? `${styles.shell} ${className}` : styles.shell}>
      <a href={`#${mainId}`} className={styles.skip} onClick={skip}>
        {skipLabel}
      </a>
      <FinSideNav {...sideNav} type={navType} onTypeChange={changeNavType} />
      <div className={styles.panel}>
        <FinHeader {...header} />
        {/* A tab stop: the content scrolls on its own, so keyboard users can reach it to scroll it (WCAG 2.1.1). */}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a scrollable region must be focusable */}
        <main ref={mainRef} id={mainId} tabIndex={0} className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  );
}
