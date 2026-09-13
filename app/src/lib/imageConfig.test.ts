import { describe, expect, it } from "vitest";
import { resolveImageStyle, type ImageFramingBySlot } from "./imageConfig";

const CONFIG: Record<string, ImageFramingBySlot> = {
  "/images/centered.jpg": { hero: {} },
  "/images/off-center.jpg": { hero: { focalX: 30, focalY: 20 } },
  "/images/zoomed.jpg": { hero: { focalX: 40, focalY: 60, zoom: 1.3 } },
  "/images/zoom-one.jpg": { hero: { zoom: 1 } },
  "/images/default-and-slot.jpg": { default: { zoom: 1.1 }, thumbnail: { zoom: 0.9 } },
  "/images/default-only.jpg": { default: { zoom: 1.1 } },
};

describe("resolveImageStyle", () => {
  it("returns no style overrides for an unconfigured image", () => {
    expect(resolveImageStyle("/images/unknown.jpg", "hero", CONFIG)).toEqual({});
  });

  it("returns no style overrides when imageUrl is undefined", () => {
    expect(resolveImageStyle(undefined, "hero", CONFIG)).toEqual({});
  });

  it("returns no style overrides when the image is configured but the slot and default are both unset", () => {
    expect(resolveImageStyle("/images/centered.jpg", "thumbnail", CONFIG)).toEqual({});
  });

  it("switches to contain with a centered, no-zoom entry ({}) — the fix for an over-tight photo", () => {
    expect(resolveImageStyle("/images/centered.jpg", "hero", CONFIG)).toEqual({
      objectFit: "contain",
      objectPosition: "50% 50%",
    });
  });

  it("uses a custom focal point for object-position", () => {
    expect(resolveImageStyle("/images/off-center.jpg", "hero", CONFIG)).toEqual({
      objectFit: "contain",
      objectPosition: "30% 20%",
    });
  });

  it("adds a scale transform anchored at the focal point when zoom is not 1", () => {
    expect(resolveImageStyle("/images/zoomed.jpg", "hero", CONFIG)).toEqual({
      objectFit: "contain",
      objectPosition: "40% 60%",
      transform: "scale(1.3)",
      transformOrigin: "40% 60%",
    });
  });

  it("omits the transform entirely when zoom is exactly 1", () => {
    const result = resolveImageStyle("/images/zoom-one.jpg", "hero", CONFIG);
    expect(result.transform).toBeUndefined();
    expect(result.transformOrigin).toBeUndefined();
    expect(result.objectFit).toBe("contain");
  });

  it("prefers the slot-specific entry over 'default' when both exist", () => {
    expect(resolveImageStyle("/images/default-and-slot.jpg", "thumbnail", CONFIG)).toEqual({
      objectFit: "contain",
      objectPosition: "50% 50%",
      transform: "scale(0.9)",
      transformOrigin: "50% 50%",
    });
  });

  it("falls back to 'default' when the requested slot has no entry of its own", () => {
    expect(resolveImageStyle("/images/default-only.jpg", "hero", CONFIG)).toEqual({
      objectFit: "contain",
      objectPosition: "50% 50%",
      transform: "scale(1.1)",
      transformOrigin: "50% 50%",
    });
  });

  it("defaults to the real IMAGE_CONFIG when no config argument is passed", () => {
    // A URL that can't plausibly be a real configured entry — this only
    // proves the default parameter wires up to the real IMAGE_CONFIG
    // (an unconfigured image still resolves to {}), not that IMAGE_CONFIG
    // is empty, since real entries will get added there over time.
    expect(resolveImageStyle("/images/__not-a-real-configured-image__.jpg", "hero")).toEqual({});
  });
});
