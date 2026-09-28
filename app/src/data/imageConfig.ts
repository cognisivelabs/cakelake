import type { ImageFramingBySlot } from "@/types/image";

/**
 * The single place every image's display settings live, keyed by the
 * same URL string used as a CatalogItem's imageUrl — independent of the
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
  // The two full-bleed hero photos (CONFIG.heroStyle: "photo") — vertical
  // framing matched to the design (CLB Desktop Home v2, screens 6a/7a).
  "/images/hero-bakery-case.jpg": { heroBleed: { focalY: 55 } },
  "/images/hero-birthday-cake.jpg": { heroBleed: { focalY: 45 } },
  // The banner's tall, narrow bleed crop discards most of this square
  // photo's width — biased left of centre so the printed photo itself
  // survives the crop rather than the "Happy Birthday" lettering.
  "/images/hero-photo-cake.jpg": { heroBleed: { focalX: 40 } },
};
