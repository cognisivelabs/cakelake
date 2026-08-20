# ADR-003: Order Handoff — WhatsApp Click-to-Chat Link

**Status:** Accepted
**Date:** 2026-08-15

## Context

The client wants completed orders sent to the bakery's WhatsApp number,
with the customer able to continue that same conversation for
customization (see requirements #3–4). No online payment is involved —
payment happens at the store or on delivery, arranged over WhatsApp as it
is today.

There are two materially different ways to get an order into WhatsApp:

**A — WhatsApp Business Platform (Cloud API).** The server pushes the
message to the bakery's WhatsApp automatically, no customer action
needed. This requires Meta Business verification, a dedicated registered
phone number, pre-approved message templates, and per-conversation fees —
ongoing costs and setup complexity disproportionate to this project's
budget, and it also requires a backend to make the API call, which
[ADR-001](ADR-001-tech-stack.md) specifically avoided.

**B — a `wa.me` click-to-chat link.** The site builds a pre-filled
message from the cart and opens `https://wa.me/<bakery-number>?text=...`
in the customer's own WhatsApp. The customer's final tap is hitting
"send" themselves.

This was presented to the client as an explicit cost/complexity
trade-off, and **the client chose Option B.**

## Decision

Use a **`wa.me` click-to-chat link**, built entirely client-side:

- The cart contents (items, options, quantities) are formatted into a
  readable order summary.
- The Cart screen also collects two more things before "Place Order" is
  enabled:
  - **When needed — required.** A date field with presets (Today /
    Tomorrow / Pick a date), plus a "Not sure yet — I'll confirm on
    WhatsApp" option.
  - **What to write on the cake — always asked, optional to fill in.**
    A short free-text field for a cake inscription. Left blank, it's
    simply omitted from the message.
- Placing the order opens `https://wa.me/<bakery-number>?text=<encoded
  summary>` — this pre-fills the message in the customer's WhatsApp app;
  the customer sends it themselves.
- No WhatsApp Business Platform/Cloud API integration, no message
  templates, no Meta Business verification, no backend call.
- **No Name field.** The bakery already sees who's messaging them once
  the order lands in WhatsApp.
- **Prices and totals are shown plainly, not labeled "estimate."** Menu,
  Item Detail, and Cart all show real catalog prices — there's nothing
  estimated about them. One disclaimer appears near the Cart total only:
  "Prices reflect the menu as shown. If you add a cake message or
  request changes, the bakery will confirm final pricing with you on
  WhatsApp." It isn't repeated on every line item.

## Rationale

**Zero cost, zero backend, chosen by the client.** This needs no ongoing
per-message fee, no API credentials, no server to hold them — it's a
plain link generated in the browser, consistent with
[ADR-001](ADR-001-tech-stack.md)'s no-backend approach.

**It naturally satisfies the customization requirement too.** Once the
order lands in the bakery's WhatsApp, the customer is already in the
exact chat thread they'd use to discuss customization — no separate
in-app messaging feature is needed to connect the two.

**The one thing given up is worth it here.** Unlike Option A, this isn't
fully automatic — the customer has to tap send. Given the bakery already
manages every order as a real WhatsApp conversation (today, entirely by
hand), one extra tap to get there isn't a meaningful loss, and it's
arguably a better fit for a business that wants to talk to the customer
right after the order lands anyway.

## Consequences

- No ongoing WhatsApp API costs, no Meta Business verification, no
  message template approval process
- The order only reaches the bakery if the customer actually sends the
  pre-filled message — if they close WhatsApp without sending, the order
  never arrives. This is a known trade-off of Option B, not a bug to fix
- **No truthful end state — the site cannot detect whether the message
  was actually sent.** Resolved as: when the browser tab regains focus
  after WhatsApp opens, prompt the customer directly — "Did you send
  your order?" with **"Yes, sent it"** (clears the cart, shows a brief
  acknowledgement) or **"No, take me back to my cart"** (returns to the
  Cart screen with everything intact). This is the one honest signal
  available, since there's no server-side confirmation to rely on.
- **Cart persistence for returning visitors:** if the customer leaves
  without answering that prompt, the pending order is kept as a
  recoverable snapshot for **2 hours**, then treated as abandoned. A
  visit inside that window resumes the cart as left; a visit after it
  starts with an empty cart rather than surfacing a stale order.
- The bakery's number needs to be a live WhatsApp number configured to
  receive customer messages — no separate "automated messaging" number is
  needed, since nothing sends automatically
- There's no server-side order record — the order lives in the WhatsApp
  conversation itself, same as today. If the business ever wants a
  record independent of WhatsApp, that's a new requirement with its own
  design, not something this ADR covers
- The message text needs to stay within WhatsApp's URL length practical
  limits — keep the order summary concise (items, quantities, options),
  not a full formatted invoice
- **"When needed" is required to avoid a round-trip.** Unlike a cake
  message, this is fulfillment-critical — the bakery can't confirm
  feasibility (same-day capacity, lead time for a custom cake) without
  it. Leaving it as a blank in the pre-filled message risked customers
  sending it unfilled, recreating the exact back-and-forth the handoff
  is meant to avoid — so it's collected on the Cart screen instead.
- **The cake-message field must never be inferred from the customer's
  WhatsApp identity.** Any family member can place an order, and the
  name that belongs on the cake is very often not the orderer's own
  name (a parent ordering for a child, a spouse for a partner, etc.) —
  the sender's WhatsApp profile name has no reliable relationship to
  what should be written on the cake, so it's always asked directly and
  never defaulted or guessed.
- **Without a checkout step, the site's total and the bakery's final
  price can genuinely disagree** — but only when something beyond the
  listed menu changes (an add-on, a customization request). Labeling
  every price "estimate" would undersell prices that are actually
  correct. Resolved by keeping prices confident everywhere, and scoping
  the one disclaimer specifically to the cake-message/customization path
  that's the actual source of any difference — not a general hedge on
  the site's own math.

## Alternatives Considered

**WhatsApp Business Platform (Cloud API) — Option A**
Fully automatic, no customer action needed. Rejected on cost and
complexity grounds — the client, once shown the trade-off explicitly,
chose the free, no-backend option instead. Worth revisiting only if order
volume grows enough that "customer might not hit send" becomes a real
business problem, and the ongoing API cost becomes affordable relative to
that.

**Email instead of WhatsApp**
Would avoid the "customer must send it themselves" step (server-sent
email is straightforward and near-free via a service like SES). Rejected
because the client's whole existing relationship and workflow with
customers is on WhatsApp, not email — moving order intake to email would
be a bigger process change for the business than the website itself.

**Leaving "when needed" and the cake message as blanks in the pre-filled
message, for the customer to fill in themselves**
Zero additional UI on the Cart screen. Rejected for "when needed"
specifically — it's the one piece of information that determines whether
the bakery can even take the order, and an unfilled blank just moves the
round-trip from "the site asks" to "the bakery asks after the fact,"
which is worse. Kept as the actual approach for anything beyond a short
cake message (photos, detailed design requests) — those still belong in
the WhatsApp conversation, not a form field.

**Auto-filling the cake message (or a "Name") from the customer's
WhatsApp profile name**
Would save the customer a step. Rejected — the orderer and the name that
belongs on the cake are frequently different people, so this would
actively produce wrong output rather than just being unnecessary.

**Labeling all prices "estimate," or showing no totals at all**
Both were raised as ways to hedge against the site's total ever
disagreeing with the bakery's final price. Rejected — most orders never
involve anything that changes the price, so both options would
undersell accurate numbers for every customer to hedge against the
minority case. A single, specifically-scoped disclaimer on the Cart
total does the same job without that cost.
