import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Behaviour tests (DESIGN.md §7.4): jsdom + Testing Library. Component tests live next to each
// component; test/ holds tests that don't belong to one (setup example, Stylelint rules).
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'test/**/*.test.{ts,tsx}'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
  },
});
