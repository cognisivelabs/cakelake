export type SelectedOptions = {
  /** Maps OptionGroup.id -> chosen OptionChoice.id */
  [groupId: string]: string;
};

export type CartLine = {
  /** Unique per distinct item+options combination, not just per item. */
  lineId: string;
  itemId: string;
  quantity: number;
  selectedOptions: SelectedOptions;
  /**
   * Cake inscription — per item, per ADR-003. Optional, always asked at
   * the point of adding the item, never inferred from the customer.
   */
  cakeMessage?: string;
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
};
