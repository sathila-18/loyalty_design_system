/**
 * The icon registry (DESIGN.md §6.2, §6.4): every Material Symbols Rounded icon the system uses,
 * by its current Material Symbols name. FinIcon only accepts these names, and the build subsets
 * the icon font to exactly this list (scripts/subset-icons.ts). Add an icon here, in order.
 */
export const finIcons = [
  'arrow_back',
  'arrow_downward',
  'arrow_upward',
  'assignment',
  'cancel',
  'check',
  'check_circle',
  'chevron_left',
  'chevron_right',
  'close',
  'cloud_upload',
  'credit_card',
  'desktop_windows',
  'dock_to_right',
  'edit',
  'home',
  'image',
  'info',
  'keyboard_arrow_down',
  'keyboard_arrow_right',
  'keyboard_arrow_up',
  'loyalty',
  'notifications',
  'person',
  'photo_camera',
  'plagiarism',
  'remove',
  'search',
  'sports_esports',
  'supervised_user_circle',
  'unfold_more',
  'visibility',
  'visibility_off',
  'warning',
] as const;

export type FinIconName = (typeof finIcons)[number];
