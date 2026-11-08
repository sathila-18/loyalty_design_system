/*
 * FinProfileImage classes (DESIGN.md §9, §3.11). The avatar is FinAvatar and the glyph is FinIcon; these place the
 * badge. The frame is Figma's 100 × 100: the 96 avatar plus the badge sticking out by 4 (profile-image-size in
 * tailwind.css).
 */
export const profile = 'fin:relative fin:inline-flex fin:flex-none fin:items-start fin:profile-image-size';

/*
 * "add image": a 32 circle at the bottom right (68, 68). The Figma stroke is 1px outside the circle: a ring, so the
 * outline stays free for focus. Focus ring: 2px, 2px offset (decided 15 Oct 2026; §10 #6). Hover and pressed wait for
 * design (decided 15 Oct 2026).
 */
export const badge =
  'fin:absolute fin:bottom-none fin:end-none fin:flex fin:items-center fin:justify-center fin:size-32 fin:p-none ' +
  'fin:border-none fin:border-current fin:rounded-full fin:bg-fg-action fin:ring fin:ring-subtle fin:cursor-pointer ' +
  'fin:focus-visible:outline-2 fin:focus-visible:outline-offset-2 fin:focus-visible:outline-focused';
