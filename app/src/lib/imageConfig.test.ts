import { describe, expect, it } from "vitest";
import { resolveImageStyle } from "./imageConfig";
import type { ImageFramingBySlot } from "@/types/image";

const CONFIG: Record<string, ImageFramingBySlot> = {
  "/images/bare.jpg": { hero: {} },
  "/images/cover-panned.jpg": { hero: { focalX: 70, focalY: 30 } },
  "/images/contain.jpg": { hero: { fit: "contain" } },
  "/images/contain-panned.jpg": { hero: { fit: "contain", focalX: 30, focalY: 20 } },
  "/images/cover-zoomed-in.jpg": { hero: { zoom: 1.3 } },
  "/images/contain-zoomed-in.jpg": { hero: { fit: "contain", focalX: 40, focalY: 60, zoom: 1.3 } },
  "/images/zoom-one.jpg": { hero: { fit: "contain", zoom: 1 } },
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
    expect(resolveImageStyle("/images/bare.jpg", "thumbnail", CONFIG)).toEqual({});
  });

  it("defaults fit to 'cover' (the site's plain default) when a bare entry ({}) opts in with nothing else set", () => {
    expect(resolveImageStyle("/images/bare.jpg", "hero", CONFIG)).toEqual({
      objectFit: "cover",
      objectPosition: "50% 50%",
    });
  });

  it("supports cover with a custom focal point — a tighter crop, just shifted", () => {
    expect(resolveImageStyle("/images/cover-panned.jpg", "hero", CONFIG)).toEqual({
      objectFit: "cover",
      objectPosition: "70% 30%",
    });
  });

  it("switches to contain (fully visible, no cropping) when fit is set explicitly", () => {
    expect(resolveImageStyle("/images/contain.jpg", "hero", CONFIG)).toEqual({
      objectFit: "contain",
      objectPosition: "50% 50%",
    });
  });

  it("supports contain with a custom focal point for where the photo sits in the letterbox gap", () => {
    expect(resolveImageStyle("/images/contain-panned.jpg", "hero", CONFIG)).toEqual({
      objectFit: "contain",
      objectPosition: "30% 20%",
    });
  });

  it("zooming in under cover crops tighter than plain cover would", () => {
    expect(resolveImageStyle("/images/cover-zoomed-in.jpg", "hero", CONFIG)).toEqual({
      objectFit: "cover",
      objectPosition: "50% 50%",
      transform: "scale(1.3)",
      transformOrigin: "50% 50%",
    });
  });

  it("zooming in under contain crops in progressively from the focal point", () => {
    expect(resolveImageStyle("/images/contain-zoomed-in.jpg", "hero", CONFIG)).toEqual({
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
      objectFit: "cover",
      objectPosition: "50% 50%",
      transform: "scale(0.9)",
      transformOrigin: "50% 50%",
    });
  });

  it("falls back to 'default' when the requested slot has no entry of its own", () => {
    expect(resolveImageStyle("/images/default-only.jpg", "hero", CONFIG)).toEqual({
      objectFit: "cover",
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
