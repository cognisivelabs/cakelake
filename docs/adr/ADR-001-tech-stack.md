# ADR-001: Tech Stack — Static Site, No Backend

**Status:** Proposed
**Date:** 2026-08-15

## Context

The approved scope (see
[requirements.md](../requirements/requirements.md)) is: browse a menu,
build a cart, hand the order to WhatsApp as a pre-filled message the
customer sends themselves, download a menu PDF, show contact details. No
online payment, no accounts, no live order tracking, no admin dashboard.

Nothing in that list needs a server. The cart lives entirely in the
customer's browser; the "place order" action assembles a WhatsApp link
client-side (see [ADR-003](ADR-003-whatsapp-order-handoff.md)) and hands
off to WhatsApp — there's no step where the site needs to talk to a
backend of its own.

The client is early-stage and explicitly budget-constrained — the whole
point of this phase's scope is to avoid ongoing hosting/compute costs the
business can't carry.

## Decision

Build the site as a **static site**: HTML/CSS/JS generated at build time,
served as files, with no server-side runtime and no database.

- Menu/catalogue content lives in structured files in the repo (see
  [ADR-004](ADR-004-content-management.md)), read at build time.
- The cart, order summary, and WhatsApp link assembly all run
  client-side, in the browser.
- A lightweight build tool (e.g. Vite) compiles the site to static
  output — chosen for a small, fast build with no framework-level
  runtime cost, not for any specific framework preference.

## Rationale

**No backend needed means no backend to pay for or maintain.** The
single biggest cost lever available here is not needing a compute
instance, a database, or anything that runs continuously — a static site
costs pennies to host (see
[ADR-002](ADR-002-hosting-and-deployment.md)) and has nothing to patch or
keep alive.

**The scope genuinely doesn't need server-side logic.** There's no
payment processing, no accounts, no order tracking, no admin CRUD to
support. What's in scope (show a catalogue, build a cart, generate a
link) is exactly the kind of thing a static site with a little
client-side JavaScript handles natively.

**A small build tool keeps this simple to maintain.** The site doesn't
need to be hand-written HTML with no build step — bundling/minification
and being able to write the cart logic in a structured way (components,
modules) is worth a lightweight toolchain, as long as that toolchain
doesn't require its own server at runtime.

## Consequences

- No database, no ORM, no schema to design or migrate
- No API to build, version, or secure
- Deployment is "build the static files, upload them" — see
  [ADR-002](ADR-002-hosting-and-deployment.md)
- Menu/price changes require a rebuild and redeploy (see
  [ADR-004](ADR-004-content-management.md)) rather than a live database
  write — acceptable at this scale, and explicitly the trade-off the
  client chose over paying for a dashboard/backend
- If a genuine need for server-side logic shows up later (accounts,
  payment, live tracking), that's a new phase with its own ADR — nothing
  here should be read as ruling that out permanently, just as not needed
  now

## Alternatives Considered

**A full stack with a server and database (e.g. Next.js + Express + MongoDB)**
Would support payment processing, accounts, order tracking, and an admin
console if any of those were ever needed. Rejected for this phase — none
of that is in scope, and building it anyway would mean paying for and
maintaining a backend and database this scope has no use for.

**A CMS-backed static site (e.g. Next.js + a headless CMS)**
Would give non-technical staff a way to edit the menu without a
developer. Rejected for this phase on cost grounds — most headless CMS
options add either a subscription cost or a database/backend to host;
[ADR-004](ADR-004-content-management.md) covers the git-based alternative
chosen instead, with this noted as a reasonable upgrade path later.
