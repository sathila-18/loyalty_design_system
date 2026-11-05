import { defineConfig } from 'vite';

// The global stylesheets are built separately from the library: library mode inlines every font as base64, so this
// plain build writes them as files instead. Runs after the library build (index.css takes dist/components.css).
// Output, with dist/fonts/:
//   dist/styles.css  foundations: tokens, fonts, reset     → @finspace-loyalty/ui/styles.css
//   dist/index.css   all-in-one: styles.css + components   → @finspace-loyalty/ui/index.css
export default defineConfig({
  base: './', // font URLs relative to the stylesheet, wherever the app serves it
  build: {
    emptyOutDir: false,
    assetsInlineLimit: 0,
    rollupOptions: {
      input: { styles: 'src/styles/index.css', index: 'src/styles/bundle.css' },
      output: {
        assetFileNames: ({ names }) => (names[0]?.endsWith('.css') ? '[name][extname]' : 'fonts/[name][extname]'),
      },
    },
  },
});
