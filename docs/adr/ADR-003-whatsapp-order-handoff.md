# ADR-003: Order Handoff — WhatsApp Click-to-Chat Link

**Status:** Accepted
**Date:** 2026-08-15

## Context

The client wants completed orders sent to the bakery's WhatsApp number,
with the customer able to continue that same conversation for
customization (see requirements #3–4). No online payment is involved —
payment happens at the store or on delivery, arranged over WhatsApp as it
is today.

There are two materially different ways to get an order into WhatsApp:

**A — WhatsApp Business Platform (Cloud API).** The server pushes the
message to the bakery's WhatsApp automatically, no customer action
needed. This requires Meta Business verification, a dedicated registered
phone number, pre-approved message templates, and per-conversation fees —
ongoing costs and setup complexity disproportionate to this project's
budget, and it also requires a backend to make the API call, which
[ADR-001](ADR-001-tech-stack.md) specifically avoided.

**B — a `wa.me` click-to-chat link.** The site builds a pre-filled
message from the cart and opens `https://wa.me/<bakery-number>?text=...`
in the customer's own WhatsApp. The customer's final tap is hitting
"send" themselves.

This was presented to the client as an explicit cost/complexity
trade-off, and **the client chose Option B.**

## Decision

Use a **`wa.me` click-to-chat link**, built entirely client-side:

- **The order summary follows a fixed template, not an ad hoc format:**

  ```
  Order from the Cake Lake website 🎂

  1. Chocolate Truffle Cake (Large, Chocolate) x1 — "Happy Birthday Sarah"
  2. Vanilla Cupcake Box of 6 x2
  3. Red Velvet Slice x3

  Delivery (AED 25)
  Needed: Tomorrow, Aug 22
  Total: AED 245

  Sent via the website
  ```

  One line per item always — name, options, quantity, and the
  inscription (if any) appended on the same line rather than a separate
  one, so a realistic order (6–8 items) stays well within a safe,
  readable length without needing truncation logic. Fulfillment,
  when-needed, and total each get their own line, since those are what
  the bakery needs to act on first. Exact wording (the emoji, "Sent via
  the website") is easy to adjust later — it's a string template, not
  an architectural choice.
- **What to write on the cake — asked per item, on Item Detail, not
  the Cart.** A short free-text field, optional, asked when the
  customer is choosing that specific cake — not once for the whole
  order. Left blank, it's simply omitted for that item. Each item's
  inscription (if any) is shown on its Cart line alongside its other
  details, so it stays visible for review before "Place Order," not
  hidden until it reaches WhatsApp.
- The Cart screen collects one more thing before "Place Order" is
  enabled:
  - **When needed — required.** A date field with presets (Today /
    Tomorrow / Pick a date), plus a "Not sure yet — I'll confirm on
    WhatsApp" option. **This field enforces lead time, not just asks
    for a date.** If any item in the cart has a `leadTimeHours`
    requirement (see [ADR-004](ADR-004-content-management.md)), dates
    that fall short of it are disabled rather than just flagged — e.g.
    a 72-hour item greys out "Today" and "Tomorrow" — so the order can't
    be composed with a date the bakery can't actually meet.
- Placing the order opens `https://wa.me/<bakery-number>?text=<encoded
  summary>` — this pre-fills the message in the customer's WhatsApp app;
  the customer sends it themselves.
- **Desktop gets a different handoff than mobile.** On mobile, the
  `wa.me` link opens the native app directly. On desktop, the same link
  is shown as a **QR code** instead of a button — scanning it with a
  phone opens the pre-filled chat there, since a `wa.me` link on desktop
  otherwise routes through WhatsApp Web, which only works if that
  browser is already paired with the customer's phone (often it isn't).
  A smaller secondary "Or open WhatsApp Web" link remains for anyone who
  does have it set up.
- No WhatsApp Business Platform/Cloud API integration, no message
  templates, no Meta Business verification, no backend call.
- **No Name field.** The bakery already sees who's messaging them once
  the order lands in WhatsApp.
- **Prices and totals are shown plainly, not labeled "estimate."** Menu,
  Item Detail, and Cart all show real catalog prices — there's nothing
  estimated about them. One disclaimer appears near the Cart total only:
  "Prices reflect the menu as shown. If you add a cake message or
  request changes, the bakery will confirm final pricing with you on
  WhatsApp." It isn't repeated on every line item.
- **Pickup vs. delivery stays on the Cart screen, because delivery
  changes the price.** Pickup is free; delivery adds a **flat fee** as
  its own line in the total — chosen over a zone-based structure to
  keep the total showable immediately, with no zone-selection step
  blocking it first. If the client's actual delivery costs vary enough
  by area that a flat fee stops making sense, that's revisitable later
  as a data change, not a redesign. If any item in the cart is flagged
  as requiring delivery (see
  [ADR-004](ADR-004-content-management.md)'s catalog data), Pickup isn't
  offered as a choice for that order at all — Delivery is the only
  option, with a short note explaining why.

## Rationale

**Zero cost, zero backend, chosen by the client.** This needs no ongoing
per-message fee, no API credentials, no server to hold them — it's a
plain link generated in the browser, consistent with
[ADR-001](ADR-001-tech-stack.md)'s no-backend approach.

**It naturally satisfies the customization requirement too.** Once the
order lands in the bakery's WhatsApp, the customer is already in the
exact chat thread they'd use to discuss customization — no separate
in-app messaging feature is needed to connect the two.

**The one thing given up is worth it here.** Unlike Option A, this isn't
fully automatic — the customer has to tap send. Given the bakery already
manages every order as a real WhatsApp conversation (today, entirely by
hand), one extra tap to get there isn't a meaningful loss, and it's
arguably a better fit for a business that wants to talk to the customer
right after the order lands anyway.

## Consequences

- No ongoing WhatsApp API costs, no Meta Business verification, no
  message template approval process
- The order only reaches the bakery if the customer actually sends the
  pre-filled message — if they close WhatsApp without sending, the order
  never arrives. This is a known trade-off of Option B, not a bug to fix
- **No truthful end state — the site cannot detect whether the message
  was actually sent.** Resolved as: on mobile, when the browser tab
  regains focus after WhatsApp opens, prompt the customer directly —
  "Did you send your order?" with **"Yes, sent it"** (clears the cart,
  shows a brief acknowledgement) or **"No, take me back to my cart"**
  (returns to the Cart screen with everything intact). This is the one
  honest signal available, since there's no server-side confirmation to
  rely on.
- **The mobile confirmation mechanism doesn't work on desktop.** The
  focus/visibility-regained trigger assumes the same device opens
  WhatsApp and comes back — but on desktop, the *phone* sends the
  message via the QR code above, so the laptop's browser tab never loses
  focus at all. Desktop instead shows an explicit, manually-clicked
  **"I've sent it" / "Not yet"** pair with the same two outcomes,
  triggered by the customer's own click rather than a focus event.
- **Cart persistence for returning visitors:** if the customer leaves
  without answering that prompt, the pending order is kept as a
  recoverable snapshot for **2 hours**, then treated as abandoned. A
  visit inside that window resumes the cart as left; a visit after it
  starts with an empty cart rather than surfacing a stale order.
- **A different, longer expiry applies when the customer explicitly
  taps "No, take me back to my cart."** That's a deliberate choice to
  keep shopping, not an unanswered prompt — treating it the same as the
  2-hour case above would be too aggressive for someone who fully
  intends to come back later that day or the next. The cart survives
  **24 hours** in that case. Past that, it clears to a plain empty-cart
  state (not an error) rather than surfacing items with a "when needed"
  date that may have already passed.
- The bakery's number needs to be a live WhatsApp number configured to
  receive customer messages — no separate "automated messaging" number is
  needed, since nothing sends automatically
- There's no server-side order record — the order lives in the WhatsApp
  conversation itself, same as today. If the business ever wants a
  record independent of WhatsApp, that's a new requirement with its own
  design, not something this ADR covers
- The message text needs to stay within WhatsApp's URL length practical
  limits — keep the order summary concise (items, quantities, options),
  not a full formatted invoice
- **"When needed" is required to avoid a round-trip.** Unlike a cake
  message, this is fulfillment-critical — the bakery can't confirm
  feasibility (same-day capacity, lead time for a custom cake) without
  it. Leaving it as a blank in the pre-filled message risked customers
  sending it unfilled, recreating the exact back-and-forth the handoff
  is meant to avoid — so it's collected on the Cart screen instead.
- **Lead time is enforced, not just displayed, for the same reason.**
  Showing "requires 72 hours notice" as text and still letting the
  customer pick "Today" doesn't prevent the round-trip — it just moves
  the discovery to after the message is sent. Disabling infeasible
  dates outright catches it at the one point the customer can still
  easily change their mind (before sending), consistent with how
  `requiresDelivery` removes Pickup rather than just warning about it.
- **The cake-message field must never be inferred from the customer's
  WhatsApp identity.** Any family member can place an order, and the
  name that belongs on the cake is very often not the orderer's own
  name (a parent ordering for a child, a spouse for a partner, etc.) —
  the sender's WhatsApp profile name has no reliable relationship to
  what should be written on the cake, so it's always asked directly and
  never defaulted or guessed.
- **Corrected from an earlier round: the cake message started as one
  order-level field on the Cart screen, not per-item.** That broke down
  for a two-cake order — one field can't hold two different
  inscriptions for two different cakes. Moved to Item Detail, per item,
  which handles both the single- and multi-cake case correctly; the
  order-level version is no longer part of this design.
- **Without a checkout step, the site's total and the bakery's final
  price can genuinely disagree** — but only when something beyond the
  listed menu changes (an add-on, a customization request). Labeling
  every price "estimate" would undersell prices that are actually
  correct. Resolved by keeping prices confident everywhere, and scoping
  the one disclaimer specifically to the cake-message/customization path
  that's the actual source of any difference — not a general hedge on
  the site's own math.
- **The mobile/desktop cart breakpoint is a build detail worth testing,
  not assuming.** A portrait tablet has enough width for the desktop
  right-column treatment, so the switch should be tested at both 768px
  and 1024px rather than defaulting to 1024px for every device wider
  than a phone — the goal is tablets getting whichever layout actually
  looks right at that width, decided empirically during build, not
  picked in advance here.
- **Marking an item sold out in real time (not just via a commit and
  redeploy) is still an open question, not decided.** See the same-day-
  sellout question in [requirements.md](../requirements/requirements.md)
  — if the client confirms this happens routinely, the minimum-cost
  answer is one small serverless function writing a live overlay file
  read by the site client-side, not a running server or a database.
  Not building this until that's confirmed needed.
- **An item can go sold out while sitting in a returning customer's
  saved cart** (the 2-hour or 24-hour persistence above). Resolved the
  same way as every other infeasible-order case in this ADR: the item's
  Cart row shows the same "Sold out" treatment as Menu/Item Detail
  (see [ADR-004](ADR-004-content-management.md)'s `available` flag),
  **"Place Order" is disabled while it's present**, and the row gets a
  one-tap **"Remove"** action rather than making the customer hunt for
  the problem item. Letting it through and leaving the bakery to catch
  it in chat was considered and rejected — see Alternatives.

## Alternatives Considered

**WhatsApp Business Platform (Cloud API) — Option A**
Fully automatic, no customer action needed. Rejected on cost and
complexity grounds — the client, once shown the trade-off explicitly,
chose the free, no-backend option instead. Worth revisiting only if order
volume grows enough that "customer might not hit send" becomes a real
business problem, and the ongoing API cost becomes affordable relative to
that.

**Email instead of WhatsApp**
Would avoid the "customer must send it themselves" step (server-sent
email is straightforward and near-free via a service like SES). Rejected
because the client's whole existing relationship and workflow with
customers is on WhatsApp, not email — moving order intake to email would
be a bigger process change for the business than the website itself.

**Leaving "when needed" and the cake message as blanks in the pre-filled
message, for the customer to fill in themselves**
Zero additional UI. Rejected for "when needed" specifically — it's the
one piece of information that determines whether the bakery can even
take the order, and an unfilled blank just moves the round-trip from
"the site asks" to "the bakery asks after the fact," which is worse.
Kept as the actual approach for anything beyond a short cake message
(photos, detailed design requests) — those still belong in the WhatsApp
conversation, not a form field.

**A single order-level cake-message field (the original design)**
Simpler — one field, asked once on the Cart screen. Rejected once a
two-cake order was considered: one message can't represent two different
inscriptions for two different cakes in the same order, so this was
corrected to a per-item field on Item Detail instead.

**Auto-filling the cake message (or a "Name") from the customer's
WhatsApp profile name**
Would save the customer a step. Rejected — the orderer and the name that
belongs on the cake are frequently different people, so this would
actively produce wrong output rather than just being unnecessary.

**Labeling all prices "estimate," or showing no totals at all**
Both were raised as ways to hedge against the site's total ever
disagreeing with the bakery's final price. Rejected — most orders never
involve anything that changes the price, so both options would
undersell accurate numbers for every customer to hedge against the
minority case. A single, specifically-scoped disclaimer on the Cart
total does the same job without that cost.

**Showing the same "Open WhatsApp" button on desktop as mobile**
Simpler — one component for every device. Rejected: on desktop this
silently assumes WhatsApp Web is already paired with the customer's
phone, which is frequently not true, leading to a dead end (WhatsApp
Web's own login QR, unrelated to the order) instead of a working
handoff. The QR-code alternative sidesteps that assumption entirely by
routing through the phone's already-logged-in WhatsApp instead.

**Always negotiating delivery over WhatsApp chat, with no pickup/delivery
choice or delivery line on the site**
Would remove a field from the Cart screen. Rejected — delivery genuinely
changes the price (pickup is free), so leaving it out would mean every
delivery order under-shows its actual total, which is worse than the
"estimate" labeling problem this same ADR already resolved above.

**Letting customers choose Pickup for items that require delivery**
Simpler UI — one fulfillment choice, no per-item exceptions. Rejected:
this isn't a negotiable preference the way "when needed" sometimes is —
a large or custom cake needing on-site installation isn't safe or
sensible to hand over for the customer to transport themselves, so it's
resolved on the site rather than left for the bakery to catch and
correct after the fact.

**Displaying lead time as informational text only, without disabling
infeasible dates**
Simpler to build — no cross-referencing the cart against each item's
`leadTimeHours`. Rejected for the same reason "when needed" is required
in the first place: a customer can easily miss or ignore text next to a
date field that still lets them pick that date, recreating the
round-trip this ADR already spent effort avoiding elsewhere.

**Zone-based delivery pricing**
More accurate to actual delivery cost by area. Not chosen for now — it
needs a zone-selection question answered before the total can even be
shown, more UI and more content to maintain (a full zone table) for a
single small shop's delivery area. A flat fee gets a showable total
immediately; revisit only if the client's real delivery costs vary
enough by area to make a flat number actively misleading.

**Treating the "No, take me back to my cart" case the same as the
2-hour unanswered-prompt case**
Simpler — one expiry rule instead of two. Rejected: the two situations
mean different things. Not answering the prompt at all is ambiguous;
explicitly choosing to keep shopping is a clear signal the customer
intends to come back, so it gets a longer, more forgiving window (24
hours vs. 2).

**A running server + database to support real-time sold-out toggling**
Would make every one of these six items solvable the same way, plus
open the door to anything else that needs live state later. Rejected
for now — only one of the six actually needs anything beyond static
content, and even that one is unconfirmed as a real need. Reintroducing
always-on compute and a database to solve a single boolean toggle would
be paying for exactly the kind of ongoing cost this whole project has
been built to avoid. If live toggling turns out to be needed, a single
serverless function writing to a small overlay file is the minimum
viable version — see Consequences above.

**Letting a now-sold-out item in a saved cart go through to WhatsApp,
leaving the bakery to catch and correct it in chat**
Zero additional UI. Rejected — this is the exact round-trip pattern
`requiresDelivery` and `leadTimeHours` enforcement were already built to
avoid; there's no reason to make an exception for sold-out items sitting
in a stale cart when the site already knows the item is unavailable.
