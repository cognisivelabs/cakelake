# ADR-009: Logging & Error Tracking

**Status:** Proposed
**Date:** 2026-08-14

## Context

Operational requirement (see [requirements.md](../requirements/requirements.md)):
application errors and key events need to be logged somewhere a developer
can actually debug from — not silently swallowed, not printed to a console
nobody's watching once this is deployed.

Cake Lake has no in-house engineering team watching this day to day — it's
a small external build for a budget-conscious client. Whoever debugs a
production issue (during and after delivery) needs to find useful
information quickly, without operating a heavyweight observability stack.
Expected volume is low (see [ADR-001](ADR-001-tech-stack.md)), so log
volume itself will never be the problem — findability and not missing real
errors is.

## Decision

- **Structured logging** from the Express API (and Next.js server-side
  code) to stdout, in a consistent format (JSON lines: timestamp, level,
  message, relevant IDs like orderId/storeId where applicable) — using
  whatever the Node ecosystem's standard lightweight logger provides
  (e.g. Pino), not a bespoke logging setup.
- Logs flow to **CloudWatch Logs**, since compute already runs on AWS (see
  [ADR-003](ADR-003-hosting.md)) — no separate log-shipping infrastructure.
- **A lightweight error-tracking service** (e.g. Sentry's free/low tier) for
  exceptions specifically — so a crash or unhandled error surfaces as an
  actionable alert with a stack trace, not just a line buried in a log
  stream nobody's tailing in real time.

## Rationale

**Structured logs over free-text `console.log`.** JSON-line logs with
consistent fields (level, message, orderId/storeId when relevant) can
actually be searched and filtered later — in CloudWatch's own console or
piped elsewhere if needed. Free-text logs are fine to write and useless to
search once there's more than a screenful.

**CloudWatch, not a separate logging platform.** Compute is already on AWS
(ADR-003); CloudWatch Logs is the default destination for anything writing
to stdout on that infrastructure, at effectively no extra setup cost. A
dedicated logging platform (Datadog, Better Stack, etc.) would be another
vendor and another cost line for a volume of logs that doesn't need it.

**Error tracking is a different job than logging, and worth the small
separate tool.** Logs answer "what happened, in order" — good for tracing
through a specific incident once you know where to look. They're bad at
answering "did anything break today that I don't know about yet." A
lightweight error tracker (Sentry-style) exists specifically to catch
unhandled exceptions and surface them without anyone needing to go looking
— genuinely useful for a small unattended app, and free tiers cover this
volume comfortably.

**No full observability stack (metrics + traces + logs, e.g. an ELK stack
or a Datadog/New Relic APM setup).** That tooling earns its cost and
operational overhead at a scale with many services, many engineers on call,
and enough traffic that manual log-reading isn't viable. None of that
describes Cake Lake. See [ADR-010](ADR-010-metrics-and-analytics.md) for
where basic order/traffic numbers come from instead — that's a separate,
much smaller need than full APM.

## Consequences

- A logging library needs to be picked and used consistently across the
  Express API (and any Next.js server-side code) from the start of
  development — retrofitting structured logging later is more painful than
  adopting it from the first route handler
- CloudWatch Logs retention/cost needs a sane default (e.g. 30–90 days) set
  at provisioning time — not indefinite retention by default
- Sentry (or equivalent) needs its DSN as a secret (see
  [ADR-003](ADR-003-hosting.md)'s secrets handling) and a small SDK
  integration in both the Express API and the Next.js app
- Whoever picks up a bug report has two places to look: CloudWatch for the
  surrounding sequence of events, Sentry for the specific exception and
  stack trace — this is an intentional, minimal split, not fragmentation
- Payment-related errors (ADR-006, ADR-008) specifically must always be
  logged, even though the order/email flow itself shouldn't fail loudly to
  the customer — this ADR is what makes that debuggable after the fact

## Alternatives Considered

**Full ELK/observability stack (Elasticsearch + Logstash/Fluentd + Kibana,
or a hosted equivalent)**
The thorough answer for a team debugging a high-traffic, multi-service
system. Rejected outright — the operational overhead (running/paying for
Elasticsearch, maintaining ingestion pipelines) has no payoff at Cake
Lake's log volume, and nobody on a small external build should be operating
a search cluster for tens of orders a day.

**Just `console.log`, read via `docker logs` / SSH when something breaks**
The zero-setup option. Rejected as insufficient for the stated
requirement ("debugging is possible") — free-text logs with no
error-alerting mean someone has to already suspect something's wrong and go
looking, rather than being told. The gap between this and the proposed
approach is small in effort but large in usefulness.
