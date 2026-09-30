import type { Category } from "@/types/catalog";

/** The menu's categories, in display order, each with its kind
 * (everyday, made-to-order or custom) and colours. */
export const CATEGORIES: Category[] = [
  { id: 1, slug: "classic-cakes", label: "Classic Cakes", kind: "everyday", colour: "pink" },
  { id: 2, slug: "premium-cakes", label: "Premium Cakes", kind: "everyday", colour: "pink" },
  { id: 3, slug: "exotic-cakes", label: "Exotic Cakes", kind: "everyday", colour: "pink" },
  { id: 4, slug: "exotic-premium-cakes", label: "Exotic Premium Cakes", kind: "everyday", colour: "pink" },
  { id: 5, slug: "cheesecakes", label: "Cheesecakes", kind: "everyday", colour: "pink" },
  { id: 6, slug: "indian-cakes", label: "Flavourful Indian Cakes", kind: "everyday", colour: "pink" },
  { id: 7, slug: "photo-cakes", label: "Photo Cakes", kind: "custom", colour: "pink" },
  { id: 8, slug: "custom-cakes", label: "Custom Cakes", kind: "custom", colour: "berry" },
  { id: 9, slug: "pull-me-up-cakes", label: "Pull Me Up Cakes", kind: "made-to-order", colour: "pink" },
  { id: 10, slug: "hammer-cakes", label: "Hammer Cakes", kind: "made-to-order", colour: "pink" },
  { id: 11, slug: "pinata-cakes", label: "Pinata Cakes", kind: "made-to-order", colour: "pink" },
];
