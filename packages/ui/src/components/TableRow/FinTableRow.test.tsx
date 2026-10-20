import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinTableCell } from '../TableCell';
import { FinTableRow } from './FinTableRow';

const inTable = (row: ReactNode) =>
  render(
    <table>
      <tbody>{row}</tbody>
    </table>,
  );

const cells = (
  <>
    <FinTableCell leadingAccessories={false}>Ann Perera</FinTableCell>
    <FinTableCell type="link" href="#member" leadingAccessories={false}>
      View profile
    </FinTableCell>
    <FinTableCell leadingAccessories={false} action actionLabel="Edit member" onAction={() => undefined}>
      Gold
    </FinTableCell>
  </>
);

describe('FinTableRow', () => {
  it('starts with a select cell holding the row checkbox (Figma default)', () => {
    inTable(<FinTableRow>{cells}</FinTableRow>);
    expect(screen.getAllByRole('cell')).toHaveLength(4);
    expect(screen.getAllByRole('checkbox')).toHaveLength(1);
    expect(screen.getByRole('checkbox', { name: 'Select row' })).not.toBeChecked();
    expect(screen.getByRole('row')).not.toHaveAttribute('data-selected');
  });

  it('when selected, has the selected state and the checkbox ticked', () => {
    inTable(
      <FinTableRow selected checkboxLabel="Select Ann Perera">
        {cells}
      </FinTableRow>,
    );
    expect(screen.getByRole('row')).toHaveAttribute('data-selected');
    expect(screen.getByRole('checkbox', { name: 'Select Ann Perera' })).toBeChecked();
  });

  it('with Select cell off, has only the Cell Slot cells', () => {
    inTable(<FinTableRow selectCell={false}>{cells}</FinTableRow>);
    expect(screen.getAllByRole('cell')).toHaveLength(3);
    expect(screen.queryByRole('checkbox')).toBeNull();
  });

  it('reports checkbox changes without clicking the row', async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    const onRowClick = vi.fn();
    inTable(
      <FinTableRow onSelectedChange={onSelectedChange} onRowClick={onRowClick}>
        {cells}
      </FinTableRow>,
    );
    await user.click(screen.getByRole('checkbox'));
    expect(onSelectedChange).toHaveBeenCalledWith(true);
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it('calls onRowClick for a click on the row, but not on its links and action buttons', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    inTable(<FinTableRow onRowClick={onRowClick}>{cells}</FinTableRow>);
    await user.click(screen.getByText('Ann Perera'));
    expect(onRowClick).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole('link', { name: 'View profile' }));
    await user.click(screen.getByRole('button', { name: 'Edit member' }));
    expect(onRowClick).toHaveBeenCalledTimes(1);
  });

  it('with onRowClick, is focusable and opens with Enter', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    inTable(
      <FinTableRow selectCell={false} onRowClick={onRowClick}>
        <FinTableCell leadingAccessories={false}>Ann Perera</FinTableCell>
      </FinTableRow>,
    );
    const row = screen.getByRole('row');
    expect(row).toHaveAttribute('tabindex', '0');
    expect(row).toHaveAttribute('data-clickable');
    await user.tab();
    expect(row).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onRowClick).toHaveBeenCalledTimes(1);
  });

  it('without onRowClick, is not focusable', () => {
    inTable(<FinTableRow>{cells}</FinTableRow>);
    expect(screen.getByRole('row')).not.toHaveAttribute('tabindex');
    expect(screen.getByRole('row')).not.toHaveAttribute('data-clickable');
  });

  it('forwards ref, attributes and its own click handler to the tr', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLTableRowElement>();
    const onClick = vi.fn();
    inTable(
      <FinTableRow ref={ref} className="extra" onClick={onClick} selectCell={false}>
        <FinTableCell leadingAccessories={false}>Ann Perera</FinTableCell>
      </FinTableRow>,
    );
    expect(ref.current?.tagName).toBe('TR');
    expect(ref.current).toHaveClass('extra');
    await user.click(screen.getByText('Ann Perera'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
