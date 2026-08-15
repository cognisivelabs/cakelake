# ADR-002: Hosting & Deployment — AWS Static Hosting via GitHub Actions

**Status:** Proposed
**Date:** 2026-08-15

## Context

The client explicitly asked for the app to be "hosted on AWS as a simple
application, using GitHub Actions for building and deployment." Combined
with [ADR-001](ADR-001-tech-stack.md)'s decision to build a static site
with no backend, hosting needs to serve static files reliably, over
HTTPS, at low cost — nothing more.

## Decision

- **Hosting:** Amazon S3 (stores the built site files) + CloudFront (CDN,
  HTTPS, caching) in front of it.
- **DNS/TLS:** Route 53 for the domain, ACM for the TLS certificate —
  both standard, low-cost AWS services that pair naturally with
  CloudFront.
- **CI/CD:** a GitHub Actions workflow that, on push to the main branch,
  builds the static site and syncs the output to S3, then invalidates
  the CloudFront cache so the change goes live immediately.
- No compute instance (EC2, containers, Lambda) is provisioned for
  serving the site — there's nothing dynamic to run.

## Rationale

**This is close to the cheapest AWS setup that still meets the ask.** S3
+ CloudFront is billed almost entirely by actual usage (storage in cents,
CloudFront's free tier covers most small-business traffic) rather than a
fixed monthly compute cost — the right fit for a business that explicitly
said it can't carry ongoing expenses.

**GitHub Actions matches what was asked for directly.** The client named
GitHub Actions specifically; a push-to-deploy workflow (build → sync to
S3 → invalidate CloudFront) is the natural, low-effort way to satisfy
that without adding a separate CI product.

**Nothing here needs patching or uptime babysitting.** Unlike a compute
instance, S3/CloudFront have no OS to patch, no process to keep alive,
and no server to go down — appropriate for a client with no in-house
engineering team to operate infrastructure.

## Consequences

- Route 53 hosted zone (~$0.50/month) and ACM certificate (free) are the
  only fixed-ish costs; S3 storage and CloudFront transfer scale with
  actual traffic, both negligible at this business's expected volume
- The GitHub Actions workflow needs AWS credentials (scoped narrowly to
  S3 write + CloudFront invalidation) stored as GitHub repo secrets — no
  broader AWS access than that is needed
- Any future move to a backend (see [ADR-001](ADR-001-tech-stack.md)'s
  Consequences) would need its own hosting decision — this ADR only
  covers the static-site phase
- Every push to main goes live automatically — acceptable at this scale
  and traffic; if that ever feels risky, a manual-approval step can be
  added to the workflow without changing the underlying hosting

## Alternatives Considered

**AWS Amplify Hosting**
Also cheap and built specifically for static sites, with its own
built-in CI/CD from a connected repo. Not chosen only because the client
asked for GitHub Actions specifically — Amplify's own pipeline would
sidestep that ask rather than fulfill it, even though it's a very
reasonable alternative on technical merits alone.

**A simpler non-AWS static host (Vercel, Netlify, Cloudflare Pages)**
Would likely be even less setup effort, and some have generous free
tiers. Not chosen because the client specifically asked for AWS hosting —
worth revisiting only if AWS setup effort/cost turns out to be
disproportionate once real numbers are in hand.

**EC2 or a container service running a small web server**
Would work, but reintroduces exactly the "always-on compute to pay for
and patch" cost this ADR is trying to avoid, for a site that has no
server-side logic to run. Rejected — see
[ADR-001](ADR-001-tech-stack.md).
