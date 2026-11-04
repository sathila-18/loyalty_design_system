/** The brands with a logo (FinLogo). Finspace and Burgundy have none yet: apps show their own (Storybook: a placeholder). */
export const FIN_LOGO_BRANDS = ['sampath'] as const;
export type FinLogoBrand = (typeof FIN_LOGO_BRANDS)[number];
