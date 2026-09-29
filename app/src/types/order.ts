/** One line in the cart: an item at one weight, with a quantity. */
export type CartLine = {
  /** Unique per line; the same item can appear on several lines. */
  lineId: string;
  itemId: string;
  quantity: number;
  weightTierId: string;
  /** Optional inscription for the cake. */
  cakeMessage?: string;
};

export type Fulfillment = "pickup" | "delivery";

/** When the customer needs the order. */
export type WhenNeeded =
  | { kind: "today" }
  | { kind: "tomorrow" }
  | { kind: "date"; date: string } // ISO yyyy-mm-dd
  | { kind: "unsure" };

/** The cart, saved in localStorage. */
export type Order = {
  lines: CartLine[];
  fulfillment: Fulfillment;
  whenNeeded: WhenNeeded;
  /** The customer's name; may be empty. */
  customerName: string;
  /** True from handing the order to WhatsApp until the customer answers
   * "did you send it?". */
  pendingHandoff: boolean;
  /** When the cart expires, in epoch ms: set on handoff
   * (CONFIG.pendingHandoffExpiryHours) and on "not yet, back to my cart"
   * (CONFIG.declinedHandoffExpiryHours). Absent for a cart with no
   * expiry. */
  expiresAt?: number;
};
