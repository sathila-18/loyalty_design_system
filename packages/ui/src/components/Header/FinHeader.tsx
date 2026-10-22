'use client';

import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import { FinButton } from '../Button';
import { FinHeaderNotificationButton, type FinHeaderNotificationButtonProps } from '../HeaderNotificationButton';
import { FinTextBox, type FinHeadingLevel } from '../TextBox';
import styles from './FinHeader.module.css';

export interface FinHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** The page title (the Title Text Box). One line; a longer title ends in "…". */
  heading: ReactNode;
  /** The heading element (default 1: this is the page title). Changes the structure only, never the look. */
  headingLevel?: FinHeadingLevel;
  /**
   * Figma `body content` slot, under the title. A string is shown as Figma's default content, a Text Box description
   * (Body/Medium, `text-secondary`); anything else is placed as it is. Hidden when not passed.
   */
  bodyContent?: ReactNode;
  /** Figma `Show Back Button` (default on). */
  backButton?: boolean;
  /** Called when the back button is pressed. */
  onBack?: MouseEventHandler<HTMLButtonElement>;
  /** The back button's accessible name (default "Back"). */
  backLabel?: string;
  /** Figma `Notification` (default on): the Header notification button. */
  notification?: boolean;
  /** Passed to FinHeaderNotificationButton (`notification`, `count`, `onClick`…). */
  notificationProps?: FinHeaderNotificationButtonProps;
}

/**
 * The page header (Figma Main header; DESIGN.md §9): a back button, the title with its body content, and the
 * notification button. Fills its container.
 */
export function FinHeader({
  heading,
  headingLevel = 1,
  bodyContent,
  backButton = true,
  onBack,
  backLabel = 'Back',
  notification = true,
  notificationProps,
  className,
  ...rest
}: FinHeaderProps) {
  return (
    <header {...rest} className={className ? `${styles.header} ${className}` : styles.header}>
      <div className={styles.main}>
        {backButton && (
          <FinButton variant="tertiary" size="medium" icon="only-icon" iconName="arrow_back" onClick={onBack}>
            {backLabel}
          </FinButton>
        )}
        <div className={styles.text}>
          <FinTextBox type="h4" heading={heading} headingLevel={headingLevel} truncateHeading />
          {bodyContent !== undefined && bodyContent !== null && (
            <div className={styles.body}>
              {typeof bodyContent === 'string' || typeof bodyContent === 'number' ? (
                <FinTextBox type="h4" description={bodyContent} />
              ) : (
                bodyContent
              )}
            </div>
          )}
        </div>
      </div>
      {notification && <FinHeaderNotificationButton {...notificationProps} />}
    </header>
  );
}
