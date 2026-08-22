# Cake Lake Bakery — Technical Requirements

Status: **Planning.** This is the internal,
technical companion to the client-approved
[`Cake-Lake-Bakery-Website-Requirements.pdf`](../../Cake-Lake-Bakery-Website-Requirements.pdf),
which is the source of truth for what the client asked for. This document
translates that approved scope into terms the build can work from, and
tracks the open items still pending client input.

Last updated: 2026-08-21 (consolidated all outstanding client asks into
a single content checklist, separated from open design decisions).

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
   that actually leads to a structured order (see note under #6). The
   catalogue isn't cakes-only: it also includes party/event add-ons
   (candles, a cake knife, a party cap, balloons — see
   [ADR-004](../adr/ADR-004-content-management.md)), shown as their own
   Menu category, browsed and ordered exactly the same way as cakes. A
   backdrop was also raised by the client but is left out for now.
2. **Build an order** — customers pick items, choose available options
   (e.g. size, flavour for cakes; colour or quantity for some add-ons),
   and add them to a cart. Not every item has the same kind of options —
   Item Detail supports a flexible, generic set of option groups per
   item rather than assuming every item is a size+flavour choice.
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

These are decisions, not raw content — they need a choice, not a data
dump (see the content checklist below for that):

- **Promotions/offers:** does the bakery want to advertise any
  time-limited offers or discounts on the site at launch?
- **How often do items actually sell out same-day?** The site can mark
  an item "Sold out" (see [ADR-004](../adr/ADR-004-content-management.md)),
  but doing so requires a commit and a redeploy — fine for predictable
  unavailability, not fast enough for a mid-afternoon sellout at the
  counter. If this happens routinely rather than rarely, that's worth
  knowing now: it's what would justify building the small, dedicated
  toggle mechanism already scoped (one serverless function, not a
  running server or database — see
  [ADR-003](../adr/ADR-003-whatsapp-order-handoff.md)) rather than
  relying on WhatsApp to catch the occasional edge case.

## Content checklist for the client

Raw content and assets the build is genuinely blocked on — not design
decisions, just things only the client can supply. Grouped by how
urgent each one actually is:

**Needed soon — affects whether the wireframes hold as designed:**

- **Menu content, even a rough draft:** categories, item names, prices,
  and — most importantly right now — **what options each item actually
  has.** Confirmed as a real issue, not just a risk: add-ons (candles,
  cake knife, party cap, balloons — see confirmed scope #1) clearly
  don't follow the same size+flavour pattern cakes do, so Item Detail
  needs the flexible, generic option-group structure already noted
  under #2, not the size+flavour assumption the wireframes started
  with. A rough list of items and their real options (cakes and
  add-ons both) is enough to check this before more wireframing builds
  on top of it — it doesn't need to be final.
- **Which items are delivery-only** (need on-site installation — large
  or tiered cakes) and **which need advance notice, how long, and
  whether it varies by size within an item.** 72 hours is a placeholder
  used throughout these docs, not a confirmed number (see
  [ADR-004](../adr/ADR-004-content-management.md)).
- **Photography — status and ownership.** Is a photographer lined up,
  and is there anything usable right now? Every screen leans on
  photography, and the Menu list specifically breaks down if photos are
  inconsistent in crop or lighting. If real photography isn't ready in
  time for visual design, the fallback is a consistent, license-checked
  placeholder set (the same approach used before) — but that needs
  deciding now, not discovered as a gap during visual design.

**Needed before launch, not blocking wireframes:**

- **Delivery fee amount** — the fee structure is decided (a flat fee,
  see [ADR-003](../adr/ADR-003-whatsapp-order-handoff.md)), just not
  the number.
- Full, final menu content (allergen/dietary info, final pricing,
  final photos) once the rough draft above has validated the options
  assumption.

**Resolved, included for completeness:**

- **Featured items ("this week" section on Home):** no owner named for
  weekly updates, so it's cut from Home entirely rather than shipping
  something that goes stale. Revisit only if someone is willing to own
  it going forward.

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
- **2026-08-15** (wireframe review) — Added a sold-out state: items get
  an `available` flag in the catalogue data (default true); when false,
  the item stays visible but shows grayed out with a "Sold out" label,
  and "Add to Cart" is disabled. This only solves *predictable*
  unavailability, since toggling it is a commit-and-redeploy like any
  other content change — same-day sellouts are flagged as an open
  question for the client (see above), not solved yet. See
  [ADR-004](../adr/ADR-004-content-management.md).
- **2026-08-15** (wireframe review) — Corrected the cake-message field:
  it started as one order-level field on the Cart screen, but that
  breaks for a two-cake order (one message can't hold two different
  inscriptions). Moved to Item Detail, asked per item instead — each
  item's inscription now shows on its own Cart line for review before
  "Place Order." See [ADR-003](../adr/ADR-003-whatsapp-order-handoff.md).
- **2026-08-21** (wireframe review) — Added lead-time handling: items
  get a `leadTimeHours` field in the catalogue data (ADR-004), shown on
  Item Detail for that item, with a general "custom cakes need advance
  notice" note on Home and Contact. The Cart's "when needed" date field
  now disables dates that fall short of any cart item's lead time,
  rather than just displaying a warning — same reasoning as
  `requiresDelivery` removing Pickup instead of just flagging it. See
  [ADR-003](../adr/ADR-003-whatsapp-order-handoff.md) and
  [ADR-004](../adr/ADR-004-content-management.md).
- **2026-08-21** (wireframe review) — Resolved five of six remaining
  open findings; held the sixth open pending client input:
  - Cart expiry when the customer explicitly chooses to keep shopping
    ("No, take me back to my cart") is **24 hours** — longer than the
    2-hour unanswered-prompt case, since it's a deliberate choice, not
    an ambiguous non-answer.
  - Delivery is a **flat fee**, not zone-based, to keep the total
    showable without a zone-selection step first (amount still needed
    from the client — see open questions).
  - `leadTimeHours` can be set per size/option, not just per item, since
    a cake's smallest size may be same-day feasible while its largest
    tier isn't.
  - The Cart's mobile/desktop breakpoint gets tested at both 768px and
    1024px rather than assumed, so tablets get whichever layout actually
    fits.
  - Empty states (empty cart, no search results, a fully-sold-out
    category) are being wireframed — not solved by any of the above,
    just newly in scope.
  - **Held open:** real-time sold-out toggling. If the client confirms
    same-day sellouts are routine (still an open question), the
    minimum-cost fix is one serverless function writing a small overlay
    file the site reads client-side — not a running server or database.
    Not built until that's confirmed needed. See
    [ADR-003](../adr/ADR-003-whatsapp-order-handoff.md) and
    [ADR-004](../adr/ADR-004-content-management.md).
- **2026-08-21** (wireframe review) — Three content gaps flagged as
  "content, not design": featured items' ownership question is resolved
  (no owner, cut from Home); real catalogue data is needed soon
  specifically to validate the wireframes' size+flavour options
  assumption, not just for final content; photography ownership/status
  needs a direct answer, with a placeholder-photo fallback if real
  photography isn't ready in time. Restructured this document's open
  items into "Open questions" (decisions) and a new "Content checklist"
  (raw content/assets), consolidating everything outstanding into one
  list for the client.
- **2026-08-21** (chat) — Client confirmed the catalogue also includes
  party/event add-ons: candles, a cake knife, a party cap, and balloons.
  A backdrop was also raised but is left out of scope for now. Add-ons
  are just another Menu category using the exact same catalogue data
  shape, options structure, and cart/checkout flow as cakes — no new
  mechanism needed. See confirmed scope #1–#2 and
  [ADR-004](../adr/ADR-004-content-management.md).
- **2026-08-21** (wireframe review) — Settled three remaining items:
  (1) the WhatsApp order summary now follows a fixed template — one
  line per item (name, options, quantity, inscription), then
  fulfillment, when-needed, and total each on their own line; (2) a
  sold-out item in a returning customer's saved cart shows the same
  "Sold out" treatment as elsewhere, disables "Place Order," and gets a
  one-tap "Remove" — resolved the same way as every other
  infeasible-order case rather than letting it reach WhatsApp;
  (3) the downloadable menu PDF is generated from the same catalogue
  data at build time (a headless-browser step in the existing CI
  pipeline), not a separately hand-designed document that could drift
  out of sync. See [ADR-003](../adr/ADR-003-whatsapp-order-handoff.md)
  and [ADR-004](../adr/ADR-004-content-management.md).
