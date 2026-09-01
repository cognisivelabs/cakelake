import { withBasePath } from "@/lib/assets";

// Next doesn't deep-merge a page's `openGraph` metadata with the parent
// layout's — a page that provides the key at all replaces the whole
// object, field for field. Shared here so every page that needs its own
// openGraph override (to get its own og:title/og:description filled in)
// can still repeat the site-wide constants correctly instead of losing
// them.
export const SITE_NAME = "Cake Lake Bakery";

export const DEFAULT_DESCRIPTION =
  "Fresh cakes, ready in an hour. Browse the menu, build an order, and send it to us on WhatsApp.";

// The site's logo mark (also the PWA icon) — the only image on the site
// that isn't a placeholder, so it's the safest default social-share
// image until real catalogue photography exists (see lib/catalog.ts).
export const DEFAULT_OG_IMAGE = {
  url: withBasePath("/icons/icon-512.png"),
  width: 512,
  height: 512,
  alt: SITE_NAME,
};
