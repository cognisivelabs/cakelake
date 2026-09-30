import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { CartProvider, useCart, type NewLineInput } from "@/context/CartContext";
import { CatalogProvider } from "@/context/CatalogContext";
import { testCatalog } from "@/test/fixtures";
import { STORAGE_KEYS } from "@/lib/storageKeys";
import { CONFIG } from "@/lib/config";
import type { Order } from "@/types/order";

const HOUR_MS = 60 * 60 * 1000;

const NEW_LINE: NewLineInput = {
  itemId: 1,
  quantity: 1,
  weightTierId: 1,
};

let container: HTMLDivElement;
let root: Root;
let cart: ReturnType<typeof useCart>;

function Probe() {
  cart = useCart();
  return null;
}

function mount() {
  container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    root = createRoot(container);
    root.render(
      createElement(CatalogProvider, { catalog: testCatalog }, createElement(CartProvider, null, createElement(Probe))),
    );
  });
}

function unmount() {
  act(() => root.unmount());
  container.remove();
}

describe("CartContext", () => {
  // The store is a module-level singleton (see CartContext.tsx's own
  // comment on why — useSyncExternalStore, not React state), so it
  // outlives any one test's mount/unmount. clearCart() guarantees every
  // test starts from the same known-empty state regardless of what the
  // previous test left behind.
  beforeEach(() => {
    localStorage.clear();
    mount();
    act(() => {
      cart.clearCart();
    });
  });

  afterEach(() => {
    unmount();
  });

  it("starts with an empty order", () => {
    expect(cart.order.lines).toEqual([]);
    expect(cart.order.pendingHandoff).toBe(false);
  });

  it("addLine appends a line and gives each one a unique id", () => {
    act(() => {
      cart.addLine(NEW_LINE);
      cart.addLine({ ...NEW_LINE, weightTierId: 2 });
    });
    expect(cart.order.lines).toHaveLength(2);
    const [a, b] = cart.order.lines;
    expect(a.id).not.toBe(b.id);
    expect(a.itemId).toBe(1);
  });

  it("addLine adds to an identical line's quantity instead of adding a line", () => {
    act(() => {
      cart.addLine(NEW_LINE);
      cart.addLine({ ...NEW_LINE, quantity: 2 });
    });
    expect(cart.order.lines).toHaveLength(1);
    expect(cart.order.lines[0].quantity).toBe(3);
  });

  it("addLine keeps lines with different cake messages separate", () => {
    act(() => {
      cart.addLine({ ...NEW_LINE, cakeMessage: "Happy Birthday" });
      cart.addLine({ ...NEW_LINE, cakeMessage: "Congrats" });
      cart.addLine(NEW_LINE);
    });
    expect(cart.order.lines.map((l) => l.cakeMessage)).toEqual(["Happy Birthday", "Congrats", undefined]);
  });

  it("updateQuantity changes the matching line's quantity", () => {
    act(() => {
      cart.addLine(NEW_LINE);
    });
    const cartLineId = cart.order.lines[0].id;
    act(() => {
      cart.updateQuantity(cartLineId, 3);
    });
    expect(cart.order.lines[0].quantity).toBe(3);
  });

  it("updateQuantity removes the line once quantity drops to 0", () => {
    act(() => {
      cart.addLine(NEW_LINE);
    });
    const cartLineId = cart.order.lines[0].id;
    act(() => {
      cart.updateQuantity(cartLineId, 0);
    });
    expect(cart.order.lines).toEqual([]);
  });

  it("removeLine removes only the matching line", () => {
    act(() => {
      cart.addLine(NEW_LINE);
      cart.addLine({ ...NEW_LINE, itemId: 2 });
    });
    const [first, second] = cart.order.lines;
    act(() => {
      cart.removeLine(first.id);
    });
    expect(cart.order.lines.map((l) => l.id)).toEqual([second.id]);
  });

  it("updateCakeMessage sets the message on the matching line only", () => {
    act(() => {
      cart.addLine(NEW_LINE);
      cart.addLine({ ...NEW_LINE, itemId: 2 });
    });
    const [first, second] = cart.order.lines;
    act(() => {
      cart.updateCakeMessage(first.id, "Happy Birthday");
    });
    expect(cart.order.lines.find((l) => l.id === first.id)?.cakeMessage).toBe(
      "Happy Birthday"
    );
    expect(cart.order.lines.find((l) => l.id === second.id)?.cakeMessage).toBeUndefined();
  });

  it("setFulfillment, setWhenNeeded and setCustomerName update their own fields", () => {
    act(() => {
      cart.setFulfillment("delivery");
      cart.setWhenNeeded({ kind: "tomorrow" });
      cart.setCustomerName("Sam");
    });
    expect(cart.order.fulfillment).toBe("delivery");
    expect(cart.order.whenNeeded).toEqual({ kind: "tomorrow" });
    expect(cart.order.customerName).toBe("Sam");
  });

  it("clearCart resets every field, not just the lines", () => {
    act(() => {
      cart.addLine(NEW_LINE);
      cart.setCustomerName("Sam");
      cart.setFulfillment("delivery");
      cart.clearCart();
    });
    expect(cart.order.lines).toEqual([]);
    expect(cart.order.customerName).toBe("");
    expect(cart.order.fulfillment).toBe("pickup");
    expect(cart.order.pendingHandoff).toBe(false);
  });

  it("persists every commit to localStorage", () => {
    act(() => {
      cart.addLine(NEW_LINE);
    });
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.cart)!) as Order;
    expect(stored.lines).toHaveLength(1);
    expect(stored.lines[0].itemId).toBe(1);
  });

  it("startHandoff marks pendingHandoff and stamps a ~2 hour expiry", () => {
    act(() => {
      cart.startHandoff();
    });
    expect(cart.order.pendingHandoff).toBe(true);
    expect(cart.order.expiresAt).toBeDefined();
    const expected = Date.now() + CONFIG.pendingHandoffExpiryHours * HOUR_MS;
    expect(Math.abs(cart.order.expiresAt! - expected)).toBeLessThan(1000);
  });

  it("declineHandoff clears pendingHandoff and gives a longer expiry window than startHandoff", () => {
    act(() => {
      cart.startHandoff();
    });
    const pendingExpiry = cart.order.expiresAt!;
    act(() => {
      cart.declineHandoff();
    });
    expect(cart.order.pendingHandoff).toBe(false);
    const declinedExpiry = cart.order.expiresAt!;
    const expectedDiff =
      (CONFIG.declinedHandoffExpiryHours - CONFIG.pendingHandoffExpiryHours) * HOUR_MS;
    expect(Math.abs(declinedExpiry - pendingExpiry - expectedDiff)).toBeLessThan(1000);
  });

  // Regression coverage for the stale-cart-expiry bug from the prior
  // independent re-audit (see project memory): any real edit after a
  // handoff attempt must clear the abandonment clock, not just adding
  // the first line.
  it("clears a stale expiresAt as soon as the customer makes another edit", () => {
    act(() => {
      cart.addLine(NEW_LINE);
      cart.startHandoff();
    });
    expect(cart.order.expiresAt).toBeDefined();

    act(() => {
      cart.updateQuantity(cart.order.lines[0].id, 2);
    });
    expect(cart.order.expiresAt).toBeUndefined();
  });
});

describe("CartContext — localStorage hydration on load", () => {
  // The hydration/expiry/reconciliation logic runs once, at module
  // import time — it can't be exercised by mounting the already-loaded
  // CartProvider from the top of this file, so each case here resets
  // the module registry and re-imports fresh, after seeding localStorage
  // with the scenario it wants to hydrate from.
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  afterEach(() => {
    unmount();
  });

  async function mountFresh() {
    const mod = await import("@/context/CartContext");
    const catalogMod = await import("@/context/CatalogContext");
    container = document.createElement("div");
    document.body.appendChild(container);
    function FreshProbe() {
      cart = mod.useCart();
      return null;
    }
    act(() => {
      root = createRoot(container);
      root.render(
        createElement(
          catalogMod.CatalogProvider,
          { catalog: testCatalog },
          createElement(mod.CartProvider, null, createElement(FreshProbe)),
        ),
      );
    });
  }

  it("starts empty when nothing is stored", async () => {
    await mountFresh();
    expect(cart.order.lines).toEqual([]);
  });

  it("hydrates a valid, non-expired stored order", async () => {
    const stored: Order = {
      lines: [
        {
          id: "l1",
          itemId: 1,
          quantity: 2,
          weightTierId: 1,
        },
      ],
      fulfillment: "delivery",
      whenNeeded: { kind: "tomorrow" },
      customerName: "Sam",
      pendingHandoff: false,
    };
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(stored));
    await mountFresh();
    expect(cart.order.lines).toHaveLength(1);
    expect(cart.order.customerName).toBe("Sam");
    expect(cart.order.fulfillment).toBe("delivery");
  });

  it("resets to an empty cart when the stored order has already expired", async () => {
    const stored: Order = {
      lines: [
        {
          id: "l1",
          itemId: 1,
          quantity: 1,
          weightTierId: 1,
        },
      ],
      fulfillment: "pickup",
      whenNeeded: { kind: "today" },
      customerName: "",
      pendingHandoff: true,
      expiresAt: Date.now() - 1000,
    };
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(stored));
    await mountFresh();
    expect(cart.order.lines).toEqual([]);
    expect(cart.order.pendingHandoff).toBe(false);
    const persisted = JSON.parse(localStorage.getItem(STORAGE_KEYS.cart)!) as Order;
    expect(persisted.lines).toEqual([]);
  });

  it("drops lines for discontinued items and re-persists the reconciled order", async () => {
    const stored: Order = {
      lines: [
        {
          id: "l1",
          itemId: 1,
          quantity: 1,
          weightTierId: 1,
        },
        { id: "l2", itemId: 9999, quantity: 1, weightTierId: 9999 },
      ],
      fulfillment: "pickup",
      whenNeeded: { kind: "today" },
      customerName: "",
      pendingHandoff: false,
    };
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(stored));
    await mountFresh();
    expect(cart.order.lines.map((l) => l.id)).toEqual(["l1"]);
    const persisted = JSON.parse(localStorage.getItem(STORAGE_KEYS.cart)!) as Order;
    expect(persisted.lines.map((l) => l.id)).toEqual(["l1"]);
  });

  it("falls back to an empty cart when the stored value is corrupt JSON", async () => {
    localStorage.setItem(STORAGE_KEYS.cart, "{not json");
    await mountFresh();
    expect(cart.order.lines).toEqual([]);
  });
});
