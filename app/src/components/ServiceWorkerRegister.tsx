"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    // Only the deployed site is an installable, offline-capable PWA. In
    // development a registered worker keeps serving a stale cached
    // bundle, so changes look like they didn't happen — drop any left
    // over from an earlier production build instead of registering one.
    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister()));
      return;
    }
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    navigator.serviceWorker.register(`${basePath}/sw.js`, { scope: `${basePath}/` });
  }, []);

  return null;
}
