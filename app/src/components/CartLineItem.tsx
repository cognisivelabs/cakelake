"use client";

import type { CatalogItem } from "@/types/catalog";
import type { CartLine } from "@/types/order";
import { useCart } from "@/context/CartContext";
import { lineTotal, formatAed } from "@/lib/pricing";
import styles from "./CartLineItem.module.css";

export function CartLineItem({ item, line }: { item: CatalogItem; line: CartLine }) {
  const { updateQuantity, removeLine } = useCart();

  const tier = item.weightTiers.find((t) => t.id === line.weightTierId);
  const flavour = item.flavours.find((f) => f.id === line.flavourId);
  const descriptors = [tier?.label, flavour?.label].filter(Boolean).join(", ");
  const total = lineTotal(item, line);

  return (
    <div className={styles.line}>
      <div className={styles.photo} />
      <div className={styles.info}>
        <div className={styles.nameRow}>
          <strong>
            {item.name}
            {descriptors ? ` · ${descriptors}` : ""}
          </strong>
          <button type="button" className={styles.remove} onClick={() => removeLine(line.lineId)}>
            Remove
          </button>
        </div>
        {line.customDescription && (
          <p className={styles.detail}>{line.customDescription}</p>
        )}
        {line.cakeMessage && <p className={styles.inscription}>&ldquo;{line.cakeMessage}&rdquo;</p>}
        <div className={styles.footerRow}>
          <span className={styles.price}>
            {total === undefined ? "Price to confirm" : formatAed(total)}
          </span>
          <div className={styles.quantityStepper}>
            <button
              type="button"
              onClick={() => updateQuantity(line.lineId, line.quantity - 1)}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span>{line.quantity}</span>
            <button
              type="button"
              onClick={() => updateQuantity(line.lineId, line.quantity + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
