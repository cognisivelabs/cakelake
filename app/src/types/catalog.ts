// The shape of the bakery's catalogue: categories, items, occasions and
// flavour tags.
//

export type WeightTier = {
  /** Unique within its item. */
  id: number;
  label: string; // "½ kg", "1 kg", "3 kg+"
  /** Weight in kg; the smallest weight for an open-ended tier such as "3 kg+". */
  kg: number;
  /** Price in AED. Leave out to show "Ask us". */
  price?: number;
  /** How many people this weight serves, e.g. "Serves 5–6". */
  serves?: string;
};

/** How a category is sold: everyday menu ranges, ranges that need notice
 * (made to order), or a from-scratch custom brief (Photo, 3D). */
export type CategoryKind = "everyday" | "made-to-order" | "custom";

export type Category = {
  id: number;
  /** URL form of the category, e.g. "classic-cakes". */
  slug: string;
  label: string;
  kind: CategoryKind;
  /** Accent colour for chips and headers, usually a theme variable such
   * as var(--color-pink). */
  accent: string;
  /** A pale version of the accent, used as a tag background. */
  tint: string;
};

/** A "shop by occasion" grouping (Birthday, Anniversary...). Which items
 * suit it is stored on each item's `occasions` list. */
export type Occasion = {
  id: number;
  /** URL form of the occasion, e.g. "new-baby". */
  slug: string;
  label: string;
  /** Tile photo on Home. */
  imageUrl?: string;
};

/** A "browse by flavour" grouping that cuts across categories — e.g.
 * "Biscoff" covers the Exotic Premium cake, the cheesecake and the Pull
 * Me Up. Which items belong is stored on each item's `flavours` list. */
export type FlavourTag = {
  id: number;
  /** URL form of the flavour tag, e.g. "red-velvet". */
  slug: string;
  label: string;
};

/**
 * Represent a single item in the catalogue
 */
export type CatalogItem = {
  /** Unique identifier for CatalogItem. */
  id: number;
  /** URL form of the item, e.g. "classic-cakes-black-forest". */
  slug: string;
  /** Name of the item. */
  name: string;
  /** Id of the category this item belongs to. */
  categoryId: number;
  /** Short description of the item. */
  description: string;
  /** The URL is relative to the public folder. */
  imageUrl?: string;
  /** The available weight tiers for this item. */
  weightTiers: WeightTier[];
  /** Advance notice needed, in hours. 0 = same-day, ready in
   * CONFIG.sameDayPrepHours. */
  leadTimeHours: number;
  /** Max length for the optional per-item cake inscription. */
  cakeMessageMaxLength: number;
  /** Ids of the occasions (see Occasion) this item suits. */
  occasions?: number[];
  /** Ids of the flavour tags (see FlavourTag) this item belongs to. */
  flavours?: number[];
  /** 1-based position in Home's "Most ordered" row; omit for items not featured there. */
  mostOrderedRank?: number;
  /** False when the item is sold out. */
  available: boolean;
  /** True when the item must be delivered; Pickup isn't offered for it. */
  requiresDelivery: boolean;
};
