import type { CSSProperties } from "react";

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
 * Presence of an entry (even {}) opts a slot out of the default
 * object-fit: cover (crop-to-fill, which silently discards whatever
 * falls outside the box) and into object-fit: contain — the whole photo
 * is always visible, letterboxed rather than cropped — then optionally
 * zooms in from there. This adjusts how the existing photo FILE is
 * displayed; it doesn't crop or re-encode the file itself — there's no
 * image-processing pipeline here, just CSS presentation of one <img>.
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

export type ImageFramingBySlot = Partial<Record<ImageSlot, ImageFraming>> & {
  /** Applies when a slot below doesn't have its own entry — the common
   * case, since most photos want the same treatment everywhere. */
  default?: ImageFraming;
};

/**
 * The single place every image's display settings live, keyed by the
 * same URL string used as a Flavour's imageUrl — independent of the
 * catalogue's own content data (types/catalog.ts), so "what photo is
 * this" and "how should this photo be displayed" stay two separate
 * concerns. An image with no entry here just uses plain object-fit:
 * cover everywhere, today's existing behavior.
 */
export const IMAGE_CONFIG: Record<string, ImageFramingBySlot> = {};

/**
 * Looks up imageUrl in `config` (IMAGE_CONFIG by default — overridable
 * for tests), resolves the given slot's framing (falling back to
 * "default"), and turns it into inline CSS for that <img>. See
 * ImageFraming above for what each field does.
 */
export function resolveImageStyle(
  imageUrl: string | undefined,
  slot: ImageSlot,
  config: Record<string, ImageFramingBySlot> = IMAGE_CONFIG
): CSSProperties {
  const framing = imageUrl ? config[imageUrl] : undefined;
  const spec = framing?.[slot] ?? framing?.default;
  if (!spec) return {};

  const { focalX = 50, focalY = 50, zoom = 1 } = spec;
  const focalPoint = `${focalX}% ${focalY}%`;

  return {
    objectFit: "contain",
    objectPosition: focalPoint,
    ...(zoom !== 1 ? { transform: `scale(${zoom})`, transformOrigin: focalPoint } : {}),
  };
}
