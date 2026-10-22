'use client';

import { useRef, useState } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import { FinButton } from '../Button';
import { FinListCheckbox, FinListCheckboxGroup } from '../ListCheckbox';
import { FinListRadio, FinListRadioGroup } from '../ListRadio';
import { FinMenu } from '../Menu';
import { FinSearchField } from '../SearchField';
import styles from './FinTableColumnFilter.module.css';

/** One value a column can be filtered by. */
export interface FinTableFilterOption {
  value: string;
  label: string;
}

export interface FinTableColumnFilterProps {
  /** The column's title ("Status"): names the button ("Filter Status") and the menu's list. */
  label: string;
  /** The values to choose from. */
  options: FinTableFilterOption[];
  /** The applied values (none: not filtered). */
  value: string[];
  /** Called with the values when Apply is pressed. */
  onApply: (value: string[]) => void;
  /** Checkboxes (several values, default) or radios (one value). Per column; may change per scenario. */
  multiple?: boolean;
  /** Button texts (translations). Default "Reset" and "Apply" (checkboxes only). */
  resetLabel?: string;
  applyLabel?: string;
  /** Radios: the first option, which clears the filter. Default "All". */
  allLabel?: string;
}

/** The "All" radio's value (not a column value). */
const ALL = '\u0000all';

/** Above this many values the menu gets a search field (as the country menu). */
const SEARCH_FROM = 8;

/**
 * A column's filter (code first, 22 Oct 2026; DESIGN.md §9): the header's down arrow (Figma `Show trailing icon`) as
 * a 24 button that opens a filter menu (FinMenu `kind="filter"`): a checkbox (or radio) list of the column's values,
 * a search when there are many. Checkboxes apply with Apply (Reset clears); radios apply on selection, "All" first.
 * `fg-secondary`; purple (`fg-action`) while open or while a filter is applied; points up while open.
 * **Internal:** part of the table header cell.
 */
export function FinTableColumnFilter({
  label,
  options,
  value,
  onApply,
  multiple = true,
  resetLabel = 'Reset',
  applyLabel = 'Apply',
  allLabel = 'All',
}: FinTableColumnFilterProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<string[]>(value);
  const [query, setQuery] = useState('');
  const shown = options.filter((option) => option.label.toLowerCase().includes(query.trim().toLowerCase()));
  const active = value.length > 0;
  // Radios: a choice by pointer, Space or Enter applies and closes; one by arrow keys applies and stays open.
  const arrowed = useRef(false);
  const choose = (next: string) => {
    onApply(next === ALL ? [] : [next]);
    if (!arrowed.current) setOpen(false);
    arrowed.current = false;
  };

  const changeOpen = (next: boolean) => {
    // Each time it opens, it starts from the applied values and an empty search.
    if (next) {
      setDraft(value);
      setQuery('');
    }
    setOpen(next);
  };

  return (
    <FinMenu
      kind="filter"
      open={open}
      onOpenChange={changeOpen}
      label={`Filter ${label}`}
      header={
        options.length > SEARCH_FROM ? (
          <FinSearchField size="small" label={`Search ${label}`} value={query} onChange={(e) => setQuery(e.target.value)} />
        ) : undefined
      }
      footer={
        multiple ? (
          <>
            <FinButton variant="tertiary" size="small" onClick={() => setDraft([])}>
              {resetLabel}
            </FinButton>
            <FinButton
              size="small"
              onClick={() => {
                onApply(draft);
                setOpen(false);
              }}
            >
              {applyLabel}
            </FinButton>
          </>
        ) : undefined
      }
      trigger={(menuProps) => (
        <button
          {...menuProps}
          type="button"
          className={styles.button}
          data-active={active || undefined}
          aria-label={active ? `Filter ${label}, ${value.length} selected` : `Filter ${label}`}
        >
          <FinIcon name={menuProps['aria-expanded'] ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} size={24} />
        </button>
      )}
    >
      {multiple ? (
        <FinListCheckboxGroup label={label} size="small" value={draft} onValueChange={setDraft}>
          {shown.map((option) => (
            <FinListCheckbox key={option.value} value={option.value} title={option.label} />
          ))}
        </FinListCheckboxGroup>
      ) : (
        // Radios apply on selection (decided by design 22 Oct 2026): no Reset or Apply; "All" clears the filter.
        <FinListRadioGroup
          label={label}
          size="small"
          value={value[0] ?? ALL}
          onValueChange={choose}
          onKeyDown={(event) => {
            arrowed.current = event.key.startsWith('Arrow');
          }}
        >
          {query.trim() === '' && <FinListRadio value={ALL} title={allLabel} />}
          {shown.map((option) => (
            <FinListRadio key={option.value} value={option.value} title={option.label} />
          ))}
        </FinListRadioGroup>
      )}
    </FinMenu>
  );
}
