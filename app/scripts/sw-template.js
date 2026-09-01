// Minimal, conservative service worker (ADR-005): cache the static build
// output for fast repeat loads and basic offline access, without risking
// stale content — pages always go to the network first.
//
// This file is a TEMPLATE — public/sw.js is generated from it by
// scripts/generate-sw.mjs, which fills in the version placeholder below
// with the current git commit (see that script for why: a version that
// doesn't change every deploy means the activate handler below never has
// anything to clean up, and the cache just grows forever).
const CACHE_VERSION = "cakelake-VERSION_PLACEHOLDER";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Pages: always try the network first so customers never see a stale
  // menu — cache is only a fallback for when they're offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Hashed static assets never change under a given filename, so they're
  // safe to serve from cache first.
  if (url.pathname.includes("/_next/static/")) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
            return response;
          })
      )
    );
  }
});
