import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Third-party code bundled into the library (Floating UI) lives under node_modules in the source tree; with preserved
// modules it would keep that path, and packing skips folders named node_modules. It goes to dist/vendor/ instead.
const fileName = ({ name }: { name: string }) => {
  const i = name.lastIndexOf('node_modules/');
  return i === -1 ? `${name}.js` : `vendor/${name.slice(i + 'node_modules/'.length)}.js`;
};

export default defineConfig({
  // Tailwind compiles src/styles/components.css (imported by src/index.ts); see DESIGN.md §3.11.
  plugins: [react(), tailwindcss()],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      // The components' CSS (Tailwind utilities): dist/components.css.
      cssFileName: 'components',
    },
    rollupOptions: {
      // React, and the tokens package (a peer dependency: apps install both, at the same version).
      external: ['react', 'react-dom', 'react/jsx-runtime', /^@finspace-loyalty\/tokens(\/.*)?$/],
      // One output file per source file, so each component keeps its own 'use client' (or none, for a purely
      // presentational one) and a Next.js Server Component can import the library (NEXTJS-USAGE.md §5; checked by
      // scripts/nextjs-check.mjs).
      output: { preserveModules: true, preserveModulesRoot: 'src', entryFileNames: fileName },
    },
    sourcemap: true,
  },
});
