import type { Category } from "@/types/catalog";

/** Pink accent and tint colours. */
const pink = { accent: "var(--color-pink)", tint: "var(--color-pink-bg)" };
/** Berry accent and tint colours, used by Custom Cakes. */
const berry = { accent: "var(--color-berry)", tint: "var(--color-berry-bg)" };

/** The menu's categories, in display order, each with its kind
 * (everyday, made-to-order or custom) and colours. */
export const CATEGORIES: Category[] = [
  { id: "classic-cakes", label: "Classic Cakes", kind: "everyday", ...pink },
  { id: "premium-cakes", label: "Premium Cakes", kind: "everyday", ...pink },
  { id: "exotic-cakes", label: "Exotic Cakes", kind: "everyday", ...pink },
  { id: "exotic-premium-cakes", label: "Exotic Premium Cakes", kind: "everyday", ...pink },
  { id: "cheesecakes", label: "Cheesecakes", kind: "everyday", ...pink },
  { id: "indian-cakes", label: "Flavourful Indian Cakes", kind: "everyday", ...pink },
  { id: "photo-cakes", label: "Photo Cakes", kind: "custom", ...pink },
  { id: "custom-cakes", label: "Custom Cakes", kind: "custom", ...berry },
  { id: "pull-me-up-cakes", label: "Pull Me Up Cakes", kind: "made-to-order", ...pink },
  { id: "hammer-cakes", label: "Hammer Cakes", kind: "made-to-order", ...pink },
  { id: "pinata-cakes", label: "Pinata Cakes", kind: "made-to-order", ...pink },
];
