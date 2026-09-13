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

  const {
    fit = "cover",
    focalX = 50,
    focalY = 50,
    zoom = 1,
    rotate = 0,
    flipX = false,
    flipY = false,
    backgroundColor,
    cropTop = 0,
    cropRight = 0,
    cropBottom = 0,
    cropLeft = 0,
  } = spec;

  const focalPoint = `${focalX}% ${focalY}%`;
  const style: CSSProperties = {
    objectFit: fit,
    objectPosition: focalPoint,
  };

  // scale(x, y) covers zoom and flip together — flip is just zoom with a
  // negated axis — rather than a separate scaleX()/scaleY() function.
  const scaleX = zoom * (flipX ? -1 : 1);
  const scaleY = zoom * (flipY ? -1 : 1);
  const transformParts: string[] = [];
  if (scaleX !== 1 || scaleY !== 1) transformParts.push(`scale(${scaleX}, ${scaleY})`);
  if (rotate !== 0) transformParts.push(`rotate(${rotate}deg)`);
  if (transformParts.length > 0) {
    style.transform = transformParts.join(" ");
    style.transformOrigin = focalPoint;
  }

  if (backgroundColor) {
    style.backgroundColor = backgroundColor;
  }

  if (cropTop !== 0 || cropRight !== 0 || cropBottom !== 0 || cropLeft !== 0) {
    style.clipPath = `inset(${cropTop}% ${cropRight}% ${cropBottom}% ${cropLeft}%)`;
  }

  return style;
}
