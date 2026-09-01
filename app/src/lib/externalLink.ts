// Spread onto every external-link anchor (`<a {...EXTERNAL_LINK_PROPS} .../>`)
// instead of typing target/rel out by hand at each of the 8 call sites.
export const EXTERNAL_LINK_PROPS = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;
