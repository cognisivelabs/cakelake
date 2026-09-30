// Every internal route path in one place — a typo like "/Menu" used to
// be possible in 15+ call sites with no compiler check catching it.
export const ROUTES = {
  home: "/",
  menu: "/menu",
  cart: "/cart",
  contact: "/contact",
} as const;

/** An individual catalog item's page — /menu/<item slug>. */
export function itemRoute(itemSlug: string): string {
  return `${ROUTES.menu}/${itemSlug}`;
}

/** The menu focused on one or more categories — /menu?category=<slug>,<slug>.
 * Mobile scrolls to the first one's section; desktop ticks them all in
 * the category filter. A search param (not a hash) so a soft navigation
 * from a link while already on /menu is observable and updates the page. */
export function categoriesRoute(categorySlugs: string[]): string {
  return `${ROUTES.menu}?category=${categorySlugs.join(",")}`;
}

/** The menu focused on a single category. */
export function categoryRoute(categorySlug: string): string {
  return categoriesRoute([categorySlug]);
}

/** The menu filtered to a flavour tag — /menu?flavour=<flavour tag slug>. */
export function flavourRoute(flavourTagSlug: string): string {
  return `${ROUTES.menu}?flavour=${flavourTagSlug}`;
}

/** The menu filtered to an occasion — /menu?occasion=<occasion slug>. */
export function occasionRoute(occasionSlug: string): string {
  return `${ROUTES.menu}?occasion=${occasionSlug}`;
}

/** The menu with a search pre-filled — /menu?q=<text>. */
export function searchRoute(query: string): string {
  return `${ROUTES.menu}?q=${encodeURIComponent(query)}`;
}
