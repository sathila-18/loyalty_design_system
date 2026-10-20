import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinTableHeaderCell } from '../TableHeaderCell';
import { FinTableHeaderRow } from './FinTableHeaderRow';

const inTable = (row: ReactNode) =>
  render(
    <table>
      <thead>{row}</thead>
    </table>,
  );

const columns = (
  <>
    <FinTableHeaderCell type="grey" checkbox={false}>
      Name
    </FinTableHeaderCell>
    <FinTableHeaderCell type="grey" checkbox={false}>
      Status
    </FinTableHeaderCell>
  </>
);

describe('FinTableHeaderRow', () => {
  it('starts with a Grey select cell holding only the "select all" checkbox (Figma default)', () => {
    inTable(<FinTableHeaderRow>{columns}</FinTableHeaderRow>);
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(3);
    expect(headers[0]).toHaveAttribute('data-type', 'grey');
    expect(screen.getByText('Select').closest('[data-hidden]')).not.toBeNull();
    expect(screen.getAllByRole('checkbox')).toHaveLength(1);
    expect(screen.getByRole('checkbox', { name: 'Select all rows' })).not.toBeChecked();
    expect(headers[1]).toHaveAccessibleName('Name');
  });

  it('with Select cell off, has only the Slot cells', () => {
    inTable(<FinTableHeaderRow selectCell={false}>{columns}</FinTableHeaderRow>);
    expect(screen.getAllByRole('columnheader')).toHaveLength(2);
    expect(screen.queryByRole('checkbox')).toBeNull();
  });

  it('reports "select all" changes and shows the controlled and mixed states', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const { rerender } = inTable(
      <FinTableHeaderRow checked={false} onCheckedChange={onCheckedChange}>
        {columns}
      </FinTableHeaderRow>,
    );
    await user.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    rerender(
      <table>
        <thead>
          <FinTableHeaderRow indeterminate checkboxLabel="Seleccionar todo" selectTitle="Seleccionar">
            {columns}
          </FinTableHeaderRow>
        </thead>
      </table>,
    );
    expect(screen.getByRole('checkbox', { name: 'Seleccionar todo' })).toHaveProperty('indeterminate', true);
    expect(screen.getByText('Seleccionar')).toBeInTheDocument();
  });

  it('forwards ref and attributes to the tr', () => {
    const ref = createRef<HTMLTableRowElement>();
    inTable(
      <FinTableHeaderRow ref={ref} className="extra" data-testid="row">
        {columns}
      </FinTableHeaderRow>,
    );
    expect(ref.current?.tagName).toBe('TR');
    expect(ref.current).toHaveClass('extra');
    expect(screen.getByTestId('row')).toBe(ref.current);
  });
});
