import { describe, expect, it } from "vitest";
import { resolveImageStyle } from "./imageFraming";

describe("resolveImageStyle", () => {
  it("returns no style overrides when framing is undefined", () => {
    expect(resolveImageStyle(undefined, "hero")).toEqual({});
  });

  it("returns no style overrides when the slot and default are both unset", () => {
    expect(resolveImageStyle({}, "hero")).toEqual({});
  });

  it("switches to contain with a centered, no-zoom entry ({}) — the fix for an over-tight photo", () => {
    expect(resolveImageStyle({ hero: {} }, "hero")).toEqual({
      objectFit: "contain",
      objectPosition: "50% 50%",
    });
  });

  it("uses a custom focal point for both object-position and (when zoomed) transform-origin", () => {
    expect(resolveImageStyle({ hero: { focalX: 30, focalY: 20 } }, "hero")).toEqual({
      objectFit: "contain",
      objectPosition: "30% 20%",
    });
  });

  it("adds a scale transform anchored at the focal point when zoom is not 1", () => {
    expect(resolveImageStyle({ hero: { focalX: 40, focalY: 60, zoom: 1.3 } }, "hero")).toEqual({
      objectFit: "contain",
      objectPosition: "40% 60%",
      transform: "scale(1.3)",
      transformOrigin: "40% 60%",
    });
  });

  it("omits the transform entirely when zoom is exactly 1", () => {
    const result = resolveImageStyle({ hero: { zoom: 1 } }, "hero");
    expect(result.transform).toBeUndefined();
    expect(result.transformOrigin).toBeUndefined();
    expect(result.objectFit).toBe("contain");
  });

  it("prefers the slot-specific entry over 'default' when both exist", () => {
    expect(
      resolveImageStyle({ default: { zoom: 1.1 }, thumbnail: { zoom: 0.9 } }, "thumbnail")
    ).toEqual({
      objectFit: "contain",
      objectPosition: "50% 50%",
      transform: "scale(0.9)",
      transformOrigin: "50% 50%",
    });
  });

  it("falls back to 'default' when the requested slot has no entry of its own", () => {
    expect(resolveImageStyle({ default: { zoom: 1.1 } }, "hero")).toEqual({
      objectFit: "contain",
      objectPosition: "50% 50%",
      transform: "scale(1.1)",
      transformOrigin: "50% 50%",
    });
  });
});
