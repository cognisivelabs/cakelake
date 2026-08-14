# Cake Lake Bakery — Requirements

Status: **Planning.** This document separates what's confirmed from what
still needs a client answer. As answers come in, move items from "Open
questions" into the relevant confirmed section and note the date/source of
the decision.

Last updated: 2026-08-14 (added order confirmation email, admin console,
logging, and metrics requirements).

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
4. **Online payment via a UAE payment gateway.** Telr or PayTabs are the
   front-runners over Stripe: cheaper and easier UAE merchant approval for a
   retail/F&B business. Final choice depends on the client's trade licence
   and bank account status (see open questions).
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
   - **Account** — the customer's mobile number is their ID. Once logged in,
     they can place an order and see their own past order history.
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
- **Payments:** Telr or PayTabs (UAE gateway, final choice pending — see open
  questions)

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

**⚠ Discrepancy to resolve:** a newer working prototype (`prototype/`,
2026-08-14) reconciled the mockup to a single shop, which is correct per
scope — but it also **removed QR-code-at-table in-shop ordering**, making
in-shop ordering counter-only. That conflicts with confirmed requirement #6
above (order online while physically in the shop, QR-code style), which
was not an open question — it was explicit, confirmed scope. Requirement #6
has since been elaborated into two distinct QR flows (counter QR + leaflet
QR, see above); of the two, only the **counter QR** needs adding back to
the prototype now — leaflet QR design is deferred (see above), so its
absence from the prototype isn't a discrepancy.

**⚠ Second discrepancy to resolve:** in prototype v2
(`prototype/Cake Lake Ordering Prototype v2.dc.html`), the Track Order page
pulls its list of trackable orders as `s.orders.slice(0,3)` — the first
three orders regardless of status. Its sample data (`SEED_ORDERS`) has one
live/in-progress order and three already-collected/delivered ones, so the
Track Order page currently shows completed orders next to the live one.
Per this session's chat feedback (2026-08-14): **Track Order should only
ever show the current in-progress order plus anything scheduled for
today/future collection or delivery — never orders that are already
collected/delivered.** Already-completed orders belong in account order
history (requirement #7), not on the tracking page. This is prototype logic,
not just sample content, so it needs fixing in Claude Design rather than
patched locally — see workflow note above.

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
- **Payment gateway:** Telr vs PayTabs — depends on the client's trade
  licence and bank account status. Also confirm whether a buy-now-pay-later
  option (e.g. Tabby, shown as a placeholder badge in the mockup) is
  actually wanted, since that's a separate integration from the core gateway.
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
