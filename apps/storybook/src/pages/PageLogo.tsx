import { FinIcon, FinLogo } from '@finspace-loyalty/ui';
import styles from './PageLogo.module.css';

/**
 * The logo slot, following the Brand toolbar (decided by design 4 Nov 2026; DESIGN.md §9.83): Sampath's logo (Small;
 * White in Dark), or for Finspace and Burgundy a placeholder like Figma's (the `image` icon in the brand colour and
 * "Fintech loyalty"), as the side nav stories.
 */
export const PageLogo = ({ brand }: { brand: string | undefined }) =>
  brand === 'sampath' ? (
    <FinLogo brand="sampath" />
  ) : (
    <span className={styles.logo}>
      <span className={styles.logoImage}>
        <FinIcon name="image" size={36} color="brand" />
      </span>
      <span className={styles.companyName}>Fintech loyalty</span>
    </span>
  );
