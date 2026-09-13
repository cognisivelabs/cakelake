import type { ImageFramingBySlot } from "@/types/image";

/**
 * The single place every image's display settings live, keyed by the
 * same URL string used as a Flavour's imageUrl — independent of the
 * catalogue's own content data (types/catalog.ts, lib/catalog.ts), so
 * "what photo is this" and "how should this photo be displayed" stay
 * two separate concerns. Read by lib/imageConfig.ts's resolveImageStyle,
 * which turns an entry here into actual CSS.
 *
 * An image with no entry here just uses plain object-fit: cover
 * everywhere — today's existing behavior. See types/image.ts's
 * ImageFraming for what each field (fit/focalX/focalY/zoom) does.
 */
export const IMAGE_CONFIG: Record<string, ImageFramingBySlot> = {
  // Strawberry crown sits right at the top edge with almost no margin —
  // plain object-fit: cover's ~22% top/bottom crop on the desktop hero
  // cut off most of it. fit: "contain" (full visibility, no zoom) fixes
  // that; see the framing discussion in chat for the underlying math.
  "/images/premium-dark-chocolate-strawberry.jpg": { default: { fit: "contain" } },
};
