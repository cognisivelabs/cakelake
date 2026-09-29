import type { CatalogItem, WeightTier } from "@/types/catalog";
import { CONFIG } from "@/lib/config";

/**
 * The menu's items. PLACEHOLDER CONTENT in places — see individual
 * comments below. The client will provide the remaining items, prices and
 * photos (see the "Content checklist" in docs/requirements/requirements.md).
 * Every screen reads through lib/catalog.ts, so swapping in real data is a
 * data change, not a code one.
 *
 * Scope, client-confirmed: only cakes are ordered online. Cupcakes,
 * cookies, pastries, desserts, and savoury items are not — the bakery
 * doesn't take online orders for those.
 *
 * Sep 2026 recategorisation (client-confirmed): each flavour is now its
 * own catalog item, and what used to be a multi-flavour "group" (e.g.
 * Premium Cakes) is now a Category instead. Photo Cakes and Custom Cakes
 * stay single items (no per-flavour split — Photo Cakes works with any
 * flavour on this menu, chosen in the WhatsApp chat; Custom Cakes is a
 * from-scratch design brief). Any customisation a customer wants — a
 * photo to print, a design idea, anything — is handled entirely in that
 * WhatsApp chat, not a form field in the app.
 */

/** "threeDCakes" is a single-item category's item id, used directly by
 * other screens. "photoCakes" is the same string, but now only as a
 * *category* id — Photo Cakes is three shape items (Round/Rectangle/
 * Heart), not one, since the client supplied per-shape photos. */
export const SPECIAL_ITEM_IDS = { photoCakes: "photo-cakes", threeDCakes: "3d-cakes" } as const;

/** Every weight a cake can be ordered in, smallest first: its label,
 * weight in kg and how many people it serves. Serves counts are
 * proposed, not yet client-confirmed. */
export const SIZES = {
  "half-kg": { label: "½ kg", kg: 0.5, serves: "Serves 2–4" },
  "1kg": { label: "1 kg", kg: 1, serves: "Serves 5–6" },
  "1.5kg": { label: "1½ kg", kg: 1.5, serves: "Serves 8–10" },
  "2kg": { label: "2 kg", kg: 2, serves: "Serves 10–12" },
  "2.5kg": { label: "2½ kg", kg: 2.5, serves: "Serves 12–15" },
  "3kg": { label: "3 kg", kg: 3, serves: "Serves 15–18" },
  "3kg-plus": { label: "3 kg+", kg: 3, serves: "Serves 18+" },
} as const;

type SizeId = keyof typeof SIZES;

/** The size ranges categories are sold in. */
const HALF_TO_3KG: SizeId[] = ["half-kg", "1kg", "1.5kg", "2kg", "2.5kg", "3kg"];
const HALF_TO_1_5KG: SizeId[] = ["half-kg", "1kg", "1.5kg"];
const CUSTOM_SIZES: SizeId[] = ["1kg", "1.5kg", "2kg", "2.5kg", "3kg-plus"];

/** One weight tier per size, priced from `prices`; a size missing from
 * `prices` shows "Ask us". */
function weightTiers(sizes: SizeId[], prices: Partial<Record<SizeId, number>>): WeightTier[] {
  return sizes.map((id) => ({ id, label: SIZES[id].label, price: prices[id], serves: SIZES[id].serves }));
}

type ItemEntry = string | { label: string; description?: string; imageUrl?: string };

/**
 * One CatalogItem per flavour in a category, with id
 * "<categoryId>-<flavour>", all sharing the category's weight tiers and
 * lead time. An entry without its own description uses
 * `fallbackDescription`.
 */
function categoryItems(
  categoryId: string,
  fallbackDescription: string,
  weightTiers: WeightTier[],
  leadTimeHours: number,
  entries: ItemEntry[],
  requiresDelivery = false,
): CatalogItem[] {
  return entries.map((entry) => {
    const { label, description, imageUrl } = typeof entry === "string" ? { label: entry } : entry;
    return {
      id: `${categoryId}-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      name: label,
      categoryId,
      description: description ?? fallbackDescription,
      weightTiers,
      leadTimeHours,
      cakeMessageMaxLength: CONFIG.cakeMessageMaxLength,
      available: true,
      requiresDelivery,
      ...(imageUrl ? { imageUrl } : {}),
    };
  });
}

export const BASE_CATALOG: CatalogItem[] = [
  ...categoryItems(
    "classic-cakes",
    "Ultra moist, ready in an hour.",
    weightTiers(HALF_TO_3KG, { "half-kg": 55, "1kg": 100 }),
    0,
    [
      {
        label: "Butterscotch",
        description: "Ultra moist cake with each bite having a creamy butterscotch mouthfeel.",
        imageUrl: "/images/classic-butterscotch.jpg",
      },
      {
        label: "Black Forest",
        description: "A divine combination of chocolate, cherries and whipped cream in every layer.",
        imageUrl: "/images/classic-black-forest.jpg",
      },
      {
        label: "Pineapple",
        description: "A light and airy cake with tropical, fresh pineapple in every bite.",
        imageUrl: "/images/classic-pineapple.jpg",
      },
    ],
  ),

  ...categoryItems(
    "premium-cakes",
    "Truffle, fresh fruit, and berry finishes.",
    weightTiers(HALF_TO_3KG, { "half-kg": 65, "1kg": 115 }),
    0,
    [
      {
        label: "Dark Chocolate Truffle",
        description: "Love dark chocolate? This luxurious, ganache based cake is for you.",
        imageUrl: "/images/premium-dark-chocolate-truffle.jpg",
      },
      {
        label: "Milk Chocolate Truffle",
        description:
          "A chocolate layer cake recipe with dense, moist chocolate cake, silky chocolate truffle frosting.",
        imageUrl: "/images/premium-milk-chocolate-truffle.jpg",
      },
      {
        label: "Chocolate Vanilla",
        description:
          "Soft, buttery, fluffy, moist, and filled with rich chocolate and vanilla flavor with zebra design.",
        imageUrl: "/images/premium-chocolate-vanilla.jpg",
      },
      {
        label: "Chocolate Chips Loaded",
        description: "Delicious taste of chocolate cake with chocolate chips, moist and fluffy. Kids' favourite.",
        imageUrl: "/images/premium-chocolate-chips-loaded.jpg",
      },
      {
        label: "Dark Chocolate Strawberry",
        description:
          "Made with moist and rich dark chocolate cake layers, silky smooth strawberry cream, dark chocolate ganache.",
        imageUrl: "/images/premium-dark-chocolate-strawberry.jpg",
      },
      {
        label: "Strawberry",
        description: "Strawberry cake in combination of vanilla sponge with strawberry filling with nice presentation.",
        imageUrl: "/images/premium-strawberry.jpg",
      },
      {
        label: "Blueberry",
        description: "Tangy, tart and sweet. Creamy blueberry reduction in between layers of vanilla cake.",
        imageUrl: "/images/premium-blueberry.jpg",
      },
      {
        label: "Fresh Fruit",
        description:
          "Subtle, delectable vanilla cake with fresh, fruity goodness in every bite. Made of fresh fruit with less sugar.",
        imageUrl: "/images/premium-fresh-fruit.jpg",
      },
    ],
  ),

  ...categoryItems(
    "exotic-cakes",
    "Our more distinctive flavours.",
    weightTiers(HALF_TO_3KG, { "half-kg": 75, "1kg": 140 }),
    0,
    [
      {
        label: "Chocolate Mousse",
        description: "A classic with layers of moist chocolate cake and creamy chocolate mousse.",
        imageUrl: "/images/exotic-chocolate-mousse.jpg",
      },
      {
        label: "Chocolate Brownie",
        description: "Dense brownie sponge topped with chocolate ganache and decorated with chocolate brownie balls.",
        imageUrl: "/images/exotic-chocolate-brownie.jpg",
      },
      {
        label: "Hazelnut Crunch",
        description:
          "A rich hazelnut ganache in between layers of velvety chocolate sponge. A favourite with those who like a little crunch and texture in every bite.",
        imageUrl: "/images/exotic-hazelnut-crunch.jpg",
      },
      {
        label: "White Chocolate Coconut",
        description:
          "Layered with white chocolate ganache and coconut flakes, garnished with white chocolate coconut truffle balls.",
        imageUrl: "/images/exotic-white-chocolate-coconut.jpg",
      },
      {
        label: "Cafe Latte",
        description: "A coffee lover's delight — a light and airy vanilla-based cake with a coffee frosting.",
        imageUrl: "/images/exotic-cafe-latte.jpg",
      },
      {
        label: "Mango",
        description: "Moist and spongy mango cake layered with mango cream, topped with fresh mango pieces.",
        imageUrl: "/images/exotic-mango.jpg",
      },
      {
        label: "Caramel Chocolate",
        description: "Moist chocolate cake layered with delicious chocolate caramel and crunchy bits.",
        imageUrl: "/images/exotic-caramel-chocolate.jpg",
      },
      {
        label: "Triple Chocolate Indulgence",
        description:
          "Three different chocolate frostings — white, milk and dark — creating an ombre effect. Every chocoholic's dream come true.",
        imageUrl: "/images/exotic-triple-chocolate-indulgence.jpg",
      },
    ],
  ),

  ...categoryItems(
    "exotic-premium-cakes",
    "Our top-tier range — whole Rocher, Kinder Bueno, and more.",
    weightTiers(HALF_TO_3KG, { "half-kg": 85, "1kg": 160 }),
    0,
    [
      {
        label: "Oreo",
        description: "The perfect combo of an incredibly moist chocolate cake with crushed Oreo cookies.",
        imageUrl: "/images/exotic-premium-oreo.jpg",
      },
      {
        label: "Snickers",
        description: "A cake reminiscent of a Snickers bar, with a peanut nougat, salted caramel filling.",
        imageUrl: "/images/exotic-premium-snickers.jpg",
      },
      { label: "Red Velvet", imageUrl: "/images/exotic-premium-red-velvet.jpg" },
      {
        label: "Pinacolada",
        description:
          "This unique, alcohol-free cake pays homage to the classic beverage — coconut, pineapple bits and whipped cream.",
        imageUrl: "/images/exotic-premium-pinacolada.jpg",
      },
      {
        label: "Kinder Bueno",
        description:
          "A perfect celebration cake smothered in chocolate hazelnut cream and decorated with an array of Kinder Bueno chocolates.",
        imageUrl: "/images/exotic-premium-kinder-bueno.jpg",
      },
      {
        label: "Lotus Biscoff",
        description: "The ultimate cake for Biscoff lovers — made with both crushed Biscoff biscuits and Biscoff spread.",
        imageUrl: "/images/exotic-premium-lotus-biscoff.jpg",
      },
      {
        label: "Nutella Rocher",
        description:
          "Chocolate sponge layers sandwiched with Nutella cream and Ferrero Rocher bits. Recommended for all Nutella lovers out there.",
        imageUrl: "/images/exotic-premium-nutella-rocher.jpg",
      },
      { label: "KitKat & Gems", imageUrl: "/images/exotic-premium-kitkat-gems.jpg" },
      { label: "Rose & Pistachio", imageUrl: "/images/exotic-premium-rose-pistachio.jpg" },
    ],
  ),

  // NEW category (Sep 2026 recategorisation) — whole cakes only.
  ...categoryItems(
    "cheesecakes",
    "Creamy baked cheesecake, whole cakes only.",
    weightTiers(HALF_TO_3KG, { "half-kg": 95, "1kg": 170 }),
    24,
    [
      { label: "Oreo", imageUrl: "/images/cheesecake-oreo.jpg" },
      { label: "Strawberry", imageUrl: "/images/cheesecake-strawberry.jpg" },
      { label: "Blueberry", imageUrl: "/images/cheesecake-blueberry.jpg" },
      { label: "Lotus Biscoff", imageUrl: "/images/cheesecake-lotus-biscoff.jpg" },
      { label: "New York", imageUrl: "/images/cheesecake-new-york.jpg" },
    ],
  ),

  // Made in small batches each morning; 24 hours notice.
  ...categoryItems(
    "indian-cakes",
    "Traditional Indian mithai flavours in cake form, made fresh each morning.",
    weightTiers(HALF_TO_3KG, { "half-kg": 105, "1kg": 190 }),
    24,
    [
      { label: "Motichoor", imageUrl: "/images/indian-motichoor.jpg" },
      { label: "Kaju Katli", imageUrl: "/images/indian-kaju-katli.jpg" },
      { label: "Gulkand", imageUrl: "/images/indian-gulkand.jpg" },
      { label: "Gulab Jamun", imageUrl: "/images/indian-gulab-jamun.jpg" },
      { label: "Rasmalai", imageUrl: "/images/indian-rasmalai.jpg" },
    ],
  ),

  ...categoryItems(
    "hammer-cakes",
    "A chocolate shell cake you crack open with a hammer.",
    weightTiers(HALF_TO_1_5KG, { "1kg": 190 }),
    24,
    [{ label: "Heart Shape Hammer Cake", imageUrl: "/images/hammer-heart-shape.jpg" }],
  ),

  ...categoryItems(
    "pull-me-up-cakes",
    "Pull the ribbons to reveal a surprise inside.",
    weightTiers(HALF_TO_3KG, { "1kg": 180 }),
    24,
    ["Biscoff", "Coffee", "Nutella Strawberry", "Triple Chocolate", "Mango", "Red Velvet"],
  ),

  ...categoryItems(
    "pinata-cakes",
    "Break it open for the treats hidden inside.",
    weightTiers(HALF_TO_1_5KG, { "1kg": 190 }),
    24,
    [
      "Fresh Fruit",
      { label: "Chocolate", imageUrl: "/images/pinata-chocolate.jpg" },
      "Rainbow",
    ],
  ),

  // Shape variants (client-supplied photos) — same pricing and notice as
  // the single "Photo Cakes" item this replaces; the flavour is still
  // chosen in the WhatsApp chat, not a picker here.
  ...categoryItems(
    "photo-cakes",
    "An edible print of your photo on the cake — works with any flavour on this menu. Tell us which flavour you'd like and send the photo on WhatsApp after ordering.",
    weightTiers(HALF_TO_3KG, { "1kg": 170, "2kg": 340 }),
    24,
    [
      {
        label: "Round Photo Cake",
        description:
          "An edible print of your photo on a round cake — works with any flavour on this menu. Tell us which flavour you'd like and send the photo on WhatsApp after ordering.",
        imageUrl: "/images/photo-cakes-round.jpg",
      },
      {
        label: "Rectangle Photo Cake",
        description:
          "An edible print of your photo on a rectangle cake — works with any flavour on this menu. Tell us which flavour you'd like and send the photo on WhatsApp after ordering.",
        imageUrl: "/images/photo-cakes-rectangle.jpg",
      },
      {
        label: "Heart Photo Cake",
        description:
          "An edible print of your photo on a heart-shaped cake — works with any flavour on this menu. Tell us which flavour you'd like and send the photo on WhatsApp after ordering.",
        imageUrl: "/images/photo-cakes-heart.jpg",
      },
    ],
    true,
  ),

  {
    id: "3d-cakes",
    name: "Custom Cakes",
    categoryId: "3d-cakes",
    description:
      "Designed to your idea in fondant. Describe what you have in mind — a reference photo helps — on WhatsApp after ordering.",
    weightTiers: weightTiers(CUSTOM_SIZES, { "1kg": 190, "2kg": 380 }),
    leadTimeHours: 24,
    cakeMessageMaxLength: CONFIG.cakeMessageMaxLength,
    available: true,
    requiresDelivery: true,
  },
];
