import type { SyntheticEvent } from "react";

// Raw root-relative paths (e.g. catalog image URLs) don't go through
// Next's own asset pipeline, so they don't get the GitHub Pages basePath
// prefixed automatically the way next/link or next/image would — same
// issue solved for the service worker registration.
export function withBasePath(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}

// Every catalog/flavour <img> falls back to the plain placeholder box
// behind it on a broken/missing image — hiding the element directly via
// the DOM (not React state) is deliberate: React never re-renders this
// node just to retry a broken src, so nothing would ever clear the
// hidden state on its own otherwise.
export function hideBrokenImage(e: SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.display = "none";
}
