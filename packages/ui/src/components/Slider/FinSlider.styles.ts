/*
 * FinSlider classes (DESIGN.md §9, §3.11). A native range input, restyled through the range-track / range-thumb
 * variants (tailwind.css). Standard slider geometry (decided 15 Oct 2026): the handle's centre travels from 12px to
 * (width - 12px) so it never leaves the track, and the fill runs to its centre: the fill is the track's background
 * (slider-fill), driven by --fraction (0-1) set on the element. Hover and pressed have no design yet: cursor only.
 * No animation (motion is deferred, §5).
 */

export const slider =
  'fin:block fin:w-full fin:h-24 fin:m-none fin:bg-transparent fin:cursor-pointer fin:appearance-none ' +
  'fin:disabled:cursor-default fin:focus-visible:outline-none ' +
  // Track (8 tall, Radius-XS) with the fill up to the handle's centre.
  'fin:range-track:h-8 fin:range-track:rounded-xs fin:range-track:slider-fill fin:disabled:range-track:slider-fill-disabled ' +
  // Handle: 24px fg-brand circle, 2px border-inverse ring inside, the Resting cards shadow; centred on the track in WebKit.
  'fin:range-thumb:box-border fin:range-thumb:size-24 fin:range-thumb:border-2 fin:range-thumb:border-inverse fin:range-thumb:rounded-full ' +
  'fin:range-thumb:bg-fg-brand fin:range-thumb:shadow-resting-cards fin:webkit-range-thumb:-mt-m fin:webkit-range-thumb:appearance-none ' +
  // Disabled: fg-disabled handle, no shadow (decided 15 Oct 2026).
  'fin:disabled:range-thumb:bg-fg-disabled fin:disabled:range-thumb:shadow-none ' +
  // Focus: the default ring (2px border-focused, 2px offset, §10 #6) around the handle.
  'fin:focus-visible:range-thumb:outline-2 fin:focus-visible:range-thumb:outline-offset-2 fin:focus-visible:range-thumb:outline-focused';
