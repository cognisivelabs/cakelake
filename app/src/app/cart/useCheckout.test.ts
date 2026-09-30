import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { useCheckout } from "@/app/cart/useCheckout";
import { CartProvider, useCart } from "@/context/CartContext";
import { CatalogProvider } from "@/context/CatalogContext";
import { testCatalog, item as fixtureItem } from "@/test/fixtures";
import { buildOrderMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { STORAGE_KEYS } from "@/lib/storageKeys";

const NEW_LINE = { itemId: fixtureItem.id, quantity: 1, weightTierId: 1 };

let container: HTMLDivElement;
let root: Root;
let cart: ReturnType<typeof useCart>;
let checkout: ReturnType<typeof useCheckout>;

function Probe() {
  cart = useCart();
  checkout = useCheckout();
  return null;
}

function mount() {
  container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    root = createRoot(container);
    root.render(
      createElement(
        CatalogProvider,
        { catalog: testCatalog },
        createElement(CartProvider, null, createElement(Probe)),
      ),
    );
  });
}

function unmount() {
  act(() => root.unmount());
  container.remove();
}

describe("useCheckout", () => {
  // Same singleton-store caveat as CartContext.test.ts — clearCart() gives
  // every test a known-empty starting order.
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

  it("starts on the review screen for a fresh order", () => {
    expect(checkout.screen).toEqual({ kind: "review" });
  });

  it("starts on the confirming screen when the cart already has a pending handoff (reload recovery)", () => {
    act(() => {
      cart.addLine(NEW_LINE);
      cart.startHandoff();
    });
    unmount();
    mount();
    expect(checkout.screen).toEqual({ kind: "confirming" });
  });

  it("goToHandoff freezes the current order into `message` and moves to the handoff screen", () => {
    act(() => {
      cart.addLine(NEW_LINE);
    });
    const expected = buildOrderMessage(cart.order, testCatalog.items);
    act(() => {
      checkout.goToHandoff();
    });
    expect(checkout.screen).toEqual({ kind: "handoff" });
    expect(checkout.message).toBe(expected);

    // The message stays frozen even if the cart changes afterwards —
    // it's what's about to be sent, not a live recompute.
    act(() => {
      cart.addLine({ ...NEW_LINE, weightTierId: 2 });
    });
    expect(checkout.message).toBe(expected);
  });

  it("openWhatsApp marks pendingHandoff, freezes chatUrl and moves to confirming", () => {
    act(() => {
      cart.addLine(NEW_LINE);
      checkout.goToHandoff();
    });
    const expectedUrl = buildWhatsAppUrl(checkout.message);

    act(() => {
      checkout.openWhatsApp();
    });

    expect(checkout.screen).toEqual({ kind: "confirming" });
    expect(checkout.chatUrl).toBe(expectedUrl);
    expect(cart.order.pendingHandoff).toBe(true);
  });

  it("backToReview from the plain review screen does not start an abandonment clock", () => {
    act(() => {
      cart.addLine(NEW_LINE);
      checkout.backToReview();
    });
    expect(checkout.screen).toEqual({ kind: "review" });
    expect(cart.order.pendingHandoff).toBe(false);
    expect(cart.order.expiresAt).toBeUndefined();
  });

  it("backToReview after a handoff attempt declines it and stamps an expiry", () => {
    act(() => {
      cart.addLine(NEW_LINE);
      checkout.goToHandoff();
      checkout.openWhatsApp();
    });
    expect(cart.order.pendingHandoff).toBe(true);

    act(() => {
      checkout.backToReview();
    });

    expect(checkout.screen).toEqual({ kind: "review" });
    expect(cart.order.pendingHandoff).toBe(false);
    expect(cart.order.expiresAt).toBeDefined();
  });

  it("confirmSent builds a summary, clears the cart and moves to acknowledged", () => {
    act(() => {
      cart.addLine(NEW_LINE);
      checkout.goToHandoff();
      checkout.openWhatsApp();
    });

    act(() => {
      checkout.confirmSent();
    });

    expect(checkout.screen.kind).toBe("acknowledged");
    if (checkout.screen.kind === "acknowledged") {
      expect(checkout.screen.summary.itemizedLines).toHaveLength(1);
    }
    expect(cart.order.lines).toEqual([]);
    expect(localStorage.getItem(STORAGE_KEYS.cart)).not.toBeNull();
  });

  it("confirmSent recovered straight into confirming (no openWhatsApp this session) still freezes a chatUrl", () => {
    act(() => {
      cart.addLine(NEW_LINE);
      cart.startHandoff();
    });
    // Recover into "confirming" the way a reload would, without ever
    // calling openWhatsApp() in this session.
    unmount();
    mount();
    expect(checkout.screen).toEqual({ kind: "confirming" });
    expect(checkout.chatUrl).toBe("");
    // Capture before confirmSent clears the cart — `message` is live-
    // computed here (never frozen by goToHandoff this session), so it
    // would change to an empty-cart message right after clearCart().
    const expectedUrl = buildWhatsAppUrl(checkout.message);

    act(() => {
      checkout.confirmSent();
    });

    expect(checkout.screen.kind).toBe("acknowledged");
    expect(checkout.chatUrl).toBe(expectedUrl);
  });
});
