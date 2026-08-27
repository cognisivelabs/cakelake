// Catalogue data shape — see docs/adr/ADR-004-content-management.md.
// Content lives as structured data read at build time; this file is the
// contract that real content will eventually be dropped into.

export type OptionChoice = {
  id: string;
  label: string;
  /** Added to the item's base price when this choice is selected. */
  priceDelta?: number;
  /**
   * Hours of advance notice needed if this choice is selected, overriding
   * the item's own leadTimeHours (see ADR-004 — lead time can vary by
   * size/option, not just per item).
   */
  leadTimeHours?: number;
};

export type OptionGroup = {
  id: string;
  label: string;
  choices: OptionChoice[];
  /** Whether picking one of `choices` is required before adding to cart. */
  required: boolean;
};

export type CatalogItem = {
  id: string;
  name: string;
  description: string;
  category: string;
  /** Base price in AED, before any option price deltas. */
  price: number;
  photo?: string;
  /**
   * Flexible, generic option groups — deliberately not hardcoded to
   * size+flavour. Cakes commonly have them; most add-ons (candles, a
   * knife, a cap) commonly don't. See ADR-004.
   */
  optionGroups: OptionGroup[];
  /** Sold-out flag — see ADR-004. Safety valve, not a routine toggle. */
  available: boolean;
  /** Needs on-site installation — see ADR-003 (removes Pickup as a choice). */
  requiresDelivery: boolean;
  /** Advance notice needed, in hours. 0 = same-day is fine. See ADR-004. */
  leadTimeHours: number;
};
