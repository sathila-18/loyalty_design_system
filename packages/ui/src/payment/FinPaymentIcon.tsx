'use client';

import { useEffect, useState, type HTMLAttributes } from 'react';
import { FinIcon, type FinIconSize } from '../icons/FinIcon';
import { finPaymentMethods, isFinPaymentMethod, type FinPaymentMethod, type FinPaymentMethodEntry } from './finPaymentMethods';
import styles from './FinPaymentIcon.module.css';

export type FinPaymentIconSize = 'small' | 'medium' | 'large' | 'xlarge';

export interface FinPaymentIconProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** The payment method (finPaymentMethods). An unknown method shows the default card. */
  method: FinPaymentMethod;
  /** Figma Payment Icons `Size`: heights 16 / 24 / 32 / 48, on a 38 × 24 card. Default medium. */
  size?: FinPaymentIconSize;
  /** Figma `State=Disabled`: shown partly transparent (opacity 0.4, as FinFlag), never recolored. */
  disabled?: boolean;
  /** Next to a visible brand name: hidden from screen readers so it isn't read twice. */
  decorative?: boolean;
  /** The alt text. Default the brand's name. */
  label?: string;
}

// One lazy loader per logo: a logo is fetched only when it's shown (no bundle of every logo).
const LOADERS: Record<string, () => Promise<string>> = {
  ...import.meta.glob<string>('./library/*.svg', { query: '?url', import: 'default' }),
  ...import.meta.glob<string>('./custom/*.svg', { query: '?url', import: 'default' }),
};

const fileOf = (entry: FinPaymentMethodEntry) =>
  entry.custom ? `./custom/${entry.custom}.svg` : entry.library ? `./library/${entry.library}.svg` : undefined;

/** The default card's icon per size (Figma: 16 / 20 / 24 / 36). */
const DEFAULT_ICON_SIZE: Record<FinPaymentIconSize, FinIconSize> = { small: 16, medium: 20, large: 24, xlarge: 36 };

/**
 * A payment method's logo (Figma Payment Icons; DESIGN.md §6.1, §8.5, §9). Brand logos come from Shopify's open-source
 * `activemerchant/payment_icons` (MIT, pinned), self-hosted; our own logos from src/payment/custom/. Code is the source
 * of truth, Figma is visual reference. Rendered as an `<img>` on a 38 × 24 card, never recolored or distorted.
 * `default` (and any unknown method, or a logo that fails to load) is our generic card, drawn from tokens. Announced as
 * an image named by the brand unless `decorative`.
 */
export function FinPaymentIcon({
  method,
  size = 'medium',
  disabled = false,
  decorative = false,
  label,
  className,
  ...rest
}: FinPaymentIconProps) {
  const known = isFinPaymentMethod(method);
  const entry: FinPaymentMethodEntry = finPaymentMethods[known ? method : 'default'];
  const name = label ?? (known ? entry.name : finPaymentMethods.default.name);
  const file = fileOf(entry);
  const [loaded, setLoaded] = useState<{ file: string; src: string }>();
  const [failed, setFailed] = useState<string>();

  useEffect(() => {
    let current = true;
    if (file)
      void LOADERS[file]?.().then((src) => {
        if (current) setLoaded({ file, src });
      });
    return () => {
      current = false;
    };
  }, [file]);

  const generic = !file || failed === file || !LOADERS[file];

  return (
    <span
      {...rest}
      className={className ? `${styles.icon} ${className}` : styles.icon}
      data-size={size}
      data-default={generic || undefined}
      data-disabled={disabled || undefined}
      {...(decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': name })}
    >
      {generic ? (
        <FinIcon name="credit_card" size={DEFAULT_ICON_SIZE[size]} color="secondary" className={styles.art} />
      ) : (
        loaded?.file === file && (
          <img className={styles.art} src={loaded.src} alt="" draggable={false} onError={() => setFailed(file)} />
        )
      )}
    </span>
  );
}
