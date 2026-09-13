import type { CSSProperties } from "react";
import type { Flavour, ImageSlot } from "@/types/catalog";

/**
 * Turns a flavour's optional per-slot framing config into inline CSS for
 * its <img>. Every *Image class defaults to object-fit: cover (crops to
 * fill, centered) — fine for a photo shot with generous margin, but it
 * silently discards whatever falls outside the box's aspect ratio, which
 * is exactly what over-cropped a tightly-framed photo before this
 * existed. A configured slot switches that one <img> to object-fit:
 * contain instead — the whole photo is always visible, letterboxed
 * rather than cropped — then optionally zooms in from there:
 *   - zoom 1 (or omitted): fully visible, no cropping at all. The safe
 *     default once a slot opts in.
 *   - zoom > 1: crops in progressively from focalX/focalY, tighter as
 *     zoom increases — at some value equivalent to what cover alone
 *     would have produced, and beyond that, tighter still.
 * No framing entry for a slot (the default for ~every photo) returns {}
 * — that <img> keeps its class's own object-fit: cover, unchanged.
 *
 * This adjusts how the existing photo FILE is displayed — there's no
 * image-processing pipeline here, nothing is re-encoded or actually
 * cropped on disk, just CSS presentation of one static <img>.
 */
export function resolveImageStyle(framing: Flavour["framing"], slot: ImageSlot): CSSProperties {
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
