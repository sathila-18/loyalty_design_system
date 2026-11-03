import { useState } from 'react';
import {
  FinAppShell,
  FinDialog,
  FinEmptyState,
  FinSnackbar,
  FinSnackbarRegion,
  FinTable,
  type FinTableColumn,
  type FinTableFilters,
} from '@finspace-loyalty/ui';
import { PAGE_TABLE_VARIANT, usePageSideNav } from '../pageShell';
import { PendingLink } from '../PendingLink';
import { RecordDetails } from '../RecordDetails';
import { TierForm, type TierValues } from './TierForm';
import { TIER_LEVELS, type Tier } from './tiers';

export interface TierManagementProps {
  tiers: Tier[];
  /** Called with what the admin did (an action from the toolbar or a row), so stories can show it. */
  onAction?: (action: string) => void;
}

const number = (n: number) => n.toLocaleString('en-US');
const multiplier = (n: number) => `${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}×`;
const status = (active: boolean) => (active ? 'Active' : 'Inactive');
/** Lowest level first; within a level, the lowest upgrade threshold first. */
const byLevel = (a: Tier, b: Tier) => TIER_LEVELS.indexOf(a.level) - TIER_LEVELS.indexOf(b.level) || a.upgradeThreshold - b.upgradeThreshold;

/** The link columns go nowhere yet (decided 27 Oct 2026): design will say where. */
const pending = { type: 'link', href: () => '#', linkAs: PendingLink } as const;

/** The list's columns; the details sheet shows each one as a row. */
const columns: FinTableColumn<Tier>[] = [
  { key: 'no', header: 'No.', width: 80, value: (t) => String(t.id).padStart(2, '0') },
  // Level before Tier name, as the screen (decided 27 Oct 2026); filtered by level, lowest first.
  { key: 'level', header: 'Level', filter: { options: TIER_LEVELS.map((level) => ({ value: level, label: level })) } },
  { key: 'name', header: 'Tier name', minWidth: 176, ...pending },
  { key: 'upgrade', header: 'Upgrade threshold (pts)', width: 216, value: (t) => number(t.upgradeThreshold), ...pending },
  { key: 'downgrade', header: 'Downgrade threshold (pts)', width: 232, value: (t) => number(t.downgradeThreshold), ...pending },
  { key: 'multiplier', header: 'Earn multiplier', value: (t) => multiplier(t.earnMultiplier), ...pending },
  {
    key: 'status',
    header: 'Status',
    type: 'badge',
    value: (t) => status(t.active),
    // Inactive is switched off, not an error (decided 27 Oct 2026): neutral, as Programme configuration's Disable.
    badgeTone: (t) => (t.active ? 'success' : 'neutral'),
    filter: { options: [true, false].map((active) => ({ value: status(active), label: status(active) })) },
  },
];

/**
 * Pages → Loyalty management → Tier management (Figma `152:6162`, DESIGN.md §8.6): the tiers, sorted by level, in
 * the app shell. Built the same way as Programme configuration: search by tier name, filter from the
 * Level and Status columns' dropdowns, act on a row from its ⋮ menu (Figma's inline action buttons wait for its action cell,
 * decided 27 Oct 2026). The tier name, thresholds and multiplier are links with no destination yet. Add opens the add
 * side sheet (`345:14560`); a saved tier is added to the table. View, or a click on the row, opens the details sheet
 * (code first). Edit, in the row menu or the details sheet, opens the same form with the row's values (code first).
 * Remove asks in a dialog (`347:16831`) and then takes the row out, with a Success snackbar (`347:17774`). With
 * nothing to show, an empty state replaces the table (code first).
 */
export function TierManagement({ tiers: initialTiers, onAction = () => undefined }: TierManagementProps) {
  const sideNav = usePageSideNav('#loyalty/tiers');
  const [tiers, setTiers] = useState(initialTiers);
  const [adding, setAdding] = useState(false);
  const [viewing, setViewing] = useState<Tier | null>(null);
  // The edit sheet stays mounted after it closes (so focus goes back); `key` gives each opening fresh values.
  const [editing, setEditing] = useState<{ tier: Tier; open: boolean; key: number } | null>(null);
  // The dialog keeps the last tier while it closes, so its text doesn't change.
  const [removing, setRemoving] = useState<{ tier: Tier; open: boolean } | null>(null);
  // Snackbars, newest last; each closes itself or with its close button.
  const [notices, setNotices] = useState<{ id: number; text: string }[]>([]);
  const [query, setQuery] = useState('');
  // The Level and Status columns' filters, kept here so the empty state can clear them.
  const [filters, setFilters] = useState<FinTableFilters>({});

  const search = query.trim().toLowerCase();
  const rows = tiers.filter((t) => t.name.toLowerCase().includes(search)).sort(byLevel);

  const add = () => {
    onAction('Add tier');
    setAdding(true);
  };
  const searched = query.trim();
  const several = Object.values(filters).filter((values) => values.length > 0).length > 1;
  const empty =
    tiers.length === 0 ? (
      <FinEmptyState
        icon="loyalty"
        heading="No tiers yet"
        description="Add a tier to set the points members need to reach it and how fast they earn there."
        action={{ label: 'Add tier', leadingIcon: 'add', onClick: add }}
      />
    ) : (
      <FinEmptyState
        size="small"
        icon="search"
        heading={searched ? `No tiers match “${searched}”` : several ? 'No tiers match the filters' : 'No tiers match the filter'}
        description={
          searched ? 'Check the spelling, or clear the search and filters.' : `Clear the ${several ? 'filters' : 'filter'} to see every tier.`
        }
        action={{
          label: searched ? 'Clear search and filters' : several ? 'Clear filters' : 'Clear filter',
          onClick: () => {
            setQuery('');
            setFilters({});
          },
        }}
      />
    );

  const edit = (tier: Tier) => {
    onAction(`Edit: ${tier.name}`);
    setViewing(null);
    setEditing((current) => ({ tier, open: true, key: (current?.key ?? 0) + 1 }));
  };
  const askRemove = (tier: Tier) => {
    onAction(`Remove: ${tier.name}`);
    setViewing(null);
    setRemoving({ tier, open: true });
  };
  const closeRemove = () => setRemoving((current) => current && { ...current, open: false });

  return (
    <FinAppShell
      sideNav={sideNav}
      header={{
        heading: 'Tier management',
        bodyContent: 'Thresholds and earn multipliers',
        backButton: false,
        notificationProps: { notification: 'number', count: 120 },
      }}
    >
      <FinTable
        label="Tiers"
        variant={PAGE_TABLE_VARIANT}
        columns={columns}
        rows={rows}
        getRowId={(t) => t.id}
        getRowLabel={(t) => t.name}
        onRowClick={setViewing}
        rowActions={(t) => [
          { label: 'View', icon: 'visibility', onSelect: () => setViewing(t) },
          { label: 'Edit', icon: 'edit', onSelect: () => edit(t) },
          { label: 'Remove', icon: 'delete', onSelect: () => askRemove(t), separator: true, destructive: true },
        ]}
        toolbar={{
          search: { label: 'Search tier', placeholder: 'Search tier', value: query, onChange: (e) => setQuery(e.target.value) },
          actionLabel: 'Add tier',
          onAction: add,
        }}
        filters={filters}
        onFiltersChange={setFilters}
        empty={empty}
      />
      <TierForm
        open={adding}
        onClose={() => setAdding(false)}
        tiers={tiers}
        onSave={(values: TierValues) => {
          onAction(`Saved: ${values.name}`);
          setTiers((current) => [...current, { ...values, id: Math.max(0, ...current.map((t) => t.id)) + 1 }]);
        }}
      />
      <RecordDetails record={viewing} getName={(t) => t.name} columns={columns} onClose={() => setViewing(null)} onEdit={edit} onRemove={askRemove} />
      {editing && (
        <TierForm
          key={editing.key}
          open={editing.open}
          onClose={() => setEditing({ ...editing, open: false })}
          tier={editing.tier}
          tiers={tiers}
          onSave={(values: TierValues) => {
            onAction(`Saved: ${values.name}`);
            setTiers((current) => current.map((t) => (t.id === editing.tier.id ? { ...t, ...values } : t)));
          }}
        />
      )}
      <FinDialog
        open={removing?.open ?? false}
        onClose={closeRemove}
        title="Remove tier"
        secondaryButton={{ label: 'Cancel', onClick: closeRemove }}
        primaryButton={{
          label: 'Remove',
          tone: 'destructive',
          onClick: () => {
            if (!removing) return;
            onAction(`Removed: ${removing.tier.name}`);
            setTiers((current) => current.filter((t) => t.id !== removing.tier.id));
            setNotices((current) => [...current, { id: Math.max(0, ...current.map((n) => n.id)) + 1, text: 'Tier removed successfully' }]);
            closeRemove();
          },
        }}
      >
        {`Are you sure you want to remove the “${removing?.tier.name ?? ''}” tier?`}
      </FinDialog>
      <FinSnackbarRegion>
        {notices.map((notice) => (
          <FinSnackbar key={notice.id} tone="success" onClose={() => setNotices((current) => current.filter((n) => n.id !== notice.id))}>
            {notice.text}
          </FinSnackbar>
        ))}
      </FinSnackbarRegion>
    </FinAppShell>
  );
}
