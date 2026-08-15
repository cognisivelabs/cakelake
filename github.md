repo: cognisivelabs/cakelake
branch: main

## Last sync

date: 2026-08-15T00:00:00Z

### Updated in this project

- **All four requested fixes from the consolidated Claude Design prompt landed, verified directly in the files:**
  1. Login OTP copy now says WhatsApp, not SMS/"texted" — `authSentKind`/`authSentTo` in v2.
  2. WhatsApp drawer's order-placing paths removed entirely — no `waSend`/`waReply`/`commitOrder('WhatsApp')` left in v2; the drawer only displays the two outbound notifications from [ADR-012](docs/adr/ADR-012-whatsapp-notifications.md).
  3. Checkout's "Confirm on WhatsApp" payment option removed.
  4. `payOptions` rebuilt: Apple Pay and Google Pay as separate options, manual card entry gone, in-person reads "Tap your card at the counter." Tabby untouched. See [ADR-006](docs/adr/ADR-006-payment-gateway.md).
- **Two bonus fixes, not explicitly asked for but the same underlying problem:** the hero's "Order on WhatsApp" CTA and the cart's "Send this cart on WhatsApp" `wa.me` deep link are both gone — both were alternate routes into placing an order over WhatsApp. A plain "Message the shop on WhatsApp" contact link remains, correctly (ordinary chat link, not an ordering path).
- **New, unrequested: admin Payments settings page** in `Cake Lake Admin.dc.html` (Owner-only, behind the `payments` permission already deferred per [ADR-011](docs/adr/ADR-011-admin-console.md)) — reasonable scope for that console, but its gateway picker (`GATEWAYS = {telr, paytabs}`) and payment-methods list are stale against [ADR-006](docs/adr/ADR-006-payment-gateway.md): PayTabs is actually correct again as of the 2026-08-15 gateway direction change, but Telr isn't one of the two live candidates (Stripe is, and it's missing), and the payment-methods list is missing Google Pay and still says "Cash at the counter." Flagged as a minor, non-blocking discrepancy — see requirements.md.
- **Payment gateway direction changed same day (2026-08-15, chat):** client confirmed the online gateway will be Stripe or PayTabs, final pick pending — ADCB dropped as a website-gateway candidate, stays in-person-only. See [ADR-006](docs/adr/ADR-006-payment-gateway.md) (rewritten as Round 5).

### Flagged for confirmation, not auto-accepted (see requirements.md)

- Wallet-only checkout (Apple Pay/Google Pay, no card-entry fallback) still an open UX question — Claude Design weighed in this round that it risks stranding desktop customers with no compatible wallet, and suggested pricing a hosted card-entry page before committing. Not yet decided either way.
- The new admin Payments settings page's stale gateway options (above) — low priority since it's behind the deferred role system, but worth a fix pass.

## Sync history

- 2026-08-15T00:00:00Z — OTP-copy, WhatsApp-ordering, and checkout payment-method fixes confirmed landed; new Payments settings page flagged as a stale-data discrepancy.
- 2026-08-14T18:18:00Z — WhatsApp notifications, counter QR, account/guest checkout, Track Order fix, logo redraw, admin console (first pass).
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
| Cart, checkout, confirmation | docs/requirements/requirements.md (req #7 account/guest; req #4 payments: Stripe or PayTabs, final pick pending, Apple Pay/Google Pay only; Tabby unconfirmed) |
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
