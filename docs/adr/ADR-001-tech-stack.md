# ADR-001: Tech Stack — Static Site (Next.js, TypeScript), No Backend

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

- **Next.js**, run in static export mode (`output: 'export'`), as the
  site generator. The build produces plain static files — no Node
  server runs at request time, and nothing here changes
  [ADR-002](ADR-002-hosting-and-deployment.md)'s S3 + CloudFront hosting.
- **TypeScript** as the language, for the cart, order-summary, and
  WhatsApp-link-assembly logic as well as the page/component code.
- Menu/catalogue content lives in structured files in the repo (see
  [ADR-004](ADR-004-content-management.md)), read at build time.
- The cart, order summary, and WhatsApp link assembly all run
  client-side, in the browser.

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

**Next.js in static export mode gives structure without giving up
"just files."** Routing, layouts, and component-based pages are worth
having for a multi-page site (menu, item detail, contact, etc.) without
hand-wiring an HTML build pipeline — and static export still produces
exactly the plain HTML/CSS/JS output S3 + CloudFront serves, with no Node
process needed at runtime. If a genuine need for server-side rendering or
API routes ever shows up, Next.js supports that without a framework
migration — but nothing in this scope calls for it now.

**TypeScript catches the kind of bug this app is most exposed to.** The
cart → order-summary → WhatsApp-link pipeline is the one place where a
silent mistake (a wrong price, a dropped item, a malformed link) would
reach a real customer with no server-side check to catch it. Static
typing on that data flow is cheap insurance for exactly the part of the
app that matters most, at no runtime cost since it's compiled away.

## Consequences

- No database, no ORM, no schema to design or migrate
- No API to build, version, or secure
- Deployment is "build the static files, upload them" — see
  [ADR-002](ADR-002-hosting-and-deployment.md)
- Menu/price changes require a rebuild and redeploy (see
  [ADR-004](ADR-004-content-management.md)) rather than a live database
  write — acceptable at this scale, and explicitly the trade-off the
  client chose over paying for a dashboard/backend
- Next.js features that need a live server (API routes, SSR,
  middleware, image optimization at request time) aren't available in
  static export mode — none of those are needed by this scope, but
  worth knowing if a future feature seems to want one
- If a genuine need for server-side logic shows up later (accounts,
  payment, live tracking), that's a new phase with its own ADR — nothing
  here should be read as ruling that out permanently, just as not needed
  now

## Alternatives Considered

**A full stack with a server and database (e.g. Next.js in server mode + Express + MongoDB)**
Would support payment processing, accounts, order tracking, and an admin
console if any of those were ever needed. Rejected for this phase — none
of that is in scope, and building it anyway would mean paying for and
maintaining a backend and database this scope has no use for.

**A lighter build tool instead of Next.js (e.g. Vite with plain React, or vanilla HTML/CSS/JS)**
Would produce a smaller, simpler toolchain for a site this size, with
less framework surface to learn. Not chosen — Next.js's routing and
page/component conventions are worth the modest extra weight for a
multi-page site, and static export means none of Next.js's
server-oriented features are paid for at runtime. Worth reconsidering
only if the framework's conventions ever get in the way rather than help.

**JavaScript instead of TypeScript**
Slightly less setup, one less thing to learn. Rejected — the type safety
is worth having specifically on the cart/order/WhatsApp-link logic (see
Rationale), and the cost is small since it's a compile-time-only choice
with no runtime overhead.

**A CMS-backed static site (e.g. Next.js + a headless CMS)**
Would give non-technical staff a way to edit the menu without a
developer. Rejected for this phase on cost grounds — most headless CMS
options add either a subscription cost or a database/backend to host;
[ADR-004](ADR-004-content-management.md) covers the git-based alternative
chosen instead, with this noted as a reasonable upgrade path later.
