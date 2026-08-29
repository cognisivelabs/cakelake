export type CartLine = {
  /** Unique per line, not per item — the same item can appear twice
   * with different weight/flavour/message combinations. */
  lineId: string;
  itemId: string;
  quantity: number;
  weightTierId: string;
  /** Empty string if the item has no flavour choice. */
  flavourId: string;
  /**
   * Cake inscription — per item, per ADR-003. Optional, always asked at
   * the point of adding the item, never inferred from the customer.
   */
  cakeMessage?: string;
  /** For items with needsCustomDescription — what the cake should look like. */
  customDescription?: string;
};

export type Fulfillment = "pickup" | "delivery";

export type WhenNeeded =
  | { kind: "today" }
  | { kind: "tomorrow" }
  | { kind: "date"; date: string } // ISO yyyy-mm-dd
  | { kind: "unsure" };

export type Order = {
  lines: CartLine[];
  fulfillment: Fulfillment;
  whenNeeded: WhenNeeded;
  /**
   * Optional — client-confirmed: keep the name field, but omit it from
   * the WhatsApp message entirely if left blank, rather than sending a
   * placeholder.
   */
  customerName: string;
  /**
   * Set right before handing off to WhatsApp, cleared once the customer
   * answers "did you send it?". Persisted (not just component state) so
   * the "did you send it?" screen survives a reload — in an installed
   * PWA, opening the wa.me link can navigate the app's own single window
   * instead of a separate tab, wiping in-memory state when the customer
   * returns.
   */
  pendingHandoff: boolean;
};
