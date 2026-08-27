/**
 * Delivery fee and currency are still placeholders pending the client
 * (see "Content checklist" in docs/requirements/requirements.md). Kept
 * in one place so real values are a one-line change, not a hunt through
 * the codebase.
 */
export const CONFIG = {
  /** The bakery's WhatsApp number, in international format, no leading +. */
  bakeryWhatsAppNumber: "971529811358",
  /** Flat delivery fee in AED — ADR-003 chose flat over zone-based. */
  deliveryFeeAed: 25,
  currency: "AED",
} as const;
