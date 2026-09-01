// Catalogue data shape — see docs/adr/ADR-004-content-management.md.
// Content lives as structured data read at build time; this file is the
// contract that real content will eventually be dropped into.
//
// Pricing model (client-confirmed): each item is priced by category and
// weight — a weight tier list, not a single price. Flavour is a free
// choice within an item and never changes the price. A weight tier can
// have no fixed price at all ("Ask us"), for the largest custom sizes.

export type WeightTier = {
  id: string;
  label: string; // "½ kg", "1 kg", "3 kg+"
  /** AED. Omitted means "Ask us" — no fixed price at this weight. */
  price?: number;
};

export type Flavour = {
  id: string;
  label: string;
  /** Real photo, when we have one — falls back to the placeholder box. */
  imageUrl?: string;
  /** What this specific flavour tastes/looks like — not every flavour
   * has one yet (real content is being filled in incrementally). Falls
   * back to the item's own description when absent. */
  description?: string;
};

export type Category = {
  id: string;
  label: string;
  /** Accent colour for chips/headers, matching the Hi-Fi design. */
  accent: string;
};

export type CatalogItem = {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  weightTiers: WeightTier[];
  /** Free choice, no price impact. Empty = no flavour choice needed. */
  flavours: Flavour[];
  /** Free-text ready-time badge, e.g. "Ready in 1 hour" — not always a
   *  clean function of leadTimeHours, so kept as its own field. */
  readyLabel: string;
  /** Advance notice needed, in hours. 0 = same-day is fine. */
  leadTimeHours: number;
  /** Max length for the optional per-item cake inscription; 0 = not offered. */
  cakeMessageMaxLength: number;
  /** Custom cakes ask the customer to describe what they want — see ADR-003. */
  needsCustomDescription: boolean;
  /** Sold-out flag — see ADR-004. Safety valve, not a routine toggle. */
  available: boolean;
  /** Needs on-site installation/delivery — see ADR-003 (removes Pickup as a choice). */
  requiresDelivery: boolean;
};
