import type { Category } from "@/types/catalog";

/** Pink accent and tint colours. */
const pink = { accent: "var(--color-pink)", tint: "var(--color-pink-bg)" };
/** Berry accent and tint colours, used by Custom Cakes. */
const berry = { accent: "var(--color-berry)", tint: "var(--color-berry-bg)" };

/** The menu's categories, in display order, each with its kind
 * (everyday, made-to-order or custom) and colours. */
export const CATEGORIES: Category[] = [
  { id: 1, slug: "classic-cakes", label: "Classic Cakes", kind: "everyday", ...pink },
  { id: 2, slug: "premium-cakes", label: "Premium Cakes", kind: "everyday", ...pink },
  { id: 3, slug: "exotic-cakes", label: "Exotic Cakes", kind: "everyday", ...pink },
  { id: 4, slug: "exotic-premium-cakes", label: "Exotic Premium Cakes", kind: "everyday", ...pink },
  { id: 5, slug: "cheesecakes", label: "Cheesecakes", kind: "everyday", ...pink },
  { id: 6, slug: "indian-cakes", label: "Flavourful Indian Cakes", kind: "everyday", ...pink },
  { id: 7, slug: "photo-cakes", label: "Photo Cakes", kind: "custom", ...pink },
  { id: 8, slug: "custom-cakes", label: "Custom Cakes", kind: "custom", ...berry },
  { id: 9, slug: "pull-me-up-cakes", label: "Pull Me Up Cakes", kind: "made-to-order", ...pink },
  { id: 10, slug: "hammer-cakes", label: "Hammer Cakes", kind: "made-to-order", ...pink },
  { id: 11, slug: "pinata-cakes", label: "Pinata Cakes", kind: "made-to-order", ...pink },
];
