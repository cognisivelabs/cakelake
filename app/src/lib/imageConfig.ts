import type { CSSProperties } from "react";
import type { ImageFramingBySlot, ImageSlot } from "@/types/image";
import { IMAGE_CONFIG } from "@/data/imageConfig";

/**
 * Inline CSS for an image in `slot`: its framing for that slot in
 * `config` (IMAGE_CONFIG by default), else its "default" framing; {}
 * when it has neither.
 */
export function resolveImageStyle(
  imageUrl: string | undefined,
  slot: ImageSlot,
  config: Record<string, ImageFramingBySlot> = IMAGE_CONFIG
): CSSProperties {
  const framing = imageUrl ? config[imageUrl] : undefined;
  const spec = framing?.[slot] ?? framing?.default;
  if (!spec) return {};

  const { fit = "cover", focalX = 50, focalY = 50, zoom = 1 } = spec;

  const focalPoint = `${focalX}% ${focalY}%`;
  const style: CSSProperties = {
    objectFit: fit,
    objectPosition: focalPoint,
  };

  if (zoom !== 1) {
    style.transform = `scale(${zoom})`;
    style.transformOrigin = focalPoint;
  }

  return style;
}
