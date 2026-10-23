import { FinIcon } from '@finspace-loyalty/ui';
import styles from './PageLogo.module.css';

/** The logo slot: a placeholder like Figma's, until there's a real logo (as the side nav stories). */
export const PageLogo = () => (
  <span className={styles.logo}>
    <span className={styles.logoImage}>
      <FinIcon name="image" size={36} color="brand" />
    </span>
    <span className={styles.companyName}>Company name</span>
  </span>
);
