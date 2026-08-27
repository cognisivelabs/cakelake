/**
 * Real values confirmed by the client, except where noted. Kept in one
 * place so changes are a one-line edit, not a hunt through the codebase.
 */
export const CONFIG = {
  /**
   * The number the site's WhatsApp order handoff (ADR-003) sends to —
   * client-confirmed. Distinct from the general contact number below.
   */
  bakeryWhatsAppNumber: "971529811358",
  /** General "message us" contact number, shown on Home/Contact — not
   * used for the order handoff itself. */
  contactWhatsAppNumber: "971503287761",
  /** Shop landline — display only, not a WhatsApp number. */
  shopPhone: "04 221 7761",
  address: {
    line1: "Building B8, Shop No. 05",
    line2: "Sheikh Hamdan Colony, Karama",
    line3: "Dubai, UAE",
  },
  /** Still pending the client — see the open questions in requirements.md. */
  openingHours: "Opening hours to confirm with the bakery.",
  currency: "AED",
} as const;
