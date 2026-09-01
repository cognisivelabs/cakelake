"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { EXTERNAL_LINK_PROPS } from "@/lib/externalLink";
import styles from "./error.module.css";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // No error-reporting service wired up (POC phase) — the console is
    // the only record, same as any other unhandled error on this site.
    console.error(error);
  }, [error]);

  return (
    <div className={styles.wrap}>
      <h1>Something went wrong</h1>
      <p className={styles.muted}>
        Sorry about that — nothing was lost, but this page hit a snag. Try
        again, or message us directly if it keeps happening.
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.primaryButton} onClick={reset}>
          TRY AGAIN
        </button>
        <Link href={ROUTES.home} className={styles.outlineButton}>
          BACK TO HOME
        </Link>
        <a href={buildWhatsAppUrl()} {...EXTERNAL_LINK_PROPS} className={styles.outlineButton}>
          MESSAGE US ON WHATSAPP
        </a>
      </div>
    </div>
  );
}
