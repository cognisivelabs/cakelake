import type { Category } from "@/types/catalog";

const pink = { accent: "var(--color-pink)", tint: "var(--color-pink-bg)" };
// The one category colour that stands apart: 3D cakes are a from-scratch
// design brief, not a menu flavour.
const berry = { accent: "var(--color-berry)", tint: "var(--color-berry-bg)" };

/**
 * The menu's categories, in display order. `kind` says how a category is
 * sold — it drives the footer's columns, the mega-menu's groups and which
 * tiles get the "custom" look, so none of those hard-code category ids.
 * Halloween and Valentine join once the client supplies their cakes.
 */
export const CATEGORIES: Category[] = [
  { id: "classic-cakes", label: "Classic Cakes", kind: "everyday", ...pink },
  { id: "premium-cakes", label: "Premium Cakes", kind: "everyday", ...pink },
  { id: "exotic-cakes", label: "Exotic Cakes", kind: "everyday", ...pink },
  { id: "exotic-premium-cakes", label: "Exotic Premium Cakes", kind: "everyday", ...pink },
  { id: "cheesecakes", label: "Cheesecakes", kind: "everyday", ...pink },
  { id: "indian-cakes", label: "Flavourful Indian Cakes", kind: "everyday", ...pink },
  { id: "photo-cakes", label: "Photo Cakes", kind: "custom", ...pink },
  { id: "3d-cakes", label: "3D Cakes", kind: "custom", ...berry },
  { id: "pull-me-up-cakes", label: "Pull Me Up Cakes", kind: "made-to-order", ...pink },
  { id: "hammer-cakes", label: "Hammer Cakes", kind: "made-to-order", ...pink },
  { id: "pinata-cakes", label: "Pinata Cakes", kind: "made-to-order", ...pink },
];
