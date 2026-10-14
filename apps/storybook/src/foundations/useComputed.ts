import { useLayoutEffect, useRef, useState } from 'react';

/**
 * Reads a computed style from an element after render. `deps` re-reads it when the theme or
 * brand changes, since the CSS variable then resolves to a different value.
 */
export function useComputed(property: 'backgroundColor' | 'width' | 'font', deps: unknown[]) {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState('');
  useLayoutEffect(() => {
    if (ref.current) setValue(getComputedStyle(ref.current)[property]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return [ref, value] as const;
}
