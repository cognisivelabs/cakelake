# Cake Lake Bakery — Technical Requirements

Status: **Planning.** This is the internal,
technical companion to the client-approved
[`Cake-Lake-Bakery-Website-Requirements.pdf`](../../Cake-Lake-Bakery-Website-Requirements.pdf),
which is the source of truth for what the client asked for. This document
translates that approved scope into terms the build can work from, and
tracks the open items still pending client input.

Last updated: 2026-08-15.

## Client

Cake Lake Bakery — a single-shop bakery in Dubai, UAE, currently taking
all orders manually over WhatsApp. Early-stage, budget-conscious, no
in-house engineering team.

## Confirmed scope

Approved by the client 2026-08-15 (see the PDF above for the original,
business-language version):

1. **Browse the menu** — customers see the full range of items, with
   photos, descriptions, and prices.
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
   site.
7. **Contact details** — phone/WhatsApp number, location, opening hours,
   displayed on the site.
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

- **Delivery vs. pickup only:** does the website need to support delivery
  orders at launch, or pickup only to start?
- **Promotions/offers:** does the bakery want to advertise any
  time-limited offers or discounts on the site at launch?
- **Menu content:** final list of items, categories, prices, photos, and
  any allergen/dietary info to publish.

## Tentative technical direction

Proposed, not yet built — see the ADRs in [`docs/adr/`](../adr/) for the
reasoning behind each:

- **Site:** a static site (no server, no database) — see
  [ADR-001](../adr/ADR-001-tech-stack.md)
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
