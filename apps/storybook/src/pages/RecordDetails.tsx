import type { ReactNode } from 'react';
import { FinBadge, FinSideSheet, FinTable, type FinTableColumn } from '@finspace-loyalty/ui';

export interface RecordDetailsProps<Row> {
  /** The record shown; `null` closes the sheet. */
  record: Row | null;
  /** The record's name, for the title ("<name> details"). */
  getName: (record: Row) => string;
  /** The list's columns: each one is a row here, its title the attribute. */
  columns: FinTableColumn<Row>[];
  onClose: () => void;
  onEdit: (record: Row) => void;
  onRemove: (record: Row) => void;
  /** Edit and Remove can't be used, for example while the connection is down (Pages/Common states). */
  actionsDisabled?: boolean;
}

interface Detail {
  key: string;
  attribute: string;
  value: ReactNode;
  /** The column's leading content for the record (an icon before a name), shown before the value as in the list. */
  leading?: ReactNode;
}

/** A column's value for the record, as the list shows it; a link is plain text here (decided 26 Oct 2026). */
function shown<Row>(column: FinTableColumn<Row>, record: Row): ReactNode {
  const value = column.value ? column.value(record) : (record as Record<string, ReactNode>)[column.key];
  if (column.type !== 'badge') return value;
  const tone = typeof column.badgeTone === 'function' ? column.badgeTone(record) : column.badgeTone;
  return <FinBadge {...(tone ? { tone } : {})}>{value}</FinBadge>;
}

/**
 * A list page's Details (code first, no Figma; DESIGN.md §8.6), shared by every page so they match: a side sheet
 * titled "<name> details" (wraps to two lines, then "…") with a two-column table, each of the list's columns
 * (Attribute) and the record's value (Added record), no hover. Remove (Secondary, destructive, bin icon, as wide as
 * its label) and Edit (Primary, the rest of the width) in the dock; the close button at the top.
 */
export function RecordDetails<Row>({ record, getName, columns, onClose, onEdit, onRemove, actionsDisabled = false }: RecordDetailsProps<Row>) {
  const details: Detail[] = record
    ? columns.map((column) => ({ key: column.key, attribute: column.header, value: shown(column, record), leading: column.leading?.(record) }))
    : [];
  const title = record ? `${getName(record)} details` : 'Details';

  return (
    <FinSideSheet
      open={record !== null}
      onClose={onClose}
      title={title}
      buttonDock={{
        secondaryButton: {
          label: 'Remove',
          tone: 'destructive',
          leadingIcon: 'delete',
          disabled: actionsDisabled,
          onClick: () => record && onRemove(record),
        },
        primaryButton: { label: 'Edit', disabled: actionsDisabled, onClick: () => record && onEdit(record) },
      }}
    >
      <FinTable
        label={title}
        columns={[
          { key: 'attribute', header: 'Attribute' },
          { key: 'value', header: 'Added record', leading: (d) => d.leading },
        ]}
        rows={details}
        getRowId={(d) => d.key}
        selectable={false}
        footer={false}
        hover={false}
      />
    </FinSideSheet>
  );
}
