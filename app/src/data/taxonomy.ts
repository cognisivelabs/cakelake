import type { FlavourTag, Occasion } from "@/types/catalog";

export const OCCASIONS: Occasion[] = [
  { id: "birthday", label: "Birthday", imageUrl: "/images/exotic-premium-oreo.jpg" },
  { id: "anniversary", label: "Anniversary", imageUrl: "/images/hammer-heart-shape.jpg" },
  { id: "new-baby", label: "New baby", imageUrl: "/images/indian-rasmalai.jpg" },
  { id: "graduation", label: "Graduation", imageUrl: "/images/photo-cakes.jpg" },
  // Halloween and Valentine are in the design as seasonal occasions, but
  // the client hasn't supplied their content yet — added with their
  // seasonal categories.
];

export const FLAVOUR_TAGS: FlavourTag[] = [
  { id: "chocolate-truffle", label: "Chocolate truffle" },
  { id: "red-velvet", label: "Red velvet" },
  { id: "biscoff", label: "Biscoff" },
  { id: "black-forest", label: "Black forest" },
  { id: "butterscotch", label: "Butterscotch" },
  { id: "fresh-fruit", label: "Fresh fruit" },
  { id: "pistachio-rose", label: "Pistachio & rose" },
  { id: "indian-sweets", label: "Indian sweets" },
];

/**
 * Which occasions each category suits. PLACEHOLDER mapping — the client
 * hasn't said which cakes go with which occasion, so this is a sensible
 * first pass by category; adjust here (or override per item below) once
 * they do.
 */
export const CATEGORY_OCCASIONS: Record<string, string[]> = {
  "classic-cakes": ["birthday", "anniversary", "new-baby", "graduation"],
  "premium-cakes": ["birthday", "anniversary", "new-baby", "graduation"],
  "exotic-cakes": ["birthday", "anniversary", "new-baby", "graduation"],
  "exotic-premium-cakes": ["birthday", "anniversary", "new-baby", "graduation"],
  cheesecakes: ["birthday", "anniversary", "new-baby"],
  "indian-cakes": ["birthday", "anniversary"],
  "photo-cakes": ["birthday", "anniversary", "new-baby", "graduation"],
  "3d-cakes": ["birthday", "anniversary", "new-baby", "graduation"],
  "pull-me-up-cakes": ["birthday", "graduation"],
  "hammer-cakes": ["birthday", "anniversary"],
  "pinata-cakes": ["birthday", "graduation"],
};

/** Item ids grouped under each flavour tag (an item can be in several). */
export const FLAVOUR_ITEMS: Record<string, string[]> = {
  "chocolate-truffle": ["premium-cakes-dark-chocolate-truffle", "premium-cakes-milk-chocolate-truffle"],
  "red-velvet": ["exotic-premium-cakes-red-velvet", "pull-me-up-cakes-red-velvet"],
  biscoff: [
    "exotic-premium-cakes-lotus-biscoff",
    "cheesecakes-lotus-biscoff",
    "pull-me-up-cakes-biscoff",
  ],
  "black-forest": ["classic-cakes-black-forest"],
  butterscotch: ["classic-cakes-butterscotch"],
  "fresh-fruit": ["premium-cakes-fresh-fruit", "pinata-cakes-fresh-fruit"],
  "pistachio-rose": ["exotic-premium-cakes-rose-pistachio"],
  "indian-sweets": [
    "indian-cakes-motichoor",
    "indian-cakes-kaju-katli",
    "indian-cakes-gulkand",
    "indian-cakes-gulab-jamun",
    "indian-cakes-rasmalai",
  ],
};

/**
 * Home's "Most ordered" row, in display order. Taken from the client's
 * design — not yet confirmed as the real best-sellers.
 */
export const MOST_ORDERED: string[] = [
  "exotic-premium-cakes-nutella-rocher",
  "classic-cakes-butterscotch",
  "exotic-premium-cakes-lotus-biscoff",
  "premium-cakes-dark-chocolate-truffle",
];
