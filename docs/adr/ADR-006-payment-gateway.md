# ADR-006: Payment Gateway — Stripe or PayTabs, Final Pick Pending

**Status:** Proposed — gateway narrowed to two candidates; final pick not yet decided
**Date:** 2026-08-15

## Context

Confirmed requirement #4 calls for online payment, with Apple Pay and
Google Pay as required checkout methods. This ADR went through several
rounds before landing here — worth keeping all of them, since each
resolved something real:

**Round 1 (superseded):** Telr and PayTabs, two established UAE payment
gateways, were the original front-runners over Stripe (cheaper, easier UAE
merchant approval for a retail/F&B business). Choice between the two left
open pending the client's trade licence and bank account status.

**Round 2 (superseded):** the client confirmed Apple Pay and Google Pay as
required checkout options, alongside Telr/PayTabs.

**Round 3 (superseded):** the client said Telr and PayTabs weren't being
used at all — the client's own bank, ADCB, would be the gateway instead,
based on their existing business account and the physical card machine
ADCB had already provided the shop.

**Round 4 (superseded):** working through what the ADCB card machine
actually is clarified an important distinction — it's a **physical
point-of-sale terminal**, which accepts an in-person NFC tap (including
from an Apple Pay/Google Pay-loaded phone), completely separately from
whatever a **website checkout** would need. That produced a two-path plan:
ask ADCB whether they have a separate web/e-commerce gateway, and use
PayTabs as the confirmed fallback if not.

**Round 5 (current, 2026-08-15):** the client has moved on from the ADCB
question — **the online gateway will be either Stripe or PayTabs, final
choice not yet decided.** ADCB's card machine remains exactly what it's
always been (in-person tap payment, out of scope for this ADR); it's no
longer a candidate for the *website's* gateway. Stripe is back in
consideration despite being passed over in Round 1 — that was this ADR's
own cost/approval reasoning at the time, not a client constraint, and the
client has since chosen to reconsider it directly.

## Decision

1. **Online payment gateway: Stripe or PayTabs — not yet decided.** Both
   are viable, established options with Apple Pay/Google Pay web support;
   the specific pick is a client decision still pending, not a technical
   blocker.
2. **Checkout methods: Apple Pay and Google Pay only**, no manual
   card-entry form currently planned — unchanged from prior rounds and
   still flagged as needing explicit UX confirmation (see Consequences);
   this doesn't depend on which gateway wins.
3. **In-person payment is unaffected.** ADCB's physical card machine keeps
   handling counter tap payments exactly as it does today — this ADR only
   concerns the website's online gateway.
4. **Settlement account reopened as a question.** The previous round
   assumed funds would land in the client's ADCB account regardless of
   gateway (a PSP can settle into any designated bank account). That
   assumption hasn't been re-confirmed now that ADCB itself is out of the
   gateway picture — see Consequences.

## Rationale

**Two known-good options, decision left to the client.** Both Stripe and
PayTabs are established payment gateways with documented Apple Pay/Google
Pay web support — there's no technical reason to force the choice early.
Building against a thin internal interface (see below) means development
isn't blocked on which one the client eventually prefers.

**Integrate behind a thin interface regardless of which gateway wins.**
The Express backend (see [ADR-001](ADR-001-tech-stack.md)) should wrap
payment calls behind a small internal interface (create-payment,
verify-webhook, refund) rather than calling either gateway's SDK directly
from route handlers — good practice for isolating a third-party dependency
that touches money, and it means the Stripe-vs-PayTabs choice doesn't
ripple through the whole codebase either way.

## Consequences

- **Open question, needs a client decision:** Stripe or PayTabs — no
  technical blocker either way; development on the payment integration
  layer can proceed against either API behind the thin interface above,
  and swap in the final choice without redesigning anything.
- **Open question, reopened 2026-08-15:** which bank account settlement
  lands in. Previously assumed to be the client's ADCB account regardless
  of gateway (a PSP settles into whatever account the merchant
  designates) — worth reconfirming with the client now that ADCB isn't
  the gateway itself, rather than carrying the old assumption forward
  unchecked.
- **✅ Checkout payment methods rebuilt to match this decision
  (2026-08-15):** `prototype/Cake Lake Ordering Prototype v2.dc.html`'s
  `payOptions` now lists Apple Pay and Google Pay as separate options,
  manual card entry is gone, and in-person reads "Tap your card at the
  counter" instead of "Cash." Tabby is untouched — still the separate open
  question below. Verified directly in the file.
- **Open question, still needs explicit confirmation:** is Apple Pay/
  Google Pay-only checkout really intended, or should a card-entry
  fallback exist for customers without a compatible wallet (most desktop
  browsers, notably)? Unchanged from the prior round. **Claude Design's
  view, worth weighing (2026-08-15):** wallet-only genuinely strands
  desktop customers — Apple Pay needs Safari or a paired device, Google
  Pay needs a saved card in Chrome; a Windows/Firefox visitor trying to
  order a wedding cake would have no way to pay and no fallback, and
  would likely just leave. Suggested pricing a hosted card-entry page
  from whichever gateway wins before committing to wallet-only.
- **⚠ Discrepancy, needs another look now that the gateway direction has
  changed again (found 2026-08-15, gateway direction changed same day):**
  the admin console (`prototype/Cake Lake Admin.dc.html`) has an
  unrequested, Owner-only Payments settings page with a gateway picker
  offering **Telr and PayTabs** — PayTabs is actually back in play under
  this round, but Telr isn't (Stripe is, and it's missing from the
  picker); the payment-methods list still shows "Cards" as a toggle and
  "Cash at the counter," missing Google Pay entirely. Lower priority:
  this screen lives behind the `payments` permission, part of the role
  system already deferred to a later phase per
  [ADR-011](ADR-011-admin-console.md), so nothing is blocked — but worth
  a fix pass once Stripe-vs-PayTabs is settled. See requirements.md's
  fifth discrepancy note.
- Apple Pay and Google Pay each need their own merchant/domain setup steps
  (Apple Pay merchant ID + domain verification; Google Pay merchant
  registration) regardless of which underlying gateway is used
- Whichever gateway is used, its API keys/credentials need a secrets home
  — see [ADR-003](ADR-003-hosting.md)
- The buy-now-pay-later question (Tabby, shown only as a placeholder badge
  in the prototype) remains a separate decision — see the open question in
  requirements.md
- **In-person tap payment stays out of scope for this ADR.** The ADCB card
  machine handles contactless payment at the counter already — nothing to
  build, integrate, or decide here. It doesn't need to talk to whichever
  online gateway is chosen; an in-person sale is recorded as paid,
  independent of the online checkout flow
- Once the client decides between Stripe and PayTabs, this ADR's Status
  flips to Accepted with the specific choice recorded

## Alternatives Considered

**ADCB as the website gateway (Rounds 3–4 of this ADR)**
Rejected as of Round 5 — the client has moved the online-gateway decision
to Stripe vs. PayTabs instead. ADCB's role is now confirmed as in-person
tap payment only; nothing here prevents revisiting ADCB later if the
client's plans change again, but it's not an active candidate now.

**Telr**
Same standing as PayTabs — established, well-documented UAE gateway with
Apple Pay/Google Pay web support. Not one of the two named candidates in
this round; the client specifically named Stripe and PayTabs. Telr remains
a viable substitute if both of those hit a snag later.

**Card-entry checkout alongside wallets (still not adopted, not
permanently rejected)**
The safer default for a payments UX — never leaves a customer stranded
without a way to pay. Not adopted as the current plan because the client's
direction reads as wallet-only by choice. Still flagged as an open
question above rather than silently decided either way.
