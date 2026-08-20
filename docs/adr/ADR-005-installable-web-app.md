# ADR-005: Installable Web App (PWA), No Native App Store App

**Status:** Proposed
**Date:** 2026-08-15

## Context

The client asked whether they could have a mobile app. A native app
(iOS/Android, listed on the App Store/Google Play) is a real, recurring
cost — Apple Developer Program is $99/year alone, before accounting for
the extra build effort of a second codebase (or a cross-platform
framework) and going through app store review for every update. Given
the client's stated budget constraint, that cost is disproportionate to
what a single-shop bakery doing a modest volume of orders needs.

A Progressive Web App (PWA) gets most of what "having an app" means to a
customer — a home-screen icon, a full-screen app-like feel, no browser
chrome — as an extension of the same static site, at effectively no extra
cost.

## Decision

Build the site as an **installable PWA**:

- A web app manifest (icon, name, theme colour) so browsers offer "Add to
  Home Screen."
- A service worker that caches static assets (menu, images, app shell)
  for fast repeat loads and basic offline availability of static content.
- No native app, no App Store/Play Store listing, for this phase.

## Rationale

**This is what the client actually gets value from, for free.** The
practical thing a customer wants from "an app" — an icon on their home
screen, opening straight into the site without typing a URL — is exactly
what a PWA provides, built on top of the site that's being built anyway.

**A native app reintroduces the cost problem this whole project is
solving.** $99/year plus real additional build effort is the same shape
of ongoing expense the client said they can't carry — no different in
kind from the payment gateway costs already ruled out.

**Nothing here blocks a native app later.** If there's ever a concrete
reason to want app store presence (marketing visibility, push
notifications), that's a well-scoped future addition, not something this
decision forecloses.

## Consequences

- Needs an app icon set (multiple sizes) and a short manifest — a small,
  one-time addition to the build, not ongoing cost
- **The install prompt is not one experience — it's two, by platform
  constraint, not choice.** Android/Chromium browsers fire an
  install-capable event the site can hook a real **"Install"** button
  to, triggering the native install dialog in one tap. iOS Safari never
  fires that event — there is no API to trigger installation there at
  all — so the same banner's action opens **instructions** instead
  ("Tap the Share icon, then 'Add to Home Screen'"). The banner should
  not appear at all once the site is already installed, and is
  suppressed on platforms that can do neither (e.g. iOS Chrome, which
  inherits the same WebKit restriction as iOS Safari).
- The service worker's asset-caching strategy needs to be simple and
  conservative (cache static assets, not any dynamic behaviour — there
  isn't any) to avoid customers seeing stale menu content after an update
- No push notifications, no background sync, no app-store discoverability
  — all real limitations of the PWA approach the client should be aware
  of, distinct from what a native app would offer
- If the client later wants a real app-store app, that's new scope with
  its own cost (developer program fees, cross-platform or native build,
  ongoing store maintenance) — not an incremental change to this decision

## Alternatives Considered

**A native app (iOS/Android), via a cross-platform framework**
Would give real app-store presence and access to native APIs (push
notifications, etc.). Rejected for this phase strictly on cost — see
Context. Documented here as the clear upgrade path if the business
outgrows the PWA's limitations.

**No mobile-specific treatment at all — a plain responsive website**
Simplest possible option, and would still satisfy the mobile-friendly
requirement on its own. Not chosen because it leaves real value on the
table (the home-screen-icon, app-like feel) for effectively no extra
cost — the PWA layer is cheap enough that skipping it isn't actually
saving anything meaningful.
