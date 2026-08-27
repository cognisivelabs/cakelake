import type { Category, CatalogItem } from "@/types/catalog";

/**
 * PLACEHOLDER CONTENT — not the real catalogue. The client will provide
 * the actual items, prices, and flavours to go here (see the "Content
 * checklist" in docs/requirements/requirements.md). Every screen reads
 * from getCatalog()/getCategories() below, nothing is hardcoded
 * elsewhere, so swapping in real data is a data change, not a code one.
 *
 * Scope, client-confirmed: only cakes are ordered online. Cupcakes,
 * cookies, pastries, desserts, and savoury items are not — the bakery
 * doesn't take online orders for those.
 */

const CATEGORIES: Category[] = [
  { id: "cakes", label: "Cakes", accent: "#CD346F" },
  { id: "custom-cakes", label: "Custom Cakes", accent: "#91134B" },
];

function flavours(...labels: string[]) {
  return labels.map((label) => ({ id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"), label }));
}

const CATALOG: CatalogItem[] = [
  {
    id: "classic-cakes",
    name: "Classic Cakes",
    categoryId: "cakes",
    description: "Our everyday cake range — a light sponge with buttercream.",
    weightTiers: [
      { id: "half-kg", label: "½ kg", price: 55 },
      { id: "1kg", label: "1 kg", price: 100 },
    ],
    flavours: flavours("Butterscotch", "Black Forest", "Pineapple"),
    readyLabel: "Ready in 1 hour",
    leadTimeHours: 0,
    cakeMessageMaxLength: 40,
    needsCustomDescription: false,
    available: true,
    requiresDelivery: false,
  },
  {
    id: "premium-cakes",
    name: "Premium Cakes",
    categoryId: "cakes",
    description: "Truffle, fresh fruit, and berry finishes.",
    weightTiers: [
      { id: "half-kg", label: "½ kg", price: 65 },
      { id: "1kg", label: "1 kg", price: 115 },
    ],
    flavours: flavours("Chocolate Truffle", "Fresh Fruit", "Mixed Berries"),
    readyLabel: "Ready in 1 hour",
    leadTimeHours: 0,
    cakeMessageMaxLength: 40,
    needsCustomDescription: false,
    available: true,
    requiresDelivery: false,
  },
  {
    id: "exotic-cakes",
    name: "Exotic Cakes",
    categoryId: "cakes",
    description: "Our more distinctive flavours.",
    weightTiers: [
      { id: "half-kg", label: "½ kg", price: 75 },
      { id: "1kg", label: "1 kg", price: 140 },
    ],
    flavours: flavours("Belgian Chocolate", "Salted Caramel", "Pistachio Rose"),
    readyLabel: "Ready in 1 hour",
    leadTimeHours: 0,
    cakeMessageMaxLength: 40,
    needsCustomDescription: false,
    available: true,
    requiresDelivery: false,
  },
  {
    id: "premium-exotic-cakes",
    name: "Premium Exotic Cakes",
    categoryId: "cakes",
    description: "Our top-tier range — whole Rocher, Kinder Bueno, and more.",
    weightTiers: [
      { id: "half-kg", label: "½ kg", price: 85 },
      { id: "1kg", label: "1 kg", price: 160 },
    ],
    flavours: flavours("Nutella Rocher", "Kinder Bueno", "Oreo", "Snickers", "Red Velvet"),
    readyLabel: "Ready in 1 hour",
    leadTimeHours: 0,
    cakeMessageMaxLength: 40,
    needsCustomDescription: false,
    available: true,
    requiresDelivery: false,
  },
  {
    id: "hammer-cakes",
    name: "Hammer Cakes",
    categoryId: "cakes",
    description: "A chocolate shell cake you crack open with a hammer.",
    weightTiers: [{ id: "1kg", label: "1 kg", price: 150 }],
    flavours: flavours("Chocolate", "Strawberry"),
    readyLabel: "24 hours notice",
    leadTimeHours: 24,
    cakeMessageMaxLength: 40,
    needsCustomDescription: false,
    available: true,
    requiresDelivery: false,
  },
  {
    id: "pull-me-up-cakes",
    name: "Pull Me Up Cakes",
    categoryId: "cakes",
    description: "Pull the ribbons to reveal a surprise inside.",
    weightTiers: [{ id: "1kg", label: "1 kg", price: 150 }],
    flavours: flavours("Chocolate", "Vanilla"),
    readyLabel: "24 hours notice",
    leadTimeHours: 24,
    cakeMessageMaxLength: 40,
    needsCustomDescription: false,
    available: true,
    requiresDelivery: false,
  },
  {
    id: "pinata-cakes",
    name: "Pinata Cakes",
    categoryId: "cakes",
    description: "Break it open for the treats hidden inside.",
    weightTiers: [{ id: "1kg", label: "1 kg", price: 160 }],
    flavours: flavours("Chocolate", "Vanilla"),
    readyLabel: "24 hours notice",
    leadTimeHours: 24,
    cakeMessageMaxLength: 40,
    needsCustomDescription: false,
    available: true,
    requiresDelivery: false,
  },
  {
    id: "photo-cakes",
    name: "Photo Cakes",
    categoryId: "custom-cakes",
    description: "An edible print of your photo on the cake.",
    weightTiers: [
      { id: "1kg", label: "1 kg", price: 150 },
      { id: "2kg", label: "2 kg", price: 290 },
      { id: "3kg-plus", label: "3 kg+", price: undefined },
    ],
    flavours: [],
    readyLabel: "24 hours notice",
    leadTimeHours: 24,
    cakeMessageMaxLength: 40,
    needsCustomDescription: true,
    available: true,
    requiresDelivery: true,
  },
  {
    id: "cheese-cakes",
    name: "Cheese Cakes",
    categoryId: "custom-cakes",
    description: "Custom-designed cheesecake.",
    weightTiers: [
      { id: "1kg", label: "1 kg", price: 170 },
      { id: "2kg", label: "2 kg", price: 330 },
      { id: "3kg-plus", label: "3 kg+", price: undefined },
    ],
    flavours: [],
    readyLabel: "24 hours notice",
    leadTimeHours: 24,
    cakeMessageMaxLength: 40,
    needsCustomDescription: true,
    available: true,
    requiresDelivery: true,
  },
  {
    id: "shape-cake",
    name: "Shape Cake",
    categoryId: "custom-cakes",
    description: "Sculpted into a shape of your choice.",
    weightTiers: [
      { id: "1kg", label: "1 kg", price: 190 },
      { id: "2kg", label: "2 kg", price: 380 },
      { id: "3kg-plus", label: "3 kg+", price: undefined },
    ],
    flavours: [],
    readyLabel: "24 hours notice",
    leadTimeHours: 24,
    cakeMessageMaxLength: 40,
    needsCustomDescription: true,
    available: true,
    requiresDelivery: true,
  },
  {
    id: "3d-cakes",
    name: "3D Cakes",
    categoryId: "custom-cakes",
    description: "Designed to your idea in fondant.",
    weightTiers: [
      { id: "1kg", label: "1 kg", price: 190 },
      { id: "2kg", label: "2 kg", price: 380 },
      { id: "3kg-plus", label: "3 kg+", price: undefined },
    ],
    flavours: [],
    readyLabel: "24 hours notice",
    leadTimeHours: 24,
    cakeMessageMaxLength: 40,
    needsCustomDescription: true,
    available: true,
    requiresDelivery: true,
  },
];

export function getCatalog(): CatalogItem[] {
  return CATALOG;
}

export function getCategories(): Category[] {
  return CATEGORIES;
}

export function getCategory(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getItemById(id: string): CatalogItem | undefined {
  return CATALOG.find((item) => item.id === id);
}
