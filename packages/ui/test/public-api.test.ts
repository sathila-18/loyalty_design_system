import { describe, expect, it } from 'vitest';
import * as ui from '../src';

// DESIGN.md §7.2 rule 4: bases are internal unless DESIGN.md says otherwise. The package entry point must not expose them.
const INTERNAL_BASES = ['FinBadgeBase', 'FinIndicatorDot', 'FinButtonBase'];

describe('public API', () => {
  it('exports FinBadge and the shared tone list, but not FinBadgeBase', () => {
    expect(ui).toHaveProperty('FinBadge');
    expect(ui.FIN_BADGE_TONES).toEqual(['primary', 'secondary', 'success', 'error', 'info', 'warning', 'disabled', 'neutral']);
  });

  it('exports FinPageIndicator, but not its FinIndicatorDot base', () => {
    expect(ui).toHaveProperty('FinPageIndicator');
  });

  it.each(INTERNAL_BASES)('does not export the internal base %s', (name) => {
    expect(ui).not.toHaveProperty(name);
  });

  it('exports no base components', () => {
    expect(Object.keys(ui).filter((name) => /Base$/.test(name))).toEqual([]);
  });
});
