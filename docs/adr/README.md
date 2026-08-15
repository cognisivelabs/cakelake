# Architecture Decision Records — Cake Lake Bakery

This is the current ADR set, rebuilt from scratch on 2026-08-15 against
the client-approved, much smaller project scope (see
[requirements.md](../requirements/requirements.md) and the approved
[`Cake-Lake-Bakery-Website-Requirements.pdf`](../../Cake-Lake-Bakery-Website-Requirements.pdf)).

The prior ADR set (payment gateway, customer accounts, order tracking,
admin console, Next.js/Express/MongoDB) was deleted from the working tree
at the client's request when the project scope changed — it's still
recoverable from git history if that reasoning is ever needed again, but
none of it reflects the current plan.

| ADR | Title | Status |
|---|---|---|
| [ADR-001](ADR-001-tech-stack.md) | Tech Stack — Static Site, No Backend | Proposed |
| [ADR-002](ADR-002-hosting-and-deployment.md) | Hosting & Deployment — AWS Static Hosting via GitHub Actions | Proposed |
| [ADR-003](ADR-003-whatsapp-order-handoff.md) | Order Handoff — WhatsApp Click-to-Chat Link | Accepted |
| [ADR-004](ADR-004-content-management.md) | Menu & Content Management — Git-Managed, No CMS | Proposed |
| [ADR-005](ADR-005-installable-web-app.md) | Installable Web App (PWA), No Native App Store App | Proposed |
