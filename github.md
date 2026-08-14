repo: cognisivelabs/cakelake
branch: main

## Last sync

date: 2026-08-14T18:18:00Z

### Updated in this project

- **New: WhatsApp order notifications** (req #10) — v2's WhatsApp drawer now sends exactly two automated messages per order: a receipt when placed, a "ready" nudge when staff mark the order ready. Capped at two by design — see `waNotify()`/`receiptText()`/`readyText()` in v2 and [ADR-012](docs/adr/ADR-012-whatsapp-notifications.md).
- **Counter QR restored** (req #6): in-shop "scan and skip the queue" flow on the home ordering channels and the Visit screen. Leaflet QR deliberately left out — design deferred per the requirements doc.
- **Account vs guest checkout added** (req #7): guest collects an email for the tracking link; account uses mobile-or-email with a one-time code, then keeps order history.
- **Track Order discrepancy fixed**: trackable orders are now filtered to live + upcoming only, never collected/delivered. Added a scheduled sample order and an empty state pointing at account history. Same filter applied to v1.
- Logo redrawn from the client's own artwork and used in both prototypes' headers/footers; the order tracker now assembles that mark tier by tier as stages complete.
- **New: admin console** (req #9) — `prototype/Cake Lake Admin.dc.html`. Catalogue CRUD, offers CRUD, an invite-based team/roles system (Owner / Catalogue manager / Counter staff), and an activity log. Doesn't yet include an orders view or the metrics view.

### Flagged for confirmation, not auto-accepted (see requirements.md)

- OTP login is mobile-**or**-email, not mobile-only as ADR-005 originally decided — reopens the "no SMS/OTP cost" assumption for the mobile-OTP path.
- Admin console scope (roles, invites, audit log) goes beyond the original catalogue/offers CRUD ask in requirement #9.
- WhatsApp notification scope is intentionally limited to two messages (no full in-chat ordering) — see ADR-012's open question on whether the client's existing WhatsApp number gets migrated to the API or a second number is used.

## Sync history

- 2026-08-14T17:07:50Z — counter QR restored, Track Order fixed, admin console added, logo redrawn.
- 2026-08-14T16:09:58Z — 10 more photos (16 total); Naked Fruit Tier removed from the menu.
- 2026-08-14T15:45:33Z — first six placeholder photos wired into v2's photo slots.
- 2026-08-14T14:02:21Z — repo associated; read README + requirements to ground the prototype.

## Screen map

| Project screen | Repo source |
|---|---|
| All screens — visual language, components | design-system/ (mirror of the bound Claude design system) |
| Photo slots (home, menu, product detail) | docs/design/photos/ (see docs/design/photos/SOURCES.md) |
| Home / hero, ordering channels | docs/requirements/requirements.md (confirmed scope 1–6) |
| Menu, product detail, custom cake builder | docs/requirements/requirements.md (catalogue — open question); design-system/ui_kits/cakelake-site/data.jsx |
| Offers | docs/requirements/requirements.md (offer types — open question) |
| Cart, checkout, confirmation | docs/requirements/requirements.md (req #7 account/guest; req #4 payments: ADCB gateway, Apple Pay/Google Pay only; Tabby unconfirmed) |
| Counter QR panel (home, Visit) | docs/requirements/requirements.md (req #6 counter QR) |
| Track order | docs/requirements/requirements.md (live pickup status; current + upcoming only) |
| Locations | docs/requirements/requirements.md (single store today, store-scoped model) |
| Admin console (`Cake Lake Admin.dc.html`) | docs/requirements/requirements.md (req #9); docs/adr/ADR-011-admin-console.md |
| WhatsApp order drawer + notifications | docs/requirements/requirements.md (req #10); docs/adr/ADR-012-whatsapp-notifications.md |
| Story, contact, corporate | Not in repo — authored in this project |

## Notes

- Both requirements-doc discrepancies from the previous sync are now resolved in v2 (counter QR restored, Track Order filtered). Leaflet QR remains undesigned by intent.
- Logo: the redrawn mark lives in the prototypes only. The repo mirror's `design-system/assets/logo-mark.svg` and the DS `OrderTracker` illustration still carry the old three-bar mark — changing those means editing the design system itself, not this prototype.
- Admin console auth uses the same one-time-code mechanism as customer login, but against a completely separate `team` collection/identity space — never the same session as a customer account.

- The 16 photos are Wikimedia Commons placeholders, not the client's own product photography — attributions render on each slot and must stay until real shots replace them. Any slot can be overridden by dropping a photo onto it.
- Two photos are flagged in `SOURCES.md` as approximate matches: Pistachio Rose Cups (no rose element) and Pistachio Shortbread (plain shortbread).

- `design-system/` in the repo is a read-only mirror; Claude Design is the source of truth.
- Repo `app/` is intentionally empty — development starts after prototype sign-off.
- Prototype content (prices, menu items, addresses) is still illustrative, not client-approved.
