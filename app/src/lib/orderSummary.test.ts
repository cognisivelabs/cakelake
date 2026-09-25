import { describe, expect, it } from "vitest";
import { getCatalog } from "@/lib/catalog";
import { CONFIG } from "@/lib/config";
import { buildAckSummary, describeWhenNeeded } from "@/lib/orderSummary";
import type { Order } from "@/types/order";

const order = (overrides: Partial<Order> = {}): Order => ({
  lines: [
    { lineId: "a", itemId: "classic-cakes-butterscotch", quantity: 2, weightTierId: "half-kg", cakeMessage: "Happy Birthday" },
    { lineId: "b", itemId: "photo-cakes", quantity: 1, weightTierId: "3kg-plus" },
  ],
  fulfillment: "pickup",
  whenNeeded: { kind: "tomorrow" },
  customerName: "",
  pendingHandoff: false,
  ...overrides,
});

describe("describeWhenNeeded", () => {
  it("words each option the way the cart shows it", () => {
    expect(describeWhenNeeded({ kind: "today" }, "3:00 PM")).toBe("Today, from 3:00 PM");
    expect(describeWhenNeeded({ kind: "tomorrow" }, "3:00 PM")).toBe("Tomorrow");
    expect(describeWhenNeeded({ kind: "date", date: "2026-09-01" }, "3:00 PM")).toBe("Sep 1");
    expect(describeWhenNeeded({ kind: "unsure" }, "3:00 PM")).toBe("Not sure yet");
  });
});

describe("buildAckSummary", () => {
  const sentAt = new Date(2026, 8, 1, 14, 30);

  it("recaps each line with its size, message and price", () => {
    const summary = buildAckSummary(order(), getCatalog(), "3:00 PM", sentAt);
    expect(summary.itemizedLines).toEqual([
      { quantity: 2, name: "Butterscotch", descriptor: "½ kg", message: "Happy Birthday", price: "AED 110" },
      { quantity: 1, name: "Photo Cakes", descriptor: "3 kg+", message: undefined, price: "Ask us" },
    ]);
    expect(summary.sentAt).toBe("2:30 PM");
  });

  it("puts the shop address on a pickup and just the time on a delivery", () => {
    const pickup = buildAckSummary(order(), getCatalog(), "3:00 PM", sentAt);
    expect(pickup.fulfillmentLine).toBe(`Pickup · Tomorrow — ${CONFIG.address.line1}`);
    const delivery = buildAckSummary(order({ fulfillment: "delivery" }), getCatalog(), "3:00 PM", sentAt);
    expect(delivery.fulfillmentLine).toBe("Delivery · Tomorrow");
  });

  it("joins the lines and totals the priced ones", () => {
    const summary = buildAckSummary(order(), getCatalog(), "3:00 PM", sentAt);
    expect(summary.lines).toContain(" · ");
    expect(summary.total).toBe("AED 110");
  });
});
