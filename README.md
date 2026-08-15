# Cake Lake Bakery

A cake and bakery shop in Dubai, UAE, currently taking all orders
manually over WhatsApp. This repo holds the documentation and (once
development starts) the code for a website that lets customers browse
the menu and build an order themselves, handed off to the bakery's
WhatsApp for confirmation and payment — no online payment, no accounts,
no backend.

## Fresh start (2026-08-15)

The client approved a much smaller-scope business requirements document
than what this project originally planned around. At the client's
request, the prior planning-phase content (a heavier Next.js/Express/
MongoDB plan with a payment gateway, customer accounts, and an admin
console) was cleared from this repo — it's still recoverable from git
history, but nothing in the current working tree reflects it. Everything
below is being rebuilt from scratch against the new, approved scope.

## Project Phases

1. **Requirements** — done. See
   [`Cake-Lake-Bakery-Website-Requirements.pdf`](Cake-Lake-Bakery-Website-Requirements.pdf),
   the client-approved source of truth for what's being built.
2. **Planning** — in progress. Technical requirements, architecture
   decisions (ADRs), and system design, scoped to the approved
   requirements.
3. **Development** — not started. `app/` is currently empty.

## Documentation

| Doc | Purpose |
|---|---|
| [`Cake-Lake-Bakery-Website-Requirements.pdf`](Cake-Lake-Bakery-Website-Requirements.pdf) | Client-approved business requirements — the source of truth for scope |
| [`docs/requirements/requirements.md`](docs/requirements/requirements.md) | Technical requirements, confirmed scope, and open questions |
| [`docs/adr/`](docs/adr/README.md) | Architecture Decision Records |
| [`docs/architecture/system-overview.md`](docs/architecture/system-overview.md) | How the pieces fit together |

## Tech Stack

| Area | Decision | ADR |
|---|---|---|
| Site | Static site, no backend, no database | [ADR-001](docs/adr/ADR-001-tech-stack.md) |
| Hosting/CI-CD | AWS (S3 + CloudFront), built and deployed via GitHub Actions | [ADR-002](docs/adr/ADR-002-hosting-and-deployment.md) |
| Order handoff | `wa.me` click-to-chat link, customer-sent | [ADR-003](docs/adr/ADR-003-whatsapp-order-handoff.md) |
| Content | Menu/catalogue content managed in-repo, no CMS | [ADR-004](docs/adr/ADR-004-content-management.md) |
| Mobile | Installable PWA, no native app store app | [ADR-005](docs/adr/ADR-005-installable-web-app.md) |

## Repo Structure

```
Cake-Lake-Bakery-Website-Requirements.pdf   Client-approved requirements
docs/
  requirements/   Technical requirements
  adr/            Architecture Decision Records
  architecture/   System overview
app/              Site source (empty — development not yet started)
```
