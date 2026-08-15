# ADR-006: Payment Gateway — ADCB if Available, PayTabs as Confirmed Fallback

**Status:** Proposed — fallback path confirmed; final pick pending ADCB's answer
**Date:** 2026-08-14

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

**Round 4 (current):** working through what the ADCB card machine actually
is clarified an important distinction — it's a **physical point-of-sale
terminal**, which accepts an in-person NFC tap (including from an Apple
Pay/Google Pay-loaded phone), completely separately from whatever a
**website checkout** would need. A website has no terminal to tap; Apple
Pay/Google Pay on the web work through Apple's/Google's JavaScript payment
APIs, which hand an encrypted token to a **payment gateway** integrated
into the site's backend — a software integration, not a hardware one. Bank
card machines and web payment gateways are commonly separate products even
within the same bank, so having one doesn't confirm the other exists.

That produced the current, practical two-path plan.

## Decision

1. **Ask ADCB directly:** do they offer a separate web/e-commerce payment
   gateway (API, SDK, or hosted checkout page) for the site — distinct
   from the physical card machine — and does it support Apple Pay/Google
   Pay for *web* checkout specifically? If yes, and it's not slow to set
   up, **use it.**
2. **If ADCB doesn't have this, or it's unclear/slow: use PayTabs.**
   Confirmed as the fallback, not just "reconsider later" — PayTabs is a
   well-documented UAE gateway with established Apple Pay/Google Pay web
   support, so it's a known-good path rather than a second unknown.
3. **Either way, settlement lands in the client's existing ADCB account.**
   The gateway (whichever it turns out to be) and the bank account funds
   settle into are separate concerns — PayTabs doesn't require banking
   with PayTabs; it processes the transaction and deposits into whatever
   account the merchant designates, which can be — and here, will be —
   the client's ADCB account. So "we want the money in ADCB" is satisfied
   regardless of which of the two gateways ends up doing the processing.
4. **Checkout methods: Apple Pay and Google Pay only**, no manual
   card-entry form currently planned — this part is unchanged from the
   prior round and still flagged as needing explicit UX confirmation (see
   Consequences); it doesn't depend on which gateway wins.

## Rationale

**A confirmed fallback turns an open risk into a bounded one.** The
previous version of this ADR left "what if ADCB doesn't have a web
product" as an unresolved risk. Naming PayTabs as the specific,
already-vetted fallback means the answer to "does ADCB work out" is never
"start over" — it's "use the other known-good option," decided now rather
than improvised later if ADCB's answer is disappointing.

**The gateway/settlement-account distinction is what makes this
low-risk.** Once it's clear that "money ends up at ADCB" doesn't require
"ADCB processes the transaction," the two paths stop being in tension with
the client's actual goal (their money, in their bank). This is the single
fact that unblocks the decision — worth keeping explicit in this ADR
rather than just in chat history, since it's easy to re-lose the thread on
this later.

**Ask ADCB a specific, answerable question, not a vague one.** "Do you
support Apple Pay" is exactly the ambiguous framing that caused the
confusion in Rounds 3–4 (a card machine "supports" Apple Pay, in a totally
different sense than a web gateway does). The question to actually ask is
specific: *"Do you have a web/e-commerce payment gateway, separate from
our card machine, that supports Apple Pay and Google Pay for online
checkout?"* — a question ADCB's business banking team can answer
unambiguously, which is the point.

**Integrate behind a thin interface regardless of which gateway wins.**
The Express backend (see [ADR-001](ADR-001-tech-stack.md)) should wrap
payment calls behind a small internal interface (create-payment,
verify-webhook, refund) rather than calling either gateway's SDK directly
from route handlers — good practice for isolating a third-party dependency
that touches money, and it means the ADCB-vs-PayTabs choice doesn't ripple
through the whole codebase either way.

## Consequences

- **Open question, needs the client to ask ADCB directly (see the specific
  question above):** whether ADCB has a web gateway product at all. This
  is now a bounded question with a known fallback, not a blocking risk —
  development on the payment integration layer can proceed against the
  PayTabs API in the meantime, and swap in ADCB later if it turns out to
  be available and worthwhile, without redesigning anything (see the thin
  interface point above)
- **✅ Checkout payment methods rebuilt to match this decision
  (2026-08-15):** `prototype/Cake Lake Ordering Prototype v2.dc.html`'s
  `payOptions` now lists Apple Pay and Google Pay as separate options,
  manual card entry is gone, and in-person reads "Tap your card at the
  counter" instead of "Cash." Tabby is untouched — still the separate open
  question below. Verified directly in the file.
- **Open question, still needs explicit confirmation:** is Apple Pay/
  Google Pay-only checkout really intended, or should a card-entry
  fallback exist for customers without a compatible wallet (most desktop
  browsers, notably)? Unchanged from the prior round — not resolved by
  the ADCB/PayTabs question. **Claude Design's view, worth weighing
  (2026-08-15):** wallet-only genuinely strands desktop customers — Apple
  Pay needs Safari or a paired device, Google Pay needs a saved card in
  Chrome; a Windows/Firefox visitor trying to order a wedding cake would
  have no way to pay and no fallback, and would likely just leave.
  Suggested pricing a hosted card-entry page from whichever gateway wins
  (ADCB or PayTabs) before committing to wallet-only.
- **⚠ New discrepancy, minor, found 2026-08-15:** the admin console
  (`prototype/Cake Lake Admin.dc.html`) gained an unrequested,
  Owner-only Payments settings page with a gateway picker offering
  **Telr and PayTabs** — not ADCB, which superseded Telr as the
  first-choice option under this ADR — and a payment-methods list still
  showing "Cards" as a toggle and "Cash at the counter," missing Google
  Pay entirely. Lower priority: this screen lives behind the `payments`
  permission, part of the role system already deferred to a later phase
  per [ADR-011](ADR-011-admin-console.md), so nothing is blocked — but
  worth a fix pass whenever that phase happens, or sooner if it's
  confusing to look at now. See requirements.md's fifth discrepancy note.
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
- Once ADCB's answer comes back, this ADR's Status flips to Accepted with
  the specific choice recorded — either "ADCB, confirmed web gateway
  available" or "PayTabs, ADCB had no web product" — rather than left as
  a two-path plan

## Alternatives Considered

**Committing to ADCB only, and treating "no web product" as a blocker to
resolve later**
The previous version of this ADR. Rejected in favor of naming the fallback
now — there's no reason to let the whole payment integration wait on a
single yes/no from one bank when a known-good alternative already exists.

**Committing to PayTabs only, skipping the ADCB question entirely**
Would remove the open question altogether and let development start
immediately. Rejected because the client has a real, existing ADCB
relationship and it's a reasonable preference to use it if it works
technically — worth one direct question to ADCB before ruling it out,
which costs little and might simplify things (one less third party in the
money-movement chain).

**Telr**
Same standing as PayTabs — established, well-documented UAE gateway with
Apple Pay/Google Pay web support. Not chosen as *the* named fallback only
because a single, concrete fallback is more useful than two — PayTabs was
picked arbitrarily between two otherwise-equivalent options. Telr remains
a perfectly viable substitute if PayTabs specifically hits a snag later.

**Stripe**
Ruled out earlier in the original scope — harder and more expensive UAE
merchant approval for this business type. Not re-evaluated here; nothing
about this round changes that calculus.

**Card-entry checkout alongside wallets (still not adopted, not
permanently rejected)**
The safer default for a payments UX — never leaves a customer stranded
without a way to pay. Not adopted as the current plan because the client's
direction reads as wallet-only by choice. Still flagged as an open
question above rather than silently decided either way.
