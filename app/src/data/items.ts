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
 * Premium Cakes) is now a Category instead. Photo Cakes and 3D Cakes
 * stay single items (no per-flavour split — Photo Cakes works with any
 * flavour on this menu, chosen in the WhatsApp chat; 3D Cakes is a
 * from-scratch design brief). Any customisation a customer wants — a
 * photo to print, a design idea, anything — is handled entirely in that
 * WhatsApp chat, not a form field in the app.
 */

/** Ids of the two single-item categories other screens link to directly. */
export const SPECIAL_ITEM_IDS = { photoCakes: "photo-cakes", threeDCakes: "3d-cakes" } as const;

type ItemEntry = string | { label: string; description?: string; imageUrl?: string };

/**
 * Builds one category's flattened item list — one CatalogItem per
 * flavour, all sharing that category's weight tiers/ready time/lead
 * time. A bare string entry falls back to `fallbackDescription`, same
 * as a flavour with no description of its own used to fall back to its
 * group's description before the recategorisation.
 */
function categoryItems(
  categoryId: string,
  idPrefix: string,
  fallbackDescription: string,
  weightTiers: WeightTier[],
  readyLabel: string,
  leadTimeHours: number,
  entries: ItemEntry[],
  requiresDelivery = false,
): CatalogItem[] {
  return entries.map((entry) => {
    const { label, description, imageUrl } = typeof entry === "string" ? { label: entry } : entry;
    return {
      id: `${idPrefix}-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      name: label,
      categoryId,
      description: description ?? fallbackDescription,
      weightTiers,
      readyLabel,
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
    "classic-cakes",
    "Ultra moist, ready in an hour.",
    [
      { id: "half-kg", label: "½ kg", price: 55 },
      { id: "1kg", label: "1 kg", price: 100 },
    ],
    "Ready in 1 hour",
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
    "premium-cakes",
    "Truffle, fresh fruit, and berry finishes.",
    [
      { id: "half-kg", label: "½ kg", price: 65 },
      { id: "1kg", label: "1 kg", price: 115 },
    ],
    "Ready in 1 hour",
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
    "exotic-cakes",
    "Our more distinctive flavours.",
    [
      { id: "half-kg", label: "½ kg", price: 75 },
      { id: "1kg", label: "1 kg", price: 140 },
    ],
    "Ready in 1 hour",
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
      },
    ],
  ),

  ...categoryItems(
    "exotic-premium-cakes",
    "exotic-premium-cakes",
    "Our top-tier range — whole Rocher, Kinder Bueno, and more.",
    [
      { id: "half-kg", label: "½ kg", price: 85 },
      { id: "1kg", label: "1 kg", price: 160 },
    ],
    "Ready in 1 hour",
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
    "cheesecakes",
    "Creamy baked cheesecake, whole cakes only.",
    [
      { id: "half-kg", label: "½ kg", price: 95 },
      { id: "1kg", label: "1 kg", price: 170 },
    ],
    "24 hours notice",
    24,
    [
      { label: "Oreo", imageUrl: "/images/cheesecake-oreo.jpg" },
      { label: "Strawberry", imageUrl: "/images/cheesecake-strawberry.jpg" },
      { label: "Blueberry", imageUrl: "/images/cheesecake-blueberry.jpg" },
      { label: "Lotus Biscoff", imageUrl: "/images/cheesecake-lotus-biscoff.jpg" },
      { label: "New York", imageUrl: "/images/cheesecake-new-york.jpg" },
    ],
  ),

  // NEW category (Sep 2026 recategorisation) — made in small batches
  // each morning, per the client. Ready time/lead time follow the
  // standard same-day cakes until the client says otherwise (see
  // docs/design/CLAUDE.md — still TBC).
  ...categoryItems(
    "indian-cakes",
    "indian-cakes",
    "Traditional Indian mithai flavours in cake form, made fresh each morning.",
    [
      { id: "half-kg", label: "½ kg", price: 105 },
      { id: "1kg", label: "1 kg", price: 190 },
    ],
    "24 hours notice",
    24,
    [
      "Motichoor",
      "Kaju Katli",
      { label: "Gulkand", imageUrl: "/images/indian-gulkand.jpg" },
      { label: "Gulab Jamun", imageUrl: "/images/indian-gulab-jamun.jpg" },
      { label: "Rasmalai", imageUrl: "/images/indian-rasmalai.jpg" },
    ],
  ),

  ...categoryItems(
    "hammer-cakes",
    "hammer-cakes",
    "A chocolate shell cake you crack open with a hammer.",
    [{ id: "1kg", label: "1 kg", price: 190 }],
    "24 hours notice",
    24,
    [{ label: "Heart Shape Hammer Cake", imageUrl: "/images/hammer-heart-shape.jpg" }],
  ),

  ...categoryItems(
    "pull-me-up-cakes",
    "pull-me-up-cakes",
    "Pull the ribbons to reveal a surprise inside.",
    [{ id: "1kg", label: "1 kg", price: 180 }],
    "24 hours notice",
    24,
    ["Biscoff", "Coffee", "Nutella Strawberry", "Triple Chocolate", "Mango", "Red Velvet"],
  ),

  ...categoryItems(
    "pinata-cakes",
    "pinata-cakes",
    "Break it open for the treats hidden inside.",
    [{ id: "1kg", label: "1 kg", price: 190 }],
    "24 hours notice",
    24,
    [
      "Fresh Fruit",
      { label: "Chocolate", imageUrl: "/images/pinata-chocolate.jpg" },
      "Rainbow",
    ],
  ),

  {
    id: "photo-cakes",
    name: "Photo Cakes",
    categoryId: "photo-cakes",
    description:
      "An edible print of your photo on the cake — works with any flavour on this menu. Tell us which flavour you'd like and send the photo on WhatsApp after ordering.",
    weightTiers: [
      { id: "1kg", label: "1 kg", price: 170 },
      { id: "2kg", label: "2 kg", price: 340 },
      { id: "3kg-plus", label: "3 kg+", price: undefined },
    ],
    imageUrl: "/images/photo-cakes.jpg",
    readyLabel: "24 hours notice",
    leadTimeHours: 24,
    cakeMessageMaxLength: CONFIG.cakeMessageMaxLength,
    available: true,
    requiresDelivery: true,
  },

  {
    id: "3d-cakes",
    name: "3D Cakes",
    categoryId: "3d-cakes",
    description:
      "Designed to your idea in fondant. Describe what you have in mind — a reference photo helps — on WhatsApp after ordering.",
    weightTiers: [
      { id: "1kg", label: "1 kg", price: 190 },
      { id: "2kg", label: "2 kg", price: 380 },
      { id: "3kg-plus", label: "3 kg+", price: undefined },
    ],
    readyLabel: "24 hours notice",
    leadTimeHours: 24,
    cakeMessageMaxLength: CONFIG.cakeMessageMaxLength,
    available: true,
    requiresDelivery: true,
  },
];
