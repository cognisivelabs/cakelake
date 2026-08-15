# System Overview — Cake Lake Bakery

Lightweight by design — see [ADR-001](../adr/ADR-001-tech-stack.md)
through [ADR-005](../adr/ADR-005-installable-web-app.md) for the
reasoning behind each piece.

## 1. What exists

```
Customer's phone/browser
      |
      v
Static site (Next.js static export, TypeScript)
  - Menu / catalogue (read from repo content at build time)
  - Cart (held in the browser, not persisted anywhere)
  - Menu PDF download
  - Contact details
  - Installable as a PWA (manifest + service worker, ADR-005)
      |
      v (customer taps "Place Order")
wa.me click-to-chat link, pre-filled with the order summary
      |
      v (customer taps "send" in their own WhatsApp)
Bakery's WhatsApp — order confirmed and, if needed, customization
discussed, exactly as it works today
```

There is no server, no database, no API. The only "backend" behavior —
assembling the WhatsApp link from the cart — runs in the customer's
browser.

## 2. Order flow

1. Customer browses the menu on the static site.
2. Customer adds items (with options) to a cart, held in browser memory.
3. Customer taps "Place Order." The site formats the cart into a readable
   order summary and opens a `wa.me` link addressed to the bakery's
   WhatsApp number with that summary pre-filled ([ADR-003](../adr/ADR-003-whatsapp-order-handoff.md)).
4. Customer sends the pre-filled message themselves, from their own
   WhatsApp.
5. The bakery confirms the order and payment (at the store or on
   delivery) over that same WhatsApp conversation — unchanged from
   today's process.
6. Any customization (special messages, photos to print, etc.) is
   discussed in that same thread — no separate feature needed.

## 3. Content & deployment

1. Menu/catalogue content lives in structured files in this repo
   ([ADR-004](../adr/ADR-004-content-management.md)).
2. A content or code change is pushed to the main branch.
3. GitHub Actions builds the static site and syncs the output to S3,
   then invalidates the CloudFront cache ([ADR-002](../adr/ADR-002-hosting-and-deployment.md)).
4. The change is live within the pipeline's normal run time — no manual
   deployment step.

## 4. What's deliberately not here

Matching the ADRs and the approved requirements, these are explicitly out
of scope for this phase, not overlooked:

- No payment processing of any kind ([requirements.md](../requirements/requirements.md))
- No customer accounts, login, or order history
- No live order-status tracking on the site
- No admin dashboard — content changes go through a repo change request
  ([ADR-004](../adr/ADR-004-content-management.md))
- No WhatsApp Business Platform/API integration — order handoff is a
  customer-sent click-to-chat link only ([ADR-003](../adr/ADR-003-whatsapp-order-handoff.md))
- No native app-store app — the site is installable as a PWA instead
  ([ADR-005](../adr/ADR-005-installable-web-app.md))
- No backend, API, or database of any kind ([ADR-001](../adr/ADR-001-tech-stack.md))
