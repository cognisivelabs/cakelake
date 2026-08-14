# ADR-008: Order Confirmation Email

**Status:** Proposed
**Date:** 2026-08-14

## Context

Confirmed requirement #8: every customer — account or guest — gets an email
when they place an order, confirming what was ordered. For guest checkout
specifically, this email is also how the customer receives their live
order-tracking link, since guests have no account to log back into (see
[ADR-005](ADR-005-customer-identity.md), requirement #7).

This sits alongside, not instead of, the in-app live tracker (requirement
#5) and the order-tracking polling endpoint
([ADR-004](ADR-004-order-tracking-strategy.md)) — confirmation email is a
one-time send at order placement, not a repeated notification channel.

## Decision

On successful order placement (payment confirmed — see
[ADR-006](ADR-006-payment-gateway.md)), the Express API sends one
transactional email to the customer's email address, containing:
- Order summary (items, total, store, pickup/delivery detail)
- A link to the live order-tracking page (the same page requirement #5's
  tracker lives on)

Sent via **AWS SES** (already the working assumption from
[ADR-003](ADR-003-hosting.md)'s hosting decision and ADR-005's
consequences), called directly from the order-creation code path — no
separate notification service or queue.

## Rationale

**One email, sent inline, is proportionate to the load.** At tens of
orders a day, sending the confirmation email synchronously (or with a
trivial retry, not a full queue) as part of order creation is simple and
sufficient. There's no volume here that would justify a dedicated
notification service or a message queue — that's solving a scale problem
Cake Lake doesn't have, consistent with the reasoning in
[ADR-003](ADR-003-hosting.md) and [ADR-004](ADR-004-order-tracking-strategy.md).

**SES over a third-party transactional email provider.** Already provisioned
as part of the AWS hosting decision (ADR-003), and already flagged in
ADR-005 as the natural choice for guest-tracking emails — order confirmation
is the same delivery mechanism, just a different template, sent to every
customer instead of only guests. Adding a separate provider (Postmark,
SendGrid, etc.) would mean a second vendor relationship and a second set of
credentials for no capability SES doesn't already provide at this volume.

**Confirmation email needs the order to actually exist first.** The email
is sent after payment is confirmed (the webhook in ADR-006 marks the order
paid), not at cart-submission time — so a customer never gets a
confirmation for an order that didn't actually go through.

## Consequences

- Order creation code path gains one more step: call SES after payment
  confirmation, before returning success to the frontend
- If SES send fails, that failure needs to be logged (see
  [ADR-009](ADR-009-logging-and-error-tracking.md)) but shouldn't fail the
  order itself — the order is valid once paid, regardless of whether the
  confirmation email happened to bounce or SES had a blip
- A simple email template (order summary + tracking link) needs to exist;
  no need for a templating service beyond whatever's simplest in the chosen
  stack (e.g. a plain HTML string or a lightweight template lib)
- SES needs to be out of "sandbox mode" (verified sending domain) before
  launch, which is a one-time AWS setup step, not ongoing engineering work
- This is the same delivery mechanism the guest-tracking email in ADR-005
  already assumed — no new infrastructure decision, just a broader
  audience (all customers, not only guests) and a defined trigger point

## Alternatives Considered

**Queue-based notification service (e.g. a dedicated worker processing an
outbox table)**
The "correct at scale" pattern — decouples email sending from the request
path, survives SES being temporarily down, retries reliably. Rejected for
now as more infrastructure than tens-of-orders-a-day justifies (see
[ADR-003](ADR-003-hosting.md)'s "no background job queue" stance). Worth
revisiting if order volume grows enough that synchronous SES calls start
measurably slowing down checkout, or if reliable delivery becomes a proven
problem rather than a theoretical one.

**Third-party transactional email provider (Postmark, SendGrid, Resend)**
Often nicer developer experience than raw SES. Rejected: adds a vendor and
a cost line for no capability gain over SES at this volume, when SES is
already the assumed provider for guest-tracking email in ADR-005.
