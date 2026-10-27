# loyalty_design_system
## Storybook on Vercel

`vercel.json` builds and publishes Storybook. Vercel runs `pnpm install --frozen-lockfile`, then `pnpm build-storybook` (tokens → icon font subset and flags → Storybook), and serves `apps/storybook/storybook-static`. There's no framework preset ("Other").

The Vercel project needs:

- the environment variable `ENABLE_EXPERIMENTAL_COREPACK=1`, so Vercel installs the pnpm version in `packageManager` (12.11.2), not the one it guesses from the lockfile;
- Node.js 24.x, which `engines` in package.json pins (Node 25 and later have no Corepack);
- the repo root as the root directory.

To check a build locally the same way: `pnpm install --frozen-lockfile && pnpm build-storybook`, then serve `apps/storybook/storybook-static` (for example `python3 -m http.server` in that folder).
