import type { AnchorHTMLAttributes } from 'react';

/**
 * A table link whose destination isn't decided yet (FinTable column `linkAs`; decided 27 Oct 2026): it looks and
 * reads as a link, but a click does nothing (and doesn't open the row). Swap it for the real link when design names
 * where it goes.
 */
export function PendingLink({ href, children, onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...rest}
      href={href}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
