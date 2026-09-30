"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { CartLine, Fulfillment, Order, WhenNeeded } from "@/types/order";
import { STORAGE_KEYS } from "@/lib/storageKeys";
import { safeGetItem, safeSetItem } from "@/lib/safeStorage";
import { useCatalog } from "@/context/CatalogContext";
import { dropDiscontinuedLines, isSameLine } from "@/lib/order";
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

// Commits with any pending expiry stamp cleared — any real edit counts
// as active use, not abandonment.
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
        // An expired order resets to empty rather than keeping a stale
        // "when needed" date.
        currentOrder = EMPTY_ORDER;
        persist(EMPTY_ORDER);
      } else {
        currentOrder = merged;
      }
    }
  } catch {
    // Corrupt storage contents — fall back to an empty cart.
  }
}

export type NewLineInput = {
  itemId: number;
  quantity: number;
  weightTierId: number;
  cakeMessage?: string;
};

type CartContextValue = {
  order: Order;
  /** Adds to the quantity of an identical line (see isSameLine), or adds a new line. */
  addLine: (input: NewLineInput) => void;
  updateQuantity: (cartLineId: string, quantity: number) => void;
  removeLine: (cartLineId: string) => void;
  updateCakeMessage: (cartLineId: string, cakeMessage: string) => void;
  setFulfillment: (fulfillment: Fulfillment) => void;
  setWhenNeeded: (whenNeeded: WhenNeeded) => void;
  setCustomerName: (customerName: string) => void;
  /** Call right before opening the wa.me link; stamps a 2-hour expiry. */
  startHandoff: () => void;
  /** Call only for an explicit "not yet, back to my cart"; stamps a
   * 24-hour expiry. Not for navigating back before a handoff was ever
   * attempted. */
  declineHandoff: () => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { items } = useCatalog();
  const storedOrder = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // The cart without lines whose item is no longer in the catalogue.
  const order = dropDiscontinuedLines(storedOrder, items);

  useEffect(() => {
    if (order !== storedOrder) commit(order);
  }, [order, storedOrder]);

  /** The current cart, without discontinued lines. */
  const current = () => dropDiscontinuedLines(currentOrder, items);

  /** Merges `patch` into the current cart and commits it as an active
   * edit (see commitActive). Every mutator below goes through this
   * except startHandoff/declineHandoff, which set expiresAt themselves. */
  const update = (patch: Partial<Order>) => commitActive({ ...current(), ...patch });

  const value: CartContextValue = {
    order,
    addLine: (input) => {
      const cart = current();
      const match = cart.lines.find((l) => isSameLine(l, input));
      if (match) {
        update({
          lines: cart.lines.map((l) =>
            l === match ? { ...l, quantity: l.quantity + input.quantity } : l,
          ),
        });
        return;
      }
      const line: CartLine = {
        id: `${input.itemId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        ...input,
      };
      update({ lines: [...cart.lines, line] });
    },
    updateQuantity: (cartLineId, quantity) => {
      update({
        lines: current()
          .lines.map((l) => (l.id === cartLineId ? { ...l, quantity } : l))
          .filter((l) => l.quantity > 0),
      });
    },
    removeLine: (cartLineId) => {
      update({ lines: current().lines.filter((l) => l.id !== cartLineId) });
    },
    updateCakeMessage: (cartLineId, cakeMessage) => {
      update({
        lines: current().lines.map((l) =>
          l.id === cartLineId ? { ...l, cakeMessage } : l,
        ),
      });
    },
    setFulfillment: (fulfillment) => update({ fulfillment }),
    setWhenNeeded: (whenNeeded) => update({ whenNeeded }),
    setCustomerName: (customerName) => update({ customerName }),
    startHandoff: () => {
      commit({
        ...current(),
        pendingHandoff: true,
        expiresAt: pendingHandoffExpiresAt(Date.now()),
      });
    },
    declineHandoff: () => {
      commit({
        ...current(),
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
