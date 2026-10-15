/** The Badge-primary `State` colors, in Figma order (DESIGN.md §9.10). The one list every badge and story uses. */
export const FIN_BADGE_TONES = ['primary', 'secondary', 'success', 'error', 'info', 'warning', 'disabled', 'neutral'] as const;
/** A badge tone. `primary` is Badge-base's own color. */
export type FinBadgeTone = (typeof FIN_BADGE_TONES)[number];
