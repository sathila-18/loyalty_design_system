import type { HTMLAttributes, ReactNode } from 'react';
import * as styles from './FinSignInLayout.styles';

export interface FinSignInLayoutProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
  /**
   * The artwork that fills the image panel: an `<img>`, or next/image with `fill`. It's cropped to cover the panel.
   * Decorative: give it `alt=""`. The library ships no artwork; each app brings its own.
   */
  image: ReactNode;
  /** The heading over the artwork (Figma `Text Block - Dark`). Optional. */
  imageTitle?: ReactNode;
  /** The text under that heading. Optional. */
  imageDescription?: ReactNode;
  /** The form column: logo, Text Box, fields, buttons. In the `main` landmark. */
  children: ReactNode;
}

/**
 * The page shell for sign-in screens (code first, DESIGN.md §9.84): the image panel on the left and the form column on
 * the right, from 1024; below 1024 only the form, centred. Presentational (no 'use client'), so a Server Component can
 * render it. **Public.**
 */
export function FinSignInLayout({ image, imageTitle, imageDescription, children, className, ...rest }: FinSignInLayoutProps) {
  const hasText = imageTitle != null || imageDescription != null;
  return (
    <div {...rest} className={className ? `${styles.layout} ${className}` : styles.layout}>
      <aside className={styles.panel} data-part="panel">
        <div className={styles.image} data-part="image">
          {image}
        </div>
        {hasText && (
          <>
            <div className={styles.scrim} aria-hidden="true" />
            <div className={styles.text}>
              {imageTitle != null && <p className={styles.title}>{imageTitle}</p>}
              {imageDescription != null && <p className={styles.description}>{imageDescription}</p>}
            </div>
          </>
        )}
      </aside>
      <main className={styles.main}>
        <div className={styles.form} data-part="form">
          {children}
        </div>
      </main>
    </div>
  );
}
