# ADR-006: Data Access Through an Internal API

**Status:** Proposed
**Date:** 2026-09-30

## Context

Catalogue and banner content lives in data files in the repository
(see [ADR-004](ADR-004-content-management.md)). A backend with a real
HTTP API is expected later, and the app should be able to switch to it
without rewriting its screens. Screens and components reading the data
files directly, or through synchronous helpers, would each need
changing when the data starts coming over the network.

## Decision

**All catalogue and banner data is read through an internal API in
`app/src/api/`.** Each function stands in for one backend endpoint,
returns a Promise, and is the only code that imports the catalogue and
banner files in `app/src/data/`:

- `fetchCategories()`, `fetchItems()`, `fetchItem(slug)`,
  `fetchOccasions()`, `fetchFlavourTags()`, and `fetchCatalog()` for
  all four together (`api/catalog.ts`)
- `searchItems(filters)`: the items matching the menu's search text and
  its price, flavour and occasion filters (`api/catalog.ts`)
- `fetchBanners()` (`api/banners.ts`)

**The types in `app/src/types/` describe what the API returns:**
numeric ids and foreign keys, with a separate `slug` wherever a
readable URL is needed.

**Server components call the API; client components read a loaded
copy.** The root layout awaits `fetchCatalog()` and provides the
result through `CatalogProvider`; client components read it with
`useCatalog()`. The item page calls `fetchItems()` and `fetchItem()`,
Home calls `fetchBanners()`, and the menu shows the results of
`searchItems()`, showing every item until the first answer arrives.

**Everything else works on data it is given.** Lookups, labels, search,
filters, menu groups, pricing and order logic in `app/src/lib/` take the
catalogue (or its items) as an argument and never load data themselves.

## Rationale

**Switching to a real backend is a change in one folder.** Replacing a
function body in `app/src/api/` with a `fetch()` call leaves its callers
unchanged, because they already await a Promise of the same type.

**The API's shape is fixed before the backend exists.** The endpoint
list and types are the contract the backend has to meet.

**One load per build.** The site is a static export
([ADR-001](ADR-001-tech-stack.md)), so server components run at build
time and the catalogue is loaded once and passed down, not read
separately by each screen.

## Consequences

- With a real API, the catalogue is fetched when the site is built;
  menu and price changes appear after a rebuild, as they do with data
  files today
- Data that must update without a rebuild (for example an item selling
  out) would need a fetch in the browser; that change is contained to
  `app/src/api/` and `CatalogProvider`
- Components that read the catalogue are client components, since they
  use `useCatalog()`
- The filter panel's counts ("Biscoff (3)") are still worked out in the
  browser from the loaded catalogue, not returned by `searchItems()`; a
  backend search would need to return them too, or the site keeps
  loading the full catalogue for them
- The menu calls `searchItems()` on every change, including each step of
  the price slider; a network-backed version would need debouncing
- `app/src/data/imageConfig.ts` (photo framing) is presentation
  configuration, not API data, and is read directly by `lib/imageConfig.ts`
