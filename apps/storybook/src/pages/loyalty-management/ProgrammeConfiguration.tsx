import { useState } from 'react';
import { FinAppShell, FinAssistChip, FinListStandard, FinMenu, FinTable, type FinTableColumn } from '@finspace-loyalty/ui';
import { pageSideNav } from '../pageShell';

/** One programme configuration: the loyalty and cash conversion rules for a customer segment. */
export interface ProgrammeConfig {
  id: number;
  segment: string;
  loyalty: boolean;
  /** Points expire after this many months. */
  expiryMonths: number;
  cashConversion: boolean;
  /** Points worth 1.00 in cash ("80 pts = 1.00"). */
  pointsPerUnit: number;
  minConversion: number;
  maxConversion: number;
}

export interface ProgrammeConfigurationProps {
  configs: ProgrammeConfig[];
  /** Called with what the admin did (an action from the toolbar or a row), so stories can show it. */
  onAction?: (action: string) => void;
}

const ALL = 'All';
const number = (n: number) => n.toLocaleString('en-US');
const onOff = (on: boolean) => (on ? 'Enable' : 'Disable');

/**
 * Pages → Loyalty management → Programme configuration (Figma `312:15165`, DESIGN.md §8.6): the list of
 * configurations, one per customer segment, in the app shell. Search by segment, filter with the Segment chip, act
 * on a row from its ⋮ menu. The add (side sheet) and remove (dialog, snackbar) states wait for those components.
 */
export function ProgrammeConfiguration({ configs, onAction = () => undefined }: ProgrammeConfigurationProps) {
  const [query, setQuery] = useState('');
  const [segment, setSegment] = useState(ALL);

  const search = query.trim().toLowerCase();
  const rows = configs.filter((c) => c.segment.toLowerCase().includes(search) && (segment === ALL || c.segment === segment));

  const columns: FinTableColumn<ProgrammeConfig>[] = [
    { key: 'no', header: 'No.', width: 80, value: (c) => String(c.id).padStart(2, '0') },
    { key: 'segment', header: 'Segment', minWidth: 176 },
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
      value: (c) => `${number(c.pointsPerUnit)} pts = 1.00`,
      href: (c) => `#loyalty/programme/${c.id}/conversion`,
    },
    { key: 'min', header: 'Min conversion (pts)', width: 200, value: (c) => number(c.minConversion) },
    { key: 'max', header: 'Max conversion (pts)', width: 200, value: (c) => number(c.maxConversion) },
  ];

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
        rowActions={(c) => [
          { label: 'View', icon: 'visibility', onSelect: () => onAction(`View: ${c.segment}`) },
          { label: 'Edit', icon: 'edit', onSelect: () => onAction(`Edit: ${c.segment}`) },
          { label: 'Remove', icon: 'delete', onSelect: () => onAction(`Remove: ${c.segment}`), separator: true, destructive: true },
        ]}
        toolbar={{
          search: { label: 'Search segment', placeholder: 'Search segment', value: query, onChange: (e) => setQuery(e.target.value) },
          filters: (
            <FinMenu
              kind="select"
              label="Segment"
              placement="bottom-end"
              trigger={(menuProps) => (
                <FinAssistChip {...menuProps} size="large" dropdown expanded={menuProps['aria-expanded']}>
                  {`Segment: ${segment}`}
                </FinAssistChip>
              )}
            >
              {[ALL, ...configs.map((c) => c.segment)].map((s) => (
                <FinListStandard key={s} as="li" size="small" behavior="option" divider={false} title={s} selected={s === segment} onClick={() => setSegment(s)} />
              ))}
            </FinMenu>
          ),
          actionLabel: 'Add programme configuration',
          onAction: () => onAction('Add programme configuration'),
        }}
      />
    </FinAppShell>
  );
}
