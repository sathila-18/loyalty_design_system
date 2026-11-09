# Publishing to GitHub Packages

Packages: `@finspace-loyalty/ui` · `@finspace-loyalty/tokens`

> Code changes already applied — `private: true` removed, versions set to `0.1.0`, `publishConfig` and `repository` added, `.npmrc` updated, GitHub Actions workflow created, `release` script added to root `package.json`.

---

## One-time setup (this repo)

### 1. Replace YOUR_GITHUB_ORG

In `packages/ui/package.json` and `packages/tokens/package.json`, update the `repository.url`:

```json
"url": "https://github.com/your-org-name/loyalty_design_system.git"
```

> **Important:** The packages are scoped `@finspace-loyalty/`. GitHub Packages requires this scope to match a GitHub org named `finspace-loyalty`. If your org is named differently, rename the packages or create a matching org.

### 2. Authenticate locally

Create a GitHub Personal Access Token (PAT) with `write:packages` scope at:
**GitHub → Settings → Developer settings → Personal access tokens**

Then log in:

```bash
npm login --registry=https://npm.pkg.github.com --scope=@finspace-loyalty
# Username: your GitHub username
# Password: your PAT
# Email: your GitHub email
```

### 3. Dry run to verify package contents

```bash
# Build first
pnpm --filter @finspace-loyalty/tokens build
pnpm --filter @finspace-loyalty/ui build

# Check what will be published — no upload
pnpm --filter @finspace-loyalty/tokens publish --dry-run --no-git-checks
pnpm --filter @finspace-loyalty/ui publish --dry-run --no-git-checks
```

Confirm `dist/` and CSS files appear in the output.

### 4. First publish

```bash
pnpm release
```

This builds both packages then publishes tokens first, ui second (order matters).

---

## Releasing future versions

1. All checks pass on `main`:
   ```bash
   pnpm lint && pnpm typecheck && pnpm test && pnpm build
   ```

2. Bump version in both `packages/ui/package.json` and `packages/tokens/package.json`:
   - `patch` (0.1.0 → 0.1.1) — bug fix or visual tweak
   - `minor` (0.1.0 → 0.2.0) — new component or prop
   - `major` (0.1.0 → 1.0.0) — breaking API change

3. Commit, tag, and push:
   ```bash
   git add packages/ui/package.json packages/tokens/package.json
   git commit -m "Release v0.2.0"
   git tag v0.2.0
   git push && git push --tags
   ```

4. GitHub Actions publishes automatically on every `v*` tag push (`.github/workflows/publish.yml`). Uses `secrets.GITHUB_TOKEN` — no extra repo configuration needed.

---

## Consumer project setup

Every developer and CI environment that installs `@finspace-loyalty/ui` needs a GitHub PAT with **`read:packages`** scope.

### 1. Create a read:packages PAT

**GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens**
Scope: `read:packages`

### 2. Add .npmrc to the consumer project

Create `.npmrc` in the consumer project root:

```ini
@finspace-loyalty:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

> **Never commit the token directly.** Use the `${GITHUB_TOKEN}` placeholder and set the env var per machine.

### 3. Set the env var locally

```bash
# macOS / Linux — add to ~/.bashrc or ~/.zshrc
export GITHUB_TOKEN=ghp_your_token_here

# Windows PowerShell — add to $PROFILE
$env:GITHUB_TOKEN = "ghp_your_token_here"
```

### 4. Install

```bash
pnpm add @finspace-loyalty/ui
# @finspace-loyalty/tokens installs automatically as a dependency
```

### 5. Import CSS at the app entry point

Add once in `main.tsx` (or root layout in Next.js). Order matters:

```ts
import '@finspace-loyalty/tokens/tokens.css';   // CSS variables for all tokens
import '@finspace-loyalty/tokens/styles.css';   // shadows, grid helpers
import '@finspace-loyalty/ui/index.css';        // reset + Inter font
import '@finspace-loyalty/ui/components.css';   // pre-compiled component styles
```

> No Tailwind setup needed in the consumer project. Component styles are fully pre-compiled.

### 6. Set theme on `<html>`

```ts
// Set once in your app shell
document.documentElement.setAttribute('data-theme', 'light'); // or 'dark'
```

### 7. Use components

```tsx
import { FinButton, FinTextField, FinBadge } from '@finspace-loyalty/ui';

export function MyPage() {
  return (
    <form>
      <FinTextField label="Email address" placeholder="user@example.com" />
      <FinButton variant="primary" size="medium">Save changes</FinButton>
    </form>
  );
}
```

---

## CI/CD in the consumer project

```yaml
# consumer-project/.github/workflows/ci.yml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: 'https://npm.pkg.github.com'
      - name: Install
        run: pnpm install --frozen-lockfile
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - run: pnpm build
```

> If the consumer repo is in a **different GitHub org**, `secrets.GITHUB_TOKEN` won't have `read:packages` for this org. Store a PAT as a repo secret (e.g. `FINSPACE_PACKAGES_TOKEN`) and reference it instead.

---

## Checklist

- [ ] Replace `YOUR_GITHUB_ORG` in both `packages/*/package.json`
- [ ] Push this repo to GitHub under the matching org
- [ ] Create a PAT with `write:packages` for publishing
- [ ] Run `npm login --registry=https://npm.pkg.github.com`
- [ ] Dry-run publish to verify package contents
- [ ] Run `pnpm release` for first publish
- [ ] Add `.npmrc` to consumer project
- [ ] Create a PAT with `read:packages` for each developer
- [ ] Set `GITHUB_TOKEN` env var on each dev machine
- [ ] Install and test in consumer project
- [ ] Configure CI secret in consumer repo (if different org)
