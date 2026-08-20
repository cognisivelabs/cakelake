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
- Placing the order opens `https://wa.me/<bakery-number>?text=<encoded
  summary>` — this pre-fills the message in the customer's WhatsApp app;
  the customer sends it themselves.
- No WhatsApp Business Platform/Cloud API integration, no message
  templates, no Meta Business verification, no backend call.

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
