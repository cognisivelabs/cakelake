# Cake Lake Bakery — Requirements

Status: **Planning.** This document separates what's confirmed from what
still needs a client answer. As answers come in, move items from "Open
questions" into the relevant confirmed section and note the date/source of
the decision.

Last updated: 2026-08-14.

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
   This is what makes two things possible without a rebuild:
   - Ordering online while physically in the shop (QR-code-at-table style).
   - Every future branch running on the same system.

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

_(Empty for now — entries get added here as open questions are resolved with
the client, each with a date and source, e.g. "call 2026-08-20" or "email
2026-08-21".)_
