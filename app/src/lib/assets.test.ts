import { afterEach, describe, expect, it } from "vitest";
import { withBasePath } from "@/lib/assets";

const originalBasePath = process.env.NEXT_PUBLIC_BASE_PATH;

afterEach(() => {
  process.env.NEXT_PUBLIC_BASE_PATH = originalBasePath;
});

describe("withBasePath", () => {
  it("returns the path unchanged when no base path is set", () => {
    delete process.env.NEXT_PUBLIC_BASE_PATH;
    expect(withBasePath("/images/cake.jpg")).toBe("/images/cake.jpg");
  });

  it("prefixes the path with the configured base path", () => {
    process.env.NEXT_PUBLIC_BASE_PATH = "/cakelake";
    expect(withBasePath("/images/cake.jpg")).toBe("/cakelake/images/cake.jpg");
  });
});
