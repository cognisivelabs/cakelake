repo: cognisivelabs/cakelake
branch: main

## Last sync

date: 2026-08-14T16:09:58Z

### Updated in this project

- Pulled 10 more placeholder photos (16 total) plus the updated `SOURCES.md` — mirrored at `docs/design/photos/` in the repo; every menu item now has a photo with its attribution.
- Removed **Naked Fruit Tier** from the menu in both prototypes, matching the item drop recorded in `SOURCES.md`.
- Built prototype v2 ("The Case" direction): photography-led catalogue, sticky category rail, deals strip, persistent order bar. Repo path: `prototype/Cake Lake Ordering Prototype v2.dc.html`.
- Three earlier layout directions (Counter, Order Rail, The Case) and three logo explorations (CL Cut Cake, Logo Options, Logo Redraw) kept for the record under `prototype/explorations/` — "The Case" is what v2 was built from; the others weren't picked.
- Reconciled to a **single shop** (Marina Walk); in-shop ordering is counter-only, no QR-at-table (counter QR still needs adding back per `docs/requirements/requirements.md`).

## Sync history

- 2026-08-14T15:45:33Z — first six placeholder photos wired into v2's photo slots.
- 2026-08-14T14:02:21Z — repo associated; read README + requirements to ground the prototype.

## Screen map

| Project screen (Cake Lake Ordering Prototype.dc.html) | Repo source |
|---|---|
| All screens — visual language, components | design-system/ (mirror of the bound Claude design system) |
| Photo slots (home, menu, product detail) | docs/design/photos/ (see docs/design/photos/SOURCES.md) |
| Home / hero, ordering channels | docs/requirements/requirements.md (confirmed scope 1–6) |
| Menu, product detail, custom cake builder | docs/requirements/requirements.md (catalogue — open question); design-system/ui_kits/cakelake-site/data.jsx |
| Offers | docs/requirements/requirements.md (offer types — open question) |
| Cart, checkout, confirmation | docs/requirements/requirements.md (payments: Telr/PayTabs pending; Tabby unconfirmed) |
| Track order | docs/requirements/requirements.md (live pickup status — signature feature) |
| Locations | docs/requirements/requirements.md (single store today, store-scoped model) |
| WhatsApp order drawer | README.md (client currently orders via WhatsApp Business) |
| Story, contact, corporate | Not in repo — authored in this project |

## Notes

- The 16 photos are Wikimedia Commons placeholders, not the client's own product photography — attributions render on each slot and must stay until real shots replace them. Any slot can be overridden by dropping a photo onto it.
- Two photos are flagged in `SOURCES.md` as approximate matches: Pistachio Rose Cups (no rose element) and Pistachio Shortbread (plain shortbread).

- `design-system/` in the repo is a read-only mirror; Claude Design is the source of truth.
- Repo `app/` is intentionally empty — development starts after prototype sign-off.
- Prototype content (prices, menu items, addresses) is still illustrative, not client-approved.
