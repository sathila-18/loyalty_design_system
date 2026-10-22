import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => cleanup());

// jsdom hides [popover] elements but has no showPopover() to open them (FinMenu); real browsers do. Show them in tests.
// (Node-only test files have no document.)
if (typeof document !== 'undefined') {
  const popoverStyle = document.createElement('style');
  popoverStyle.textContent = '[popover]:not(:popover-open):not(dialog[open]) { display: block; }';
  document.head.append(popoverStyle);
}
