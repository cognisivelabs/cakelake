"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { CartLine, Fulfillment, Order, WhenNeeded } from "@/types/order";
import { STORAGE_KEYS } from "@/lib/storageKeys";
import { safeGetItem, safeSetItem } from "@/lib/safeStorage";
import { getCatalog } from "@/lib/catalog";
import { isOrderExpired, pendingHandoffExpiresAt, declinedHandoffExpiresAt } from "@/lib/cartExpiry";

const STORAGE_KEY = STORAGE_KEYS.cart;

const EMPTY_ORDER: Order = {
  lines: [],
  fulfillment: "pickup",
  whenNeeded: { kind: "today" },
  customerName: "",
  pendingHandoff: false,
};

/**
 * A tiny external store, not React state — the cart is the textbook case
 * for useSyncExternalStore: state that must be read from localStorage
 * (unavailable during static export's server render) without a
 * post-mount setState-in-an-effect hydration step, which would trip
 * React's hydration-mismatch and set-state-in-effect rules.
 */
let currentOrder: Order = EMPTY_ORDER;
const listeners = new Set<() => void>();

function persist(order: Order) {
  if (typeof window === "undefined") return;
  safeSetItem(STORAGE_KEY, JSON.stringify(order));
}

function commit(next: Order) {
  currentOrder = next;
  persist(next);
  for (const listener of listeners) listener();
}

// Any edit — adding an item, changing quantity, picking a date — is real
// engagement, not the inactivity ADR-003's expiry windows are meant to
// catch. Without this, a cart that was declined once (24h stamp) and
// then actively used the next day could still get wiped mid-session once
// the original stamp's clock ran out, even though nothing about it was
// actually abandoned.
function commitActive(next: Order) {
  commit({ ...next, expiresAt: undefined });
}

function getSnapshot(): Order {
  return currentOrder;
}

function getServerSnapshot(): Order {
  return EMPTY_ORDER;
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

// A cart can sit in localStorage for weeks — long enough for a catalog
// item it references to be discontinued or renamed to a new id in a later
// deploy. Without this, the line lingers forever: it drops out of
// resolveOrderLines()'s item/price rendering (so the cart page and total
// look right) but still counts toward orderItemCount()'s "CART N" badge,
// since that only reads order.lines — the two would silently disagree.
function dropDiscontinuedLines(order: Order): Order {
  const catalogIds = new Set(getCatalog().map((item) => item.id));
  const lines = order.lines.filter((line) => catalogIds.has(line.itemId));
  return lines.length === order.lines.length ? order : { ...order, lines };
}

// Hydrate the store from localStorage once, on the client, outside any
// component's lifecycle — the first client render still uses
// getServerSnapshot (EMPTY_ORDER) until useSyncExternalStore switches
// over post-hydration, so there's no server/client mismatch either way.
if (typeof window !== "undefined") {
  try {
    const raw = safeGetItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Order) : null;
    if (parsed?.lines) {
      const merged = { ...EMPTY_ORDER, ...parsed };
      if (isOrderExpired(merged, Date.now())) {
        // ADR-003: an unanswered or explicitly-declined handoff attempt
        // expires to a plain empty cart, not a stale order with a
        // "when needed" date that may have already passed.
        currentOrder = EMPTY_ORDER;
        persist(EMPTY_ORDER);
      } else {
        const reconciled = dropDiscontinuedLines(merged);
        currentOrder = reconciled;
        if (reconciled.lines.length !== merged.lines.length) persist(reconciled);
      }
    }
  } catch {
    // Corrupt storage contents — fall back to an empty cart.
  }
}

export type NewLineInput = {
  itemId: string;
  quantity: number;
  weightTierId: string;
  flavourId: string;
  cakeMessage?: string;
  customDescription?: string;
};

type CartContextValue = {
  order: Order;
  addLine: (input: NewLineInput) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  updateCakeMessage: (lineId: string, cakeMessage: string) => void;
  setFulfillment: (fulfillment: Fulfillment) => void;
  setWhenNeeded: (whenNeeded: WhenNeeded) => void;
  setCustomerName: (customerName: string) => void;
  /** Call right before opening the wa.me link — ADR-003's 2-hour
   * abandonment window starts from this moment. */
  startHandoff: () => void;
  /** Call only for an explicit "not yet, back to my cart" — ADR-003's
   * more forgiving 24-hour window. Not for merely navigating back
   * before a handoff was ever attempted. */
  declineHandoff: () => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const order = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const value: CartContextValue = {
    order,
    addLine: (input) => {
      const line: CartLine = {
        lineId: `${input.itemId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        ...input,
      };
      commitActive({ ...currentOrder, lines: [...currentOrder.lines, line] });
    },
    updateQuantity: (lineId, quantity) => {
      commitActive({
        ...currentOrder,
        lines: currentOrder.lines
          .map((l) => (l.lineId === lineId ? { ...l, quantity } : l))
          .filter((l) => l.quantity > 0),
      });
    },
    removeLine: (lineId) => {
      commitActive({
        ...currentOrder,
        lines: currentOrder.lines.filter((l) => l.lineId !== lineId),
      });
    },
    updateCakeMessage: (lineId, cakeMessage) => {
      commitActive({
        ...currentOrder,
        lines: currentOrder.lines.map((l) =>
          l.lineId === lineId ? { ...l, cakeMessage } : l,
        ),
      });
    },
    setFulfillment: (fulfillment) => {
      commitActive({ ...currentOrder, fulfillment });
    },
    setWhenNeeded: (whenNeeded) => {
      commitActive({ ...currentOrder, whenNeeded });
    },
    setCustomerName: (customerName) => {
      commitActive({ ...currentOrder, customerName });
    },
    startHandoff: () => {
      commit({
        ...currentOrder,
        pendingHandoff: true,
        expiresAt: pendingHandoffExpiresAt(Date.now()),
      });
    },
    declineHandoff: () => {
      commit({
        ...currentOrder,
        pendingHandoff: false,
        expiresAt: declinedHandoffExpiresAt(Date.now()),
      });
    },
    clearCart: () => commit(EMPTY_ORDER),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
