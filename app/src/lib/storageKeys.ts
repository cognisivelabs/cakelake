// Every localStorage key the site uses, in one place — so a new feature
// picks a consistent name instead of inventing its own "cakelake-*" scheme.
export const STORAGE_KEYS = {
  cart: "cakelake-cart-v3",
  installDismissed: "cakelake-install-dismissed",
} as const;
