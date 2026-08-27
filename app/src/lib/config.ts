/**
 * Currency is still a placeholder pending the client (see "Content
 * checklist" in docs/requirements/requirements.md). Kept in one place
 * so real values are a one-line change, not a hunt through the
 * codebase. Delivery cost isn't priced on the site at all — see
 * ADR-003 — so there's no delivery fee value here to keep in sync.
 */
export const CONFIG = {
  /** The bakery's WhatsApp number, in international format, no leading +. */
  bakeryWhatsAppNumber: "971529811358",
  currency: "AED",
} as const;
