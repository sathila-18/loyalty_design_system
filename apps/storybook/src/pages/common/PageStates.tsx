import { FinEmptyState, FinNotificationBanner, FinSnackbar, FinSnackbarRegion } from '@finspace-loyalty/ui';
import type { PageNotice } from './pageApi';

/**
 * The shared negative states (code first, no Figma; decided 27 Oct 2026; DESIGN.md §8.6, Pages/Common states). Every
 * list page uses these, so the wording and look are the same everywhere.
 */

/** The list couldn't load: it replaces the table (FinTable `empty`), with Try again. The page hides its toolbar. */
export function LoadError({ items, onRetry }: { items: string; onRetry: () => void }) {
  return (
    <FinEmptyState
      icon="warning"
      heading={`Couldn't load ${items}`}
      description="Something went wrong on our side. Try again in a moment."
      action={{ label: 'Try again', onClick: onRetry }}
    />
  );
}

/** The connection is down: above the table (and at the top of an open form) until it's back. Changes are off. */
export function ConnectionError() {
  return (
    <FinNotificationBanner tone="error" role="alert">
      Network or server error. Nothing you change can be saved until the connection is back.
    </FinNotificationBanner>
  );
}

/** A save failed: at the top of the form, which keeps what was typed. Save works again straight away. */
export function SaveError() {
  return (
    <FinNotificationBanner tone="error" role="alert">
      Network or server error. Couldn&apos;t save your changes. Check your connection and try again.
    </FinNotificationBanner>
  );
}

/** The page's snackbars, at the top right: successes close themselves; an error with Try again stays until closed. */
export function PageNotices({ notices, onDismiss }: { notices: PageNotice[]; onDismiss: (id: number) => void }) {
  return (
    <FinSnackbarRegion>
      {notices.map((notice) => (
        <FinSnackbar
          key={notice.id}
          tone={notice.tone}
          onClose={() => onDismiss(notice.id)}
          {...(notice.action
            ? {
                action: {
                  label: notice.action.label,
                  onClick: () => {
                    onDismiss(notice.id);
                    notice.action?.onClick();
                  },
                },
              }
            : {})}
        >
          {notice.text}
        </FinSnackbar>
      ))}
    </FinSnackbarRegion>
  );
}
