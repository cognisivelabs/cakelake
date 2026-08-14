# ADR-012: WhatsApp Order Notifications

**Status:** Proposed
**Date:** 2026-08-14

## Context

Confirmed requirement #10: exactly two automated WhatsApp messages per
order — **order confirmed** (sent at order placement) and **ready for
collection/delivery** (sent the moment staff advance the order to "ready",
requirement #5). This is the client's existing channel: today, every order
already happens over WhatsApp Business, manually. The ask isn't to replace
that relationship, just to automate two specific, predictable moments in
it.

This sits alongside a broader question, discussed before this requirement
was confirmed: could WhatsApp handle *ordering itself* (browsing, cart,
payment), not just notifications? Two facts settled that:

- **WhatsApp has no native in-chat payment in the UAE.** WhatsApp Pay only
  operates in a handful of markets (India, Brazil, Singapore) — checkout
  always has to hand off to a browser regardless of how the cart was built,
  the same hosted-checkout flow already designed in
  [ADR-006](ADR-006-payment-gateway.md).
- Building a **Catalog + Cart-in-WhatsApp** flow would substantially
  duplicate the ordering UI already being built properly for the web
  (menu, cart, checkout — [ADR-001](ADR-001-tech-stack.md)), for a channel
  that can't even complete the transaction itself.

Given that, WhatsApp's proven, low-effort value is exactly what got
confirmed: **status notifications**, not a parallel ordering system.

## Decision

Integrate the **WhatsApp Business Platform (Cloud API)** — Meta's official
API — scoped narrowly to sending two message types, both triggered from
existing backend events, not a new subsystem:

1. **Order confirmed** — sent inline when payment is confirmed, same
   trigger point as the confirmation email ([ADR-008](ADR-008-order-confirmation-email.md)).
   Content: items ordered, total, fulfilment method, slot.
2. **Ready for collection/delivery** — sent inline when staff mark the
   order "ready" (the same admin/counter action from
   [ADR-011](ADR-011-admin-console.md)). Content: collection instructions
   or delivery status.

No message per intermediate stage (baking, decorating) — deliberately,
per the requirement: more than two risks the thread getting muted, which
defeats the purpose. The in-app live tracker
([ADR-004](ADR-004-order-tracking-strategy.md)) already covers
stage-by-stage detail for anyone who wants it; WhatsApp covers the two
moments that actually warrant an interruption.

Full WhatsApp-native ordering (catalog browsing, cart-building, in-chat
checkout) is **explicitly out of scope** for this ADR — see Alternatives.

## Rationale

**Two inline sends, not a new notification platform.** Structurally
identical to [ADR-008](ADR-008-order-confirmation-email.md)'s approach —
call the WhatsApp API directly from the same order-creation and
mark-ready code paths, no message queue, no separate service. The load
(tens of orders a day, two messages each) doesn't justify anything more,
consistent with every other ADR's stance against infrastructure the actual
volume doesn't need.

**This is where WhatsApp adds real value without duplicating work.**
Customers already expect to hear from this business on WhatsApp — that's
the existing relationship. Two well-timed, automated messages meet that
expectation with a fraction of the effort of rebuilding ordering inside
the chat, and without hitting the wall that no in-chat payment exists in
the UAE anyway.

**Message templates are a real constraint worth planning for now.**
WhatsApp only allows free-form business replies within a 24-hour window
after the *customer* last messaged in. A business-initiated message
outside that window — which "order confirmed" and "ready for collection"
usually are — must use a **pre-approved message template** (Meta's
"Utility" category fits both). Template approval is normally fast for
clear transactional content like this, but it has to be submitted and
approved *before* launch, not discovered as a blocker during development.

## Consequences

- Access to the WhatsApp Business Platform needed — either via a Business
  Solution Provider (Twilio, 360dialog, Gupshup, etc. — easier setup, adds
  a monthly fee) or directly via Meta's Cloud API (no middleman fee, more
  setup and verification work). Not decided here; a small, separate
  implementation choice.
- **Confirmed 2026-08-14: a second WhatsApp number is used for automated
  system messaging.** The client's existing number keeps working exactly
  as it does today, entirely manual, for the human side of the
  relationship. The second number is registered to the Cloud API and used
  by nothing but the two automated sends in this ADR — it never needs to
  be checked or replied to by staff. Getting that second number verified
  as a WhatsApp Business Platform sender is a one-time setup step, not
  ongoing engineering work.
- Two message templates (order-confirmed, ready-for-collection/delivery)
  need drafting and submitting to Meta for approval ahead of launch
- WhatsApp API costs are per-conversation (Utility category), billed
  separately from — and in addition to — the SES email cost in ADR-008;
  low at this order volume, but a real recurring line item to budget for
- The order-creation and mark-ready code paths each gain one more outbound
  call (WhatsApp, alongside the SES email in ADR-008) — both failures
  should be logged ([ADR-009](ADR-009-logging-and-error-tracking.md)) but
  never block the order/status-update itself succeeding

## Alternatives Considered

**Full WhatsApp-native ordering (Catalog + Cart + checkout handoff)**
Would let customers stay in-chat longer. Rejected for now: no in-chat
payment exists in the UAE regardless (see Context), so checkout always
leaves the chat anyway — meaning this mode buys "browse in WhatsApp
instead of on the site" and nothing more, at the cost of building and
maintaining a second, more constrained ordering UI alongside the real one.
Worth revisiting only if there's clear evidence customers specifically
want to browse without leaving WhatsApp — not assumed here.

**A message per order stage (placed, baking, decorating, ready) instead of
two**
More visibility, mirrors the in-app tracker exactly. Rejected — this is
the requirement's own explicit reasoning: more than two proactive messages
risks the thread getting muted, undermining the one message that actually
matters (ready for collection). The in-app tracker already serves anyone
who wants stage-by-stage detail.

**SMS instead of WhatsApp**
Simpler API surface, no template-approval process. Rejected: it's not
where this client's customers already expect to hear from them — WhatsApp
is the existing, working relationship (today, entirely manual); SMS would
be a worse fit for a channel switch nobody asked for.
