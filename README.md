# loyalty_design_system
## Storybook on Vercel

Live at **https://loyaltydesignsystem.vercel.app** (`main`); each pushed branch gets a preview at `https://loyaltydesignsystem-git-<branch>-sathila.vercel.app` (behind Vercel login).

`vercel.json` builds and publishes Storybook. Vercel runs `pnpm install --frozen-lockfile`, then `pnpm build-storybook` (tokens → icon font subset and flags → Storybook), and serves `apps/storybook/storybook-static`. There's no framework preset ("Other").

The Vercel project needs:

- the environment variable `ENABLE_EXPERIMENTAL_COREPACK=1`, so Vercel installs the pnpm version in `packageManager` (12.11.2), not the one it guesses from the lockfile;
- Node.js 24.x, which `engines` in package.json pins (Node 25 and later have no Corepack);
- the repo root as the root directory.

To check a build locally the same way: `pnpm install --frozen-lockfile && pnpm build-storybook`, then serve `apps/storybook/storybook-static` (for example `python3 -m http.server` in that folder).

**After a deploy**, a tab opened before it still asks for the old build's files, which are gone (every build renames them). Safari shows "Importing a module script failed", Chrome "Failed to fetch dynamically imported module". The preview (`apps/storybook/.storybook/preview.tsx`) reloads itself once when that happens (Vite's `vite:preloadError`), which picks up the new build; it waits 10 seconds before it would reload again, so a file that's really missing shows Storybook's error instead of a reload loop.
