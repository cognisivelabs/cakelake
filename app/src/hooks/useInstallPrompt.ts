"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { INSTALL_PROMPT_EVENT, APP_INSTALLED_EVENT } from "@/lib/installEvents";

export type InstallPlatform = "none" | "ios" | "android" | "android-manual";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface Window {
    // Stashed by the beforeInteractive script in layout.tsx — Android can
    // fire beforeinstallprompt before this hook's own listener attaches,
    // and a missed event can't be replayed later.
    __cakelakeInstallPrompt?: BeforeInstallPromptEvent | null;
  }
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

function isAndroidDevice(): boolean {
  return /Android/i.test(window.navigator.userAgent);
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
      window.__cakelakeInstallPrompt = event as BeforeInstallPromptEvent;
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    }

    function handleAppInstalled() {
      window.__cakelakeInstallPrompt = null;
      setInstalled(true);
    }

    window.addEventListener(INSTALL_PROMPT_EVENT, handleBeforeInstallPrompt);
    window.addEventListener(APP_INSTALLED_EVENT, handleAppInstalled);
    return () => {
      window.removeEventListener(INSTALL_PROMPT_EVENT, handleBeforeInstallPrompt);
      window.removeEventListener(APP_INSTALLED_EVENT, handleAppInstalled);
    };
  }, []);

  if (!isClient || installed || isStandalone()) {
    return {
      platform: "none" as InstallPlatform,
      triggerInstall: async () => "unavailable" as const,
    };
  }

  // Pick up an event the beforeInteractive script already caught before
  // this effect's own listener attached, in addition to one it hands us
  // live via setDeferredPrompt above.
  const activePrompt = deferredPrompt ?? window.__cakelakeInstallPrompt ?? null;
  const platform: InstallPlatform = activePrompt
    ? "android"
    : isIOSSafari()
      ? "ios"
      : isAndroidDevice()
        ? "android-manual"
        : "none";

  async function triggerInstall(): Promise<"accepted" | "dismissed" | "unavailable"> {
    if (!activePrompt) return "unavailable";
    window.__cakelakeInstallPrompt = null;
    setDeferredPrompt(null);
    await activePrompt.prompt();
    const { outcome } = await activePrompt.userChoice;
    return outcome;
  }

  return { platform, triggerInstall };
}
