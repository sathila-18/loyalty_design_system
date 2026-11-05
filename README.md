# loyalty_design_system

## Using the design system in an app

Import it once, from the app's main stylesheet (for example `src/index.css`):

```css
@import "@finspace-loyalty/ui/index.css"; /* tokens + fonts + reset + components */
```

Then set the brand and theme on `<html>`: `<html data-brand="finspace" data-theme="light">`.

The parts are also available on their own: `@finspace-loyalty/ui/styles.css` (tokens, fonts, reset) and `@finspace-loyalty/ui/components.css` (components). An app that uses Tailwind 4 may also import `@finspace-loyalty/ui/theme.css` (optional), to get the same token utilities on its own pages.

**Your styles win over ours.** Everything the design system ships is in a CSS cascade layer (`@layer fin`), and any app CSS that isn't in a layer beats it, whatever its specificity. That's how a `className` you pass to a component applies without `!important`. It also means a global element rule in the app (`button { … }`, `a { … }`, `input { … }`) changes our components too, so scope those rules to your own markup (DESIGN.md §3.11, §10 #112).

## Storybook on Vercel

Live at **https://loyaltydesignsystem.vercel.app** (`main`); each pushed branch gets a preview at `https://loyaltydesignsystem-git-<branch>-sathila.vercel.app` (behind Vercel login).

`vercel.json` builds and publishes Storybook. Vercel runs `pnpm install --frozen-lockfile`, then `pnpm build-storybook` (tokens → icon font subset and flags → Storybook), and serves `apps/storybook/storybook-static`. There's no framework preset ("Other").

The Vercel project needs:

- the environment variable `ENABLE_EXPERIMENTAL_COREPACK=1`, so Vercel installs the pnpm version in `packageManager` (12.11.2), not the one it guesses from the lockfile;
- Node.js 24.x, which `engines` in package.json pins (Node 25 and later have no Corepack);
- the repo root as the root directory.

To check a build locally the same way: `pnpm install --frozen-lockfile && pnpm build-storybook`, then serve `apps/storybook/storybook-static` (for example `python3 -m http.server` in that folder).

**After a deploy**, a tab opened before it still asks for the old build's files, which are gone (every build renames them). Safari shows "Importing a module script failed", Chrome "Failed to fetch dynamically imported module". The preview (`apps/storybook/.storybook/preview.tsx`) reloads itself once when that happens (Vite's `vite:preloadError`), which picks up the new build; it waits 10 seconds before it would reload again, so a file that's really missing shows Storybook's error instead of a reload loop.
