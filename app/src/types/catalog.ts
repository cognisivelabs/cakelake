// Catalogue data shape — see docs/adr/ADR-004-content-management.md.
// Content lives as structured data read at build time; this file is the
// contract that real content will eventually be dropped into.
//
// Pricing model (client-confirmed): each item is priced by category and
// weight — a weight tier list, not a single price. A weight tier can
// have no fixed price at all ("Ask us"), for the largest custom sizes.
//
// Sep 2026 recategorisation: flavour used to be a picker inside a
// multi-flavour "group" item (e.g. Premium Cakes had 8 flavour options).
// The client's updated design promotes each flavour to its own catalog
// item, and the old group becomes a Category instead — so "Dark
// Chocolate Truffle" is now a CatalogItem in the "premium-cakes"
// category, not a Flavour nested inside one. Any customisation a
// customer wants (a photo to print, a 3D design brief, anything) is
// handled entirely in the WhatsApp chat after ordering — not a
// structured field here — so there's no needsCustomDescription/
// customDescription concept anymore either.

export type WeightTier = {
  id: string;
  label: string; // "½ kg", "1 kg", "3 kg+"
  /** AED. Omitted means "Ask us" — no fixed price at this weight. */
  price?: number;
};

/** How a category is sold: everyday menu ranges, ranges that need notice
 * (made to order), or a from-scratch custom brief (Photo, 3D). */
export type CategoryKind = "everyday" | "made-to-order" | "custom";

export type Category = {
  id: string;
  label: string;
  kind: CategoryKind;
  /** Accent colour for chips/headers — a CSS colour, normally a theme
   * variable (var(--color-pink)) so it follows the active theme. */
  accent: string;
  /** A pale wash of the accent, for a tag's background. */
  tint: string;
};

/** A "shop by occasion" grouping (Birthday, Anniversary...). Which items
 * suit it is stored on each item's `occasions` list. */
export type Occasion = {
  id: string;
  label: string;
  /** Tile photo on Home — one of our flavour photos that fits the mood. */
  imageUrl?: string;
};

/** A "browse by flavour" grouping that cuts across categories — e.g.
 * "Biscoff" covers the Exotic Premium cake, the cheesecake and the Pull
 * Me Up. Which items belong is stored on each item's `flavours` list. */
export type FlavourTag = {
  id: string;
  label: string;
};

export type CatalogItem = {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  /** Real photo, when we have one — falls back to the placeholder box.
   * How this photo is framed/cropped/zoomed at each display size is
   * separate, standalone config keyed by this same URL — see
   * lib/imageConfig.ts. Not stored here: this type is the catalogue's
   * content contract, not a place for display tuning. */
  imageUrl?: string;
  weightTiers: WeightTier[];
  /** Free-text ready-time badge, e.g. "Ready in 1 hour" — not always a
   *  clean function of leadTimeHours, so kept as its own field. */
  readyLabel: string;
  /** Advance notice needed, in hours. 0 = same-day is fine. */
  leadTimeHours: number;
  /** Max length for the optional per-item cake inscription; 0 = not offered. */
  cakeMessageMaxLength: number;
  /** Occasion ids (see Occasion) this item suits — feeds "shop by
   * occasion" and the menu's occasion filter. */
  occasions?: string[];
  /** Flavour-tag ids (see FlavourTag) this item belongs to — feeds
   * "browse by flavour" and lets menu search match a flavour. */
  flavours?: string[];
  /** 1-based position in Home's "Most ordered" row; omit for items not
   * featured there. */
  mostOrderedRank?: number;
  /** Sold-out flag — see ADR-004. Safety valve, not a routine toggle. */
  available: boolean;
  /** Needs on-site installation/delivery — see ADR-003 (removes Pickup as a choice). */
  requiresDelivery: boolean;
};
