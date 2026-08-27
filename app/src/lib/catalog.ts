import type { CatalogItem } from "@/types/catalog";

/**
 * PLACEHOLDER CONTENT — not client-approved menu data.
 *
 * Real items, prices, categories, options, delivery/lead-time flags, and
 * photography are still pending the client (see the "Content checklist"
 * in docs/requirements/requirements.md). This file exists to prove the
 * browse → cart → WhatsApp flow works end-to-end; swap its contents for
 * real data without changing any other code — every screen reads from
 * `getCatalog()` below, nothing is hardcoded elsewhere.
 */
const CATALOG: CatalogItem[] = [
  {
    id: "chocolate-truffle-cake",
    name: "Chocolate Truffle Cake",
    description: "Layered dark chocolate sponge with truffle ganache.",
    category: "Cakes",
    price: 120,
    optionGroups: [
      {
        id: "size",
        label: "Size",
        required: true,
        choices: [
          { id: "6in", label: "6\" (serves 6-8)" },
          { id: "8in", label: "8\" (serves 12-14)", priceDelta: 60 },
          { id: "10in", label: "10\" (serves 20-24)", priceDelta: 140 },
        ],
      },
    ],
    available: true,
    requiresDelivery: false,
    leadTimeHours: 24,
  },
  {
    id: "vanilla-birthday-cake",
    name: "Vanilla Birthday Cake",
    description: "Classic vanilla sponge, buttercream, sprinkles.",
    category: "Cakes",
    price: 100,
    optionGroups: [
      {
        id: "size",
        label: "Size",
        required: true,
        choices: [
          { id: "6in", label: "6\" (serves 6-8)" },
          { id: "8in", label: "8\" (serves 12-14)", priceDelta: 50 },
        ],
      },
    ],
    available: true,
    requiresDelivery: false,
    leadTimeHours: 24,
  },
  {
    id: "three-tier-wedding-cake",
    name: "Three-Tier Celebration Cake",
    description:
      "A large tiered cake, assembled and finished on site by our team.",
    category: "Cakes",
    price: 950,
    optionGroups: [
      {
        id: "flavour",
        label: "Flavour",
        required: true,
        choices: [
          { id: "vanilla", label: "Vanilla" },
          { id: "chocolate", label: "Chocolate" },
          { id: "red-velvet", label: "Red Velvet" },
        ],
      },
    ],
    available: true,
    requiresDelivery: true,
    leadTimeHours: 72,
  },
  {
    id: "cupcake-box-6",
    name: "Cupcake Box of 6",
    description: "A mix of our everyday flavours.",
    category: "Cupcakes",
    price: 45,
    optionGroups: [],
    available: true,
    requiresDelivery: false,
    leadTimeHours: 0,
  },
  {
    id: "party-candles",
    name: "Party Candles (set of 10)",
    description: "Plain wax candles for the top of any cake.",
    category: "Party Add-ons",
    price: 10,
    optionGroups: [],
    available: true,
    requiresDelivery: false,
    leadTimeHours: 0,
  },
  {
    id: "cake-knife",
    name: "Cake Knife",
    description: "A simple cake-cutting knife.",
    category: "Party Add-ons",
    price: 15,
    optionGroups: [],
    available: true,
    requiresDelivery: false,
    leadTimeHours: 0,
  },
  {
    id: "birthday-balloons",
    name: "Balloon Bunch",
    description: "A bunch of latex balloons.",
    category: "Party Add-ons",
    price: 30,
    optionGroups: [
      {
        id: "colour",
        label: "Colour",
        required: true,
        choices: [
          { id: "pastel", label: "Pastel mix" },
          { id: "gold", label: "Gold and white" },
        ],
      },
    ],
    available: true,
    requiresDelivery: false,
    leadTimeHours: 0,
  },
];

export function getCatalog(): CatalogItem[] {
  return CATALOG;
}

export function getCategories(): string[] {
  return Array.from(new Set(CATALOG.map((item) => item.category)));
}

export function getItemById(id: string): CatalogItem | undefined {
  return CATALOG.find((item) => item.id === id);
}
