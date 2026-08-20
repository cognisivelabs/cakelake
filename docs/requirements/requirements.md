# Cake Lake Bakery — Technical Requirements

Status: **Planning.** This is the internal,
technical companion to the client-approved
[`Cake-Lake-Bakery-Website-Requirements.pdf`](../../Cake-Lake-Bakery-Website-Requirements.pdf),
which is the source of truth for what the client asked for. This document
translates that approved scope into terms the build can work from, and
tracks the open items still pending client input.

Last updated: 2026-08-15 (Home CTA hierarchy clarified — Browse Menu
primary, PDF secondary, WhatsApp moved out of the CTA row).

## Client

Cake Lake Bakery — a single-shop bakery in Dubai, UAE, currently taking
all orders manually over WhatsApp. Early-stage, budget-conscious, no
in-house engineering team.

## Confirmed scope

Approved by the client 2026-08-15 (see the PDF above for the original,
business-language version):

1. **Browse the menu** — customers see the full range of items, with
   photos, descriptions, and prices. This is the site's primary
   call-to-action on Home — it's the only one of the site's entry points
   that actually leads to a structured order (see note under #6).
2. **Build an order** — customers pick items, choose available options
   (e.g. size, flavour), and add them to a cart.
3. **Place the order via WhatsApp, no online payment** — the site
   assembles the cart into a clear order summary and hands it to a
   pre-filled WhatsApp message addressed to the bakery's number. The
   customer sends it themselves — this is a deliberate choice (see
   [ADR-003](../adr/ADR-003-whatsapp-order-handoff.md)), not a
   placeholder for something more automatic.
4. **Customization happens on WhatsApp, not the website** — once the
   order lands in the bakery's WhatsApp, the customer continues that
   same conversation for special requests, photos to print, etc. No
   in-app messaging or customization builder is needed.
5. **No online payment of any kind.** Customers pay at the store or on
   delivery, arranged over WhatsApp — unchanged from today.
6. **Downloadable menu** — a PDF of the full menu, downloadable from the
   site. This is a reference/decision-support tool, not an alternative
   ordering path — a PDF can't hold a cart, so it should be styled as
   secondary to "Browse Menu" on Home, not an equal, competing CTA.
   It's also reachable from inside the Browse/Menu screen itself, not
   only Home, since some customers want it partway through browsing
   rather than before. The PDF itself should point back to the site to
   order ("Ready to order? Visit [site]").
7. **Contact details** — phone/WhatsApp number, location, opening hours,
   displayed on the site. The WhatsApp contact link on Home is general
   contact, not a shopping path — it should read as a simple text
   link/icon (header or footer), not a CTA button competing with
   "Browse Menu."
8. **Mobile-friendly, primary surface** — most customers will use this on
   a phone; this isn't a desktop site with a mobile afterthought.
9. **Installable, app-like on a phone (PWA)** — a customer can add the
   site to their home screen and open it like an app. No native
   App Store/Play Store app for this phase — see
   [ADR-005](../adr/ADR-005-installable-web-app.md).

## Explicitly out of scope for this phase

- Online payment (cards, Apple Pay, Google Pay, or anything else)
- Customer accounts, logins, or order history
- Live order status tracking on the website
- A dashboard for staff to manage orders or the menu — menu/price changes
  go through the dev team as change requests for now (see
  [ADR-004](../adr/ADR-004-content-management.md))
- Anything that sends the order to WhatsApp without the customer sending
  it themselves (i.e. no WhatsApp Business Platform/Cloud API
  integration this phase)
- A native app-store app (iOS/Android)

## Open questions for the client

These need an answer before they're locked in — see the equivalent
section in the approved PDF:

- **Delivery fee structure:** delivery is confirmed in scope alongside
  pickup — pickup is free, delivery is charged (see
  [ADR-003](../adr/ADR-003-whatsapp-order-handoff.md)) — but the fee
  itself (flat rate vs. by zone/distance) still needs the client's
  input.
- **Promotions/offers:** does the bakery want to advertise any
  time-limited offers or discounts on the site at launch?
- **Menu content:** final list of items, categories, prices, photos, and
  any allergen/dietary info to publish.

## Tentative technical direction

Proposed, not yet built — see the ADRs in [`docs/adr/`](../adr/) for the
reasoning behind each:

- **Site:** a static site — Next.js in static export mode, TypeScript, no
  server, no database — see [ADR-001](../adr/ADR-001-tech-stack.md)
- **Hosting/deployment:** AWS (S3 + CloudFront), built and deployed via
  GitHub Actions on push — see
  [ADR-002](../adr/ADR-002-hosting-and-deployment.md)
- **Order handoff:** a `wa.me` click-to-chat link assembled from the
  cart — see [ADR-003](../adr/ADR-003-whatsapp-order-handoff.md)
- **Content:** menu/catalogue content lives in the repo (structured
  files), updated via a change request and redeployed by CI — see
  [ADR-004](../adr/ADR-004-content-management.md)
- **Installable app:** a PWA manifest + service worker on top of the same
  static site — see
  [ADR-005](../adr/ADR-005-installable-web-app.md)

## Decisions log

- **2026-08-15** (chat) — Client approved the business requirements
  document: no online payment, no accounts, orders handed off to
  WhatsApp via a customer-sent click-to-chat link, downloadable menu,
  contact info, mobile-friendly, installable as a PWA (native app store
  app explicitly deferred).
- **2026-08-15** (wireframe review) — Two open questions surfaced from
  the wireframes resolved: (1) the WhatsApp handoff has no truthful
  "sent" confirmation, so the site prompts "Did you send your order?"
  when the tab regains focus, and an unanswered pending order is kept
  for 2 hours before being treated as abandoned; (2) the Add-to-Home-
  Screen banner splits into two platform variants — a real "Install"
  button on Android/Chromium, instructions-only on iOS Safari, since iOS
  has no API to trigger installation. See
  [ADR-003](../adr/ADR-003-whatsapp-order-handoff.md) and
  [ADR-005](../adr/ADR-005-installable-web-app.md).
- **2026-08-15** (wireframe review) — Cart screen gets two more fields:
  a required "when needed" date (with a "not sure yet" option) to avoid
  a fulfillment round-trip, and an always-asked, optional "what to write
  on the cake" field. No Name field — the bakery already sees who's
  messaging via WhatsApp, and in any case the cake message must never be
  inferred from the orderer's identity, since any family member can
  place an order for someone else. See
  [ADR-003](../adr/ADR-003-whatsapp-order-handoff.md).
- **2026-08-15** (wireframe review) — Prices shown on the site (Menu,
  Item Detail, Cart) are correct, real catalog numbers, not labeled
  "estimate." A single disclaimer near the Cart total covers the one
  actual source of price difference — the bakery confirming final
  pricing if a cake message or other change is requested. See
  [ADR-003](../adr/ADR-003-whatsapp-order-handoff.md).
- **2026-08-15** (wireframe review) — Desktop gets a different order
  handoff than mobile: a QR code (scan with your phone) instead of an
  "Open WhatsApp" button, since desktop `wa.me` links assume WhatsApp
  Web is already paired, which is often untrue. Desktop also gets a
  manually-clicked "I've sent it" confirmation instead of the mobile
  version's automatic tab-focus detection, since the phone — not the
  laptop's browser tab — is what sends the message. See
  [ADR-003](../adr/ADR-003-whatsapp-order-handoff.md).
- **2026-08-15** (wireframe review) — Pickup vs. delivery stays on the
  Cart screen: pickup is free, delivery is charged (exact fee still
  open — see the open questions above), so removing it would under-show
  the total for delivery orders. Items needing on-site installation
  (large/custom cakes) get a `requiresDelivery` flag in the catalogue
  data; when one's in the cart, Pickup isn't offered at all for that
  order. See [ADR-003](../adr/ADR-003-whatsapp-order-handoff.md) and
  [ADR-004](../adr/ADR-004-content-management.md).
- **2026-08-15** (wireframe review) — Home's three CTAs ("Browse Menu,"
  "Download PDF," "Message on WhatsApp") were styled as equal, competing
  options — resolved by recognizing they're not the same kind of action.
  "Browse Menu" stays primary (the only path to an actual order);
  "Download PDF" stays secondary and is also reachable from inside the
  Browse/Menu screen, with the PDF itself linking back to the site to
  order; "Message on WhatsApp" moves out of the CTA row entirely (a
  text link/icon, not a button), since it's general contact, not a
  shopping path. See confirmed scope items #1, #6, #7 above.
