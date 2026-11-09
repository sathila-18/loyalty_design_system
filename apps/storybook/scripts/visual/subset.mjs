// Makes a snapshot folder holding only some stories of another one, for a partial re-check: the source's hashes.jsonl
// lines whose story id is listed, and links to its screenshot folders (one per combo). `visual.ts compare` walks every
// story in --a, so --a must hold the same stories as the partial --b.
// Usage: node scripts/visual/subset.mjs <source dir> <new dir> <ids file, one story id per line>
import { existsSync, mkdirSync, readFileSync, readdirSync, symlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

setTimeout(() => process.exit(2), 60_000).unref();

const [src, dst, idsFile] = process.argv.slice(2);
if (!src || !dst || !idsFile) {
  console.error('Usage: node scripts/visual/subset.mjs <source dir> <new dir> <ids file>');
  process.exit(1);
}
const ids = new Set(readFileSync(idsFile, 'utf8').split('\n').map((s) => s.trim()).filter(Boolean));
mkdirSync(dst, { recursive: true });
const lines = readFileSync(join(src, 'hashes.jsonl'), 'utf8')
  .split('\n')
  .filter(Boolean)
  .filter((l) => ids.has(JSON.parse(l).key.split('/')[1]));
writeFileSync(join(dst, 'hashes.jsonl'), lines.join('\n') + '\n');
for (const d of readdirSync(src, { withFileTypes: true })) {
  if (d.isDirectory() && /^[a-z]+-(light|dark)$/.test(d.name) && !existsSync(join(dst, d.name))) symlinkSync(join(src, d.name), join(dst, d.name));
}
console.log(`${lines.length} entries for ${ids.size} stories`);
