# ADR-005: Customer Identity — Mobile Number for Accounts, Email for Guests

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
to build and cheap to run (no expensive SMS/OTP provider commitment implied
unless the client specifically wants OTP verification).

This is the same category of decision Kram made in its ADR-004 (patient
identity — phone number, no OTP in MVP), for a similar reason: the
existing, expected identifier for this customer base is a phone number, not
an email address or a username/password pair.

## Decision

- **Account customers:** identified by **mobile number**. The mobile number
  is the account ID. Once logged in, a customer can place orders and see
  their own order history.
- **Guest customers:** no account required. At checkout, collect an
  **email address**, used only to send order-tracking details/updates for
  that order.

Password strategy and whether account login requires OTP verification are
implementation details left open for the development phase — this ADR
fixes the *identifier*, not the full auth flow.

**⚠ Prototype update, needs confirmation (2026-08-14):** the working
prototype (`prototype/Cake Lake Ordering Prototype v2.dc.html`) implements
account login as a **one-time code sent to mobile *or* email** — the
customer picks either channel, not mobile number exclusively. This is a
reasonable middle ground (email OTP costs nothing; mobile OTP still allows
the phone-first experience) but it does partially reopen the "no SMS/OTP
cost commitment" assumption in Rationale/Alternatives below — a customer
who chooses mobile OTP does incur an SMS cost per login. Flagging rather
than silently accepting: confirm whether email-or-mobile OTP is the
intended flow, or whether mobile-only (deferring OTP entirely, as
originally decided here) should be enforced instead.

## Rationale

**Phone number matches how customers already think of themselves here.**
The client's entire existing order channel (WhatsApp) is phone-number-based.
Asking a returning customer to remember an email/username instead would be
a worse experience than the WhatsApp flow it's replacing, not a better one.

**Email for guests is the lighter-weight identifier for a one-off need.**
A guest doesn't need a persistent identity — they need one thing: a way to
receive tracking updates for the order they just placed. Email is
sufficient for that, doesn't require any verification step to be useful
(unlike phone-based OTP, which costs money per message and adds friction),
and is a one-time collection at checkout rather than an account to manage.

**No SMS/OTP cost commitment at this stage.** Kram deliberately deferred
OTP verification for its MVP phone-based identity to avoid an SMS provider
cost and integration before it was proven necessary. The same logic applies
here, more so: Cake Lake's client is smaller and more budget-constrained
than Kram's target clinics. If phone verification becomes genuinely
necessary later (e.g. to prevent fake accounts), it can be added without
changing the underlying identifier.

## Consequences

- The `customer` (or equivalent) collection/model uses mobile number as its
  primary lookup key, not email
- Guest orders don't create a persistent customer record tied to identity —
  just an order record with a contact email attached for tracking purposes
- A guest who orders multiple times has no automatic order history across
  visits (that's the difference account checkout offers) — this is an
  intentional, accepted trade-off per requirement #7, not a gap to fix
- Whether/how phone numbers get verified (OTP, or trust-on-first-order) is
  an open implementation decision for the development phase, not fixed here
- Email deliverability (order-tracking emails actually landing, not
  spam-filtered) becomes a small but real operational concern for guest
  checkout — worth a basic transactional email provider (e.g. SES, given
  [ADR-003](ADR-003-hosting.md)'s AWS hosting) rather than rolling one from
  scratch

## Alternatives Considered

**Email + password for all accounts (no phone-based identity)**
The default for most web apps. Rejected: doesn't match the client's
existing WhatsApp-based customer relationship, and adds a password to
manage (reset flows, security) for a use case where phone number is already
the natural identifier customers already use with this business.

**Phone-based OTP login for all customers, no guest path**
Would give every order a verified identity and unify the two paths into
one. Rejected for now: forcing every customer through OTP adds friction and
SMS cost for a client trying to keep costs low, and the confirmed
requirement explicitly asks for both an account path and a lighter-weight
guest path — collapsing them removes an intentional part of the spec.
