# ADR-006: Payment Gateway — ADCB, Apple Pay + Google Pay Only

**Status:** Accepted (gateway choice) — integration details still open, see Consequences
**Date:** 2026-08-14

## Context

Confirmed requirement #4 calls for online payment. This ADR went through
two rounds before landing here, both worth keeping for context:

**Round 1 (superseded):** Telr and PayTabs, two established UAE payment
gateways, were the original front-runners over Stripe (cheaper, easier UAE
merchant approval for a retail/F&B business). The choice between the two
was left open pending the client's trade licence and bank account status.

**Round 2 (superseded):** the client confirmed Apple Pay and Google Pay as
required checkout options. Initially read as "use Telr or PayTabs, but make
sure wallets are supported."

**Round 3 (current):** the client clarified further — **Telr and PayTabs
are not being used at all.** The client has an existing business account
and corporate cards with **ADCB (Abu Dhabi Commercial Bank)**, and ADCB is
providing the payment gateway for the site directly.

One important technical distinction surfaced while confirming this, worth
recording since it's an easy thing to conflate: a bank card being
"Apple Pay/Google Pay-enabled" for the *cardholder's own spending* is a
completely different capability from a *merchant* being able to accept
Apple Pay/Google Pay from *customers* on a website. The former is about the
client's own wallet; the latter requires a merchant acquiring relationship
— something has to sit between "customer taps Apple Pay" and "funds settle
into the bakery's account." That's the role ADCB is confirmed to be
playing here: **ADCB is the website's payment gateway/acquirer**, not just
the bank behind the client's own cards.

## Decision

- **Payment gateway: ADCB.** Telr and PayTabs are rejected — see
  Alternatives.
- **Checkout methods: Apple Pay and Google Pay only.** No manual
  card-entry form is currently planned. Flagged as needing explicit
  confirmation — see Consequences — because it has a real UX
  consequence: a customer without a wallet configured on their device or
  browser (most desktop browsers, for one) would have no way to pay
  online at all.

## Rationale

**This is a relationship decision, not a technical comparison.** Unlike
the original Telr-vs-PayTabs framing (which was genuinely a "which do we
pick" technical/business trade-off), choosing ADCB is straightforward: it's
the client's own bank, an existing relationship, presumably simpler
onboarding as a result. This ADR isn't arguing ADCB is technically superior
to Telr/PayTabs — it's recording that the client has decided to use their
own bank, which is a perfectly reasonable business call to make
independent of a feature-by-feature gateway comparison.

**Wallet-only checkout follows from what was actually asked for.** The
client's own words were "not using Telr or PayTabs, only Apple and Google
Pay" — read plainly, that's a scope decision (wallets only), not just a
preference for which wallets to support alongside card. Recording it as
the working decision rather than quietly adding a card form back in.

**Integrate behind a thin interface regardless.** The Express backend (see
[ADR-001](ADR-001-tech-stack.md)) should still wrap payment calls behind a
small internal interface (create-payment, verify-webhook, refund) rather
than calling ADCB's SDK/API directly from route handlers — good practice
for isolating a third-party dependency that touches money, unrelated to
which specific gateway was chosen.

## Consequences

- **Open question, needs the client (and ADCB) to confirm:** what ADCB
  actually provides for web merchant integration — a documented API/SDK,
  a hosted checkout page, something else — plus what onboarding/KYC steps
  remain and a realistic timeline. Telr and PayTabs are well-known,
  developer-documented UAE payment gateways with established e-commerce
  integration paths; ADCB's own merchant gateway product is a much less
  known quantity for this kind of integration. This is real technical
  risk worth surfacing to the client early, not discovered mid-build.
- **Open question, needs explicit confirmation:** is Apple Pay/Google
  Pay-only checkout really intended, or should a card-entry fallback exist
  for customers without a compatible wallet? Worth walking through the
  actual UX with the client (e.g. "what happens to a customer checking out
  from a desktop browser with no wallet set up?") rather than assuming
  either answer.
- Apple Pay and Google Pay each need their own merchant/domain setup steps
  (Apple Pay merchant ID + domain verification; Google Pay merchant
  registration) on top of whatever ADCB's base integration requires — this
  doesn't change based on which underlying gateway is used
- ADCB's API keys/credentials need a secrets home — see
  [ADR-003](ADR-003-hosting.md) — same as any gateway would
- The buy-now-pay-later question (Tabby, shown only as a placeholder badge
  in the prototype) is a separate decision from the core gateway choice —
  see the open question in requirements.md
- **In-person tap payment stays out of scope for this ADR.** The shop's
  existing card terminal handles contactless payment at the counter
  already — nothing to build, integrate, or decide here. The two systems
  don't need to talk to each other; an in-person sale is recorded as paid,
  independent of the online checkout flow
- If ADCB turns out not to offer a workable web integration (the real risk
  flagged above), the fallback is revisiting Telr/PayTabs — this ADR
  should be updated or superseded at that point, not silently patched

## Alternatives Considered

**Telr**
The original front-runner alongside PayTabs — cheaper and easier UAE
merchant approval than Stripe, well-documented developer integration.
Rejected in favor of the client's existing ADCB relationship. Worth
revisiting as a fallback if ADCB's web integration turns out to be
impractical (see Consequences).

**PayTabs**
Same standing as Telr — established, well-documented UAE gateway.
Rejected for the same reason. Same fallback note applies.

**Stripe**
Ruled out earlier in the original scope — harder and more expensive UAE
merchant approval for this business type. Not re-evaluated here; nothing
about the ADCB decision changes that calculus.

**Card-entry checkout alongside wallets (rejected for now, not
permanently)**
The safer default for a payments UX — never leaves a customer stranded
without a way to pay. Not adopted as the current plan because the client's
direction reads as wallet-only by choice. Flagged rather than silently
overridden — see the open question in Consequences.
