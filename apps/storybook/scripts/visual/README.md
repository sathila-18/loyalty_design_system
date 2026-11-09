# Visual comparison tools

Prove that a branch looks and computes exactly like `main`: for a **styling refactor**, a change meant to look the same (moving classes, a Tailwind or Storybook upgrade). CLAUDE.md rule 11, DESIGN.md §3.11. Written during the Tailwind migration (5–9 Nov 2026).

| Script | What it does |
|---|---|
| `../visual.ts` | The main tool. `snapshot`: screenshots every story in every brand × theme from a built Storybook, with a hash of every element's computed style and box (`--states` adds hover, pressed and keyboard focus). `compare`: pixels and hashes of two snapshots, and with both builds it explains the differing stories property by property. |
| `run-limited.mjs` | Runs any command with a time limit and kills it, Chrome included, when it's reached. Wrap every long run in it (macOS has no `timeout`). |
| `states-probe.mjs` | Hover, pressed and keyboard focus compared **property by property** on both builds (`visual.ts --states` only hashes them, and `compare` explains only the resting state). Applies the same normalisations as the comparison and ends with a summary. |
| `hidden-check.mjs` | Tells apart what's behind `compare`'s "element only in b": missing on one side, or visually hidden on both. |
| `focus-check.mjs` | Keyboard and pointer focus outlines of FinAppShell's `main` and every option, compared on both builds (options aren't in the tab order, so the probe can't reach them). |
| `subset.mjs` | Makes a snapshot folder with only some stories, for re-checking part of the catalogue (`compare` needs the same stories on both sides). |

## Before you start

- **Stop the Storybook dev server** (`kill $(lsof -tiTCP:6006 -sTCP:LISTEN)`) and run **one check at a time**: the Mac has run out of memory with both. Restart Storybook afterwards.
- Keep snapshots and builds **outside the repo** (e.g. `~/loyalty_visual_cache/<name>/`); they're hundreds of MB.
- In zsh, pass lists as arrays or write the flags out: a list in one variable isn't split into words.
- Always use the same switches on every run, and list them in the summary: `--ignore-props '^--(?!fin-)' --normalize-shadows --skip-hidden` (DESIGN.md §3.11 says what each one leaves out).

## A full comparison

Run from `apps/storybook`. `C` is a folder outside the repo.

```zsh
C=~/loyalty_visual_cache/my-check
CMP=(--ignore-props '^--(?!fin-)' --normalize-shadows --skip-hidden --explain-max 250)

# 1. Two Storybook builds: main and the branch (pnpm build-storybook on each; copy apps/storybook/storybook-static away).
#    Building main: a git worktree, or switch to main, build, switch back and run `pnpm install --frozen-lockfile`.

# 2. Snapshots of the whole catalogue (about an hour each), and the states of the changed components and their users.
node scripts/visual/run-limited.mjs 240 node scripts/visual.ts snapshot --static $C/sb-main --out $C/main-all --chunk 20
node scripts/visual/run-limited.mjs 240 node scripts/visual.ts snapshot --static $C/sb-branch --out $C/branch-all --chunk 20
node scripts/visual/run-limited.mjs 150 node scripts/visual.ts snapshot --static $C/sb-main --out $C/main-states --filter components-menu-,components-table- --states --chunk 20
node scripts/visual/run-limited.mjs 150 node scripts/visual.ts snapshot --static $C/sb-branch --out $C/branch-states --filter components-menu-,components-table- --states --chunk 20

# 3. Any error records? A resumed run counts them as done: delete those lines and re-run the snapshot.
grep -c '"error"' $C/*/hashes.jsonl

# 4. Compare (with both builds, every differing story is explained once; raise --explain-max if there are more).
node scripts/visual/run-limited.mjs 120 node scripts/visual.ts compare --a $C/main-all --b $C/branch-all --static-a $C/sb-main --static-b $C/sb-branch $CMP --report $C/report-all.md
node scripts/visual/run-limited.mjs 90 node scripts/visual.ts compare --a $C/main-states --b $C/branch-states --static-a $C/sb-main --static-b $C/sb-branch $CMP --report $C/report-states.md

# 5. If "element only in b" shows up: missing, or hidden on both sides?
node scripts/visual/run-limited.mjs 45 node scripts/visual/hidden-check.mjs $C/main-all $C/branch-all $C/sb-main $C/sb-branch

# 6. States property by property (Finspace Light and Sampath Dark are enough: one light, one dark).
node scripts/visual/run-limited.mjs 120 node scripts/visual/states-probe.mjs $C/sb-main $C/sb-branch $C/probe finspace-light,sampath-dark components-menu-,components-table-
```

## Reading the result

- **Pixels** must be identical. Known noise: the Logo "Sizes" story (differs between two shots of `main` too) and a few keyboard-focus steps in Table Bordered and Playground; confirm noise with `states-probe.mjs` on the same stories.
- **Computed styles:** every difference in the reports is either fixed or listed in the summary with its reason. Invisible kinds accepted so far: `background-position` with no background image; `outline-width` / `outline-color` where `outline-style` is `none`; margin / padding / border of visually hidden (`sr-only`) elements; keyframe names (CSS Module hashes).
- **A re-check of part of the catalogue** after a fix: list the differing story ids, make the `main` side with `subset.mjs`, and re-shoot only those stories with `--filter <id,id,…>`.
- **The states probe** resumes where it stopped; a story that errored stays in `results.jsonl`: delete its line to retry it.
