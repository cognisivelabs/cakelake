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
 * one <img>.
 *
 * Two independent tools live here, usable together:
 *  - fit/focalX/focalY/zoom — a symmetric pan-and-zoom model: one focal
 *    point, one zoom level, cropping (or letterboxing) equally around
 *    that point. Good for "shift the crop" or "zoom in/out" adjustments.
 *  - cropTop/Right/Bottom/Left — direct, independently-sized trims off
 *    each edge. Good for "I know this photo has exactly this much empty
 *    margin on each side, remove it" — including unequal amounts (e.g.
 *    trim 15% off the top but only 5% off the bottom), which the
 *    symmetric pan/zoom model above can't express on its own.
 * Applied in this order: fit -> focal position -> zoom/rotate/flip ->
 * crop trim, i.e. the crop percentages are measured against the box
 * *after* everything else has already been applied.
 */
type ImageFraming = {
  /**
   * "cover" (default when omitted): crop to fill the box, discarding
   * whatever falls outside it — the site's plain default everywhere an
   * image has no config at all. "contain": show the whole photo,
   * letterboxed (see backgroundColor below) rather than cropped — use
   * this when a photo doesn't have enough margin to survive cover's
   * crop without losing real content.
   */
  fit?: "cover" | "contain";
  /** Horizontal focal point, 0-100 (50 = centered). With fit: "cover",
   * this is which edge of the photo survives the crop. With fit:
   * "contain", it's where the photo sits in any letterbox gap. Either
   * way, it's also the anchor a zoom or rotate is applied around. */
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
  /** Degrees, clockwise. 0 (or omitted) = no rotation. Rotates around
   * focalX/focalY, same as zoom. */
  rotate?: number;
  /** Mirror the photo left-right. */
  flipX?: boolean;
  /** Mirror the photo top-bottom. */
  flipY?: boolean;
  /** CSS color for the letterbox gaps fit: "contain" leaves around a
   * photo that doesn't match its box's aspect ratio — overrides the
   * box's own placeholder background (--color-photo-bg) just for this
   * photo. No visible effect under fit: "cover" (there are no gaps to
   * fill — it always fills the box completely). */
  backgroundColor?: string;
  /** Trim this many percent off the top edge, applied last — after
   * fit/focal/zoom/rotate/flip. 0 (or omitted) = no additional trim.
   * Independently sized from the other 3 sides — see the type-level
   * comment above for why that's a different tool from focalX/focalY +
   * zoom's symmetric model. */
  cropTop?: number;
  /** Trim this many percent off the right edge. */
  cropRight?: number;
  /** Trim this many percent off the bottom edge. */
  cropBottom?: number;
  /** Trim this many percent off the left edge. */
  cropLeft?: number;
};

export type ImageFramingBySlot = Partial<Record<ImageSlot, ImageFraming>> & {
  /** Applies when a slot below doesn't have its own entry — the common
   * case, since most photos want the same treatment everywhere. */
  default?: ImageFraming;
};
