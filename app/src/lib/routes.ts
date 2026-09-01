// Every internal route path in one place — a typo like "/Menu" used to
// be possible in 15+ call sites with no compiler check catching it.
export const ROUTES = {
  home: "/",
  menu: "/menu",
  cart: "/cart",
  contact: "/contact",
} as const;
