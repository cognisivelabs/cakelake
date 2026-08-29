"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

export type InstallPlatform = "none" | "ios" | "android";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandalone(): boolean {
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
}

function isIOSDevice(): boolean {
  const ua = window.navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function isIOSSafari(): boolean {
  const ua = window.navigator.userAgent;
  // Chrome/Firefox/Edge on iOS all render with WebKit but can't install
  // to the home screen the way Safari can (ADR-005) — exclude them.
  return isIOSDevice() && !/CriOS|FxiOS|EdgiOS|OPiOS|mercury/i.test(ua);
}

// Static export prerenders this with no window, so the client's first paint
// has to match that (nothing) — only reveal real platform state once
// mounted in the browser, matching the CartContext hydration pattern.
function useIsClient(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

/**
 * Shared install-eligibility detection and trigger, used by both the
 * floating InstallPrompt card and the hamburger menu's permanent
 * "Add to Home Screen" entry — each owns its own visibility/dismissal
 * UI on top of this.
 */
export function useInstallPrompt() {
  const isClient = useIsClient();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    }

    function handleAppInstalled() {
      setInstalled(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  if (!isClient || installed || isStandalone()) {
    return {
      platform: "none" as InstallPlatform,
      triggerInstall: async () => "unavailable" as const,
    };
  }

  const platform: InstallPlatform = deferredPrompt ? "android" : isIOSSafari() ? "ios" : "none";

  async function triggerInstall(): Promise<"accepted" | "dismissed" | "unavailable"> {
    if (!deferredPrompt) return "unavailable";
    const prompt = deferredPrompt;
    setDeferredPrompt(null);
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    return outcome;
  }

  return { platform, triggerInstall };
}
