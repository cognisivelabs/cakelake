repo: cognisivelabs/cakelake
branch: main

## Last sync

date: 2026-08-14T14:02:21Z

### Updated in this project

- Read the repo's planning docs (README, requirements) to ground the prototype.
- Reconciled to a **single shop** (Marina Walk) — dropped the mockup's two live + two "opening 2026" branches, per requirements.
- Removed QR-code-at-table ordering from the UI; in-shop ordering is now counter-only.
- Order flow prototype covers catalogue, offers, cart, checkout, live pickup tracker, WhatsApp Business ordering.

## Screen map

| Project screen (Cake Lake Ordering Prototype.dc.html) | Repo source |
|---|---|
| All screens — visual language, components | design-system/ (mirror of the bound Claude design system) |
| Home / hero, ordering channels | docs/requirements/requirements.md (confirmed scope 1–6) |
| Menu, product detail, custom cake builder | docs/requirements/requirements.md (catalogue — open question) |
| Offers | docs/requirements/requirements.md (offer types — open question) |
| Cart, checkout, confirmation | docs/requirements/requirements.md (payments: Telr/PayTabs pending; Tabby unconfirmed) |
| Track order | docs/requirements/requirements.md (live pickup status — signature feature) |
| Locations | docs/requirements/requirements.md (single store today, store-scoped model) |
| WhatsApp order drawer | README.md (client currently orders via WhatsApp Business) |
| Story, contact, corporate | Not in repo — authored in this project |

## Notes

- `design-system/` in the repo is a read-only mirror; Claude Design is the source of truth.
- Repo `app/` is intentionally empty — development starts after prototype sign-off.
- Prototype content (prices, menu items, addresses) is still illustrative, not client-approved.
