import type { FlavourTag, Occasion } from "@/types/catalog";

export const OCCASIONS: Occasion[] = [
  { id: 1, slug: "birthday", label: "Birthday", imageUrl: "/images/exotic-premium-oreo.jpg" },
  { id: 2, slug: "anniversary", label: "Anniversary", imageUrl: "/images/hammer-heart-shape.jpg" },
  { id: 3, slug: "new-baby", label: "New baby", imageUrl: "/images/indian-rasmalai.jpg" },
  { id: 4, slug: "graduation", label: "Graduation", imageUrl: "/images/photo-cakes.jpg" },
  // Halloween and Valentine are in the design as seasonal occasions, but
  // the client hasn't supplied their content yet — added with their
  // seasonal categories.
];

export const FLAVOUR_TAGS: FlavourTag[] = [
  { id: 1, slug: "chocolate-truffle", label: "Chocolate truffle" },
  { id: 2, slug: "red-velvet", label: "Red velvet" },
  { id: 3, slug: "biscoff", label: "Biscoff" },
  { id: 4, slug: "black-forest", label: "Black forest" },
  { id: 5, slug: "butterscotch", label: "Butterscotch" },
  { id: 6, slug: "fresh-fruit", label: "Fresh fruit" },
  { id: 7, slug: "pistachio-rose", label: "Pistachio & rose" },
  { id: 8, slug: "indian-sweets", label: "Indian sweets" },
];

/**
 * Occasion ids for each category id. PLACEHOLDER mapping — the client
 * hasn't said which cakes go with which occasion, so this is a sensible
 * first pass by category; adjust here (or override per item below) once
 * they do.
 */
export const CATEGORY_OCCASIONS: Record<number, number[]> = {
  1: [1, 2, 3, 4], // classic-cakes
  2: [1, 2, 3, 4], // premium-cakes
  3: [1, 2, 3, 4], // exotic-cakes
  4: [1, 2, 3, 4], // exotic-premium-cakes
  5: [1, 2, 3], // cheesecakes
  6: [1, 2], // indian-cakes
  7: [1, 2, 3, 4], // photo-cakes
  8: [1, 2, 3, 4], // custom-cakes
  9: [1, 4], // pull-me-up-cakes
  10: [1, 2], // hammer-cakes
  11: [1, 4], // pinata-cakes
};

/** Item ids grouped under each flavour tag id (an item can be in several). */
export const FLAVOUR_ITEMS: Record<number, number[]> = {
  1: [4, 5], // chocolate-truffle
  2: [22, 45], // red-velvet
  3: [25, 32, 40], // biscoff
  4: [2], // black-forest
  5: [1], // butterscotch
  6: [11, 46], // fresh-fruit
  7: [28], // pistachio-rose
  8: [34, 35, 36, 37, 38], // indian-sweets
};

/**
 * Home's "Most ordered" row, in display order. Taken from the client's
 * design — not yet confirmed as the real best-sellers.
 */
export const MOST_ORDERED: number[] = [
  26, // exotic-premium-cakes-nutella-rocher
  1, // classic-cakes-butterscotch
  25, // exotic-premium-cakes-lotus-biscoff
  4, // premium-cakes-dark-chocolate-truffle
];
