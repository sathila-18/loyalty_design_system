import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinTableHeaderCell } from './FinTableHeaderCell';

const inTable = (cell: ReactNode) =>
  render(
    <table>
      <thead>
        <tr>{cell}</tr>
      </thead>
    </table>,
  );

describe('FinTableHeaderCell', () => {
  it('is a column header with a "select all" checkbox and the title (Figma defaults)', () => {
    inTable(<FinTableHeaderCell>Table title</FinTableHeaderCell>);
    const header = screen.getByRole('columnheader', { name: /Table title/ });
    expect(header).toHaveAttribute('scope', 'col');
    expect(header).toHaveAttribute('data-type', 'white');
    expect(screen.getByRole('checkbox', { name: 'Select all rows' })).not.toBeChecked();
    expect(header).not.toHaveTextContent('keyboard_arrow_down');
  });

  it('takes Type Grey, no checkbox and the trailing arrow', () => {
    inTable(
      <FinTableHeaderCell type="grey" checkbox={false} trailingIcon>
        Status
      </FinTableHeaderCell>,
    );
    const header = screen.getByRole('columnheader', { name: 'Status' });
    expect(header).toHaveAttribute('data-type', 'grey');
    expect(screen.queryByRole('checkbox')).toBeNull();
    expect(header).toHaveTextContent('keyboard_arrow_down');
  });

  it('with Show title off, hides the title on screen but keeps it as the name', () => {
    inTable(<FinTableHeaderCell showTitle={false}>Select</FinTableHeaderCell>);
    const title = screen.getByText('Select');
    expect(title.closest('[data-hidden]')).not.toBeNull();
    expect(screen.getByRole('columnheader', { name: /Select/ })).toBeInTheDocument();
  });

  it('reports checkbox changes and shows the controlled and mixed states', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const { rerender } = inTable(
      <FinTableHeaderCell checked={false} onCheckedChange={onCheckedChange}>
        Name
      </FinTableHeaderCell>,
    );
    await user.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    rerender(
      <table>
        <thead>
          <tr>
            <FinTableHeaderCell indeterminate checkboxLabel="Seleccionar todo">
              Name
            </FinTableHeaderCell>
          </tr>
        </thead>
      </table>,
    );
    expect(screen.getByRole('checkbox', { name: 'Seleccionar todo' })).toHaveProperty('indeterminate', true);
  });

  it('puts other Slot content as given, and forwards ref and attributes to the th', () => {
    const ref = createRef<HTMLTableCellElement>();
    inTable(
      <FinTableHeaderCell ref={ref} className="extra" checkbox={false}>
        <strong>Custom</strong>
      </FinTableHeaderCell>,
    );
    expect(ref.current?.tagName).toBe('TH');
    expect(ref.current).toHaveClass('extra');
    expect(screen.getByText('Custom').tagName).toBe('STRONG');
  });
});
