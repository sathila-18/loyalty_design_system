import { useState } from 'react';
import { FinAppShell, FinAvatar, FinDialog, FinEmptyState, FinTable, type FinTableColumn, type FinTableFilters } from '@finspace-loyalty/ui';
import { useBackOnline, useFlakyCall, usePageLoad, usePageNotices, type PageApi } from '../common/pageApi';
import { ConnectionError, LoadError, PageNotices } from '../common/PageStates';
import pageStyles from '../common/PageStates.module.css';
import { PAGE_TABLE_VARIANT, usePageSideNav } from '../pageShell';
import { RecordDetails } from '../RecordDetails';
import { BadgeForm } from './BadgeForm';
import type { Badge } from './badgeModel';

export interface BadgesProps {
  badges: Badge[];
  /** Called with what the admin did (an action from the toolbar or a row), so stories can show it. */
  onAction?: (action: string) => void;
  /** The fake API: loading, failures and the connection (Pages/Common states). Default: everything works at once. */
  api?: PageApi;
}

const statusOf = (b: Badge) => (b.active ? 'Active' : 'Inactive');

/** The list's columns; the details sheet shows each one as a row. */
const columns: FinTableColumn<Badge>[] = [
  { key: 'id', header: 'ID', width: 120, value: (b) => String(b.id).padStart(2, '0') },
  // The icon before the name, in one cell, as the screen (32, FinAvatar small; decorative: the name is next to it).
  { key: 'name', header: 'Badge name', minWidth: 240, leading: (b) => <FinAvatar type="image" size="small" src={b.icon.url} /> },
  {
    key: 'status',
    header: 'Status',
    width: 176,
    type: 'badge',
    value: statusOf,
    // Inactive is switched off, not an error (decided 27 Oct 2026, as Tier management): neutral.
    badgeTone: (b) => (b.active ? 'success' : 'neutral'),
    filter: { options: ['Active', 'Inactive'].map((s) => ({ value: s, label: s })), value: statusOf },
  },
];

/**
 * Pages → Gamification → Badges (Figma section `57:14322`, DESIGN.md §8.6): the badges members earn, built as the
 * other list pages: search (decided 28 Oct 2026; the screen has none), a filter on the Status column, the ⋮ menu
 * (View, Edit, Remove) for the screen's round buttons. View or a row click opens the details. Add badge and Edit open
 * the badge sheet (`428:51250`): the icon (FinFileUpload), the name, Active. Remove asks in a dialog (`428:52089`)
 * and then shows a snackbar (`428:52801`). Empty states and the Common states (`api`) as the other pages.
 */
export function Badges({ badges: initialBadges, onAction = () => undefined, api = {} }: BadgesProps) {
  const sideNav = usePageSideNav('#gamification/badges');
  const [badges, setBadges] = useState(initialBadges);
  const [viewing, setViewing] = useState<Badge | null>(null);
  // Each Add or Edit starts a fresh form (the sheet remounts); the sheet keeps its badge while it closes.
  const [sheet, setSheet] = useState<{ key: number; open: boolean; badge?: Badge }>({ key: 0, open: false });
  const [removing, setRemoving] = useState<{ badge: Badge; open: boolean } | null>(null);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<FinTableFilters>({});
  const { notices, notify, dismiss } = usePageNotices();
  const { status, retry } = usePageLoad(api.load);
  const online = api.online ?? true;
  const saveCall = useFlakyCall(api.save);
  const removeCall = useFlakyCall(api.remove);
  useBackOnline(online, () => notify({ text: "You're back online", tone: 'success' }));

  const searched = query.trim();
  const rows = badges.filter((b) => b.name.toLowerCase().includes(searched.toLowerCase()));

  const add = () => {
    onAction('Add badge');
    setSheet((c) => ({ key: c.key + 1, open: true }));
  };
  const edit = (badge: Badge) => {
    onAction(`Edit: ${badge.name}`);
    setViewing(null);
    setSheet((c) => ({ key: c.key + 1, open: true, badge }));
  };
  const askRemove = (badge: Badge) => {
    onAction(`Remove: ${badge.name}`);
    setViewing(null);
    setRemoving({ badge, open: true });
  };
  const closeRemove = () => setRemoving((current) => current && { ...current, open: false });
  const remove = (badge: Badge) => {
    if (!removeCall()) {
      notify({ text: `Couldn't remove the “${badge.name}” badge`, tone: 'error', action: { label: 'Try again', onClick: () => remove(badge) } });
      return;
    }
    onAction(`Removed: ${badge.name}`);
    setBadges((current) => current.filter((b) => b.id !== badge.id));
    notify({ text: 'Badge removed successfully', tone: 'success' });
  };

  const empty =
    badges.length === 0 ? (
      <FinEmptyState
        icon="loyalty"
        heading="No badges yet"
        description="Add a badge members can earn, for example by completing a focus area."
        action={{ label: 'Add badge', leadingIcon: 'add', onClick: add }}
      />
    ) : (
      <FinEmptyState
        size="small"
        icon="search"
        heading={searched ? `No badges match “${searched}”` : 'No badges match the filter'}
        description={searched ? 'Check the spelling, or clear the search and filters.' : 'Clear the filter to see every badge.'}
        action={{
          label: searched ? 'Clear search and filters' : 'Clear filter',
          onClick: () => {
            setQuery('');
            setFilters({});
          },
        }}
      />
    );

  const editing = sheet.badge;

  return (
    <FinAppShell
      sideNav={sideNav}
      header={{ heading: 'Badges', bodyContent: 'Badges members earn as they use the programme', backButton: false, notificationProps: { notification: 'number', count: 120 } }}
    >
      <div className={pageStyles.page}>
        {!online && <ConnectionError />}
        <FinTable
          label="Badges"
          variant={PAGE_TABLE_VARIANT}
          columns={columns}
          rows={status === 'ready' ? rows : []}
          loading={status === 'loading'}
          getRowId={(b) => b.id}
          getRowLabel={(b) => b.name}
          onRowClick={setViewing}
          rowActions={(b) => [
            { label: 'View', icon: 'visibility', onSelect: () => setViewing(b) },
            { label: 'Edit', icon: 'edit', onSelect: () => edit(b), disabled: !online },
            { label: 'Remove', icon: 'delete', onSelect: () => askRemove(b), separator: true, destructive: true, disabled: !online },
          ]}
          // No toolbar until the list has loaded (decided 27 Oct 2026).
          {...(status === 'ready'
            ? {
                toolbar: {
                  search: { label: 'Search badge', placeholder: 'Search badge', value: query, onChange: (e) => setQuery(e.target.value) },
                  actionLabel: 'Add badge',
                  onAction: add,
                  actionDisabled: !online,
                },
              }
            : {})}
          filters={filters}
          onFiltersChange={setFilters}
          empty={status === 'error' ? <LoadError items="badges" onRetry={retry} /> : empty}
        />
      </div>
      <BadgeForm
        key={sheet.key}
        open={sheet.open}
        {...(editing ? { badge: editing } : {})}
        takenNames={badges.filter((b) => b.id !== editing?.id).map((b) => b.name)}
        offline={!online}
        onClose={() => setSheet((c) => ({ ...c, open: false }))}
        onSave={(values) => {
          if (!saveCall()) return false;
          if (editing) setBadges((current) => current.map((b) => (b.id === editing.id ? { ...b, ...values } : b)));
          // At the top, so it shows on the first page.
          else setBadges((current) => [{ id: current.reduce((max, b) => Math.max(max, b.id), 0) + 1, ...values }, ...current]);
          onAction(`Saved: ${values.name}`);
          notify({ text: `Badge ${editing ? 'saved' : 'added'} successfully`, tone: 'success' });
        }}
      />
      <RecordDetails
        record={viewing}
        getName={(b) => b.name}
        columns={columns}
        onClose={() => setViewing(null)}
        onEdit={edit}
        onRemove={askRemove}
        actionsDisabled={!online}
      />
      <FinDialog
        open={removing?.open ?? false}
        onClose={closeRemove}
        title="Remove badge"
        secondaryButton={{ label: 'Cancel', onClick: closeRemove }}
        primaryButton={{
          label: 'Remove',
          tone: 'destructive',
          onClick: () => {
            if (!removing) return;
            closeRemove();
            remove(removing.badge);
          },
        }}
      >
        {`Are you sure you want to remove the “${removing?.badge.name ?? ''}” badge?`}
      </FinDialog>
      <PageNotices notices={notices} onDismiss={dismiss} />
    </FinAppShell>
  );
}
