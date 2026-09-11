"use client";

import Link from "next/link";
import { CartButton } from "@/components/CartButton";
import styles from "./PageHeader.module.css";

type PageHeaderProps = {
  title: string;
  backLabel: string;
} & ({ backHref: string; onBack?: never } | { onBack: () => void; backHref?: never });

export function PageHeader(props: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        {props.backHref ? (
          <Link href={props.backHref} className={styles.back}>
            ← {props.backLabel}
          </Link>
        ) : (
          <button type="button" className={styles.back} onClick={props.onBack}>
            ← {props.backLabel}
          </button>
        )}

        <h1 className={styles.title}>{props.title}</h1>

        <div className={styles.cartSlot}>
          <CartButton />
        </div>
      </div>
    </header>
  );
}
