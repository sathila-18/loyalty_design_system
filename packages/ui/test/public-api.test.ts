import { describe, expect, it } from 'vitest';
import * as ui from '../src';

// DESIGN.md §7.2 rule 4: bases are internal unless DESIGN.md says otherwise. The package entry point must not expose them.
const INTERNAL_BASES = ['FinBadgeBase', 'FinIndicatorDot', 'FinButtonBase', 'FinWhiteButton', 'FinDestructiveButton', 'FinCheckboxBase', 'FinChipBase', 'FinSegmentBase', 'FinCountrySelector', 'FinPaginationItem', 'FinRowCountSelect', 'FinTableFooter', 'FinTableHeaderCell', 'FinTableHeaderRow', 'FinTableCell', 'FinTableRow', 'FinSideNavIcon', 'FinSideNavSubItem', 'FinSideNavItem', 'FinListItem', 'FinListItemFilled', 'FinInputBase'];

describe('public API', () => {
  it('exports FinBadge and the shared tone list, but not FinBadgeBase', () => {
    expect(ui).toHaveProperty('FinBadge');
    expect(ui.FIN_BADGE_TONES).toEqual(['primary', 'secondary', 'success', 'error', 'info', 'warning', 'disabled', 'neutral']);
  });

  it('exports FinPageIndicator, but not its FinIndicatorDot base', () => {
    expect(ui).toHaveProperty('FinPageIndicator');
  });

  it('exports FinButton, but not the three button bases it is built from', () => {
    expect(ui).toHaveProperty('FinButton');
  });

  it('exports FinCheckbox, but not its FinCheckboxBase base', () => {
    expect(ui).toHaveProperty('FinCheckbox');
  });

  it('exports the three chips, but not their FinChipBase base', () => {
    for (const name of ['FinAssistChip', 'FinFilterChip', 'FinInputChip']) expect(ui).toHaveProperty(name);
  });

  it('exports FinMenu and FinMenuDivider', () => {
    expect(ui).toHaveProperty('FinMenu');
    expect(ui).toHaveProperty('FinMenuDivider');
  });

  it('exports FinHeader', () => {
    expect(ui).toHaveProperty('FinHeader');
  });

  it('exports FinHeaderNotificationButton', () => {
    expect(ui).toHaveProperty('FinHeaderNotificationButton');
  });

  it('exports FinSegmentedButton, but not its FinSegmentBase base', () => {
    expect(ui).toHaveProperty('FinSegmentedButton');
  });

  it('exports FinPaymentIcon and its registry', () => {
    expect(ui).toHaveProperty('FinPaymentIcon');
    expect(ui).toHaveProperty('finPaymentMethods');
    expect(ui).toHaveProperty('isFinPaymentMethod');
  });

  it('exports FinFlag and its registry', () => {
    expect(ui).toHaveProperty('FinFlag');
    expect(ui).toHaveProperty('finFlags');
    expect(ui).toHaveProperty('isFinFlagCountry');
  });

  it('exports FinListStandard, but not the list bases it is built from', () => {
    expect(ui).toHaveProperty('FinListStandard');
  });

  it('exports the radio list and its group', () => {
    expect(ui).toHaveProperty('FinListRadio');
    expect(ui).toHaveProperty('FinListRadioGroup');
  });

  it('exports the checkbox list and its group', () => {
    expect(ui).toHaveProperty('FinListCheckbox');
    expect(ui).toHaveProperty('FinListCheckboxGroup');
  });

  it('exports the toggle list', () => {
    expect(ui).toHaveProperty('FinListToggle');
  });

  it('exports the filled lists, but not the shared rows', () => {
    for (const name of ['FinListStandardFilled', 'FinListRadioFilled', 'FinListCheckboxFilled', 'FinListToggleFilled']) expect(ui).toHaveProperty(name);
    for (const name of ['ListStandardRow', 'FinListRadioRow', 'FinListCheckboxRow', 'FinListToggleRow']) expect(ui).not.toHaveProperty(name);
  });

  it('exports FinTable, but not the table parts it is built from', () => {
    expect(ui).toHaveProperty('FinTable');
  });

  it('exports FinPagination, but not its FinPaginationItem base', () => {
    expect(ui).toHaveProperty('FinPagination');
  });

  it('exports FinSideNav, but not the side nav parts it is built from', () => {
    expect(ui).toHaveProperty('FinSideNav');
  });

  it('exports FinSearchField', () => {
    expect(ui).toHaveProperty('FinSearchField');
  });

  it('exports FinPasswordField', () => {
    expect(ui).toHaveProperty('FinPasswordField');
  });

  it('exports FinTextField and the dial codes, but not its FinInputBase base', () => {
    expect(ui).toHaveProperty('FinTextField');
    expect(ui).toHaveProperty('finDialCodes');
  });

  it.each(INTERNAL_BASES)('does not export the internal base %s', (name) => {
    expect(ui).not.toHaveProperty(name);
  });

  it('exports no base components', () => {
    expect(Object.keys(ui).filter((name) => /Base$/.test(name))).toEqual([]);
  });
});
