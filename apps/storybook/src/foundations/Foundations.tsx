import type { CSSProperties, ReactNode } from 'react';
import { toHex, varName } from './resolve';
import { useComputed } from './useComputed';
import styles from './Foundations.module.css';

export function Page({ title, intro, children }: { title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        {intro && <p className={styles.intro}>{intro}</p>}
      </header>
      {children}
    </div>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </section>
  );
}

export function Notice({ children }: { children: ReactNode }) {
  return (
    <p className={styles.notice} role="note">
      {children}
    </p>
  );
}

/** A color chip with its CSS variable and resolved hex value. `note` adds a line (e.g. what an alias points to). */
export function Swatch({ color, note, deps }: { color: string; note?: string; deps: unknown[] }) {
  const [ref, value] = useComputed('backgroundColor', deps);
  return (
    <div className={styles.swatch}>
      <div ref={ref} className={styles.chip} style={{ '--swatch': color } as CSSProperties} />
      <div className={styles.meta}>
        <code className={styles.name}>{varName(color)}</code>
        {note && <code className={styles.detail}>{note}</code>}
        <code className={styles.detail}>{value && toHex(value)}</code>
      </div>
    </div>
  );
}
