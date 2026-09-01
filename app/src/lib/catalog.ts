import type { Category, CatalogItem } from "@/types/catalog";
import { CONFIG } from "@/lib/config";

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

function flavours(...entries: (string | { label: string; description?: string })[]) {
  return entries.map((entry) => {
    const label = typeof entry === "string" ? entry : entry.label;
    const description = typeof entry === "string" ? undefined : entry.description;
    return {
      id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      label,
      ...(description ? { description } : {}),
    };
  });
}

const CATALOG: CatalogItem[] = [
  {
    id: "classic-cakes",
    name: "Classic Cakes",
    categoryId: "cakes",
    description: "Ultra moist cake with each bite having a creamy butterscotch mouthfeel.",
    weightTiers: [
      { id: "half-kg", label: "½ kg", price: 55 },
      { id: "1kg", label: "1 kg", price: 100 },
    ],
    flavours: [
      {
        id: "butterscotch",
        label: "Butterscotch",
        imageUrl: "/images/classic-butterscotch.jpg",
        description: "Ultra moist cake with each bite having a creamy butterscotch mouthfeel.",
      },
      ...flavours(
        {
          label: "Black Forest",
          description: "A divine combination of chocolate, cherries and whipped cream in every layer.",
        },
        {
          label: "Pineapple",
          description: "A light and airy cake with tropical, fresh pineapple in every bite.",
        },
      ),
    ],
    readyLabel: "Ready in 1 hour",
    leadTimeHours: 0,
    cakeMessageMaxLength: CONFIG.cakeMessageMaxLength,
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
    flavours: flavours(
      {
        label: "Dark Chocolate Truffle",
        description: "Love dark chocolate? This luxurious, ganache based cake is for you.",
      },
      {
        label: "Milk Chocolate Truffle",
        description:
          "A chocolate layer cake recipe with dense, moist chocolate cake, silky chocolate truffle frosting.",
      },
      {
        label: "Chocolate Vanilla",
        description:
          "Soft, buttery, fluffy, moist, and filled with rich chocolate and vanilla flavor with zebra design.",
      },
      {
        label: "Chocolate Chips Loaded",
        description: "Delicious taste of chocolate cake with chocolate chips, moist and fluffy. Kids' favourite.",
      },
      {
        label: "Dark Chocolate Strawberry",
        description:
          "Made with moist and rich dark chocolate cake layers, silky smooth strawberry cream, dark chocolate ganache.",
      },
      {
        label: "Strawberry",
        description: "Strawberry cake in combination of vanilla sponge with strawberry filling with nice presentation.",
      },
      {
        label: "Blueberry",
        description: "Tangy, tart and sweet. Creamy blueberry reduction in between layers of vanilla cake.",
      },
      {
        label: "Fresh Fruit",
        description:
          "Subtle, delectable vanilla cake with fresh, fruity goodness in every bite. Made of fresh fruit with less sugar.",
      },
    ),
    readyLabel: "Ready in 1 hour",
    leadTimeHours: 0,
    cakeMessageMaxLength: CONFIG.cakeMessageMaxLength,
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
    flavours: flavours(
      {
        label: "Chocolate Mousse",
        description: "A classic with layers of moist chocolate cake and creamy chocolate mousse.",
      },
      {
        label: "Chocolate Brownie",
        description: "Dense brownie sponge topped with chocolate ganache and decorated with chocolate brownie balls.",
      },
      {
        label: "Hazelnut Crunch",
        description:
          "A rich hazelnut ganache in between layers of velvety chocolate sponge. A favourite with those who like a little crunch and texture in every bite.",
      },
      {
        label: "White Chocolate Coconut",
        description:
          "Layered with white chocolate ganache and coconut flakes, garnished with white chocolate coconut truffle balls.",
      },
      {
        label: "Cafe Latte",
        description: "A coffee lover's delight — a light and airy vanilla-based cake with a coffee frosting.",
      },
      {
        label: "Mango",
        description: "Moist and spongy mango cake layered with mango cream, topped with fresh mango pieces.",
      },
      {
        label: "Caramel Chocolate",
        description: "Moist chocolate cake layered with delicious chocolate caramel and crunchy bits.",
      },
      {
        label: "Triple Chocolate Indulgence",
        description:
          "Three different chocolate frostings — white, milk and dark — creating an ombre effect. Every chocoholic's dream come true.",
      },
      "Lush Berries",
      "Raspberry & White Chocolate",
      "Ragi Cake (Dry Fruits & Banana)",
    ),
    readyLabel: "Ready in 1 hour",
    leadTimeHours: 0,
    cakeMessageMaxLength: CONFIG.cakeMessageMaxLength,
    needsCustomDescription: false,
    available: true,
    requiresDelivery: false,
  },
  {
    id: "premium-exotic-cakes",
    name: "Exotic Premium Cakes",
    categoryId: "cakes",
    description: "Our top-tier range — whole Rocher, Kinder Bueno, and more.",
    weightTiers: [
      { id: "half-kg", label: "½ kg", price: 85 },
      { id: "1kg", label: "1 kg", price: 160 },
    ],
    flavours: flavours(
      {
        label: "Oreo",
        description: "The perfect combo of an incredibly moist chocolate cake with crushed Oreo cookies.",
      },
      {
        label: "Snickers",
        description: "A cake reminiscent of a Snickers bar, with a peanut nougat, salted caramel filling.",
      },
      "Red Velvet",
      {
        label: "Pinacolada",
        description:
          "This unique, alcohol-free cake pays homage to the classic beverage — coconut, pineapple bits and whipped cream.",
      },
      {
        label: "Kinder Bueno",
        description:
          "A perfect celebration cake smothered in chocolate hazelnut cream and decorated with an array of Kinder Bueno chocolates.",
      },
      {
        label: "Lotus Biscoff",
        description: "The ultimate cake for Biscoff lovers — made with both crushed Biscoff biscuits and Biscoff spread.",
      },
      {
        label: "Nutella Rocher",
        description:
          "Chocolate sponge layers sandwiched with Nutella cream and Ferrero Rocher bits. Recommended for all Nutella lovers out there.",
      },
      "KitKat & Gems",
      "Rose & Pistachio",
    ),
    readyLabel: "Ready in 1 hour",
    leadTimeHours: 0,
    cakeMessageMaxLength: CONFIG.cakeMessageMaxLength,
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
    cakeMessageMaxLength: CONFIG.cakeMessageMaxLength,
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
    cakeMessageMaxLength: CONFIG.cakeMessageMaxLength,
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
    cakeMessageMaxLength: CONFIG.cakeMessageMaxLength,
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
    cakeMessageMaxLength: CONFIG.cakeMessageMaxLength,
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
    cakeMessageMaxLength: CONFIG.cakeMessageMaxLength,
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
    cakeMessageMaxLength: CONFIG.cakeMessageMaxLength,
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
    cakeMessageMaxLength: CONFIG.cakeMessageMaxLength,
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
