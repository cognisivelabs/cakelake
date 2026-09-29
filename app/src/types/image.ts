/**
 * "thumbnail" is every small, roughly square photo used in various rendering 
 * contexts (menu card, flavour swatch, cart line, "added to order" sheet); 
 * "hero" is Item Detail's large photo; 
 * "heroBleed" is a Home banner's full-bleed photo.
 */
export type ImageSlot = "hero" | "thumbnail" | "heroBleed";

/** How one photo is framed in one slot: a focal point and zoom, applied
 * as CSS on the <img>. */
type ImageFraming = {
  /** "cover" (default) crops the photo to fill the box; "contain" shows
   * the whole photo, letterboxed. */
  fit?: "cover" | "contain";
  /** Horizontal focal point, 0-100 (default 50): the part kept by a
   * "cover" crop, the position within a "contain" letterbox, and the
   * point zoom scales around. */
  focalX?: number;
  /** Vertical focal point, 0-100 (default 50); same as focalX. */
  focalY?: number;
  /** Scale applied after `fit`, around the focal point (default 1).
   * Above 1 crops in tighter; below 1 shrinks the photo inside the box. */
  zoom?: number;
};

/** A photo's framing per slot. */
export type ImageFramingBySlot = Partial<Record<ImageSlot, ImageFraming>> & {
  /** Framing for any slot without its own entry. */
  default?: ImageFraming;
};
