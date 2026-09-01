"use client";

import { useState } from "react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { STORAGE_KEYS } from "@/lib/storageKeys";
import { safeGetItem, safeSetItem } from "@/lib/safeStorage";
import { INSTALL_STEPS } from "@/components/installSteps";
import styles from "./InstallPrompt.module.css";

const DISMISSED_KEY = STORAGE_KEYS.installDismissed;

export function InstallPrompt() {
  const { platform, triggerInstall } = useInstallPrompt();
  const [sessionDismissed, setSessionDismissed] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  function dismiss() {
    safeSetItem(DISMISSED_KEY, "1");
    setSessionDismissed(true);
  }

  async function handlePrimaryAction() {
    if (platform === "android") {
      const outcome = await triggerInstall();
      if (outcome === "accepted") {
        safeSetItem(DISMISSED_KEY, "1");
      }
      setSessionDismissed(true);
      return;
    }
    setShowSteps(true);
  }

  if (platform === "none") return null;
  const dismissed = sessionDismissed || safeGetItem(DISMISSED_KEY) === "1";
  if (dismissed) return null;

  return (
    <div className={styles.card}>
      <div className={styles.badge}>CL</div>
      <div className={styles.body}>
        <div className={styles.title}>Keep Cake Lake on your home screen</div>
        {showSteps && (platform === "ios" || platform === "android-manual") && (
          <ol className={styles.steps}>
            {INSTALL_STEPS[platform].map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        )}
        {!showSteps && (
          <div className={styles.text}>
            {platform === "ios" && (
              <>
                Tap <b>Share</b>, then <b>Add to Home Screen</b>. No app to install.
              </>
            )}
            {platform === "android-manual" && (
              <>
                Tap your browser&apos;s <b>⋮</b> menu, then <b>Add to Home screen</b>. No app to
                install.
              </>
            )}
            {platform === "android" && <>Add Cake Lake to your home screen. No app to install.</>}
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
