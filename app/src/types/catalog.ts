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
  /** Sold-out flag — see ADR-004. Safety valve, not a routine toggle. */
  available: boolean;
  /** Needs on-site installation/delivery — see ADR-003 (removes Pickup as a choice). */
  requiresDelivery: boolean;
};
