import { groupOpeningHours } from "@/lib/hours";

/** Client-provided, one entry per day — the single source of truth for
 * the shop's hours. Find us — desktop has room to list every day
 * individually; Footer/mobile show groupOpeningHours()'s collapsed
 * two-row summary instead. */
const OPENING_HOURS_BY_DAY = [
  { day: "Monday", hours: "10 am - 12 am" },
  { day: "Tuesday", hours: "10 am - 12 am" },
  { day: "Wednesday", hours: "10 am - 12 am" },
  { day: "Thursday", hours: "10 am - 12 am" },
  { day: "Friday", hours: "10 am - 1 am" },
  { day: "Saturday", hours: "10 am - 1 am" },
  { day: "Sunday", hours: "10 am - 1 am" },
] as const;

/**
 * Real values confirmed by the client, except where noted. Kept in one
 * place so changes are a one-line edit, not a hunt through the codebase.
 */
export const CONFIG = {
  /**
   * The business's full and short names — every place the brand name
   * appears (browser tab title, PWA manifest, nav wordmark, Open Graph
   * metadata via lib/og.ts's SITE_NAME) reads from here instead of its
   * own hardcoded copy.
   */
  name: "Cake Lake Bakery",
  shortName: "Cake Lake",
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
  /** Footer/mobile's compact summary — derived from openingHoursByDay
   * below, not hand-typed, so the two views can't drift apart. */
  openingHours: groupOpeningHours(OPENING_HOURS_BY_DAY),
  /** Find us — desktop's full per-day listing. The canonical schedule —
   * edit this when hours change. */
  openingHoursByDay: OPENING_HOURS_BY_DAY,
  currency: "AED",
  /**
   * PWA brand colours — must match `--color-accent`/`--color-bg` in
   * globals.css (CSS custom properties can't read from this file, so
   * that match has to be kept by hand), and are otherwise the single
   * source for the manifest's theme/background colour and the root
   * layout's viewport theme-color meta tag.
   */
  themeColor: "#EFD400",
  backgroundColor: "#FBF4E4",
  /** Same-day items are all "ready in an hour" — feeds the cart's "ready
   * by" estimate. Independent of each catalog item's own readyLabel
   * copy, which the client may phrase differently later. */
  sameDayPrepHours: 1,
  /** Max length for the optional per-item cake inscription — every
   * catalog item uses this same client-confirmed limit. */
  cakeMessageMaxLength: 25,
  /** ADR-003: an unanswered "did you send it?" prompt is treated as
   * abandoned after this long, resetting to an empty cart. */
  pendingHandoffExpiryHours: 2,
  /** ADR-003: explicitly tapping "not yet, back to my cart" gets a
   * longer, more forgiving window than an unanswered prompt — that's a
   * deliberate choice to keep shopping, not an ambiguous no-response. */
  declinedHandoffExpiryHours: 24,
  /**
   * The deployed site's origin (no path) — feeds metadataBase for Open
   * Graph/Twitter image resolution. GitHub Pages for this POC phase (see
   * ADR-002); update this when the site moves to its own domain.
   */
  siteUrl: "https://cognisivelabs.github.io",
} as const;
