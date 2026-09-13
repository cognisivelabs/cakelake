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
 * ImageFraming for what each field (focalX/focalY/zoom) does.
 */
export const IMAGE_CONFIG: Record<string, ImageFramingBySlot> = {};
