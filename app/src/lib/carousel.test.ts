import { describe, expect, it } from "vitest";
import { nextIndex, previousIndex, shouldAutoRotate } from "@/lib/carousel";
import { HOME_BANNERS } from "@/data/banners";

describe("previousIndex", () => {
  it("steps back one slide and wraps round to the last", () => {
    expect(previousIndex(2, 3)).toBe(1);
    expect(previousIndex(1, 3)).toBe(0);
    expect(previousIndex(0, 3)).toBe(2);
  });

  it("stays put with no slides", () => {
    expect(previousIndex(0, 0)).toBe(0);
  });
});

describe("nextIndex", () => {
  it("advances one slide and wraps back to the first", () => {
    expect(nextIndex(0, 3)).toBe(1);
    expect(nextIndex(1, 3)).toBe(2);
    expect(nextIndex(2, 3)).toBe(0);
  });

  it("stays put with a single slide or none", () => {
    expect(nextIndex(0, 1)).toBe(0);
    expect(nextIndex(0, 0)).toBe(0);
  });
});

describe("shouldAutoRotate", () => {
  it("rotates only with more than one banner", () => {
    expect(shouldAutoRotate(3, false)).toBe(true);
    expect(shouldAutoRotate(1, false)).toBe(false);
  });

  it("never rotates for someone who prefers reduced motion", () => {
    expect(shouldAutoRotate(3, true)).toBe(false);
  });
});

describe("HOME_BANNERS", () => {
  it("has unique ids and a call to action on each banner", () => {
    expect(new Set(HOME_BANNERS.map((b) => b.id)).size).toBe(HOME_BANNERS.length);
    for (const banner of HOME_BANNERS) {
      expect(banner.cta.href, `banner ${banner.id}`).toBeTruthy();
      expect(banner.title.length, `banner ${banner.id}`).toBeGreaterThan(0);
    }
  });
});
