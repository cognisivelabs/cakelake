"use client";

import { useState } from "react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import styles from "./InstallPrompt.module.css";

const DISMISSED_KEY = "cakelake-install-dismissed";

export function InstallPrompt() {
  const { platform, triggerInstall } = useInstallPrompt();
  const [sessionDismissed, setSessionDismissed] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  function dismiss() {
    window.localStorage.setItem(DISMISSED_KEY, "1");
    setSessionDismissed(true);
  }

  async function handlePrimaryAction() {
    if (platform === "android") {
      const outcome = await triggerInstall();
      if (outcome === "accepted") {
        window.localStorage.setItem(DISMISSED_KEY, "1");
      }
      setSessionDismissed(true);
      return;
    }
    setShowSteps(true);
  }

  if (platform === "none") return null;
  const dismissed = sessionDismissed || window.localStorage.getItem(DISMISSED_KEY) === "1";
  if (dismissed) return null;

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
