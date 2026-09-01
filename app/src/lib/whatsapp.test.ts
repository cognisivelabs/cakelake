import { describe, expect, it, vi } from "vitest";
import { buildOrderMessage, buildWhatsAppUrl, openWhatsAppUrl } from "@/lib/whatsapp";
import { formatShortDate } from "@/lib/dates";
import { CONFIG } from "@/lib/config";
import type { CatalogItem } from "@/types/catalog";
import type { CartLine, Order } from "@/types/order";

const item: CatalogItem = {
  id: "classic-cakes",
  name: "Classic Cakes",
  categoryId: "cakes",
  description: "",
  weightTiers: [{ id: "half-kg", label: "½ kg", price: 55 }],
  flavours: [{ id: "butterscotch", label: "Butterscotch" }],
  readyLabel: "Ready in 1 hour",
  leadTimeHours: 0,
  cakeMessageMaxLength: 40,
  needsCustomDescription: false,
  available: true,
  requiresDelivery: false,
};

function line(overrides: Partial<CartLine> = {}): CartLine {
  return {
    lineId: "l1",
    itemId: item.id,
    quantity: 1,
    weightTierId: "half-kg",
    flavourId: "butterscotch",
    ...overrides,
  };
}

function order(overrides: Partial<Order> = {}): Order {
  return {
    lines: [line()],
    fulfillment: "pickup",
    whenNeeded: { kind: "today" },
    customerName: "",
    pendingHandoff: false,
    ...overrides,
  };
}

describe("buildOrderMessage", () => {
  it("omits the name from the header when blank", () => {
    const message = buildOrderMessage(order({ customerName: "  " }), [item]);
    expect(message.split("\n")[0]).toBe("New order");
  });

  it("includes the name in the header when set", () => {
    const message = buildOrderMessage(order({ customerName: "Aisha" }), [item]);
    expect(message.split("\n")[0]).toBe("New order — Aisha");
  });

  it("formats an item line with quantity, description, and price", () => {
    const message = buildOrderMessage(order({ lines: [line({ quantity: 2 })] }), [item]);
    expect(message).toContain("2× Classic Cakes, ½ kg, Butterscotch — AED 110");
  });

  it("shows 'price to confirm' for an unpriced weight tier", () => {
    const unpriced = { ...item, weightTiers: [{ id: "half-kg", label: "½ kg" }] };
    const message = buildOrderMessage(order(), [unpriced]);
    expect(message).toContain("price to confirm");
  });

  it("includes the design and cake-message detail lines when present", () => {
    const message = buildOrderMessage(
      order({ lines: [line({ customDescription: "A red heart", cakeMessage: "Happy Bday" })] }),
      [item]
    );
    expect(message).toContain("   Design: A red heart");
    expect(message).toContain('   Message: "Happy Bday"');
  });

  it("shows Delivery vs Pickup based on fulfillment", () => {
    expect(buildOrderMessage(order({ fulfillment: "delivery" }), [item])).toContain("Delivery");
    expect(buildOrderMessage(order({ fulfillment: "pickup" }), [item])).toContain("Pickup");
  });

  it("formats a 'today' pickup date using today's short date", () => {
    const message = buildOrderMessage(order({ whenNeeded: { kind: "today" } }), [item]);
    expect(message).toContain(`Needed: Today, ${formatShortDate(new Date())}`);
  });

  it("formats an explicit date without shifting a calendar day", () => {
    const message = buildOrderMessage(
      order({ whenNeeded: { kind: "date", date: "2026-12-25" } }),
      [item]
    );
    expect(message).toContain("Needed: Dec 25");
  });

  it("skips lines whose item is missing and still totals correctly", () => {
    const message = buildOrderMessage(
      order({ lines: [line(), line({ lineId: "l2", itemId: "gone" })] }),
      [item]
    );
    expect(message).toContain(`Total: ${CONFIG.currency} 55`);
  });
});

describe("buildWhatsAppUrl", () => {
  it("returns the bare wa.me link with no message", () => {
    expect(buildWhatsAppUrl()).toBe(`https://wa.me/${CONFIG.bakeryWhatsAppNumber}`);
  });

  it("URL-encodes a pre-filled message", () => {
    const url = buildWhatsAppUrl("Hello there!");
    expect(url).toBe(`https://wa.me/${CONFIG.bakeryWhatsAppNumber}?text=Hello%20there!`);
  });
});

describe("openWhatsAppUrl", () => {
  it("clicks a temporary anchor pointed at the url and removes it", () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    const before = document.body.childElementCount;

    openWhatsAppUrl("https://wa.me/123");

    expect(clickSpy).toHaveBeenCalledOnce();
    expect(document.body.childElementCount).toBe(before);
    clickSpy.mockRestore();
  });
});
