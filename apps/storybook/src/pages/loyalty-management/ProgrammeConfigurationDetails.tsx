import type { ReactNode } from 'react';
import { FinBadge, FinSideSheet, FinTable, type FinTableColumn } from '@finspace-loyalty/ui';
import type { ProgrammeConfig } from './ProgrammeConfiguration';

export interface ProgrammeConfigurationDetailsProps {
  /** The configuration shown; `null` closes the sheet. */
  config: ProgrammeConfig | null;
  /** The list's columns: each one is a row here, its title the attribute. */
  columns: FinTableColumn<ProgrammeConfig>[];
  onClose: () => void;
  onEdit: (config: ProgrammeConfig) => void;
  onRemove: (config: ProgrammeConfig) => void;
}

interface Detail {
  key: string;
  attribute: string;
  value: ReactNode;
}

/** A column's value for the configuration, as the list shows it; a link is plain text here (decided 26 Oct 2026). */
function shown(column: FinTableColumn<ProgrammeConfig>, config: ProgrammeConfig): ReactNode {
  const value = column.value ? column.value(config) : (config as unknown as Record<string, ReactNode>)[column.key];
  if (column.type !== 'badge') return value;
  const tone = typeof column.badgeTone === 'function' ? column.badgeTone(config) : column.badgeTone;
  return <FinBadge {...(tone ? { tone } : {})}>{value}</FinBadge>;
}

/**
 * Programme configuration → Details (code first, no Figma; DESIGN.md §8.6): a side sheet titled "<segment> details"
 * (one line, ends in "…") with a two-column table, each of the list's columns (Attribute) and the configuration's
 * value (Added record), no hover. Remove (Secondary, destructive, bin icon, as wide as its
 * label) and Edit (Primary, the rest of the width) in the dock; the close button at the top.
 */
export function ProgrammeConfigurationDetails({ config, columns, onClose, onEdit, onRemove }: ProgrammeConfigurationDetailsProps) {
  const details: Detail[] = config ? columns.map((column) => ({ key: column.key, attribute: column.header, value: shown(column, config) })) : [];

  return (
    <FinSideSheet
      open={config !== null}
      onClose={onClose}
      title={config ? `${config.segment} details` : 'Details'}
      buttonDock={{
        secondaryButton: {
          label: 'Remove',
          tone: 'destructive',
          leadingIcon: 'delete',
          width: 'hug',
          onClick: () => config && onRemove(config),
        },
        primaryButton: { label: 'Edit', onClick: () => config && onEdit(config) },
      }}
    >
      <FinTable
        label={config ? `${config.segment} details` : 'Details'}
        columns={[
          { key: 'attribute', header: 'Attribute' },
          { key: 'value', header: 'Added record' },
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
