import type { CatalogItem, WeightTier } from "@/types/catalog";
import { CONFIG } from "@/lib/config";
import { CATEGORIES } from "@/data/categories";

// The menu's items, one per flavour (or shape), grouped by category.
// Some prices, sizes and photos are placeholders until the client
// supplies them.

/** Slugs linked to directly: `photoCakes` is the Photo Cakes category;
 * `customCakes` is the Custom Cakes item. */
export const SPECIAL_SLUGS = { photoCakes: "photo-cakes", customCakes: "custom-cakes" } as const;

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

/** One flavour of a category: its id and name, optionally with its own
 * description and photo. `slug` replaces the generated
 * "<category slug>-<flavour>" slug. */
type ItemEntry = { id: number; label: string; description?: string; imageUrl?: string; slug?: string };

/** One category's items and what they share. */
type CategorySpec = {
  categoryId: number;
  /** Description for items without their own. */
  fallbackDescription?: string;
  tiers: WeightTier[];
  leadTimeHours: number;
  /** Defaults to false. */
  requiresDelivery?: boolean;
  items: ItemEntry[];
};

/** "Black Forest" → "black-forest". */
function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

/** One CatalogItem per entry, with slug "<category slug>-<flavour>" unless
 * the entry sets its own, all sharing the category's tiers, lead time and
 * delivery rule. */
function categoryItems({
  categoryId,
  fallbackDescription = "",
  tiers,
  leadTimeHours,
  requiresDelivery = false,
  items,
}: CategorySpec): CatalogItem[] {
  const categorySlug = CATEGORIES.find((c) => c.id === categoryId)?.slug ?? String(categoryId);
  return items.map(({ id, label, description, imageUrl, slug }) => ({
    id,
    slug: slug ?? `${categorySlug}-${slugify(label)}`,
    name: label,
    categoryId,
    description: description ?? fallbackDescription,
    weightTiers: tiers,
    leadTimeHours,
    cakeMessageMaxLength: CONFIG.cakeMessageMaxLength,
    available: true,
    requiresDelivery,
    ...(imageUrl ? { imageUrl } : {}),
  }));
}

/** A Photo Cake's description, for one shape ("round", "heart-shaped"…). */
function photoCakeDescription(shape: string): string {
  return `An edible print of your photo on a ${shape} cake — works with any flavour on this menu. Tell us which flavour you'd like and send the photo on WhatsApp after ordering.`;
}

/** Every item on the menu, in menu order. */
export const BASE_CATALOG: CatalogItem[] = [
  ...categoryItems({
    categoryId: 1, // classic-cakes
    tiers: weightTiers(HALF_TO_3KG, { "half-kg": 55, "1kg": 100 }),
    leadTimeHours: 0,
    items: [
      {
        id: 1,
        label: "Butterscotch",
        description: "Ultra moist cake with each bite having a creamy butterscotch mouthfeel.",
        imageUrl: "/images/classic-butterscotch.jpg",
      },
      {
        id: 2,
        label: "Black Forest",
        description: "A divine combination of chocolate, cherries and whipped cream in every layer.",
        imageUrl: "/images/classic-black-forest.jpg",
      },
      {
        id: 3,
        label: "Pineapple",
        description: "A light and airy cake with tropical, fresh pineapple in every bite.",
        imageUrl: "/images/classic-pineapple.jpg",
      },
    ],
  }),

  ...categoryItems({
    categoryId: 2, // premium-cakes
    tiers: weightTiers(HALF_TO_3KG, { "half-kg": 65, "1kg": 115 }),
    leadTimeHours: 0,
    items: [
      {
        id: 4,
        label: "Dark Chocolate Truffle",
        description: "Love dark chocolate? This luxurious, ganache based cake is for you.",
        imageUrl: "/images/premium-dark-chocolate-truffle.jpg",
      },
      {
        id: 5,
        label: "Milk Chocolate Truffle",
        description:
          "A chocolate layer cake recipe with dense, moist chocolate cake, silky chocolate truffle frosting.",
        imageUrl: "/images/premium-milk-chocolate-truffle.jpg",
      },
      {
        id: 6,
        label: "Chocolate Vanilla",
        description:
          "Soft, buttery, fluffy, moist, and filled with rich chocolate and vanilla flavor with zebra design.",
        imageUrl: "/images/premium-chocolate-vanilla.jpg",
      },
      {
        id: 7,
        label: "Chocolate Chips Loaded",
        description: "Delicious taste of chocolate cake with chocolate chips, moist and fluffy. Kids' favourite.",
        imageUrl: "/images/premium-chocolate-chips-loaded.jpg",
      },
      {
        id: 8,
        label: "Dark Chocolate Strawberry",
        description:
          "Made with moist and rich dark chocolate cake layers, silky smooth strawberry cream, dark chocolate ganache.",
        imageUrl: "/images/premium-dark-chocolate-strawberry.jpg",
      },
      {
        id: 9,
        label: "Strawberry",
        description: "Strawberry cake in combination of vanilla sponge with strawberry filling with nice presentation.",
        imageUrl: "/images/premium-strawberry.jpg",
      },
      {
        id: 10,
        label: "Blueberry",
        description: "Tangy, tart and sweet. Creamy blueberry reduction in between layers of vanilla cake.",
        imageUrl: "/images/premium-blueberry.jpg",
      },
      {
        id: 11,
        label: "Fresh Fruit",
        description:
          "Subtle, delectable vanilla cake with fresh, fruity goodness in every bite. Made of fresh fruit with less sugar.",
        imageUrl: "/images/premium-fresh-fruit.jpg",
      },
    ],
  }),

  ...categoryItems({
    categoryId: 3, // exotic-cakes
    tiers: weightTiers(HALF_TO_3KG, { "half-kg": 75, "1kg": 140 }),
    leadTimeHours: 0,
    items: [
      {
        id: 12,
        label: "Chocolate Mousse",
        description: "A classic with layers of moist chocolate cake and creamy chocolate mousse.",
        imageUrl: "/images/exotic-chocolate-mousse.jpg",
      },
      {
        id: 13,
        label: "Chocolate Brownie",
        description: "Dense brownie sponge topped with chocolate ganache and decorated with chocolate brownie balls.",
        imageUrl: "/images/exotic-chocolate-brownie.jpg",
      },
      {
        id: 14,
        label: "Hazelnut Crunch",
        description:
          "A rich hazelnut ganache in between layers of velvety chocolate sponge. A favourite with those who like a little crunch and texture in every bite.",
        imageUrl: "/images/exotic-hazelnut-crunch.jpg",
      },
      {
        id: 15,
        label: "White Chocolate Coconut",
        description:
          "Layered with white chocolate ganache and coconut flakes, garnished with white chocolate coconut truffle balls.",
        imageUrl: "/images/exotic-white-chocolate-coconut.jpg",
      },
      {
        id: 16,
        label: "Cafe Latte",
        description: "A coffee lover's delight — a light and airy vanilla-based cake with a coffee frosting.",
        imageUrl: "/images/exotic-cafe-latte.jpg",
      },
      {
        id: 17,
        label: "Mango",
        description: "Moist and spongy mango cake layered with mango cream, topped with fresh mango pieces.",
        imageUrl: "/images/exotic-mango.jpg",
      },
      {
        id: 18,
        label: "Caramel Chocolate",
        description: "Moist chocolate cake layered with delicious chocolate caramel and crunchy bits.",
        imageUrl: "/images/exotic-caramel-chocolate.jpg",
      },
      {
        id: 19,
        label: "Triple Chocolate Indulgence",
        description:
          "Three different chocolate frostings — white, milk and dark — creating an ombre effect. Every chocoholic's dream come true.",
        imageUrl: "/images/exotic-triple-chocolate-indulgence.jpg",
      },
    ],
  }),

  ...categoryItems({
    categoryId: 4, // exotic-premium-cakes
    fallbackDescription: "From our top-tier range.",
    tiers: weightTiers(HALF_TO_3KG, { "half-kg": 85, "1kg": 160 }),
    leadTimeHours: 0,
    items: [
      {
        id: 20,
        label: "Oreo",
        description: "The perfect combo of an incredibly moist chocolate cake with crushed Oreo cookies.",
        imageUrl: "/images/exotic-premium-oreo.jpg",
      },
      {
        id: 21,
        label: "Snickers",
        description: "A cake reminiscent of a Snickers bar, with a peanut nougat, salted caramel filling.",
        imageUrl: "/images/exotic-premium-snickers.jpg",
      },
      { id: 22, label: "Red Velvet", imageUrl: "/images/exotic-premium-red-velvet.jpg" },
      {
        id: 23,
        label: "Pinacolada",
        description:
          "This unique, alcohol-free cake pays homage to the classic beverage — coconut, pineapple bits and whipped cream.",
        imageUrl: "/images/exotic-premium-pinacolada.jpg",
      },
      {
        id: 24,
        label: "Kinder Bueno",
        description:
          "A perfect celebration cake smothered in chocolate hazelnut cream and decorated with an array of Kinder Bueno chocolates.",
        imageUrl: "/images/exotic-premium-kinder-bueno.jpg",
      },
      {
        id: 25,
        label: "Lotus Biscoff",
        description: "The ultimate cake for Biscoff lovers — made with both crushed Biscoff biscuits and Biscoff spread.",
        imageUrl: "/images/exotic-premium-lotus-biscoff.jpg",
      },
      {
        id: 26,
        label: "Nutella Rocher",
        description:
          "Chocolate sponge layers sandwiched with Nutella cream and Ferrero Rocher bits. Recommended for all Nutella lovers out there.",
        imageUrl: "/images/exotic-premium-nutella-rocher.jpg",
      },
      { id: 27, label: "KitKat & Gems", imageUrl: "/images/exotic-premium-kitkat-gems.jpg" },
      { id: 28, label: "Rose & Pistachio", imageUrl: "/images/exotic-premium-rose-pistachio.jpg" },
    ],
  }),

  ...categoryItems({
    categoryId: 5, // cheesecakes
    fallbackDescription: "Creamy baked cheesecake, whole cakes only.",
    tiers: weightTiers(HALF_TO_3KG, { "half-kg": 95, "1kg": 170 }),
    leadTimeHours: 24,
    items: [
      { id: 29, label: "Oreo", imageUrl: "/images/cheesecake-oreo.jpg" },
      { id: 30, label: "Strawberry", imageUrl: "/images/cheesecake-strawberry.jpg" },
      { id: 31, label: "Blueberry", imageUrl: "/images/cheesecake-blueberry.jpg" },
      { id: 32, label: "Lotus Biscoff", imageUrl: "/images/cheesecake-lotus-biscoff.jpg" },
      { id: 33, label: "New York", imageUrl: "/images/cheesecake-new-york.jpg" },
    ],
  }),

  ...categoryItems({
    categoryId: 6, // indian-cakes
    fallbackDescription: "Traditional Indian mithai flavours in cake form, made fresh each morning.",
    tiers: weightTiers(HALF_TO_3KG, { "half-kg": 105, "1kg": 190 }),
    leadTimeHours: 24,
    items: [
      { id: 34, label: "Motichoor", imageUrl: "/images/indian-motichoor.jpg" },
      { id: 35, label: "Kaju Katli", imageUrl: "/images/indian-kaju-katli.jpg" },
      { id: 36, label: "Gulkand", imageUrl: "/images/indian-gulkand.jpg" },
      { id: 37, label: "Gulab Jamun", imageUrl: "/images/indian-gulab-jamun.jpg" },
      { id: 38, label: "Rasmalai", imageUrl: "/images/indian-rasmalai.jpg" },
    ],
  }),

  ...categoryItems({
    categoryId: 10, // hammer-cakes
    fallbackDescription: "A chocolate shell cake you crack open with a hammer.",
    tiers: weightTiers(HALF_TO_1_5KG, { "1kg": 190 }),
    leadTimeHours: 24,
    items: [{ id: 39, label: "Heart Shape Hammer Cake", imageUrl: "/images/hammer-heart-shape.jpg" }],
  }),

  ...categoryItems({
    categoryId: 9, // pull-me-up-cakes
    fallbackDescription: "Pull the ribbons to reveal a surprise inside.",
    tiers: weightTiers(HALF_TO_3KG, { "1kg": 180 }),
    leadTimeHours: 24,
    items: [
      { id: 40, label: "Biscoff" },
      { id: 41, label: "Coffee" },
      { id: 42, label: "Nutella Strawberry" },
      { id: 43, label: "Triple Chocolate" },
      { id: 44, label: "Mango" },
      { id: 45, label: "Red Velvet" },
    ],
  }),

  ...categoryItems({
    categoryId: 11, // pinata-cakes
    fallbackDescription: "Break it open for the treats hidden inside.",
    tiers: weightTiers(HALF_TO_1_5KG, { "1kg": 190 }),
    leadTimeHours: 24,
    items: [
      { id: 46, label: "Fresh Fruit" },
      { id: 47, label: "Chocolate", imageUrl: "/images/pinata-chocolate.jpg" },
      { id: 48, label: "Rainbow" },
    ],
  }),

  // One item per shape; the flavour is chosen in the WhatsApp chat.
  ...categoryItems({
    categoryId: 7, // photo-cakes
    tiers: weightTiers(HALF_TO_3KG, { "1kg": 170, "2kg": 340 }),
    leadTimeHours: 24,
    requiresDelivery: true,
    items: [
      {
        id: 49,
        label: "Round Photo Cake",
        description: photoCakeDescription("round"),
        imageUrl: "/images/photo-cakes-round.jpg",
      },
      {
        id: 50,
        label: "Rectangle Photo Cake",
        description: photoCakeDescription("rectangle"),
        imageUrl: "/images/photo-cakes-rectangle.jpg",
      },
      {
        id: 51,
        label: "Heart Photo Cake",
        description: photoCakeDescription("heart-shaped"),
        imageUrl: "/images/photo-cakes-heart.jpg",
      },
    ],
  }),

  ...categoryItems({
    categoryId: 8, // custom-cakes
    tiers: weightTiers(CUSTOM_SIZES, { "1kg": 190, "2kg": 380 }),
    leadTimeHours: 24,
    requiresDelivery: true,
    items: [
      {
        id: 52,
        slug: SPECIAL_SLUGS.customCakes,
        label: "Custom Cakes",
        description:
          "Designed to your idea in fondant. Describe what you have in mind — a reference photo helps — on WhatsApp after ordering.",
      },
    ],
  }),
];
