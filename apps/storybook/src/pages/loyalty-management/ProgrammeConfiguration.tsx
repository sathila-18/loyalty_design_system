import { useState } from 'react';
import { FinAppShell, FinDialog, FinSnackbar, FinSnackbarRegion, FinTable, type FinTableColumn } from '@finspace-loyalty/ui';
import { pageSideNav } from '../pageShell';
import { ProgrammeConfigurationDetails } from './ProgrammeConfigurationDetails';
import { ProgrammeConfigurationForm, type ProgrammeConfigValues } from './ProgrammeConfigurationForm';

/** One programme configuration: the loyalty and cash conversion rules for a customer segment. */
export interface ProgrammeConfig {
  id: number;
  segment: string;
  loyalty: boolean;
  /** Points expire after this many months. */
  expiryMonths: number;
  cashConversion: boolean;
  /** Points worth `unitValue` in cash ("80 pts = 1.00"). */
  pointsPerUnit: number;
  /** The cash those points are worth (LKR). Default 1.00. */
  unitValue?: number;
  minConversion: number;
  /** Not in the add form (Figma `312:15899`), so a new configuration has none: shown as "—". */
  maxConversion?: number;
}

export interface ProgrammeConfigurationProps {
  configs: ProgrammeConfig[];
  /** Every customer segment; those without a configuration are offered in the add form. */
  segments: string[];
  /** Called with what the admin did (an action from the toolbar or a row), so stories can show it. */
  onAction?: (action: string) => void;
}

const number = (n: number) => n.toLocaleString('en-US');
const onOff = (on: boolean) => (on ? 'Enable' : 'Disable');
const money = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** The list's columns; the details sheet shows each one as a row. */
const columns: FinTableColumn<ProgrammeConfig>[] = [
  { key: 'no', header: 'No.', width: 80, value: (c) => String(c.id).padStart(2, '0') },
  { key: 'segment', header: 'Segment', minWidth: 176, filter: {} },
  { key: 'loyalty', header: 'Loyalty', type: 'badge', value: (c) => onOff(c.loyalty), badgeTone: (c) => (c.loyalty ? 'success' : 'neutral') },
  { key: 'expiry', header: 'Expiry (mo)', value: (c) => number(c.expiryMonths) },
  {
    key: 'cash',
    header: 'Cash conversion',
    type: 'badge',
    value: (c) => onOff(c.cashConversion),
    badgeTone: (c) => (c.cashConversion ? 'success' : 'neutral'),
  },
  {
    key: 'rate',
    header: 'Conversion rate',
    type: 'link',
    value: (c) => `${number(c.pointsPerUnit)} pts = ${money(c.unitValue ?? 1)}`,
    href: (c) => `#loyalty/programme/${c.id}/conversion`,
  },
  { key: 'min', header: 'Min conversion (pts)', width: 200, value: (c) => number(c.minConversion) },
  { key: 'max', header: 'Max conversion (pts)', width: 200, value: (c) => (c.maxConversion === undefined ? '—' : number(c.maxConversion)) },
];

/**
 * Pages → Loyalty management → Programme configuration (Figma `312:15165`, DESIGN.md §8.6): the list of
 * configurations, one per customer segment, in the app shell. Search by segment, filter from the Segment column's
 * dropdown (decided 27 Oct 2026; was a Segment chip in the toolbar), act
 * on a row from its ⋮ menu. Add opens the add side sheet (`312:15899`); a saved configuration is added to the table.
 * View, or a click on the row, opens the details sheet (code first). Edit, in the row menu or the details sheet, opens
 * the same form with the row's values (code first); saving updates the row. Remove, in the row menu or the details
 * sheet, asks in a dialog (`328:25843`) and then takes the row out, with a Success snackbar (`328:26929`) at the top
 * right that closes itself after 6 seconds.
 */
export function ProgrammeConfiguration({ configs: initialConfigs, segments, onAction = () => undefined }: ProgrammeConfigurationProps) {
  const [configs, setConfigs] = useState(initialConfigs);
  const [adding, setAdding] = useState(false);
  const [viewing, setViewing] = useState<ProgrammeConfig | null>(null);
  // The edit sheet stays mounted after it closes (so focus goes back); `key` gives each opening fresh values.
  const [editing, setEditing] = useState<{ config: ProgrammeConfig; open: boolean; key: number } | null>(null);
  // The dialog keeps the last configuration while it closes, so its text doesn't change.
  const [removing, setRemoving] = useState<{ config: ProgrammeConfig; open: boolean } | null>(null);
  // Snackbars, newest last; each closes itself or with its close button.
  const [notices, setNotices] = useState<{ id: number; text: string }[]>([]);
  const [query, setQuery] = useState('');

  const search = query.trim().toLowerCase();
  const rows = configs.filter((c) => c.segment.toLowerCase().includes(search));
  const freeSegments = segments.filter((s) => !configs.some((c) => c.segment === s));

  const edit = (config: ProgrammeConfig) => {
    onAction(`Edit: ${config.segment}`);
    setViewing(null);
    setEditing((current) => ({ config, open: true, key: (current?.key ?? 0) + 1 }));
  };
  const askRemove = (config: ProgrammeConfig) => {
    onAction(`Remove: ${config.segment}`);
    setViewing(null);
    setRemoving({ config, open: true });
  };
  const closeRemove = () => setRemoving((current) => current && { ...current, open: false });

  return (
    <FinAppShell
      sideNav={pageSideNav('#loyalty/programme')}
      header={{
        heading: 'Programme configuration',
        bodyContent: 'One configuration per customer segment',
        backButton: false,
        notificationProps: { notification: 'number', count: 120 },
      }}
    >
      <FinTable
        label="Programme configurations"
        columns={columns}
        rows={rows}
        getRowId={(c) => c.id}
        getRowLabel={(c) => c.segment}
        onRowClick={setViewing}
        rowActions={(c) => [
          { label: 'View', icon: 'visibility', onSelect: () => setViewing(c) },
          { label: 'Edit', icon: 'edit', onSelect: () => edit(c) },
          { label: 'Remove', icon: 'delete', onSelect: () => askRemove(c), separator: true, destructive: true },
        ]}
        toolbar={{
          search: { label: 'Search segment', placeholder: 'Search segment', value: query, onChange: (e) => setQuery(e.target.value) },
          actionLabel: 'Add programme configuration',
          onAction: () => {
            onAction('Add programme configuration');
            setAdding(true);
          },
        }}
      />
      <ProgrammeConfigurationForm
        open={adding}
        onClose={() => setAdding(false)}
        segments={freeSegments}
        onSave={(values: ProgrammeConfigValues) => {
          onAction(`Saved: ${values.segment}`);
          setConfigs((current) => [...current, { ...values, id: Math.max(0, ...current.map((c) => c.id)) + 1 }]);
        }}
      />
      <ProgrammeConfigurationDetails
        config={viewing}
        columns={columns}
        onClose={() => setViewing(null)}
        onEdit={edit}
        onRemove={askRemove}
      />
      {editing && (
        <ProgrammeConfigurationForm
          key={editing.key}
          open={editing.open}
          onClose={() => setEditing({ ...editing, open: false })}
          config={editing.config}
          segments={freeSegments}
          onSave={(values: ProgrammeConfigValues) => {
            onAction(`Saved: ${values.segment}`);
            setConfigs((current) => current.map((c) => (c.id === editing.config.id ? { ...c, ...values } : c)));
          }}
        />
      )}
      <FinDialog
        open={removing?.open ?? false}
        onClose={closeRemove}
        title="Remove segment"
        secondaryButton={{ label: 'Cancel', onClick: closeRemove }}
        primaryButton={{
          label: 'Remove',
          tone: 'destructive',
          onClick: () => {
            if (!removing) return;
            onAction(`Removed: ${removing.config.segment}`);
            setConfigs((current) => current.filter((c) => c.id !== removing.config.id));
            setNotices((current) => [...current, { id: Math.max(0, ...current.map((n) => n.id)) + 1, text: 'Segment removed successfully' }]);
            closeRemove();
          },
        }}
      >
        {`Are you sure you want to remove the “${removing?.config.segment ?? ''}” segment?`}
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
