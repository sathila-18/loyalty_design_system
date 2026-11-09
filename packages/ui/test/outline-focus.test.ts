import { describe, expect, it } from 'vitest';
// The same check as the lint rule fin/no-outline-none-with-ring (eslint.config.js).
import { outlineConflict } from '../../../eslint.config.js';

// Every component's class lists as they really are (composed from constants and lookups), not only the strings the
// lint sees one by one: no list has outline-none and an outline width on the same element (stage 3e-2, 9 Nov 2026:
// outline-none sets --tw-outline-style: none, so the focus ring disappeared).
const modules = import.meta.glob<Record<string, unknown>>('../src/**/Fin*.styles.ts', { eager: true });

function classLists(value: unknown, path: string): [string, string][] {
  if (typeof value === 'string') return [[path, value]];
  if (value && typeof value === 'object') return Object.entries(value).flatMap(([key, v]) => classLists(v, `${path}.${key}`));
  return [];
}

describe('focus rings', () => {
  const lists = Object.entries(modules).flatMap(([file, mod]) =>
    Object.entries(mod).flatMap(([name, value]) => classLists(value, `${file.replace('../src/', '')}: ${name}`)),
  );

  it('reads every component class file', () => {
    expect(Object.keys(modules).length).toBeGreaterThan(70);
  });

  it('never pairs outline-none with an outline width on the same element', () => {
    expect(lists.filter(([, classes]) => outlineConflict(classes)).map(([path]) => path)).toEqual([]);
  });

  it('would catch the pair', () => {
    expect(outlineConflict('fin:focus:outline-none fin:focus-visible:outline-2')).toBe(true);
    expect(outlineConflict('fin:focus:not-focus-visible:outline-none fin:focus-visible:outline-2')).toBe(false);
  });
});
