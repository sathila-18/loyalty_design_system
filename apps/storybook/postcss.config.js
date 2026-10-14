import postcssCustomMedia from 'postcss-custom-media';

// Breakpoints: component CSS imports @finspace-loyalty/tokens/breakpoints.css and uses
// @media (--fin-bp-lg), compiled here to plain min-width queries (DESIGN.md §3.7).
export default {
  plugins: [postcssCustomMedia()],
};
