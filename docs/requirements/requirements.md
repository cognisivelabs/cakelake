# Cake Lake Bakery — Requirements

Status: **Planning.** This document separates what's confirmed from what
still needs a client answer. As answers come in, move items from "Open
questions" into the relevant confirmed section and note the date/source of
the decision.

Last updated: 2026-08-14 (resolved login OTP channel — email/WhatsApp, no
SMS — and simplified admin console scope to MVP CRUD).

## Client

Cake Lake Bakery — a cake shop in Dubai, UAE. Currently takes orders through
WhatsApp Business. Early-stage, budget-conscious, single location today with
real plans to open more branches. "Cake Lake Bakery" is a working name pending
client confirmation (see open questions).

## Confirmed scope

1. **Online catalogue** of their cakes.
2. **Time-limited offers/discounts** — the shop can run promotions with a
   start/end window.
3. **Fully mobile-friendly** — mobile is treated as the primary surface, not
   an adaptation of desktop.
4. **Payment, online and in-person, two separate surfaces:**
   - **Online:** **ADCB if they offer a web/e-commerce gateway, PayTabs as
     the confirmed fallback otherwise** — either way settling into the
     client's existing ADCB account (the gateway that processes a
     transaction and the bank the money lands in don't have to be the same
     institution). ADCB's physical card machine for the shop is a
     different product from a website payment integration, so this needs
     a direct yes/no from ADCB before it's finalized — see
     [ADR-006](../adr/ADR-006-payment-gateway.md). Checkout is **Apple Pay
     and Google Pay only** — no manual card-entry form is currently
     planned (flagged UX question: customers without a wallet set up on
     their device/browser would have no way to pay online — still open).
   - **In-person:** the shop already takes **tap/contactless card
     payment** at the counter via its existing card terminal — confirmed
     with the client as the in-person method. This is separate from the
     online gateway above; the counter QR flow (requirement #6) doesn't
     force a customer physically in the shop through the online gateway
     if they'd rather tap their card at the till.
5. **Live order status for pickup orders**, Pizza-Hut-style: placed → baking
   → decorating → ready. This is the product's signature moment, not a plain
   progress bar — see `docs/design/design-system.md` for the visual treatment.
6. **Store-scoped data model from day one.** Every order, catalogue item, and
   offer is scoped to a `store`, even though there's a single store today.
   This is what makes several things possible without a rebuild:
   - **Counter QR** — a QR code at the shop counter so an in-store customer
     can order online instead of queuing at the till.
   - **Leaflet QR** — a separate, distinct QR (a short link) included with
     every order's leaflet, meant to bring the customer back to order online
     next time. Deliberately a different QR/link from the counter one so
     each can be tied to its own offer or promo code (e.g. the leaflet QR
     carries a "welcome back" discount that the counter QR doesn't) and
     tracked separately. **Leaflet design (the physical leaflet, its QR
     placement, any visual treatment) is deferred to a later pass — only the
     data-model requirement (a distinct, offer-linkable QR/link) is confirmed
     now.**
   - Every future branch running on the same system.
7. **Two ways to check out: account or guest.**
   - **Account** — the customer logs in with **email or mobile number**,
     their choice. The one-time login code goes by **email or WhatsApp —
     never SMS** (confirmed 2026-08-14, reusing the WhatsApp integration
     from requirement #10 rather than a separate SMS provider — see
     [ADR-005](../adr/ADR-005-customer-identity.md)). Once logged in, they
     can place an order and see their own past order history.
   - **Guest** — no account needed. At checkout, ask for an email address;
     that's where the live order-tracking link/details get sent, so a guest
     can follow their order without ever logging in.
8. **Order confirmation email.** Every customer — account or guest — gets an
   email when they place an order, confirming what was ordered and (for
   guests) doubling as the order-tracking link delivery from requirement #7.
   This is in addition to the in-app live tracker (requirement #5), not a
   replacement for it.
9. **Admin console.** A staff-facing tool, separate from the customer site,
   for managing the catalogue and offers day to day:
   - Insert/update/remove catalogue items (name, price, description,
     photos, tags, availability)
   - Insert/update/remove time-limited offers (requirement #2)
   - Scoped to a store (requirement #6) — a future second branch manages
     its own catalogue/offers independently
   - **Flat access for MVP** — confirmed 2026-08-14: no role tiers, no
     invite flow, no audit log. The prototype designed a fuller
     role/invite/audit-log system (Owner / Catalogue manager / Counter
     staff); that's deferred to a later phase, not built now, kept as a
     ready reference for when a second branch or bigger team needs it —
     see [ADR-011](../adr/ADR-011-admin-console.md).
10. **WhatsApp order notifications.** Exactly two automated messages per
    order, sent to the customer on WhatsApp:
    - **Order confirmed** — sent the moment an order is placed: what was
      ordered, total, fulfilment method and slot
    - **Ready for collection/delivery** — sent the moment staff mark the
      order ready (the same status-advance action from requirement #5)
    Deliberately capped at two messages, not a message per status stage —
    more than that risks the customer muting the thread, which defeats the
    purpose. This is a second, WhatsApp-specific channel alongside the
    order confirmation email (requirement #8), not a replacement for it —
    see [ADR-012](../adr/ADR-012-whatsapp-notifications.md) for the
    technical approach and why full WhatsApp-native ordering (browsing,
    cart-building, and payment inside the chat) is out of scope for now.

## Operational requirements

Not customer-facing, but confirmed as needed for running the site once it's
live:

- **Logging.** Application errors and key events need to be logged
  somewhere a developer can actually debug from — not just left to crash
  silently or print to a console nobody's watching.
- **Metrics.** Basic visibility into order volume and site traffic — enough
  to answer "how many orders today," "what's selling," "how many people are
  visiting" without digging through raw data by hand.

See [`docs/adr/`](../adr/) for how each of these (and the two requirements
above) are proposed to be implemented, sized for this project's actual
load rather than a full observability/analytics platform.

## Tentative technical direction (not locked in)

Noted here as the working plan, to be confirmed once the prototype is
approved — not to be treated as a final decision:

- **Frontend:** Next.js
- **Backend:** Node/Express + MongoDB
- **Hosting:** AWS, `me-central-1` region
- **Payments:** ADCB if they have a web gateway, PayTabs as the confirmed
  fallback — Apple Pay + Google Pay only, see requirement #4

## Existing design-system context

A design system and click-through site recreation already exist in Claude
Design (mirrored locally at [`design-system/`](../../design-system)), built
before this requirements pass from an earlier static HTML mockup. It's a
useful sketch of intent but **its content is illustrative, not confirmed** —
sample menu items, prices, offer copy, shop names/addresses, and footer
details (e.g. payment badges, delivery zones) were authored as placeholders
for the design exercise and should not be read as client-approved facts.
Notably, the mockup already assumes delivery is in scope and shows a "Tabby"
(buy-now-pay-later) badge alongside card payments, and depicts two live shops
plus two more "opening 2026" — none of this is confirmed; see the open
questions below and reconcile with the client rather than carrying it forward
by default.

**✅ Discrepancy resolved (2026-08-14):** the missing counter QR
(requirement #6) has been restored in both prototypes — a "Skip the queue
at the counter" panel with the counter QR now appears on the home ordering
channels and the Visit screen in v2. Leaflet QR remains deliberately
undesigned, per the deferral above.

**✅ Second discrepancy resolved (2026-08-14):** the Track Order page (both
v1 and v2) now filters trackable orders to `state === 'live' || state ===
'upcoming'` — already-collected/delivered orders no longer appear on the
tracking page. Verified directly in
`prototype/Cake Lake Ordering Prototype v2.dc.html`.

**⚠ Third discrepancy to resolve:** prototype v2's login flow explicitly
says **SMS** — `authSentKind` labels mobile OTP as `'SMS'`, and the code
screen reads "the 4-digit code we texted you." Both now contradict the
confirmed decision that mobile-path OTP goes by **WhatsApp**, never SMS
(see requirement #7, [ADR-005](../adr/ADR-005-customer-identity.md)).
Needs a copy/logic fix in Claude Design — not a local patch, per the usual
workflow.

**✅ Login mechanism resolved (2026-08-14):** account login is email or
mobile, customer's choice; the one-time code goes by email or **WhatsApp**
— SMS dropped entirely, reusing the WhatsApp integration from requirement
#10 rather than a separate SMS provider. See requirement #7 and
[ADR-005](../adr/ADR-005-customer-identity.md).

**✅ Admin console scope resolved (2026-08-14):** simplified to plain
catalogue/offers CRUD for MVP — no roles, no invite flow, no audit log.
The prototype's fuller role/invite/audit-log system is deferred to a later
phase (kept as a ready reference, not discarded) — revisit once a second
branch or a bigger team justifies it. See requirement #9 and
[ADR-011](../adr/ADR-011-admin-console.md).

## Open questions for client

These need direct client input before they can move to "confirmed." See
[`client-questionnaire.md`](client-questionnaire.md) for the version to walk
through with the client.

- **Brand:** Final brand name and logo — "Cake Lake Bakery" is a working name.
- **Catalogue:** Exact categories, pricing, product photography, and
  allergen/dietary info for every item. The mockup's menu (celebration cakes,
  cupcakes, loaves & bakes) is a sketch, not the confirmed range.
- **Delivery:** Is delivery in scope for launch, or a phase 2 add-on to
  pickup-only ordering? If in scope, what are the delivery zones? (The
  mockup currently references Dubai-only, free over AED 200, as a placeholder.)
- **Ask ADCB directly:** "Do you have a web/e-commerce payment gateway —
  separate from our card machine — that supports Apple Pay and Google Pay
  for online checkout?" A yes/no with enough detail to actually integrate
  (API/SDK vs. hosted checkout, onboarding/KYC steps, timeline). Until
  answered, **PayTabs is the confirmed fallback** — a known-good, already
  Apple Pay/Google Pay-enabled UAE gateway — so this no longer blocks
  starting development on the payment integration layer (see
  [ADR-006](../adr/ADR-006-payment-gateway.md)).
- **Card-entry fallback:** confirm whether checkout should really be
  Apple Pay/Google Pay *only*, or whether a manual card-entry option should
  exist as a fallback for customers without a wallet set up on their
  device or browser (e.g. most desktop checkouts). See
  [ADR-006](../adr/ADR-006-payment-gateway.md).
- Also confirm whether a buy-now-pay-later option (e.g. Tabby, shown as a
  placeholder badge in the mockup) is actually wanted — that would be a
  separate integration from the ADCB gateway either way.
- **Offer types:** Which promotion types does the client actually want to
  run at launch — percentage off, BOGO/bundle deals, delivery-threshold
  discounts, seasonal campaigns, first-order discounts, referral credits,
  corporate/bulk discounts? The mockup sketches several of these; scoping
  down to launch-ready types vs. later-phase types needs client input.
  Confirmed separately: counter-QR and leaflet-QR ordering will each be able
  to carry their own offer/promo code (see requirement #6) — exact offer
  content for each is still open.
- **Multi-branch timeline:** Does the branch-selector UI need to be live at
  launch (the mockup already shows a locations page with two live shops and
  two "opening 2026"), or is it enough for the data model to be branch-ready
  while the UI stays single-store until a second branch is real?
- **Order lifecycle policy:** What's the cancellation/edit policy once an
  order is placed? How does staff update order status — manual taps on a
  staff-facing screen, or integration with an existing POS/kitchen system?
- **Brand assets:** What does the client already own (logo, brand fonts, real
  product photography) vs. what needs to be created as part of this project?

## Decisions log

- **2026-08-14** (chat) — Requirement #6's QR ordering elaborated into two
  distinct QR flows: a **counter QR** (in-shop, order-instead-of-queue) and
  a **leaflet QR** (sent home with an order, short link, meant to drive
  reorders). Deliberately separate QRs/links so each can carry its own
  offer or promo code and be tracked independently.
- **2026-08-14** (chat) — New requirement #7: account (mobile number as ID,
  see own order history) vs. guest checkout (email address collected for
  order-tracking updates only). Also flagged that prototype v2's Track Order
  page incorrectly lists already-collected/delivered orders alongside the
  live one — should only show current + upcoming (today/future), see
  discrepancy note above.
- **2026-08-14** (chat) — New requirement #8 (order confirmation email for
  every customer) and #9 (admin console for catalogue/offers management).
  New operational requirements: logging for debugging, and metrics on
  orders/traffic. See ADR-008 through ADR-011 for the proposed technical
  approach to each.
- **2026-08-14** (chat) — Confirmed: admin authentication is separate from
  customer login (ADR-011 flipped from Proposed to Accepted on this point).
- **2026-08-14** (Claude Design sync) — Both open prototype discrepancies
  resolved: counter QR restored, Track Order filtered to live/upcoming
  only. Two new elaborations flagged for confirmation rather than
  auto-accepted: OTP login via mobile-or-email (was mobile-only in
  ADR-005), and an admin console with roles/invites/audit-log beyond the
  original catalogue/offers CRUD ask (ADR-011).
- **2026-08-14** (chat + Claude Design sync) — New requirement #10:
  WhatsApp order notifications, capped at exactly two messages per order
  (confirmed, ready). Scoped deliberately as a notification channel, not
  full WhatsApp-native ordering/payment — see ADR-012. Already built into
  prototype v2's checkout and track-order screens.
- **2026-08-14** (chat) — Confirmed: automated WhatsApp messages send from
  a **second** number, dedicated to the system. The client's existing
  number stays manual, untouched, for the human side of the relationship.
  Resolves ADR-012's open question.
- **2026-08-14** (chat, client-confirmed) — In-person payment is
  tap/contactless card at the shop's existing terminal — resolves the
  "is in-person payment still supported" question raised earlier. Apple
  Pay and Google Pay confirmed as required online payment options
  alongside card, not optional — updates requirement #4 and ADR-006's
  gateway selection criteria.
- **2026-08-14** (chat, client-confirmed) — **Superseded the above:**
  Telr and PayTabs are not being used at all. The online payment gateway
  is **ADCB** (the client's own bank), and checkout is **Apple Pay and
  Google Pay only** — no manual card-entry form currently planned. New
  open question raised: what ADCB actually provides for web integration
  (see Open Questions). See [ADR-006](../adr/ADR-006-payment-gateway.md).
- **2026-08-14** (chat) — **Refined the above into a two-path plan:**
  clarified that ADCB's card machine (in-person) and a website payment
  gateway are different products, and that the gateway which processes a
  transaction doesn't have to be the same institution the money settles
  into. Resolution: ask ADCB whether they have a web gateway; if not (or
  slow), **PayTabs is the confirmed fallback**, still settling into the
  client's ADCB account either way. Unblocks starting the payment
  integration layer without waiting on ADCB's answer. See
  [ADR-006](../adr/ADR-006-payment-gateway.md).
- **2026-08-14** (chat) — Resolved both remaining prototype elaborations:
  (1) account login OTP goes by email or **WhatsApp**, SMS dropped
  entirely — reuses the ADR-012 WhatsApp integration instead of a separate
  SMS provider; (2) admin console simplified to flat catalogue/offers CRUD
  for MVP — roles, invites, and the audit log deferred to a later phase,
  not discarded. See [ADR-005](../adr/ADR-005-customer-identity.md) and
  [ADR-011](../adr/ADR-011-admin-console.md).
