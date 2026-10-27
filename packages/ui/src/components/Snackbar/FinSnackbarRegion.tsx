'use client';

import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import styles from './FinSnackbar.module.css';

export interface FinSnackbarRegionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The FinSnackbars to show. The last one is the newest and shows on top. */
  children?: ReactNode;
  /** The region's name for screen readers (default "Notifications"). */
  label?: string;
}

/**
 * Where snackbars appear (code only, decided 27 Oct 2026; DESIGN.md §9): the top right of the window, Space-3XL from
 * the top and the right edge, 3 columns of the layout grid wide but at least 343, above the page (the top layer, as a manual
 * popover). Several stack, the newest on top. A polite live region that stays in the page, so each snackbar added is
 * read out. Keep it mounted and put the snackbars in it.
 */
export function FinSnackbarRegion({ children, label = 'Notifications', className, ...rest }: FinSnackbarRegionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const region = ref.current;
    // Older browsers and jsdom have no popover: the region stays fixed in the page instead.
    if (region && typeof region.showPopover === 'function' && !region.matches(':popover-open')) region.showPopover();
  }, []);

  return (
    <div
      {...rest}
      ref={ref}
      popover="manual"
      role="region"
      aria-live="polite"
      aria-label={label}
      className={className ? `${styles.region} ${className}` : styles.region}
    >
      {children}
    </div>
  );
}
