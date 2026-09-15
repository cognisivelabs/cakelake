import { afterEach, describe, expect, it, vi } from "vitest";
import {
  estimatedReadyTime,
  formatShortDate,
  formatTime,
  parseIsoDateLocal,
  sameDayCutoffLabel,
  sameDayCutoffPassed,
  sameDayOrderingNotYetOpen,
  sameDayOrderingOpensAtLabel,
  todayIsoDate,
} from "@/lib/dates";
import { CONFIG } from "@/lib/config";

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

describe("formatTime", () => {
  it("formats as 'h:mm AM/PM'", () => {
    expect(formatTime(new Date(2026, 8, 1, 9, 5))).toBe("9:05 AM");
    expect(formatTime(new Date(2026, 8, 1, 14, 30))).toBe("2:30 PM");
  });
});

describe("estimatedReadyTime", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("adds CONFIG.sameDayPrepHours to the current time", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 1, 10, 0));
    const expected = new Date(2026, 8, 1, 10 + CONFIG.sameDayPrepHours, 0);
    expect(estimatedReadyTime()).toBe(formatTime(expected));
  });
});

describe("sameDayCutoffPassed", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("is false for pickup right before CONFIG.sameDayPickupCutoff", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 1, 23, 29));
    expect(sameDayCutoffPassed("pickup")).toBe(false);
  });

  it("is true for pickup at or after CONFIG.sameDayPickupCutoff", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 1, 23, 30));
    expect(sameDayCutoffPassed("pickup")).toBe(true);
  });

  it("is false for delivery right before CONFIG.sameDayDeliveryCutoff", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 1, 20, 59));
    expect(sameDayCutoffPassed("delivery")).toBe(false);
  });

  it("is true for delivery at or after CONFIG.sameDayDeliveryCutoff", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 1, 21, 0));
    expect(sameDayCutoffPassed("delivery")).toBe(true);
  });

  it("delivery's cutoff is earlier than pickup's, so a time can block delivery but not pickup", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 1, 22, 0));
    expect(sameDayCutoffPassed("delivery")).toBe(true);
    expect(sameDayCutoffPassed("pickup")).toBe(false);
  });
});

describe("sameDayCutoffLabel", () => {
  it("formats CONFIG.sameDayPickupCutoff/sameDayDeliveryCutoff as a time", () => {
    const pickup = new Date();
    pickup.setHours(CONFIG.sameDayPickupCutoff.hour, CONFIG.sameDayPickupCutoff.minute, 0, 0);
    expect(sameDayCutoffLabel("pickup")).toBe(formatTime(pickup));

    const delivery = new Date();
    delivery.setHours(CONFIG.sameDayDeliveryCutoff.hour, CONFIG.sameDayDeliveryCutoff.minute, 0, 0);
    expect(sameDayCutoffLabel("delivery")).toBe(formatTime(delivery));
  });
});

describe("sameDayOrderingNotYetOpen", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("is true before CONFIG.sameDayOrderingOpensAt", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 1, 6, 0));
    expect(sameDayOrderingNotYetOpen()).toBe(true);
  });

  it("is false right at CONFIG.sameDayOrderingOpensAt", () => {
    vi.useFakeTimers();
    vi.setSystemTime(
      new Date(2026, 8, 1, CONFIG.sameDayOrderingOpensAt.hour, CONFIG.sameDayOrderingOpensAt.minute)
    );
    expect(sameDayOrderingNotYetOpen()).toBe(false);
  });

  it("is false well after opening", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 1, 12, 0));
    expect(sameDayOrderingNotYetOpen()).toBe(false);
  });
});

describe("sameDayOrderingOpensAtLabel", () => {
  it("formats CONFIG.sameDayOrderingOpensAt as a time", () => {
    const opensAt = new Date();
    opensAt.setHours(CONFIG.sameDayOrderingOpensAt.hour, CONFIG.sameDayOrderingOpensAt.minute, 0, 0);
    expect(sameDayOrderingOpensAtLabel()).toBe(formatTime(opensAt));
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
