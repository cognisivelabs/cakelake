import type { FlavourTag, Occasion } from "@/types/catalog";

export const OCCASIONS: Occasion[] = [
  { id: 1, slug: "birthday", label: "Birthday", imageUrl: "/images/exotic-premium-oreo.jpg" },
  { id: 2, slug: "anniversary", label: "Anniversary", imageUrl: "/images/hammer-heart-shape.jpg" },
  { id: 3, slug: "new-baby", label: "New baby", imageUrl: "/images/indian-rasmalai.jpg" },
  { id: 4, slug: "graduation", label: "Graduation", imageUrl: "/images/photo-cakes.jpg" },
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
