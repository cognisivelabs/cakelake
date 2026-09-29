// The shape of the bakery's catalogue: categories, items, occasions and
// flavour tags.
//
// Each item has a list of weight tiers, each with its own price. A tier
// with no price shows as "Ask us".

export type WeightTier = {
  id: string;
  label: string; // "½ kg", "1 kg", "3 kg+"
  /** Price in AED. Leave out to show "Ask us". */
  price?: number;
  /** How many people this weight serves, e.g. "Serves 5–6". */
  serves?: string;
};

/** How a category is sold: everyday menu ranges, ranges that need notice
 * (made to order), or a from-scratch custom brief (Photo, 3D). */
export type CategoryKind = "everyday" | "made-to-order" | "custom";

export type Category = {
  id: string;
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
  id: string;
  label: string;
  /** Tile photo on Home. */
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
  /** Item photo. Without one, a placeholder box shows. Framing and crop
   * per display size live in lib/imageConfig.ts, keyed by this URL. */
  imageUrl?: string;
  weightTiers: WeightTier[];
  /** Ready-time badge text, e.g. "Ready in 1 hour". */
  readyLabel: string;
  /** Advance notice needed, in hours. 0 = same-day is fine. */
  leadTimeHours: number;
  /** Max length for the optional per-item cake inscription; 0 = not offered. */
  cakeMessageMaxLength: number;
  /** Ids of the occasions (see Occasion) this item suits. */
  occasions?: string[];
  /** Ids of the flavour tags (see FlavourTag) this item belongs to. */
  flavours?: string[];
  /** 1-based position in Home's "Most ordered" row; omit for items not
   * featured there. */
  mostOrderedRank?: number;
  /** False when the item is sold out. */
  available: boolean;
  /** True when the item must be delivered; Pickup isn't offered for it. */
  requiresDelivery: boolean;
};
