"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { CartLine, Fulfillment, Order, WhenNeeded } from "@/types/order";

const STORAGE_KEY = "cakelake-cart-v2";

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
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
}

function commit(next: Order) {
  currentOrder = next;
  persist(next);
  for (const listener of listeners) listener();
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

// Hydrate the store from localStorage once, on the client, outside any
// component's lifecycle — the first client render still uses
// getServerSnapshot (EMPTY_ORDER) until useSyncExternalStore switches
// over post-hydration, so there's no server/client mismatch either way.
if (typeof window !== "undefined") {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Order) : null;
    if (parsed?.lines) currentOrder = { ...EMPTY_ORDER, ...parsed };
  } catch {
    // Corrupt or inaccessible storage — fall back to an empty cart.
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
  setPendingHandoff: (pendingHandoff: boolean) => void;
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
      commit({ ...currentOrder, lines: [...currentOrder.lines, line] });
    },
    updateQuantity: (lineId, quantity) => {
      commit({
        ...currentOrder,
        lines: currentOrder.lines
          .map((l) => (l.lineId === lineId ? { ...l, quantity } : l))
          .filter((l) => l.quantity > 0),
      });
    },
    removeLine: (lineId) => {
      commit({
        ...currentOrder,
        lines: currentOrder.lines.filter((l) => l.lineId !== lineId),
      });
    },
    updateCakeMessage: (lineId, cakeMessage) => {
      commit({
        ...currentOrder,
        lines: currentOrder.lines.map((l) =>
          l.lineId === lineId ? { ...l, cakeMessage } : l,
        ),
      });
    },
    setFulfillment: (fulfillment) => {
      commit({ ...currentOrder, fulfillment });
    },
    setWhenNeeded: (whenNeeded) => {
      commit({ ...currentOrder, whenNeeded });
    },
    setCustomerName: (customerName) => {
      commit({ ...currentOrder, customerName });
    },
    setPendingHandoff: (pendingHandoff) => {
      commit({ ...currentOrder, pendingHandoff });
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
