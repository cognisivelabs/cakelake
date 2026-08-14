# ADR-003: AWS `me-central-1` Hosting, Minimal Footprint

**Status:** Proposed
**Date:** 2026-08-14

## Context

Cake Lake needs hosting for:
1. The Next.js frontend (server-rendered pages + static assets)
2. The Express API (catalogue, cart, orders, payment gateway webhook,
   order-status polling endpoint)
3. MongoDB (see [ADR-001](ADR-001-tech-stack.md) — Atlas, not self-hosted)
4. DNS and TLS
5. Whatever secrets management the payment gateway integration needs
   (API keys for Telr/PayTabs — see [ADR-006](ADR-006-payment-gateway.md))

The client operates in Dubai, UAE. Customers and the shop itself are both
in-region, so hosting close to them keeps latency low for both the ordering
site and the counter/staff order-status screen. There's no explicit legal
data-residency requirement in scope the way Kram had with India's DPDP Act,
but keeping customer and order data in the UAE region is still the sensible
default for a UAE consumer business, and is worth revisiting explicitly if
the client's payment gateway or future compliance needs demand it.

Expected load: a single shop doing on the order of tens of orders a day,
growing to a few branches over time per the store-scoped data model (see
[ADR-007](ADR-007-store-scoped-data-model.md)). This is not a load profile
that needs auto-scaling infrastructure, multi-AZ redundancy, or a
dedicated ops setup.

## Decision

AWS **`me-central-1` (UAE, Dubai)**, minimal footprint:

| Service | Purpose | Tier |
|---------|---------|------|
| Route 53 | DNS | Hosted zone |
| ACM | TLS certificates | Standard |
| A single small compute instance (EC2 or equivalent) or a managed container service | Runs the Next.js app + Express API | Smallest instance that fits both processes comfortably |
| MongoDB Atlas | Database, hosted separately from AWS compute, region-matched to `me-central-1` where available | Free or lowest paid tier to start |
| S3 + CloudFront | Static assets (if not served directly by Next.js) | Standard, optional at launch |
| Secrets Manager (or environment variables via the hosting platform, if cheaper) | Payment gateway keys, DB connection string | Standard |

No Redis, no message queue, no separate worker service, no load balancer at
launch — there's exactly one compute node and nothing yet that needs to
sit in front of it.

## Rationale

**`me-central-1` is the right region for a UAE-only business.** The client,
the shop, and (for the foreseeable future) every customer are in the UAE.
Hosting in-region minimizes latency for both the customer-facing site and
the staff order-status screen at the counter, and is the natural default
absent any reason to host elsewhere.

**Minimal footprint matches minimal load.** A single small compute node
running both the Next.js app and the Express API is more than sufficient
for tens of orders a day. Kram's ADR-006 justified a comparatively bigger
setup (ALB, NAT gateway, multi-subnet VPC) because it was planning for
hundreds of clinics and real-time WebSocket fan-out; none of that applies
here. Provisioning that kind of infrastructure now would be pure
over-engineering for a client explicitly described as budget-conscious.

**MongoDB Atlas over self-hosted Mongo.** Running MongoDB on the same or an
adjacent EC2 instance would save Atlas's subscription cost but would push
backup, patching, and failover entirely onto whoever maintains this after
delivery — for a client with no in-house engineering, that's a bad trade.
Atlas's free/low tier costs nothing or very little at this scale and
removes an entire category of operational risk.

**No Redis, no queue, no separate worker.** Nothing in scope needs
background job processing at a volume that would justify a dedicated queue
(the payment webhook and any notification sending can run inline or via the
hosting platform's own simple scheduled/async primitives). Order status
updates are staff-initiated taps, not high-frequency events (see
[ADR-004](ADR-004-order-tracking-strategy.md)).

## Consequences

- One compute node to provision, patch, and monitor — not a VPC with public
  and private subnets, an ALB, and a NAT gateway
- Scaling path is explicit and deferred: if a second/third branch or a
  much higher order volume than expected makes a single node insufficient,
  that's the trigger to add a second node behind a load balancer — not a
  reason to build that topology now
- Secrets (payment gateway keys, DB connection string) need a home even at
  this scale — Secrets Manager if cost allows, otherwise the hosting
  platform's own environment-variable secret store is an acceptable
  substitute for a project this size
- This ADR is Proposed, not Accepted, pending prototype approval and final
  confirmation of the payment gateway (ADR-006), which may have its own
  region/compliance requirements worth checking before infrastructure is
  actually provisioned

## Alternatives Considered

**A simpler PaaS (e.g. Vercel for the frontend + a small managed Node host
for the backend), instead of raw AWS**
Would likely be cheaper and lower-effort to set up than provisioning AWS
directly, and Vercel in particular is a very natural fit for Next.js.
Not chosen as the primary plan because AWS `me-central-1` was already the
tentative direction carried in the requirements doc, and consolidating
frontend, backend, and secrets under one cloud account is simpler to hand
off to the client later than a multi-vendor PaaS spread. Worth revisiting
at implementation time if AWS setup cost/effort turns out to be
disproportionate to the client's budget — this is exactly the kind of
choice this ADR should be updated or superseded over once real numbers are
in hand.

**Full VPC + ALB + ECS setup, mirroring Kram's ADR-006**
Rejected as over-engineered for the load profile described in Context. That
topology earns its complexity at Kram's scale (500+ clinics, WebSocket
fan-out); Cake Lake doesn't have that problem, so it shouldn't carry that
infrastructure or its cost.

**Self-hosted MongoDB on the same compute node**
Cheaper up front, but pushes backup/patching/failover risk onto a client
with no engineering team to own it. Rejected — see Rationale.
