import type { CatalogItem, WeightTier } from "@/types/catalog";
import { CONFIG } from "@/lib/config";

// The menu's items, one per flavour (or shape), grouped by category.
// Some prices, sizes and photos are placeholders until the client
// supplies them, as are the occasions per category and the "Most
// ordered" ranks (taken from the client's design).

/** Every cake size, smallest first: its weight tier id, label, weight in
 * kg and how many people it serves. */
const SIZES = {
  "half-kg": { id: 1, label: "½ kg", kg: 0.5, serves: "Serves 2–4" },
  "1kg": { id: 2, label: "1 kg", kg: 1, serves: "Serves 5–6" },
  "1.5kg": { id: 3, label: "1½ kg", kg: 1.5, serves: "Serves 8–10" },
  "2kg": { id: 4, label: "2 kg", kg: 2, serves: "Serves 10–12" },
  "2.5kg": { id: 5, label: "2½ kg", kg: 2.5, serves: "Serves 12–15" },
  "3kg": { id: 6, label: "3 kg", kg: 3, serves: "Serves 15–18" },
  "3kg-plus": { id: 7, label: "3 kg+", kg: 3, serves: "Serves 18+" },
} as const;

/** A key of SIZES, e.g. "half-kg". */
type SizeKey = keyof typeof SIZES;

/** The sizes each group of categories is sold in. */
const HALF_TO_3KG: SizeKey[] = ["half-kg", "1kg", "1.5kg", "2kg", "2.5kg", "3kg"];
const HALF_TO_1_5KG: SizeKey[] = ["half-kg", "1kg", "1.5kg"];
const CUSTOM_SIZES: SizeKey[] = ["1kg", "1.5kg", "2kg", "2.5kg", "3kg-plus"];

/** One weight tier per size, priced from `prices`; a size with no price
 * shows "Ask us". */
function weightTiers(sizes: SizeKey[], prices: Partial<Record<SizeKey, number>>): WeightTier[] {
  return sizes.map((key) => ({ ...SIZES[key], price: prices[key] }));
}

/** One flavour of a category: its id, slug and name, optionally with its
 * own description, photo, flavour tag ids and "Most ordered" rank. */
type ItemEntry = Pick<CatalogItem, "id" | "slug" | "flavours" | "mostOrderedRank"> & {
  label: string;
  description?: string;
  imageUrl?: string;
};

/** One category's items and what they share. */
type CategorySpec = {
  categoryId: number;
  /** Occasion ids every item in the category suits. */
  occasions: number[];
  /** Description for items without their own. */
  fallbackDescription?: string;
  tiers: WeightTier[];
  leadTimeHours: number;
  /** Defaults to false. */
  requiresDelivery?: boolean;
  items: ItemEntry[];
};

/** One CatalogItem per entry, all sharing the category's occasions,
 * tiers, lead time and delivery rule. */
function categoryItems({
  categoryId,
  occasions,
  fallbackDescription = "",
  tiers,
  leadTimeHours,
  requiresDelivery = false,
  items,
}: CategorySpec): CatalogItem[] {
  return items.map(({ id, slug, label, description, imageUrl, flavours, mostOrderedRank }) => ({
    id,
    slug,
    name: label,
    categoryId,
    description: description ?? fallbackDescription,
    occasions,
    ...(flavours ? { flavours } : {}),
    ...(mostOrderedRank ? { mostOrderedRank } : {}),
    weightTiers: tiers,
    leadTimeHours,
    cakeMessageMaxLength: CONFIG.cakeMessageMaxLength,
    available: true,
    requiresDelivery,
    ...(imageUrl ? { imageUrl } : {}),
  }));
}

/** Every item on the menu, in menu order. */
export const CATALOG: CatalogItem[] = [
  ...categoryItems({
    categoryId: 1, // classic-cakes
    occasions: [1, 2, 3, 4], // birthday, anniversary, new-baby, graduation
    tiers: weightTiers(HALF_TO_3KG, { "half-kg": 55, "1kg": 100 }),
    leadTimeHours: 0,
    items: [
      {
        id: 1,
        slug: "classic-cakes-butterscotch",
        label: "Butterscotch",
        description: "Ultra moist cake with each bite having a creamy butterscotch mouthfeel.",
        imageUrl: "/images/classic-butterscotch.jpg",
        flavours: [5],
        mostOrderedRank: 2,
      },
      {
        id: 2,
        slug: "classic-cakes-black-forest",
        label: "Black Forest",
        description: "A divine combination of chocolate, cherries and whipped cream in every layer.",
        imageUrl: "/images/classic-black-forest.jpg",
        flavours: [4],
      },
      {
        id: 3,
        slug: "classic-cakes-pineapple",
        label: "Pineapple",
        description: "A light and airy cake with tropical, fresh pineapple in every bite.",
        imageUrl: "/images/classic-pineapple.jpg",
      },
    ],
  }),

  ...categoryItems({
    categoryId: 2, // premium-cakes
    occasions: [1, 2, 3, 4], // birthday, anniversary, new-baby, graduation
    tiers: weightTiers(HALF_TO_3KG, { "half-kg": 65, "1kg": 115 }),
    leadTimeHours: 0,
    items: [
      {
        id: 4,
        slug: "premium-cakes-dark-chocolate-truffle",
        label: "Dark Chocolate Truffle",
        description: "Love dark chocolate? This luxurious, ganache based cake is for you.",
        imageUrl: "/images/premium-dark-chocolate-truffle.jpg",
        flavours: [1],
        mostOrderedRank: 4,
      },
      {
        id: 5,
        slug: "premium-cakes-milk-chocolate-truffle",
        label: "Milk Chocolate Truffle",
        description:
          "A chocolate layer cake recipe with dense, moist chocolate cake, silky chocolate truffle frosting.",
        imageUrl: "/images/premium-milk-chocolate-truffle.jpg",
        flavours: [1],
      },
      {
        id: 6,
        slug: "premium-cakes-chocolate-vanilla",
        label: "Chocolate Vanilla",
        description:
          "Soft, buttery, fluffy, moist, and filled with rich chocolate and vanilla flavor with zebra design.",
        imageUrl: "/images/premium-chocolate-vanilla.jpg",
      },
      {
        id: 7,
        slug: "premium-cakes-chocolate-chips-loaded",
        label: "Chocolate Chips Loaded",
        description: "Delicious taste of chocolate cake with chocolate chips, moist and fluffy. Kids' favourite.",
        imageUrl: "/images/premium-chocolate-chips-loaded.jpg",
      },
      {
        id: 8,
        slug: "premium-cakes-dark-chocolate-strawberry",
        label: "Dark Chocolate Strawberry",
        description:
          "Made with moist and rich dark chocolate cake layers, silky smooth strawberry cream, dark chocolate ganache.",
        imageUrl: "/images/premium-dark-chocolate-strawberry.jpg",
      },
      {
        id: 9,
        slug: "premium-cakes-strawberry",
        label: "Strawberry",
        description: "Strawberry cake in combination of vanilla sponge with strawberry filling with nice presentation.",
        imageUrl: "/images/premium-strawberry.jpg",
      },
      {
        id: 10,
        slug: "premium-cakes-blueberry",
        label: "Blueberry",
        description: "Tangy, tart and sweet. Creamy blueberry reduction in between layers of vanilla cake.",
        imageUrl: "/images/premium-blueberry.jpg",
      },
      {
        id: 11,
        slug: "premium-cakes-fresh-fruit",
        label: "Fresh Fruit",
        description:
          "Subtle, delectable vanilla cake with fresh, fruity goodness in every bite. Made of fresh fruit with less sugar.",
        imageUrl: "/images/premium-fresh-fruit.jpg",
        flavours: [6],
      },
    ],
  }),

  ...categoryItems({
    categoryId: 3, // exotic-cakes
    occasions: [1, 2, 3, 4], // birthday, anniversary, new-baby, graduation
    tiers: weightTiers(HALF_TO_3KG, { "half-kg": 75, "1kg": 140 }),
    leadTimeHours: 0,
    items: [
      {
        id: 12,
        slug: "exotic-cakes-chocolate-mousse",
        label: "Chocolate Mousse",
        description: "A classic with layers of moist chocolate cake and creamy chocolate mousse.",
        imageUrl: "/images/exotic-chocolate-mousse.jpg",
      },
      {
        id: 13,
        slug: "exotic-cakes-chocolate-brownie",
        label: "Chocolate Brownie",
        description: "Dense brownie sponge topped with chocolate ganache and decorated with chocolate brownie balls.",
        imageUrl: "/images/exotic-chocolate-brownie.jpg",
      },
      {
        id: 14,
        slug: "exotic-cakes-hazelnut-crunch",
        label: "Hazelnut Crunch",
        description:
          "A rich hazelnut ganache in between layers of velvety chocolate sponge. A favourite with those who like a little crunch and texture in every bite.",
        imageUrl: "/images/exotic-hazelnut-crunch.jpg",
      },
      {
        id: 15,
        slug: "exotic-cakes-white-chocolate-coconut",
        label: "White Chocolate Coconut",
        description:
          "Layered with white chocolate ganache and coconut flakes, garnished with white chocolate coconut truffle balls.",
        imageUrl: "/images/exotic-white-chocolate-coconut.jpg",
      },
      {
        id: 16,
        slug: "exotic-cakes-cafe-latte",
        label: "Cafe Latte",
        description: "A coffee lover's delight — a light and airy vanilla-based cake with a coffee frosting.",
        imageUrl: "/images/exotic-cafe-latte.jpg",
      },
      {
        id: 17,
        slug: "exotic-cakes-mango",
        label: "Mango",
        description: "Moist and spongy mango cake layered with mango cream, topped with fresh mango pieces.",
        imageUrl: "/images/exotic-mango.jpg",
      },
      {
        id: 18,
        slug: "exotic-cakes-caramel-chocolate",
        label: "Caramel Chocolate",
        description: "Moist chocolate cake layered with delicious chocolate caramel and crunchy bits.",
        imageUrl: "/images/exotic-caramel-chocolate.jpg",
      },
      {
        id: 19,
        slug: "exotic-cakes-triple-chocolate-indulgence",
        label: "Triple Chocolate Indulgence",
        description:
          "Three different chocolate frostings — white, milk and dark — creating an ombre effect. Every chocoholic's dream come true.",
        imageUrl: "/images/exotic-triple-chocolate-indulgence.jpg",
      },
    ],
  }),

  ...categoryItems({
    categoryId: 4, // exotic-premium-cakes
    occasions: [1, 2, 3, 4], // birthday, anniversary, new-baby, graduation
    fallbackDescription: "From our top-tier range.",
    tiers: weightTiers(HALF_TO_3KG, { "half-kg": 85, "1kg": 160 }),
    leadTimeHours: 0,
    items: [
      {
        id: 20,
        slug: "exotic-premium-cakes-oreo",
        label: "Oreo",
        description: "The perfect combo of an incredibly moist chocolate cake with crushed Oreo cookies.",
        imageUrl: "/images/exotic-premium-oreo.jpg",
      },
      {
        id: 21,
        slug: "exotic-premium-cakes-snickers",
        label: "Snickers",
        description: "A cake reminiscent of a Snickers bar, with a peanut nougat, salted caramel filling.",
        imageUrl: "/images/exotic-premium-snickers.jpg",
      },
      {
        id: 22,
        slug: "exotic-premium-cakes-red-velvet",
        label: "Red Velvet",
        imageUrl: "/images/exotic-premium-red-velvet.jpg",
        flavours: [2],
      },
      {
        id: 23,
        slug: "exotic-premium-cakes-pinacolada",
        label: "Pinacolada",
        description:
          "This unique, alcohol-free cake pays homage to the classic beverage — coconut, pineapple bits and whipped cream.",
        imageUrl: "/images/exotic-premium-pinacolada.jpg",
      },
      {
        id: 24,
        slug: "exotic-premium-cakes-kinder-bueno",
        label: "Kinder Bueno",
        description:
          "A perfect celebration cake smothered in chocolate hazelnut cream and decorated with an array of Kinder Bueno chocolates.",
        imageUrl: "/images/exotic-premium-kinder-bueno.jpg",
      },
      {
        id: 25,
        slug: "exotic-premium-cakes-lotus-biscoff",
        label: "Lotus Biscoff",
        description:
          "The ultimate cake for Biscoff lovers — made with both crushed Biscoff biscuits and Biscoff spread.",
        imageUrl: "/images/exotic-premium-lotus-biscoff.jpg",
        flavours: [3],
        mostOrderedRank: 3,
      },
      {
        id: 26,
        slug: "exotic-premium-cakes-nutella-rocher",
        label: "Nutella Rocher",
        description:
          "Chocolate sponge layers sandwiched with Nutella cream and Ferrero Rocher bits. Recommended for all Nutella lovers out there.",
        imageUrl: "/images/exotic-premium-nutella-rocher.jpg",
        mostOrderedRank: 1,
      },
      {
        id: 27,
        slug: "exotic-premium-cakes-kitkat-gems",
        label: "KitKat & Gems",
        imageUrl: "/images/exotic-premium-kitkat-gems.jpg",
      },
      {
        id: 28,
        slug: "exotic-premium-cakes-rose-pistachio",
        label: "Rose & Pistachio",
        imageUrl: "/images/exotic-premium-rose-pistachio.jpg",
        flavours: [7],
      },
    ],
  }),

  ...categoryItems({
    categoryId: 5, // cheesecakes
    occasions: [1, 2, 3], // birthday, anniversary, new-baby
    fallbackDescription: "Creamy baked cheesecake, whole cakes only.",
    tiers: weightTiers(HALF_TO_3KG, { "half-kg": 95, "1kg": 170 }),
    leadTimeHours: 24,
    items: [
      { id: 29, slug: "cheesecakes-oreo", label: "Oreo", imageUrl: "/images/cheesecake-oreo.jpg" },
      {
        id: 30,
        slug: "cheesecakes-strawberry",
        label: "Strawberry",
        imageUrl: "/images/cheesecake-strawberry.jpg",
      },
      {
        id: 31,
        slug: "cheesecakes-blueberry",
        label: "Blueberry",
        imageUrl: "/images/cheesecake-blueberry.jpg",
      },
      {
        id: 32,
        slug: "cheesecakes-lotus-biscoff",
        label: "Lotus Biscoff",
        imageUrl: "/images/cheesecake-lotus-biscoff.jpg",
        flavours: [3],
      },
      {
        id: 33,
        slug: "cheesecakes-new-york",
        label: "New York",
        imageUrl: "/images/cheesecake-new-york.jpg",
      },
    ],
  }),

  ...categoryItems({
    categoryId: 6, // indian-cakes
    occasions: [1, 2], // birthday, anniversary
    fallbackDescription: "Traditional Indian mithai flavours in cake form, made fresh each morning.",
    tiers: weightTiers(HALF_TO_3KG, { "half-kg": 105, "1kg": 190 }),
    leadTimeHours: 24,
    items: [
      {
        id: 34,
        slug: "indian-cakes-motichoor",
        label: "Motichoor",
        imageUrl: "/images/indian-motichoor.jpg",
        flavours: [8],
      },
      {
        id: 35,
        slug: "indian-cakes-kaju-katli",
        label: "Kaju Katli",
        imageUrl: "/images/indian-kaju-katli.jpg",
        flavours: [8],
      },
      {
        id: 36,
        slug: "indian-cakes-gulkand",
        label: "Gulkand",
        imageUrl: "/images/indian-gulkand.jpg",
        flavours: [8],
      },
      {
        id: 37,
        slug: "indian-cakes-gulab-jamun",
        label: "Gulab Jamun",
        imageUrl: "/images/indian-gulab-jamun.jpg",
        flavours: [8],
      },
      {
        id: 38,
        slug: "indian-cakes-rasmalai",
        label: "Rasmalai",
        imageUrl: "/images/indian-rasmalai.jpg",
        flavours: [8],
      },
    ],
  }),

  ...categoryItems({
    categoryId: 10, // hammer-cakes
    occasions: [1, 2], // birthday, anniversary
    fallbackDescription: "A chocolate shell cake you crack open with a hammer.",
    tiers: weightTiers(HALF_TO_1_5KG, { "1kg": 190 }),
    leadTimeHours: 24,
    items: [
      {
        id: 39,
        slug: "hammer-cakes-heart-shape-hammer-cake",
        label: "Heart Shape Hammer Cake",
        imageUrl: "/images/hammer-heart-shape.jpg",
      },
    ],
  }),

  ...categoryItems({
    categoryId: 9, // pull-me-up-cakes
    occasions: [1, 4], // birthday, graduation
    fallbackDescription: "Pull the ribbons to reveal a surprise inside.",
    tiers: weightTiers(HALF_TO_3KG, { "1kg": 180 }),
    leadTimeHours: 24,
    items: [
      { id: 40, slug: "pull-me-up-cakes-biscoff", label: "Biscoff", flavours: [3] },
      { id: 41, slug: "pull-me-up-cakes-coffee", label: "Coffee" },
      { id: 42, slug: "pull-me-up-cakes-nutella-strawberry", label: "Nutella Strawberry" },
      { id: 43, slug: "pull-me-up-cakes-triple-chocolate", label: "Triple Chocolate" },
      { id: 44, slug: "pull-me-up-cakes-mango", label: "Mango" },
      { id: 45, slug: "pull-me-up-cakes-red-velvet", label: "Red Velvet", flavours: [2] },
    ],
  }),

  ...categoryItems({
    categoryId: 11, // pinata-cakes
    occasions: [1, 4], // birthday, graduation
    fallbackDescription: "Break it open for the treats hidden inside.",
    tiers: weightTiers(HALF_TO_1_5KG, { "1kg": 190 }),
    leadTimeHours: 24,
    items: [
      { id: 46, slug: "pinata-cakes-fresh-fruit", label: "Fresh Fruit", flavours: [6] },
      {
        id: 47,
        slug: "pinata-cakes-chocolate",
        label: "Chocolate",
        imageUrl: "/images/pinata-chocolate.jpg",
      },
      { id: 48, slug: "pinata-cakes-rainbow", label: "Rainbow" },
    ],
  }),

  // One item per shape; the flavour is chosen in the WhatsApp chat.
  ...categoryItems({
    categoryId: 7, // photo-cakes
    occasions: [1, 2, 3, 4], // birthday, anniversary, new-baby, graduation
    tiers: weightTiers(HALF_TO_3KG, { "1kg": 170, "2kg": 340 }),
    leadTimeHours: 24,
    requiresDelivery: true,
    items: [
      {
        id: 49,
        slug: "photo-cakes-round-photo-cake",
        label: "Round Photo Cake",
        description:
          "An edible print of your photo on a round cake — works with any flavour on this menu. Tell us which flavour you'd like and send the photo on WhatsApp after ordering.",
        imageUrl: "/images/photo-cakes-round.jpg",
      },
      {
        id: 50,
        slug: "photo-cakes-rectangle-photo-cake",
        label: "Rectangle Photo Cake",
        description:
          "An edible print of your photo on a rectangle cake — works with any flavour on this menu. Tell us which flavour you'd like and send the photo on WhatsApp after ordering.",
        imageUrl: "/images/photo-cakes-rectangle.jpg",
      },
      {
        id: 51,
        slug: "photo-cakes-heart-photo-cake",
        label: "Heart Photo Cake",
        description:
          "An edible print of your photo on a heart-shaped cake — works with any flavour on this menu. Tell us which flavour you'd like and send the photo on WhatsApp after ordering.",
        imageUrl: "/images/photo-cakes-heart.jpg",
      },
    ],
  }),

  ...categoryItems({
    categoryId: 8, // custom-cakes
    occasions: [1, 2, 3, 4], // birthday, anniversary, new-baby, graduation
    tiers: weightTiers(CUSTOM_SIZES, { "1kg": 190, "2kg": 380 }),
    leadTimeHours: 24,
    requiresDelivery: true,
    items: [
      {
        id: 52,
        slug: "custom-cakes",
        label: "Custom Cakes",
        description:
          "Designed to your idea in fondant. Describe what you have in mind — a reference photo helps — on WhatsApp after ordering.",
      },
    ],
  }),
];
