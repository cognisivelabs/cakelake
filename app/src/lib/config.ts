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
    line1: "Shop No. 5, 8C Street",
    line2: "Al Karama, Sheikh Hamdan Colony",
    line3: "Dubai, United Arab Emirates",
  },
  /**
   * The bakery's own Google Maps share link for their place listing —
   * links straight to it (shows the business name/pin) rather than a
   * generic address-text search, which doesn't reliably surface the
   * business name.
   */
  mapsUrl: "https://maps.app.goo.gl/fPX8GrNBURWDAaWo8",
  /** Client-provided. Grouped by the two distinct schedules across the week. */
  openingHours: [
    { days: "Monday - Thursday", hours: "10 am - 12 am" },
    { days: "Friday - Sunday", hours: "10 am - 1 am" },
  ],
  currency: "AED",
} as const;
