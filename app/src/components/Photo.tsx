"use client";

import { hideBrokenImage, withBasePath } from "@/lib/assets";
import { resolveImageStyle } from "@/lib/imageConfig";
import type { ImageSlot } from "@/types/image";

// The one place a catalogue photo becomes an <img>: it prefixes the
// deploy base path, fills its (relatively positioned) box, applies any
// per-photo framing for the slot it's shown in, and falls back to the
// placeholder behind it if the file is missing. Renders nothing without
// a `src`, so callers don't each guard for that.
export function Photo({
  src,
  alt = "",
  slot,
  className = "fill-cover",
}: {
  src?: string;
  alt?: string;
  /** Which display slot this is, for lib/imageConfig's per-photo framing. */
  slot?: ImageSlot;
  className?: string;
}) {
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export: next/image's optimiser needs a server
    <img
      src={withBasePath(src)}
      alt={alt}
      className={className}
      style={slot ? resolveImageStyle(src, slot) : undefined}
      onError={hideBrokenImage}
    />
  );
}
