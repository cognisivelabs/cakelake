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
