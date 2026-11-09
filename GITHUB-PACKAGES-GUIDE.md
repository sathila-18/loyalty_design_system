# Publishing & consuming the design system

**Packages:** `@finspace-loyalty/tokens` · `@finspace-loyalty/ui`  
**Repo:** `https://github.com/sathila-18/loyalty_design_system`

---

## Approach comparison

| | GitHub Releases ✅ | npmjs.com | GitHub Packages |
|---|---|---|---|
| Requires registry account? | No | Yes (free) | No |
| Consumers need auth / `.npmrc`? | No (public repo) | No | Yes — PAT on every machine |
| Automatic on tag push? | Yes | Yes | Yes |
| Install URL | Direct `.tgz` download | Package name | Package name |

**GitHub Releases** is the simplest option: push a tag → CI builds and attaches `.tgz` files to the release → consumers install via download URL with no auth setup.

---

## Part 1 — Publishing (design system repo)

### How it works

The workflow `.github/workflows/publish.yml` runs on every `v*` tag push. It:
1. Builds both packages
2. Packs each into a `.tgz` file
3. Creates a GitHub Release and uploads the `.tgz` files as release assets

No npm account needed. No secrets to configure. GitHub Actions uses the built-in `GITHUB_TOKEN`.

---

### 1.1 Push the repo to GitHub

```bash
git add .
git commit -m "Configure release workflow"
git push
```

---

### 1.2 Enable Actions write permissions (one-time)

The release workflow needs write access to create releases.

1. Go to `github.com/sathila-18/loyalty_design_system` → **Settings → Actions → General**
2. Under **Workflow permissions**, select **Read and write permissions**
3. Save

---

### 1.3 First release

Bump the version in both packages (currently `0.1.0` — if this is the first release, leave it):

```bash
git add packages/tokens/package.json packages/ui/package.json
git commit -m "Release v0.1.0"
git tag v0.1.0
git push && git push --tags
```

GitHub Actions runs automatically. After ~2 minutes, the release appears at:

```
https://github.com/sathila-18/loyalty_design_system/releases/tag/v0.1.0
```

with two assets attached: `finspace-loyalty-tokens-0.1.0.tgz` and `finspace-loyalty-ui-0.1.0.tgz`.

---

### 1.4 Releasing future versions

1. All checks pass on `main`:
   ```bash
   pnpm lint && pnpm typecheck && pnpm test && pnpm build
   ```

2. Bump the version in **both** package files:
   - [packages/tokens/package.json](packages/tokens/package.json)
   - [packages/ui/package.json](packages/ui/package.json)

   | Change | Example | When |
   |---|---|---|
   | `patch` | `0.1.0 → 0.1.1` | Bug fix, no API change |
   | `minor` | `0.1.0 → 0.2.0` | New component or prop |
   | `major` | `0.1.0 → 1.0.0` | Breaking change |

3. Commit, tag, push:
   ```bash
   git add packages/tokens/package.json packages/ui/package.json
   git commit -m "Release v0.2.0"
   git tag v0.2.0
   git push && git push --tags
   ```

Done. GitHub Actions creates the release automatically.

---

## Part 2 — Consuming in a Next.js project

### 2.1 Install

Replace `0.1.0` with the actual release version.

```bash
pnpm add https://github.com/sathila-18/loyalty_design_system/releases/download/v0.1.0/finspace-loyalty-tokens-0.1.0.tgz
pnpm add https://github.com/sathila-18/loyalty_design_system/releases/download/v0.1.0/finspace-loyalty-ui-0.1.0.tgz
```

Or add directly to `package.json` and run `pnpm install`:

```json
{
  "dependencies": {
    "@finspace-loyalty/tokens": "https://github.com/sathila-18/loyalty_design_system/releases/download/v0.1.0/finspace-loyalty-tokens-0.1.0.tgz",
    "@finspace-loyalty/ui":     "https://github.com/sathila-18/loyalty_design_system/releases/download/v0.1.0/finspace-loyalty-ui-0.1.0.tgz"
  }
}
```

No `.npmrc`. No login. No token. Just the URL.

---

### 2.2 Upgrading to a newer version

Update the version number in the URLs in `package.json` and re-run `pnpm install`:

```json
"@finspace-loyalty/ui": "https://github.com/sathila-18/loyalty_design_system/releases/download/v0.2.0/finspace-loyalty-ui-0.2.0.tgz"
```

---

### 2.3 Import CSS in the root layout

Add these four imports **once** at the top of `app/layout.tsx`. Order matters.

```tsx
// app/layout.tsx
import '@finspace-loyalty/tokens/tokens.css';   // design token CSS variables
import '@finspace-loyalty/tokens/styles.css';   // shadows, grid helpers
import '@finspace-loyalty/ui/index.css';        // reset + Inter font
import '@finspace-loyalty/ui/components.css';   // pre-compiled component styles

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" data-brand="finspace">
      <body>{children}</body>
    </html>
  );
}
```

> **No Tailwind setup needed.** Component styles are pre-compiled. Do not install or configure Tailwind CSS in the Next.js project.

---

### 2.4 Using components

Library components already carry `'use client'` internally — import them freely in server components:

```tsx
// app/members/page.tsx — server component, no 'use client' needed
import { FinBadge, FinStatCard } from '@finspace-loyalty/ui';

export default function MembersPage() {
  return (
    <main>
      <FinStatCard label="Total members" value="24,816" />
      <FinBadge tone="success" label="Active" />
    </main>
  );
}
```

Wrap in a client component when you attach event handlers:

```tsx
// components/DeleteButton.tsx
'use client';

import { FinButton } from '@finspace-loyalty/ui';

export function DeleteButton({ onDelete }: { onDelete: () => void }) {
  return (
    <FinButton tone="destructive" variant="secondary" onClick={onDelete}>
      Delete member
    </FinButton>
  );
}
```

---

### 2.5 Available brands

| `data-brand` on `<html>` | Primary colour | Font |
|---|---|---|
| `finspace` (default) | Indigo `#625bff` | Inter |
| `burgundy` | Burgundy `#660033` | Inter |
| `sampath` | Orange `#f97316` | Hanken Grotesk |

---

### 2.6 Theme toggle (dark mode)

```tsx
// components/ThemeToggle.tsx
'use client';

import { FinButton } from '@finspace-loyalty/ui';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <FinButton
      variant="tertiary"
      icon="only-icon"
      iconName={theme === 'light' ? 'dark_mode' : 'light_mode'}
      onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}
    >
      {theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    </FinButton>
  );
}
```

---

### 2.7 Pages Router (`pages/`)

```tsx
// pages/_app.tsx
import '@finspace-loyalty/tokens/tokens.css';
import '@finspace-loyalty/tokens/styles.css';
import '@finspace-loyalty/ui/index.css';
import '@finspace-loyalty/ui/components.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

```tsx
// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html data-theme="light" data-brand="finspace" lang="en">
      <Head />
      <body><Main /><NextScript /></body>
    </Html>
  );
}
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `404` on install URL | Release not created yet — push a `v*` tag |
| Actions fail on release creation | Enable read+write permissions in repo Settings → Actions → General |
| Components render but have no styles | Add the four CSS imports to `layout.tsx` in order |
| Colors wrong / no theme | Add `data-theme="light"` to `<html>` in `layout.tsx` |
| Icons not showing | Ensure `@finspace-loyalty/ui/index.css` is imported |
| TypeScript errors on props | Rebuild the library — `dist/index.d.ts` is generated at build time |

---

## Checklist

### Publisher
- [x] `private: true` removed from both packages
- [x] Version set to `0.1.0`
- [x] `.github/workflows/publish.yml` created
- [ ] Repo pushed to GitHub
- [ ] Actions write permissions enabled (Settings → Actions → General)
- [ ] First tag pushed (`git tag v0.1.0 && git push --tags`)
- [ ] Release visible at `github.com/sathila-18/loyalty_design_system/releases`

### Consumer (Next.js project)
- [ ] Packages installed via release URL (`pnpm add https://github.com/...`)
- [ ] Four CSS imports added to `app/layout.tsx`
- [ ] `data-theme` and `data-brand` on `<html>`
