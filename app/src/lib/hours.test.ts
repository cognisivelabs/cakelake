import { describe, expect, it } from "vitest";
import { groupOpeningHours } from "./hours";

describe("groupOpeningHours", () => {
  it("collapses consecutive days sharing the same hours into a range", () => {
    expect(
      groupOpeningHours([
        { day: "Monday", hours: "10 am - 12 am" },
        { day: "Tuesday", hours: "10 am - 12 am" },
        { day: "Wednesday", hours: "10 am - 12 am" },
        { day: "Thursday", hours: "10 am - 12 am" },
        { day: "Friday", hours: "10 am - 1 am" },
        { day: "Saturday", hours: "10 am - 1 am" },
        { day: "Sunday", hours: "10 am - 1 am" },
      ])
    ).toEqual([
      { days: "Monday - Thursday", hours: "10 am - 12 am" },
      { days: "Friday - Sunday", hours: "10 am - 1 am" },
    ]);
  });

  it("keeps a single day as a bare name, not a range", () => {
    expect(
      groupOpeningHours([
        { day: "Monday", hours: "10 am - 12 am" },
        { day: "Tuesday", hours: "10 am - 1 am" },
      ])
    ).toEqual([
      { days: "Monday", hours: "10 am - 12 am" },
      { days: "Tuesday", hours: "10 am - 1 am" },
    ]);
  });

  it("starts a new group when hours change and change back", () => {
    expect(
      groupOpeningHours([
        { day: "Monday", hours: "A" },
        { day: "Tuesday", hours: "B" },
        { day: "Wednesday", hours: "A" },
      ])
    ).toEqual([
      { days: "Monday", hours: "A" },
      { days: "Tuesday", hours: "B" },
      { days: "Wednesday", hours: "A" },
    ]);
  });

  it("returns an empty array for an empty schedule", () => {
    expect(groupOpeningHours([])).toEqual([]);
  });
});
