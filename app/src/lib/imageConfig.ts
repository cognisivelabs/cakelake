import type { CSSProperties } from "react";
import type { ImageFramingBySlot, ImageSlot } from "@/types/image";
import { IMAGE_CONFIG } from "@/data/imageConfig";

/**
 * Looks up imageUrl in `config` (IMAGE_CONFIG by default — overridable
 * for tests), resolves the given slot's framing (falling back to
 * "default"), and turns it into inline CSS for that <img>. See
 * types/image.ts's ImageFraming for what each field does.
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

  return {
    objectFit: fit,
    objectPosition: focalPoint,
    ...(zoom !== 1 ? { transform: `scale(${zoom})`, transformOrigin: focalPoint } : {}),
  };
}
