import { useState } from 'react';
import {
  FinAppShell,
  FinAssistChip,
  FinEmptyState,
  FinListStandard,
  FinMenu,
  FinStatCard,
  FinTable,
  type FinTableColumn,
  type FinTableFilters,
} from '@finspace-loyalty/ui';
import { NOT_AVAILABLE } from '../common/format';
import { useBackOnline, usePageLoad, usePageNotices, type PageApi } from '../common/pageApi';
import { ConnectionError, LoadError, PageNotices } from '../common/PageStates';
import pageStyles from '../common/PageStates.module.css';
import { LevelLink, LevelLinkProvider } from '../LevelLink';
import { pageSideNav } from '../pageShell';
import { ACTIVITY_TYPES, SEGMENTS, TIERS, activeBalance, number, shortDate, signed, type Activity, type Customer, type Segment } from './reportModel';
import styles from './Reports.module.css';

export interface ReportsProps {
  customers: Customer[];
  /** Start in a customer's points history (their `id`). Default: the customer list. */
  initialCustomerId?: number;
  /** Called with what the admin did, so stories can show it. */
  onAction?: (action: string) => void;
  /** The fake API: loading and the connection (Pages/Common states). Default: everything works at once. */
  api?: PageApi;
}

const ALL_SEGMENTS = 'All segments';
const customerHref = (c: Customer) => `#reports/customers/${c.id}`;
const sum = (customers: Customer[], pick: (c: Customer) => number) => number(customers.reduce((total, c) => total + pick(c), 0));

/** The customer list's columns (Figma `435:90575`). */
const customerColumns: FinTableColumn<Customer>[] = [
  { key: 'no', header: 'No.', width: 96, value: (c) => String(c.id).padStart(2, '0') },
  { key: 'name', header: 'Customer', minWidth: 200 },
  // The screen's "Tier: All" chip, as the column's filter (decided 28 Oct 2026, as the other pages).
  { key: 'tier', header: 'Tier', width: 144, filter: { options: TIERS.map((t) => ({ value: t, label: t })) } },
  { key: 'earned', header: 'Earned', width: 128, value: (c) => number(c.earned) },
  { key: 'redeemed', header: 'Redeemed', width: 128, value: (c) => number(c.redeemed) },
  { key: 'converted', header: 'Converted', width: 128, value: (c) => number(c.converted) },
  { key: 'expired', header: 'Expired', width: 128, value: (c) => number(c.expired) },
  // Opens the customer's points history, as View (decided 28 Oct 2026).
  { key: 'balance', header: 'Active balance', width: 160, type: 'link', value: (c) => number(activeBalance(c)), href: customerHref, linkAs: LevelLink },
  { key: 'last', header: 'Last activity', width: 152, value: (c) => shortDate(c.lastActivity) },
];

/** A customer's history columns (Figma `440:94624`). */
const activityColumns: FinTableColumn<Activity>[] = [
  { key: 'no', header: 'No.', width: 96, value: (a) => String(a.id).padStart(2, '0') },
  // The screen's "Type: All" chip, as the column's filter.
  { key: 'type', header: 'Type', width: 200, filter: { options: ACTIVITY_TYPES.map((t) => ({ value: t, label: t })) } },
  { key: 'description', header: 'Description', minWidth: 240 },
  { key: 'points', header: 'Points', width: 144, value: (a) => signed(a.points) },
  { key: 'balance', header: 'Active balance', width: 160, value: (a) => number(a.balance) },
  { key: 'lifetime', header: 'Lifetime', width: 144, value: (a) => number(a.lifetime) },
];

/**
 * Pages → Report management → Reports (Figma section `162:18060`, DESIGN.md §8.6): customers' points, read only. The
 * summary cards (FinStatCard) over the customer table: search by name or number, Segment as an Assist chip with a
 * select menu (no column to filter), Tier as the column's filter; View in the ⋮ menu, a row click or the Active
 * balance opens the customer's **points history** (`440:94624`): their cards and activity, Type as the column's
 * filter; the header's back button returns. The screens' Consumption type chip is dropped and Duration waits for a
 * custom date range (decided 28 Oct 2026).
 */
export function Reports({ customers, initialCustomerId, onAction = () => undefined, api = {} }: ReportsProps) {
  const [customerId, setCustomerId] = useState<number | null>(initialCustomerId ?? null);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<FinTableFilters>({});
  const [segment, setSegment] = useState<Segment | typeof ALL_SEGMENTS>(ALL_SEGMENTS);
  const { notices, notify, dismiss } = usePageNotices();
  const { status, retry } = usePageLoad(api.load);
  const online = api.online ?? true;
  useBackOnline(online, () => notify({ text: "You're back online", tone: 'success' }));

  const customer = customers.find((c) => c.id === customerId) ?? null;
  const searched = query.trim();
  const search = searched.toLowerCase();

  const open = (c: Customer) => {
    onAction(`View: ${c.name}`);
    setCustomerId(c.id);
    setQuery('');
    setFilters({});
  };
  const back = () => {
    setCustomerId(null);
    setQuery('');
    setFilters({});
  };
  const navigate = (href: string) => {
    const id = Number(href.split('/').pop());
    const target = customers.find((c) => c.id === id);
    if (target) open(target);
  };
  const clear = () => {
    setQuery('');
    setFilters({});
    setSegment(ALL_SEGMENTS);
  };
  const noMatches = (items: string, filtered: boolean) => (
    <FinEmptyState
      size="small"
      icon="search"
      heading={searched ? `No ${items} match “${searched}”` : `No ${items} match the filters`}
      description={searched ? 'Check the spelling, or clear the search and filters.' : 'Clear the filters to see everything.'}
      action={{ label: searched || filtered ? 'Clear search and filters' : 'Clear filters', onClick: clear }}
    />
  );

  let header;
  let content;
  if (customer) {
    const rows = customer.history.filter((a) => a.description.toLowerCase().includes(search) || a.type.toLowerCase().includes(search));
    header = { heading: customer.name, bodyContent: 'Reports › Points history', backButton: true, onBack: back, backLabel: 'Back to reports' };
    content = (
      <>
        <div className={styles.stats}>
          <FinStatCard label="Active points" value={number(activeBalance(customer))} />
          <FinStatCard label="Lifetime points" value={number(customer.earned)} />
          <FinStatCard label="Next expiry" value={customer.nextExpiry ? `${number(customer.nextExpiry.points)} pts on ${shortDate(customer.nextExpiry.date)}` : NOT_AVAILABLE} />
        </div>
        <FinTable
          // A new table per level, so it starts scrolled to the left (not where the list was scrolled, at narrow widths).
          key={`history-${customer.id}`}
          label={`${customer.name}'s points history`}
          columns={activityColumns}
          rows={rows}
          getRowId={(a) => a.id}
          getRowLabel={(a) => `${a.type}: ${a.description}`}
          toolbar={{ search: { label: 'Search activity', placeholder: 'Search activity', value: query, onChange: (e) => setQuery(e.target.value) } }}
          filters={filters}
          onFiltersChange={setFilters}
          empty={
            customer.history.length === 0 ? (
              <FinEmptyState icon="loyalty" heading="No activity yet" description={`${customer.name} hasn't earned or used any points yet.`} />
            ) : (
              noMatches('activities', true)
            )
          }
        />
      </>
    );
  } else {
    const rows = customers.filter(
      (c) => (segment === ALL_SEGMENTS || c.segment === segment) && (c.name.toLowerCase().includes(search) || String(c.id).padStart(2, '0').includes(search)),
    );
    header = { heading: 'Reports', bodyContent: 'Points earned, redeemed, converted and expired, by customer', backButton: false };
    content = (
      <>
        {/* For the whole programme (every customer), not the filtered rows. */}
        <div className={styles.stats}>
          <FinStatCard label="Total points" value={sum(customers, (c) => c.earned)} />
          <FinStatCard label="Reward redemption (pts)" value={sum(customers, (c) => c.redeemed)} />
          <FinStatCard label="Cash conversion (pts)" value={sum(customers, (c) => c.converted)} />
          <FinStatCard label="Points expired" value={sum(customers, (c) => c.expired)} />
        </div>
        <FinTable
          key="customers"
          label="Customers"
          columns={customerColumns}
          rows={status === 'ready' ? rows : []}
          loading={status === 'loading'}
          getRowId={(c) => c.id}
          getRowLabel={(c) => c.name}
          onRowClick={open}
          rowActions={(c) => [{ label: 'View', icon: 'visibility', onSelect: () => open(c) }]}
          // No toolbar until the list has loaded (decided 27 Oct 2026).
          {...(status === 'ready'
            ? {
                toolbar: {
                  search: { label: 'Search customer name or number', placeholder: 'Search customer name or number', value: query, onChange: (e) => setQuery(e.target.value) },
                  // Segment has no column, so it stays the screen's chip: an Assist chip with a select menu.
                  filters: (
                    <FinMenu
                      kind="select"
                      label="Segment"
                      placement="bottom-end"
                      trigger={(menuProps) => (
                        <FinAssistChip {...menuProps} size="large" dropdown expanded={menuProps['aria-expanded']}>
                          {segment}
                        </FinAssistChip>
                      )}
                    >
                      {[ALL_SEGMENTS, ...SEGMENTS].map((s) => (
                        <FinListStandard
                          key={s}
                          as="li"
                          size="small"
                          behavior="option"
                          divider={false}
                          title={s}
                          selected={s === segment}
                          onClick={() => setSegment(s as Segment | typeof ALL_SEGMENTS)}
                        />
                      ))}
                    </FinMenu>
                  ),
                },
              }
            : {})}
          filters={filters}
          onFiltersChange={setFilters}
          empty={
            status === 'error' ? (
              <LoadError items="customers" onRetry={retry} />
            ) : customers.length === 0 ? (
              <FinEmptyState icon="loyalty" heading="No customers yet" description="Customers show here once they earn or use points." />
            ) : (
              noMatches('customers', segment !== ALL_SEGMENTS)
            )
          }
        />
      </>
    );
  }

  return (
    <LevelLinkProvider navigate={navigate}>
      <FinAppShell sideNav={pageSideNav('#reports')} header={{ ...header, notificationProps: { notification: 'number', count: 120 } }}>
        <div className={pageStyles.page}>
          {!online && <ConnectionError />}
          {content}
        </div>
        <PageNotices notices={notices} onDismiss={dismiss} />
      </FinAppShell>
    </LevelLinkProvider>
  );
}
