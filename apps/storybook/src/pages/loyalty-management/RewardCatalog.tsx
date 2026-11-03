import { useState } from 'react';
import { FinAppShell, FinDialog, FinEmptyState, FinTable, type FinBadgeTone, type FinTableColumn, type FinTableFilters } from '@finspace-loyalty/ui';
import { useBackOnline, useFlakyCall, usePageLoad, usePageNotices, type PageApi } from '../common/pageApi';
import { NOT_AVAILABLE } from '../common/format';
import { ConnectionError, LoadError, PageNotices } from '../common/PageStates';
import { PAGE_TABLE_VARIANT, usePageSideNav } from '../pageShell';
import { RecordDetails } from '../RecordDetails';
import styles from '../common/PageStates.module.css';
import { AddRewardForm } from './AddRewardForm';
import { REWARD_STATUSES, type Reward, type RewardStatus } from './rewards';

export interface RewardCatalogProps {
  rewards: Reward[];
  /** Called with what the admin did (an action from the toolbar or a row), so stories can show it. */
  onAction?: (action: string) => void;
  /** The fake API: loading, failures and the connection (Pages/Common states). Default: everything works at once. */
  api?: PageApi;
}

const BADGE_TONES: Record<RewardStatus, FinBadgeTone> = {
  Draft: 'secondary',
  Published: 'success',
  'Limit exceed': 'warning',
  Expired: 'error',
};

const number = (n: number) => n.toLocaleString('en-US');
const rewardId = (r: Reward) => `RW-${String(r.id).padStart(3, '0')}`;

/** The list's columns; the details sheet shows each one as a row. */
const columns: FinTableColumn<Reward>[] = [
  { key: 'id', header: 'ID', width: 120, value: rewardId },
  { key: 'name', header: 'Reward name', minWidth: 200 },
  { key: 'partner', header: 'Partner', minWidth: 160, value: (r) => r.partner ?? NOT_AVAILABLE },
  { key: 'limit', header: 'User limit', value: (r) => (r.userLimit === undefined ? NOT_AVAILABLE : number(r.userLimit)) },
  { key: 'users', header: 'Users', value: (r) => (r.users === undefined ? NOT_AVAILABLE : number(r.users)) },
  {
    key: 'status',
    header: 'Status',
    width: 176,
    type: 'badge',
    badgeTone: (r) => BADGE_TONES[r.status],
    filter: { options: REWARD_STATUSES.map((s) => ({ value: s, label: s })) },
  },
];

/**
 * Pages → Loyalty management → Reward catalog (Figma `349:18532`, DESIGN.md §8.6): the rewards members can redeem, in
 * the app shell. Built the same way as Programme configuration and Tier management: search by name, ID or partner,
 * filter from the Status column's dropdown (Figma's "Rewards: All" chip), act on a row from its ⋮ menu. View, or a
 * click on the row, opens the details sheet (code first). Remove asks in a dialog (`410:36648`) and then takes the row
 * out, with a Success snackbar (`410:37938`). Add reward opens the four-step Add reward side sheet (decided 28 Oct 2026;
 * the screens' page in a sheet); a saved reward joins the table as Published or Draft. Edit, in the ⋮ menu or the
 * details sheet, opens the same sheet with the reward's details (code first); Save updates the row. Empty states and the shared negative states (Pages/Common states, `api`) as on
 * the other pages.
 */
export function RewardCatalog({ rewards: initialRewards, onAction = () => undefined, api = {} }: RewardCatalogProps) {
  const sideNav = usePageSideNav('#loyalty/rewards');
  const [rewards, setRewards] = useState(initialRewards);
  const [viewing, setViewing] = useState<Reward | null>(null);
  // The dialog keeps the last reward while it closes, so its text doesn't change.
  const [removing, setRemoving] = useState<{ reward: Reward; open: boolean } | null>(null);
  const { notices, notify, dismiss } = usePageNotices();
  const { status, retry } = usePageLoad(api.load);
  const online = api.online ?? true;
  const removeCall = useFlakyCall(api.remove);
  const saveCall = useFlakyCall(api.save);
  // Each Add or Edit starts a fresh form (the sheet remounts); Edit keeps its reward while the sheet closes.
  const [adding, setAdding] = useState<{ key: number; open: boolean }>({ key: 0, open: false });
  const [editing, setEditing] = useState<{ reward: Reward; key: number; open: boolean } | null>(null);
  useBackOnline(online, () => notify({ text: "You're back online", tone: 'success' }));
  const [query, setQuery] = useState('');
  // The Status column's filter, kept here so the empty state can clear it.
  const [filters, setFilters] = useState<FinTableFilters>({});

  const search = query.trim().toLowerCase();
  const rows = rewards.filter((r) => [r.name, rewardId(r), r.partner ?? ''].some((text) => text.toLowerCase().includes(search)));

  const add = () => {
    onAction('Add reward');
    setAdding((current) => ({ key: current.key + 1, open: true }));
  };
  const edit = (reward: Reward) => {
    setViewing(null);
    onAction(`Edit: ${reward.name}`);
    setEditing((current) => ({ reward, open: true, key: (current?.key ?? 0) + 1 }));
  };
  const searched = query.trim();
  const empty =
    rewards.length === 0 ? (
      <FinEmptyState
        icon="loyalty"
        heading="No rewards yet"
        description="Add a reward for members to redeem with their points."
        action={{ label: 'Add reward', leadingIcon: 'add', onClick: add }}
      />
    ) : (
      <FinEmptyState
        size="small"
        icon="search"
        heading={searched ? `No rewards match “${searched}”` : 'No rewards match the filter'}
        description={searched ? 'Check the spelling, or clear the search and filters.' : 'Clear the filter to see every reward.'}
        action={{
          label: searched ? 'Clear search and filters' : 'Clear filter',
          onClick: () => {
            setQuery('');
            setFilters({});
          },
        }}
      />
    );

  const askRemove = (reward: Reward) => {
    onAction(`Remove: ${reward.name}`);
    setViewing(null);
    setRemoving({ reward, open: true });
  };
  const closeRemove = () => setRemoving((current) => current && { ...current, open: false });
  const remove = (reward: Reward) => {
    if (!removeCall()) {
      notify({
        text: `Couldn't remove the “${reward.name}” reward`,
        tone: 'error',
        action: { label: 'Try again', onClick: () => remove(reward) },
      });
      return;
    }
    onAction(`Removed: ${reward.name}`);
    setRewards((current) => current.filter((r) => r.id !== reward.id));
    notify({ text: 'Reward removed successfully', tone: 'success' });
  };

  return (
    <FinAppShell
      sideNav={sideNav}
      header={{
        heading: 'Reward catalog',
        bodyContent: 'Rewards members can redeem with their points',
        backButton: false,
        notificationProps: { notification: 'number', count: 120 },
      }}
    >
      <div className={styles.page}>
        {!online && <ConnectionError />}
        <FinTable
          label="Rewards"
          variant={PAGE_TABLE_VARIANT}
          columns={columns}
          rows={status === 'ready' ? rows : []}
          loading={status === 'loading'}
          getRowId={(r) => r.id}
          getRowLabel={(r) => r.name}
          onRowClick={setViewing}
          rowActions={(r) => [
            { label: 'View', icon: 'visibility', onSelect: () => setViewing(r) },
            { label: 'Edit', icon: 'edit', onSelect: () => edit(r), disabled: !online },
            { label: 'Remove', icon: 'delete', onSelect: () => askRemove(r), separator: true, destructive: true, disabled: !online },
          ]}
          // No toolbar until the list has loaded (decided 27 Oct 2026).
          {...(status === 'ready'
            ? {
                toolbar: {
                  search: { label: 'Search reward', placeholder: 'Search reward', value: query, onChange: (e) => setQuery(e.target.value) },
                  actionLabel: 'Add reward',
                  onAction: add,
                  actionDisabled: !online,
                },
              }
            : {})}
          filters={filters}
          onFiltersChange={setFilters}
          empty={status === 'error' ? <LoadError items="rewards" onRetry={retry} /> : empty}
        />
      </div>
      <RecordDetails
        record={viewing}
        getName={(r) => r.name}
        columns={columns}
        onClose={() => setViewing(null)}
        onEdit={edit}
        onRemove={askRemove}
        actionsDisabled={!online}
      />
      <AddRewardForm
        key={adding.key}
        open={adding.open}
        onClose={() => setAdding((current) => ({ ...current, open: false }))}
        offline={!online}
        onSave={(values) => {
          if (!saveCall()) return false;
          const id = rewards.reduce((max, r) => Math.max(max, r.id), 0) + 1;
          const { details, status = 'Draft', ...shown } = values;
          // At the top, so it shows on the first page.
          setRewards((current) => [{ id, ...shown, status, details }, ...current]);
          onAction(`${values.status === 'Draft' ? 'Saved as draft' : 'Published'}: ${values.name}`);
          notify({ text: values.status === 'Draft' ? 'Reward saved as draft' : 'Reward published successfully', tone: 'success' });
        }}
      />
      {editing && (
        <AddRewardForm
          key={`edit-${editing.key}`}
          open={editing.open}
          reward={editing.reward}
          onClose={() => setEditing({ ...editing, open: false })}
          offline={!online}
          onSave={({ name, partner, userLimit, details }) => {
            if (!saveCall()) return false;
            // The reward keeps its status, ID and users; a cleared partner or limit goes back to "N/A".
            setRewards((current) => current.map((r) => (r.id === editing.reward.id ? { id: r.id, status: r.status, ...(r.users === undefined ? {} : { users: r.users }), name, ...(partner ? { partner } : {}), ...(userLimit === undefined ? {} : { userLimit }), details } : r)));
            onAction(`Saved: ${name}`);
            notify({ text: 'Reward saved successfully', tone: 'success' });
          }}
        />
      )}
      <FinDialog
        open={removing?.open ?? false}
        onClose={closeRemove}
        title="Remove reward"
        secondaryButton={{ label: 'Cancel', onClick: closeRemove }}
        primaryButton={{
          label: 'Remove',
          tone: 'destructive',
          onClick: () => {
            if (!removing) return;
            closeRemove();
            remove(removing.reward);
          },
        }}
      >
        {`Are you sure you want to remove the “${removing?.reward.name ?? ''}” reward?`}
      </FinDialog>
      <PageNotices notices={notices} onDismiss={dismiss} />
    </FinAppShell>
  );
}
