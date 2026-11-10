# Login app (`apps/login`)

The sign-in screens from Figma (screens file, **Login Option 02**) as a real **Next.js App Router** app, built only with the design system: `@finspace-loyalty/ui` components, `@finspace-loyalty/tokens`, and Tailwind with the library's theme.

- **Storybook (components and their props):** <https://loyaltydesignsystem.vercel.app>. The page shell is **Components/Layout/Sign in layout** (`FinSignInLayout`).
- **The screens in Storybook:** **Pages/Login**, the same screen components (`screens/`), with the Brand and Theme toolbars. This app isn't hosted; run it locally.

## Run it

From the repo root:

```bash
pnpm login        # builds tokens and ui, then the dev server on http://localhost:3001
pnpm build-login  # production build
```

The app uses the workspace packages (`workspace:*`), so it always runs against the current library. To test the packed release files like a developer's app would, use `pnpm nextjs-check` instead.

## Mock sign-in (until the real API)

Every fake call is in **`lib/auth.ts`**, each with a `TODO(developers)` where the real API goes; the screens get it through `app/NextLoginPlatform.tsx` (`auth`), so the real API plugs in there or in those function bodies. Nothing else talks to a backend. To review every state:

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

`app/globals.css` is the one stylesheet: the library's `index.css`, then `screens/screens.css` (Tailwind's utilities, no preflight or default theme, with the library's `theme.css`, unprefixed; Storybook compiles the same file for Pages/Login). Classes are our tokens (`bg-primary`, `p-xl`, `w-343`, `bp-md:`), so they follow the brand and theme. ESLint runs the library's class rules here: no arbitrary values, no `dark:`, no banned names, and no `fin:` classes (those are the library's). The setup is explained in [NEXTJS-USAGE.md](../../NEXTJS-USAGE.md), "Using Tailwind in your app".

## Where things are

| Path | What |
|---|---|
| `screens/` | **The screens**, shared with Storybook's Pages/Login: React, the library and Tailwind only, never `next/*` (ESLint). `platform.tsx` and `LoginPlatformProvider.tsx` are what they need from where they run |
| `app/` | The Next.js side: the routes (`/` redirects to `/login`), metadata, and `NextLoginPlatform.tsx` (next/link, next/image, the router, the auth) |
| `public/sign-in/` | The artwork, exported from Figma as the screens crop it (2×); Storybook serves the same files |
| `lib/brand.ts` | The brand and theme for this deployment |
| `lib/auth.ts` | **The mock API** (every fake call) |

## Notes

- `tsconfig.json` excludes `.next/dev`: Next 16 writes route types for `next dev` and `next build` to two folders, and type-checking both fails with "Duplicate identifier 'LayoutProps'" when you build after running dev.
- **Rebuilt the library while `next dev` was running?** The dev server can keep failing with "Can't resolve '@finspace-loyalty/tokens'" or "no valid target file" for `index.css`, because Turbopack's cache remembers the moment `dist` was empty. Stop it, delete `apps/login/.next/dev`, and run `pnpm login` again.
- `app/icon.svg` is a neutral placeholder until design provides a favicon.
