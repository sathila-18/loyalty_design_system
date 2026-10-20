/**
 * Payment logos (DESIGN.md §6.1, §8.5): copies the logos registered in src/payment/finPaymentMethods.ts from Shopify's
 * open-source `activemerchant/payment_icons` (MIT) at the pinned version to src/payment/library/, with the library's
 * licence, and removes logos no longer registered. The files are committed, so builds never fetch; run this by hand
 * after adding a library brand or bumping FIN_PAYMENT_LIBRARY.version, then review the diff.
 *
 * Run: pnpm payment-icons (in packages/ui).
 */
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FIN_PAYMENT_LIBRARY, finPaymentMethods, type FinPaymentMethodEntry } from '../src/payment/finPaymentMethods.ts';

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, '../src/payment/library');
const RAW = `https://raw.githubusercontent.com/${FIN_PAYMENT_LIBRARY.repo}/${FIN_PAYMENT_LIBRARY.version}`;

const fetchText = async (path: string) => {
  const response = await fetch(`${RAW}/${path}`);
  if (!response.ok) throw new Error(`payment-icons: ${path} at ${FIN_PAYMENT_LIBRARY.version}: HTTP ${response.status}`);
  return response.text();
};

const entries: FinPaymentMethodEntry[] = Object.values(finPaymentMethods);
const files = entries.flatMap((entry) => (entry.library ? [entry.library] : []));

mkdirSync(OUT, { recursive: true });
for (const file of files) writeFileSync(join(OUT, `${file}.svg`), await fetchText(`app/assets/images/payment_icons/${file}.svg`));
writeFileSync(join(OUT, 'MIT-LICENSE'), await fetchText('MIT-LICENSE'));

const keep = new Set([...files.map((file) => `${file}.svg`), 'MIT-LICENSE']);
const removed = readdirSync(OUT).filter((name) => !keep.has(name));
for (const name of removed) rmSync(join(OUT, name));

console.log(`payment-icons: ${files.length} logos from ${FIN_PAYMENT_LIBRARY.repo}@${FIN_PAYMENT_LIBRARY.version}${removed.length ? `; removed ${removed.join(', ')}` : ''}`);
