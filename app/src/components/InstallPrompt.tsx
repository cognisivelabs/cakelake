"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import styles from "./InstallPrompt.module.css";

const DISMISSED_KEY = "cakelake-install-dismissed";

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
// has to match that (nothing) — only reveal real platform/dismissal state
// once mounted in the browser, matching the CartContext hydration pattern.
function useIsClient(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function InstallPrompt() {
  const isClient = useIsClient();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [sessionDismissed, setSessionDismissed] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    }

    function handleAppInstalled() {
      window.localStorage.setItem(DISMISSED_KEY, "1");
      setSessionDismissed(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  function dismiss() {
    window.localStorage.setItem(DISMISSED_KEY, "1");
    setSessionDismissed(true);
  }

  async function handlePrimaryAction() {
    if (deferredPrompt) {
      const prompt = deferredPrompt;
      setDeferredPrompt(null);
      await prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === "accepted") {
        window.localStorage.setItem(DISMISSED_KEY, "1");
      }
      setSessionDismissed(true);
      return;
    }
    setShowSteps(true);
  }

  if (!isClient) return null;

  const platform: "none" | "ios" | "android" = deferredPrompt ? "android" : isIOSSafari() ? "ios" : "none";
  const dismissed =
    sessionDismissed || isStandalone() || window.localStorage.getItem(DISMISSED_KEY) === "1";

  if (dismissed || platform === "none") return null;

  return (
    <div className={styles.card}>
      <div className={styles.badge}>CL</div>
      <div className={styles.body}>
        <div className={styles.title}>Keep Cake Lake on your home screen</div>
        {platform === "ios" && showSteps ? (
          <ol className={styles.steps}>
            <li>
              Tap the <b>Share</b> icon in Safari&apos;s toolbar.
            </li>
            <li>
              Scroll down and tap <b>Add to Home Screen</b>.
            </li>
            <li>Tap Add.</li>
          </ol>
        ) : (
          <div className={styles.text}>
            {platform === "ios" ? (
              <>
                Tap <b>Share</b>, then <b>Add to Home Screen</b>. No app to install.
              </>
            ) : (
              <>Add Cake Lake to your home screen. No app to install.</>
            )}
          </div>
        )}
        {!showSteps && (
          <div className={styles.actions}>
            <button type="button" className={styles.primaryButton} onClick={handlePrimaryAction}>
              {platform === "android" ? "INSTALL" : "SHOW ME HOW"}
            </button>
            <button type="button" className={styles.dismissButton} onClick={dismiss}>
              Not now
            </button>
          </div>
        )}
        {showSteps && (
          <button type="button" className={styles.primaryButton} onClick={dismiss}>
            GOT IT
          </button>
        )}
      </div>
    </div>
  );
}
