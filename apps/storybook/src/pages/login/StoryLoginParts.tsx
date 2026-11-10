import type { LoginArtwork } from '@finspace-loyalty/login/screens';
import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from 'react';
import { logNavigation } from './storyRoutes';

/*
 * The plain link and the artwork of Storybook's login platform (storybookPlatform.ts). A link to a screen that has a
 * story opens that story (the whole Storybook window, as a plain link); a screen with no story yet is logged in the
 * Actions panel instead (decided 10 Nov 2026).
 */

/** A plain link: to a story, it opens it in the Storybook window; to a screen without a story, it's logged. */
export const StoryLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(function StoryLink(
  { href = '', onClick, children, ...rest },
  ref,
) {
  const toStory = href.startsWith('/?path=');
  const click = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (!toStory) {
      event.preventDefault();
      logNavigation(href.slice(1));
    }
  };
  return (
    <a {...rest} ref={ref} href={href} target={toStory ? '_top' : undefined} onClick={click}>
      {children}
    </a>
  );
});

/* The login app's artwork (apps/login/public/sign-in), served by Storybook's staticDirs. */
export function StoryArtwork({ artwork }: { artwork: LoginArtwork }) {
  return <img src={`/sign-in/${artwork}.jpg`} alt="" />;
}

