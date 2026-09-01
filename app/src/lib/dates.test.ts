import { afterEach, describe, expect, it } from "vitest";
import { formatShortDate, parseIsoDateLocal, todayIsoDate } from "@/lib/dates";

const originalTz = process.env.TZ;

afterEach(() => {
  process.env.TZ = originalTz;
});

describe("formatShortDate", () => {
  it("formats as 'Mon D'", () => {
    expect(formatShortDate(new Date(2026, 8, 1))).toBe("Sep 1");
    expect(formatShortDate(new Date(2026, 0, 25))).toBe("Jan 25");
  });
});

describe("parseIsoDateLocal", () => {
  // The historical bug this guards against: `new Date(iso)` (no time
  // component) parses as UTC midnight, which lands on a different local
  // calendar day depending on the runtime timezone. parseIsoDateLocal
  // must always resolve to the exact calendar day in the string,
  // regardless of which timezone the code happens to run in.
  it.each(["Asia/Dubai", "America/New_York", "UTC"])(
    "resolves to the exact calendar day in %s",
    (tz) => {
      process.env.TZ = tz;
      const d = parseIsoDateLocal("2026-09-01");
      expect(d.getFullYear()).toBe(2026);
      expect(d.getMonth()).toBe(8);
      expect(d.getDate()).toBe(1);
    }
  );

  it("differs from naive `new Date(iso)` parsing in a timezone behind UTC", () => {
    process.env.TZ = "America/New_York";
    const naive = new Date("2026-09-01");
    const safe = parseIsoDateLocal("2026-09-01");
    expect(naive.getDate()).not.toBe(safe.getDate());
  });
});

describe("todayIsoDate", () => {
  it("returns today's date in YYYY-MM-DD form", () => {
    const now = new Date();
    const expected = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      now.getDate()
    ).padStart(2, "0")}`;
    expect(todayIsoDate()).toBe(expected);
  });

  it("matches the local calendar day even just after local midnight in a timezone ahead of UTC", () => {
    // Regression case for the original bug: toISOString() converts to UTC
    // first, which would report yesterday's date for early-morning times
    // in a timezone ahead of UTC (e.g. before 4am in UAE, UTC+4).
    process.env.TZ = "Asia/Dubai";
    const now = new Date();
    const viaToISOString = now.toISOString().slice(0, 10);
    const viaTodayIsoDate = todayIsoDate();
    // Only assert divergence when we're actually in the bug's danger
    // window (before 4am local) — otherwise both forms happen to agree.
    if (now.getHours() < 4) {
      expect(viaTodayIsoDate).not.toBe(viaToISOString);
    }
    expect(viaTodayIsoDate).toBe(
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
        now.getDate()
      ).padStart(2, "0")}`
    );
  });
});
