# Login app (`apps/login`)

The sign-in screens from Figma (screens file, **Login Option 02**) as a real **Next.js App Router** app, built only with the design system: `@finspace-loyalty/ui` components, `@finspace-loyalty/tokens`, and Tailwind with the library's theme.

- **Storybook (components and their props):** <https://loyaltydesignsystem.vercel.app>. The page shell is **Components/Layout/Sign in layout** (`FinSignInLayout`).
- **This app on Vercel:** _(link added when the Vercel project is set up)_

## Run it

From the repo root:

```bash
pnpm login        # builds tokens and ui, then the dev server on http://localhost:3001
pnpm build-login  # production build
```

The app uses the workspace packages (`workspace:*`), so it always runs against the current library. To test the packed release files like a developer's app would, use `pnpm nextjs-check` instead.

## Mock sign-in (until the real API)

Every fake call is in **`lib/auth.ts`**, each with a `TODO(developers)` where the real API goes; nothing else in the app talks to a backend. To review every state:

| Screen | To see | Do |
|---|---|---|
| Login | Field errors | Press Login with empty fields |
| Login | Wrong credentials | Any user name, password **`wrong`** |
| Login | Signed in | Any user name and any other password |

## Brand and theme

Set once per deployment, on `<html>` (`lib/brand.ts`):

| Variable | Values | Default |
|---|---|---|
| `FIN_BRAND` | `finspace`, `burgundy`, `sampath` | `finspace` |
| `FIN_THEME` | `light`, `dark` | `light` |

## Styling: Tailwind, the library's way

`app/globals.css` is the one stylesheet: the library's `index.css`, Tailwind's utilities (no preflight, no default theme) and the library's `theme.css`, unprefixed. Classes are our tokens (`bg-primary`, `p-xl`, `w-343`, `bp-md:`), so they follow the brand and theme. ESLint runs the library's class rules here: no arbitrary values, no `dark:`, no banned names, and no `fin:` classes (those are the library's). The setup is explained in [NEXTJS-USAGE.md](../../NEXTJS-USAGE.md), "Using Tailwind in your app".

## Where things are

| Path | What |
|---|---|
| `app/` | The routes (`/` redirects to `/login`) |
| `components/SignInPage.tsx` | Every screen's shell: `FinSignInLayout` with the app's artwork |
| `public/sign-in/` | The artwork, exported from Figma as the screens crop it (2×); also shown in Storybook |
| `lib/brand.ts` | The brand and theme for this deployment |
| `lib/auth.ts` | **The mock API** (every fake call) |
| `vercel.json` | The Vercel project's build (the project's Root Directory is `apps/login`) |

## Notes

- `tsconfig.json` excludes `.next/dev`: Next 16 writes route types for `next dev` and `next build` to two folders, and type-checking both fails with "Duplicate identifier 'LayoutProps'" when you build after running dev.
- `app/icon.svg` is a neutral placeholder until design provides a favicon.
