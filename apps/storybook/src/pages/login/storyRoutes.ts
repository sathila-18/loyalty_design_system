import type { LoginRoute } from '@finspace-loyalty/login/screens';
import { action } from 'storybook/actions';

/** The story each screen opens. Add a screen here when its story exists. */
export const STORIES: Partial<Record<LoginRoute, string>> = {
  login: 'pages-login-login--default',
};

export const storyHref = (route: LoginRoute) => {
  const id = STORIES[route];
  return id ? `/?path=/story/${id}` : `#${route}`;
};

export const logNavigation = action('navigate');

