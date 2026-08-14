# ADR-011: Admin Console

**Status:** Accepted
**Date:** 2026-08-14

## Context

Confirmed requirement #9: a staff-facing tool, separate from the customer
site, for managing the catalogue (insert/update/remove items) and offers
(requirement #2), scoped to a store (requirement #6). It's also the natural
home for the order/traffic metrics view from
[ADR-010](ADR-010-metrics-and-analytics.md).

This is distinct from the staff order-status screen already implied by
requirement #5 (a few taps to move an order from placed → baking →
decorating → ready) — that's a lightweight in-the-moment tool for whoever's
at the counter during service; the admin console is a less-frequent,
content-management tool for whoever manages the catalogue and offers
(likely the owner or a manager, not necessarily the same person tapping
order statuses all day).

Cake Lake is one small team building one small site, per
[ADR-002](ADR-002-single-repo-structure.md) — whatever the admin console
turns out to be, it shouldn't become a second application to build,
deploy, and maintain independently.

## Decision

The admin console is a **protected section of the same Next.js app**
(e.g. routes under `/admin`), calling the **same Express API** with
admin-authenticated requests — not a separate application, not a separate
repo. It covers:

- Catalogue CRUD (items: name, price, description, photos, tags,
  availability), store-scoped
- Offers CRUD (create/edit/end time-limited promotions), store-scoped
- The order/traffic metrics view from ADR-010

Authentication for admin users is a separate concern from customer identity
(ADR-005) — staff are their own collection/identity space, not customer
accounts. **Confirmed 2026-08-14: admin auth is separate from customer
login.** The separation itself — a customer account can never reach admin
routes, and vice versa — is settled.

**⚠ Prototype update, needs confirmation (2026-08-14):** the working
prototype (`prototype/Cake Lake Admin.dc.html`) implements this as an
**invite-based, role-scoped team system**, not the plain email/password
originally guessed here:

- **Roles**, most to least privileged: **Owner** (everything, plus managing
  who has access), **Catalogue manager** (items, offers, photos, orders —
  no team access), **Counter staff** (orders only, read-only menu)
- Staff are **invited by an Owner** (name + mobile-or-email), not
  self-registered
- Login is a **one-time code**, sent to whichever channel (mobile or email)
  the staff member was invited on — same OTP mechanism as the customer
  login flow in ADR-005, but against a completely separate `team`
  collection, not customer accounts
- Every catalogue/offer/team change is written to an **activity log**
  (who did what, when)

This is a materially more capable design than this ADR originally scoped
(role-based permissions, invite flow, audit log weren't part of the
original ask) — flagging for confirmation rather than silently accepting
it as final, same as the OTP-mechanism note in ADR-005. The core
decision this ADR makes (protected section of the same app, not a
separate application) stands either way.

## Rationale

**One app, protected routes — not a second app.** Splitting the admin
console into its own Next.js project (or worse, its own repo) would double
the deployment surface, the dependency management, and the hosting
footprint for a feature used by a handful of staff, occasionally. Reusing
the same app and API — just with an authenticated, role-gated route
section — is the smaller, cheaper answer that still fully satisfies the
requirement, and it's consistent with the single-repo reasoning in
[ADR-002](ADR-002-single-repo-structure.md).

**Same backend, same data model.** The admin console reads and writes the
exact same store-scoped catalogue/offers/orders collections the customer
site already uses (see [ADR-007](ADR-007-store-scoped-data-model.md)) —
there's no separate admin database or sync process to keep consistent.
An item added in the admin console is immediately the same item the
customer site's catalogue query returns.

**Store-scoping falls out of ADR-007 for free.** Because every catalogue
item and offer already carries a `storeId`, a future second branch's
manager sees and edits only their own store's catalogue/offers without any
additional design work — the admin console just needs to filter by the
logged-in staff member's store, the same way every other store-scoped
query already does.

**Staff auth is deliberately separate from customer auth.** Even though the
prototype gives both customers and staff the same *style* of login
(one-time code — see the update above), they check against entirely
different collections with entirely different consequences: a customer OTP
lets someone place an order, a staff OTP lets someone write to the live
catalogue, offers, or team. Conflating the two identity spaces — even if the
UX pattern looks similar — would let a customer session reach admin
capability by accident. Keeping them separate collections/checks avoids
that regardless of how similar the login screens look.

## Consequences

- `/admin` routes need their own auth guard (middleware) distinct from
  customer session handling — a customer's mobile-number session must
  never grant access here
- Admin users are a small, separate concept from customers — a short,
  invite-only list of staff accounts per store, not a self-serve signup
  flow (per the prototype update above)
- Three roles need real enforcement server-side, not just hidden in the UI:
  Owner (everything, including team management), Catalogue manager
  (items/offers/photos/orders, no team access), Counter staff (orders only,
  read-only menu) — each permission check on the API side, not just
  which buttons the frontend shows
- Every catalogue/offer/team change should write an audit-log entry
  (who, what, when) per the prototype — a small addition to the data model
  (an `activityLog` collection, store-scoped like everything else)
- The prototype's admin console currently covers catalogue, offers, and
  team/access — it does **not** yet include the orders view or the
  order/traffic metrics view from [ADR-010](ADR-010-metrics-and-analytics.md);
  those are still to be designed
- Photo upload for catalogue items needs a storage answer (e.g. S3, given
  [ADR-003](ADR-003-hosting.md)'s AWS hosting) — a small addition to that
  ADR's scope once development starts, not a new infrastructure decision
- Because it's the same Next.js/Express app, admin console changes ship on
  the same deploy as customer-site changes — acceptable at this scale (see
  [ADR-002](ADR-002-single-repo-structure.md)); revisit only if that
  coupling becomes a real deployment-cadence problem
- The order-status tap screen (requirement #5's staff side) and the admin
  console can share the same auth mechanism even though they're different
  route sections with different purposes — one staff login, two things
  they might do with it

## Alternatives Considered

**Separate admin application (its own Next.js project or repo)**
Cleaner separation of concerns, could scale independently. Rejected: no
scale problem exists that this would solve, and it directly contradicts
the single-repo, single-app reasoning already established in
[ADR-002](ADR-002-single-repo-structure.md) for exactly this kind of
"do we split it further" question.

**A generic off-the-shelf admin panel / headless-CMS-style tool
(e.g. a database-admin UI generator)**
Would save some UI-building effort for the CRUD screens. Rejected for now:
most of these tools assume they own the data model or add their own
abstraction layer over MongoDB, which sits awkwardly against the
store-scoped, application-specific rules already established (ADR-007) —
and a small number of well-scoped custom screens (catalogue, offers,
metrics) isn't a lot of UI to build directly against the existing API
anyway.
