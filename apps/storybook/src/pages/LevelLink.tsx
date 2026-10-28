import { createContext, useContext, type AnchorHTMLAttributes, type ReactNode } from 'react';

const NavigateContext = createContext<(href: string) => void>(() => undefined);

/** Gives the page's level links (`LevelLink`) where to go: `navigate(href)` switches the page's level. */
export function LevelLinkProvider({ navigate, children }: { navigate: (href: string) => void; children: ReactNode }) {
  return <NavigateContext.Provider value={navigate}>{children}</NavigateContext.Provider>;
}

/**
 * A table link into a page's next level (FinTable column `linkAs`; Focus areas' "5 lessons", Reports' active balance):
 * it reads and looks like a link, but a click switches the page's level (`LevelLinkProvider`) instead of leaving it.
 */
export function LevelLink({ href, children, onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const navigate = useContext(NavigateContext);
  return (
    <a
      {...rest}
      href={href}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
        if (href) navigate(href);
      }}
    >
      {children}
    </a>
  );
}
