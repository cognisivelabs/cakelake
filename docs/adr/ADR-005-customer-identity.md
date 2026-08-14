# ADR-005: Customer Identity — Email or Mobile (via WhatsApp) for Accounts, Email for Guests

**Status:** Accepted
**Date:** 2026-08-14

## Context

Confirmed requirement #7 (see [requirements.md](../requirements/requirements.md))
calls for two checkout paths:
- **Account** — a returning customer logs in and can see their own past
  orders
- **Guest** — a customer orders without creating an account, and needs some
  way to receive their live order-tracking link/updates

Cake Lake's customers today order over WhatsApp, where a phone number is
already the natural, only identifier — there's no existing account system
or email-based relationship to migrate from. The client is early-stage and
budget-conscious; whatever identity mechanism is chosen needs to be cheap
to build and cheap to run.

This ADR went through a round worth keeping for context: the working
prototype implemented account login as a one-time code sent to mobile *or*
email, which reopened a cost question this ADR originally avoided — SMS
costs money per login. That's now resolved (see Decision).

## Decision

- **Account customers:** identified by **email or mobile number**,
  customer's choice. Once logged in (one-time code, see below), a
  customer can place orders and see their own order history.
- **Guest customers:** no account required. At checkout, collect an
  **email address**, used only to send order-tracking details/updates for
  that order — unchanged from the original decision.
- **One-time code delivery: email or WhatsApp — never SMS.** If the
  customer logs in with email, the code goes by email (SES). If they log
  in with their mobile number, the code goes as a **WhatsApp message**, not
  an SMS — sent via the same WhatsApp Business Platform integration and
  dedicated automated-messaging number already being built for order
  notifications ([ADR-012](ADR-012-whatsapp-notifications.md)), just a
  different message template (Meta's "Authentication" category, not
  "Utility").

## Rationale

**WhatsApp instead of SMS removes the cost objection entirely, for free.**
The original version of this ADR avoided phone-based OTP specifically
because SMS costs money per message and needs its own provider
integration. WhatsApp OTP needs neither: it's typically cheaper than SMS
per message, and — critically — it rides on infrastructure already being
built for a different reason (ADR-012's order notifications), so there's
no new provider relationship to set up. This is a case where "use the
channel this business already lives in" turns out to also be the cheap,
low-effort technical answer.

**Phone number still matches how customers already think of themselves
here.** That reasoning from the original decision is unchanged — the
client's entire existing order channel (WhatsApp) is phone-number-based.
What's changed is only *how* a mobile-identified customer receives their
login code, not that mobile-as-identifier remains a first-class, expected
option.

**Email for guests is still the lighter-weight identifier for a one-off
need.** Unchanged from the original decision — a guest doesn't need a
persistent identity, just a way to receive tracking updates for the one
order they placed.

## Consequences

- The `customer` (or equivalent) collection/model needs to look up by
  *either* email or mobile number — not a single fixed key, since the
  customer picks at login
- WhatsApp OTP needs its own approved message template (Authentication
  category) submitted to Meta, alongside the two Utility templates from
  ADR-012 — same setup process, one more template, not a new integration
- **No SMS provider needed anywhere in this system.** That was the
  original cost/complexity concern in this ADR; it's now fully resolved
  rather than just deferred
- WhatsApp API costs apply per OTP send (Authentication-category
  conversation pricing), same cost model as the order notifications in
  ADR-012 — budget it alongside those, not as a separate line item
- Guest orders still don't create a persistent customer record tied to
  identity — just an order record with a contact email attached for
  tracking purposes; this is unchanged and remains an intentional,
  accepted trade-off per requirement #7
- Email deliverability for guest tracking emails remains a small
  operational concern — unchanged, see [ADR-003](ADR-003-hosting.md)'s SES
  usage

## Alternatives Considered

**Email + password for all accounts (no phone-based identity)**
The default for most web apps. Rejected: doesn't match the client's
existing WhatsApp-based customer relationship, and adds a password to
manage (reset flows, security) for a use case where phone number is
already the natural identifier customers already use with this business.

**Mobile-only, no email option, deferring OTP entirely**
The original version of this ADR, before the prototype introduced
email-or-mobile choice and before WhatsApp-delivered OTP resolved the cost
concern that motivated deferring OTP in the first place. No longer the
right call now that OTP is effectively free to offer via WhatsApp — there's
no remaining reason to withhold it.

**SMS-delivered OTP**
The default assumption for "phone-based OTP" generally. Rejected in favor
of WhatsApp specifically because it's cheaper, needs no separate provider
relationship (reuses ADR-012's integration), and is the channel this
business's customers already associate with them — SMS is none of those
things here.
