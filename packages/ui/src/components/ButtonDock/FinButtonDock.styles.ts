/*
 * FinButtonDock classes (DESIGN.md §9, §3.11). Figma Button dock: bg-primary, padding Space-XL (16) at the top,
 * Space-3XL (24) at the sides and Space-6XL (40) at the bottom; the accessory Space-3XL above the buttons; the buttons
 * Space-XL apart, each as wide as its label: Tertiary at the start, Secondary and Primary at the end (changed by design
 * 2 Nov 2026; Figma: sharing the rest equally). Sticky casts Shadow/Sticky upward.
 */

const dockBase = 'fin:flex fin:flex-col fin:gap-3xl fin:box-border fin:w-full fin:pt-xl fin:px-3xl fin:pb-6xl fin:bg-primary';

export const dock = { still: dockBase, sticky: `${dockBase} fin:shadow-sticky` };

export const accessory = 'fin:flex fin:flex-col fin:gap-xl';

export const buttons = 'fin:flex fin:gap-xl fin:items-center';

/* Secondary and Primary at the end: the first of them takes the free space before it. */
export const firstEnd = 'fin:ms-auto';

/*
 * `width="fill"`: equal shares of the width left after the Tertiary button (dock-fill in tailwind.css). It replaces
 * FinButtonBase's flex-none, so `placement:` lets it win (both in @layer fin), as the dock's CSS Module did before.
 */
export const fill = 'fin:placement:dock-fill fin:min-w-0';
