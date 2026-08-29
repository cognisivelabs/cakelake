/**
 * Real values confirmed by the client, except where noted. Kept in one
 * place so changes are a one-line edit, not a hunt through the codebase.
 */
export const CONFIG = {
  /**
   * The bakery's one WhatsApp number, client-confirmed — used for both
   * the order handoff (ADR-003) and every general "message us" link.
   */
  bakeryWhatsAppNumber: "971503287761",
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
  /**
   * The `src` from the bakery's Google Maps embed code — the same embed
   * regardless of size (Small/Medium/Large/Custom just change the
   * iframe's fixed width/height, not this URL), so the iframe is sized
   * responsively in CSS instead of using Google's suggested dimensions.
   */
  mapsEmbedSrc:
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d902.164755967051!2d55.3038083!3d25.2484071!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43e86fd0df21%3A0xab8c252f39da49ca!2sCake%20Lake%20Bakery!5e0!3m2!1sen!2suk!4v1787921738360!5m2!1sen!2suk",
  /** Client-provided. Grouped by the two distinct schedules across the week. */
  openingHours: [
    { days: "Monday - Thursday", hours: "10 am - 12 am" },
    { days: "Friday - Sunday", hours: "10 am - 1 am" },
  ],
  currency: "AED",
} as const;
