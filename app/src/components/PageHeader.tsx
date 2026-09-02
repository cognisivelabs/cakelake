"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ROUTES } from "@/lib/routes";
import { orderItemCount } from "@/lib/order";
import styles from "./PageHeader.module.css";

type PageHeaderProps = {
  title: string;
  backLabel: string;
} & ({ backHref: string; onBack?: never } | { onBack: () => void; backHref?: never });

export function PageHeader(props: PageHeaderProps) {
  const { order } = useCart();
  const itemCount = orderItemCount(order);

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

        <Link href={ROUTES.cart} className={`${styles.cartPill} mono-tag`}>
          CART {itemCount}
        </Link>
      </div>
    </header>
  );
}
