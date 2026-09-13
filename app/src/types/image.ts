// Image display config's type contract — see data/imageConfig.ts (the
// data) and lib/imageConfig.ts (the resolver that turns it into CSS).

/**
 * The distinct photo shapes an imageUrl actually renders at across the
 * site. Every small, roughly-square rendering (menu card, flavour
 * swatch, cart line item, "added to order" sheet) shares "thumbnail" —
 * they're different pixel sizes but the same ~1:1 shape, so one
 * crop/zoom tuning suits all of them. "hero" is ItemDetailView's single
 * large photo, a meaningfully different (wider) box.
 */
export type ImageSlot = "hero" | "thumbnail";

/**
 * Per-slot display tuning for one photo. This adjusts how the existing
 * photo FILE is displayed; it doesn't crop or re-encode the file itself
 * — there's no image-processing pipeline here, just CSS presentation of
 * one <img>. Considered and deliberately left out: rotate/flip/a custom
 * letterbox-background-color override — no cake photo taken so far has
 * needed any of them, and each is easy to add later if one ever does.
 */
export type ImageFraming = {
  /**
   * "cover" (default when omitted): crop to fill the box, discarding
   * whatever falls outside it — the site's plain default everywhere an
   * image has no config at all. "contain": show the whole photo,
   * letterboxed (the box's own placeholder background shows through the
   * gaps) rather than cropped — use this when a photo doesn't have
   * enough margin to survive cover's crop without losing real content.
   */
  fit?: "cover" | "contain";
  /** Horizontal focal point, 0-100 (50 = centered). With fit: "cover",
   * this is which edge of the photo survives the crop. With fit:
   * "contain", it's where the photo sits in any letterbox gap. Either
   * way, it's also where a zoom crops in/out from. */
  focalX?: number;
  /** Vertical focal point, 0-100 (50 = centered). */
  focalY?: number;
  /**
   * Zoom relative to `fit`'s own result — 1 (or omitted) leaves it
   * unchanged. Behavior depends on `fit`:
   *  - fit: "cover" — already crops to fill, so zoom here only resizes
   *    that already-cropped result: > 1 crops in tighter (hides more of
   *    the edges); < 1 shrinks it within the box, revealing the box's
   *    background as a border. It cannot recover content cover already
   *    discarded.
   *  - fit: "contain" — 1 is fully visible, no cropping at all; > 1
   *    crops in progressively from focalX/focalY, tighter as zoom
   *    increases — at some value equivalent to what fit: "cover" alone
   *    would have produced, and beyond that, tighter still.
   */
  zoom?: number;
};

export type ImageFramingBySlot = Partial<Record<ImageSlot, ImageFraming>> & {
  /** Applies when a slot below doesn't have its own entry — the common
   * case, since most photos want the same treatment everywhere. */
  default?: ImageFraming;
};
