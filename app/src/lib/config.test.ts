import { describe, expect, it } from "vitest";
import { CONFIG } from "./config";

describe("CONFIG.openingHours", () => {
  it("is the grouped-consecutive-days summary of openingHoursByDay", () => {
    expect(CONFIG.openingHours).toEqual([
      { days: "Monday - Thursday", hours: "10 am - 12 am" },
      { days: "Friday - Sunday", hours: "10 am - 1 am" },
    ]);
  });
});
