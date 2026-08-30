// Raw root-relative paths (e.g. catalog image URLs) don't go through
// Next's own asset pipeline, so they don't get the GitHub Pages basePath
// prefixed automatically the way next/link or next/image would — same
// issue solved for the service worker registration.
export function withBasePath(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
