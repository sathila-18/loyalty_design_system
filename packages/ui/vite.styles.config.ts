import { defineConfig } from 'vite';

// The global stylesheet (src/styles/index.css) is built separately from the library:
// library mode inlines every font as base64, so this plain build writes them as files instead.
// Output: dist/styles.css and dist/fonts/, exported as @finspace-loyalty/ui/styles.css.
export default defineConfig({
  base: './', // font URLs relative to styles.css, wherever the app serves it
  build: {
    emptyOutDir: false,
    assetsInlineLimit: 0,
    rollupOptions: {
      input: { styles: 'src/styles/index.css' },
      output: {
        assetFileNames: ({ names }) => (names[0]?.endsWith('.css') ? '[name][extname]' : 'fonts/[name][extname]'),
      },
    },
  },
});
