import { describe, expect, it } from 'vitest';
import * as ui from '../src';

// DESIGN.md §7.2 rule 4: bases are internal unless DESIGN.md says otherwise. The package entry point must not expose them.
const INTERNAL_BASES = ['FinBadgeBase', 'FinIndicatorDot', 'FinButtonBase', 'FinWhiteButton', 'FinDestructiveButton', 'FinCheckboxBase', 'FinChipBase', 'FinSegmentBase', 'FinCountrySelector', 'FinPaginationItem', 'FinRowCountSelect'];

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

  it('exports FinSegmentedButton, but not its FinSegmentBase base', () => {
    expect(ui).toHaveProperty('FinSegmentedButton');
  });

  it('exports FinFlag and its registry', () => {
    expect(ui).toHaveProperty('FinFlag');
    expect(ui).toHaveProperty('finFlags');
    expect(ui).toHaveProperty('isFinFlagCountry');
  });

  it.each(INTERNAL_BASES)('does not export the internal base %s', (name) => {
    expect(ui).not.toHaveProperty(name);
  });

  it('exports no base components', () => {
    expect(Object.keys(ui).filter((name) => /Base$/.test(name))).toEqual([]);
  });
});
