import { describe, it, expect, afterEach, vi } from "vitest";
import { safeGetItem, safeSetItem } from "./safeStorage";

describe("safeGetItem/safeSetItem", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it("reads back a value that was set", () => {
    safeSetItem("k", "v");
    expect(safeGetItem("k")).toBe("v");
  });

  it("returns null for a key that was never set", () => {
    expect(safeGetItem("missing")).toBeNull();
  });

  it("returns null instead of throwing when localStorage.getItem throws", () => {
    vi.spyOn(window.localStorage.__proto__, "getItem").mockImplementation(() => {
      throw new Error("SecurityError: storage blocked");
    });
    expect(() => safeGetItem("k")).not.toThrow();
    expect(safeGetItem("k")).toBeNull();
  });

  it("does not throw when localStorage.setItem throws (e.g. quota exceeded)", () => {
    vi.spyOn(window.localStorage.__proto__, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    expect(() => safeSetItem("k", "v")).not.toThrow();
  });
});
