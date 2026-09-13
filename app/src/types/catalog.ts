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

/**
 * The distinct photo shapes imageUrl actually renders at across the site.
 * Every small, roughly-square rendering (menu card, flavour swatch, cart
 * line item, "added to order" sheet) shares "thumbnail" — they're
 * different pixel sizes but the same ~1:1 shape, so one crop/zoom tuning
 * suits all of them. "hero" is ItemDetailView's single large photo, a
 * meaningfully different (wider) box.
 */
export type ImageSlot = "hero" | "thumbnail";

/**
 * Per-photo display tuning — see lib/imageFraming.ts for how this becomes
 * actual CSS. Presence of an entry (even {}) opts that slot out of its
 * default object-fit: cover (crop-to-fill, which silently discards
 * whatever falls outside the box) and into object-fit: contain — the
 * whole photo is always visible, letterboxed rather than cropped — then
 * optionally zooms in from there. This adjusts how the existing photo
 * FILE is displayed; it doesn't crop or re-encode the file itself —
 * there's no image-processing pipeline here, just CSS presentation of
 * one static <img>.
 */
export type ImageFraming = {
  /** Horizontal focal point, 0-100 (50 = centered) — where the photo
   * sits in any letterbox gap, and what a zoom > 1 crops in toward. */
  focalX?: number;
  /** Vertical focal point, 0-100 (50 = centered). */
  focalY?: number;
  /** 1 (or omitted): fully visible, no cropping — the safe default once
   * a slot opts in. > 1: crops in progressively from focalX/focalY,
   * tighter as zoom increases — at some value equivalent to what
   * object-fit: cover alone would have produced, and beyond that,
   * tighter still. */
  zoom?: number;
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
  /** Per-slot crop/zoom tuning for imageUrl (see ImageSlot/ImageFraming
   * above) — "default" applies when a slot isn't given its own entry.
   * Omitted entirely = today's plain object-fit: cover everywhere,
   * identical to the behavior before this existed. */
  framing?: Partial<Record<ImageSlot, ImageFraming>> & { default?: ImageFraming };
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
