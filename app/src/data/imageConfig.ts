import type { ImageFramingBySlot } from "@/types/image";

/** Display framing per image, keyed by image URL (the same string as a
 * CatalogItem's imageUrl). An image with no entry uses object-fit: cover. */
export const IMAGE_CONFIG: Record<string, ImageFramingBySlot> = {
  // Full-bleed hero photos.
  "/images/hero-bakery-case.jpg": { heroBleed: { focalY: 55 } },
  "/images/hero-birthday-cake.jpg": { heroBleed: { focalY: 45 } },
  // Focal point left of centre, on the printed photo.
  "/images/hero-photo-cake.jpg": { heroBleed: { focalX: 40 } },
};
