# ADR-006: Payment Gateway — Telr vs. PayTabs

**Status:** Proposed
**Date:** 2026-08-14

## Context

Confirmed requirement #4 calls for online payment via a UAE payment
gateway. Telr and PayTabs are the two front-runners, both chosen over
Stripe specifically because they're cheaper and have easier UAE merchant
approval for a retail/F&B business than Stripe does in this market.

The actual choice between the two depends on facts only the client can
supply: their trade licence status and bank account status (see the open
question in [requirements.md](../requirements/requirements.md)). This ADR
exists to record the decision framework now, so that once the client
answers, finalizing the choice is a quick update to this file rather than a
fresh analysis.

## Decision

**Not yet finalized.** Working plan: whichever of Telr or PayTabs the
client can actually get merchant-approved with fastest, given their current
trade licence and bank account status — see Open Question below.

## Rationale

**Why not Stripe.** Already ruled out in the original scope: Stripe's UAE
merchant approval is harder and more expensive for a small retail/F&B
business than either UAE-native alternative. Re-litigating this isn't
useful without new information changing that calculus.

**Why the decision waits on the client, not on a technical comparison.**
Telr and PayTabs are both established UAE gateways with broadly similar
integration shapes (hosted checkout or API-based, card + Apple Pay support,
webhook-based order confirmation). The deciding factor here isn't which
SDK is nicer to integrate — it's which one the client can actually get
approved with, and how fast. That's a business/paperwork fact, not an
engineering one, so it's the client's answer to give, not this ADR's to
guess.

**Whatever is chosen, integrate it behind a thin interface.** Regardless of
which gateway wins, the Express backend (see
[ADR-001](ADR-001-tech-stack.md)) should wrap payment calls behind a small
internal interface (create-payment, verify-webhook, refund) rather than
calling the gateway's SDK directly from route handlers. This isn't about
expecting to switch gateways later — it's just good practice for isolating
a third-party dependency that touches money, and it costs nothing extra to
do from the start.

## Consequences

- Payment integration work cannot start until the client answers the open
  question (trade licence / bank account status)
- Whichever gateway is chosen, its API keys need a secrets home — see
  [ADR-003](ADR-003-hosting.md)
- The buy-now-pay-later question (whether to also integrate Tabby,
  currently shown only as a placeholder badge in the prototype) is a
  separate decision from the core gateway choice — see the open question
  in requirements.md — and shouldn't block finalizing Telr vs. PayTabs
- Once decided, this ADR's Status flips to Accepted and this file is
  updated with the specific choice and why (trade licence timing, fee
  comparison actually obtained, etc.) rather than left as a framework

## Alternatives Considered

**Stripe**
Ruled out in the original confirmed scope — harder and more expensive UAE
merchant approval for this business type. Not re-evaluated here.

**Waiting to decide until closer to development, rather than drafting this
ADR now**
Considered, but there's no cost to recording the decision framework early —
it clarifies exactly what information is being waited on (trade licence,
bank account status) and stops the choice from becoming a last-minute
scramble once development starts.
