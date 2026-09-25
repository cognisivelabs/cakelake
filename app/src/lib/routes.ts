// Every internal route path in one place — a typo like "/Menu" used to
// be possible in 15+ call sites with no compiler check catching it.
export const ROUTES = {
  home: "/",
  menu: "/menu",
  cart: "/cart",
  contact: "/contact",
} as const;

/** An individual catalog item's page — /menu/<id>. Kept as a function
 * (not a flat ROUTES entry) since it needs the id; still routes through
 * ROUTES.menu rather than a second hardcoded "/menu". */
export function itemRoute(itemId: string): string {
  return `${ROUTES.menu}/${itemId}`;
}

/** The menu focused on one category — /menu?category=<categoryId>.
 * Mobile scrolls to that category's section; desktop's category rail
 * pre-selects it. A search param (not a hash) so a soft navigation from
 * a link while already on /menu is observable and updates the page. */
export function categoryRoute(categoryId: string): string {
  return `${ROUTES.menu}?category=${categoryId}`;
}

/** The menu filtered to a flavour tag — /menu?flavour=<flavourTagId>. */
export function flavourRoute(flavourTagId: string): string {
  return `${ROUTES.menu}?flavour=${flavourTagId}`;
}

/** The menu filtered to an occasion — /menu?occasion=<occasionId>. */
export function occasionRoute(occasionId: string): string {
  return `${ROUTES.menu}?occasion=${occasionId}`;
}

/** The menu with a search pre-filled — /menu?q=<text>. */
export function searchRoute(query: string): string {
  return `${ROUTES.menu}?q=${encodeURIComponent(query)}`;
}
