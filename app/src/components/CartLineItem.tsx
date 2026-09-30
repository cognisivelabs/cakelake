"use client";

import type { CatalogItem } from "@/types/catalog";
import type { CartLine } from "@/types/order";
import { useCart } from "@/context/CartContext";
import { lineTotal, formatAed } from "@/lib/pricing";
import { resolveSelection } from "@/lib/order";
import { Photo } from "@/components/Photo";
import { QuantityStepper } from "@/components/QuantityStepper";
import styles from "./CartLineItem.module.css";

export function CartLineItem({ item, line }: { item: CatalogItem; line: CartLine }) {
  const { updateQuantity, removeLine } = useCart();

  const { tier } = resolveSelection(item, line);
  const total = lineTotal(item, line);

  return (
    <div className={styles.line}>
      <div className={styles.photo}>
        <Photo src={item.imageUrl} slot="thumbnail" />
      </div>
      <div className={styles.info}>
        <div className={styles.nameRow}>
          <strong>
            {item.name}
            {tier ? ` · ${tier.label}` : ""}
          </strong>
          <button type="button" className={styles.remove} onClick={() => removeLine(line.id)}>
            Remove
          </button>
        </div>
        {line.cakeMessage && <p className={styles.inscription}>&ldquo;{line.cakeMessage}&rdquo;</p>}
        <div className={styles.footerRow}>
          <span className={styles.price}>
            {total === undefined ? "Price to confirm" : formatAed(total)}
          </span>
          <QuantityStepper
            className={styles.quantityStepper}
            quantity={line.quantity}
            onDecrease={() => updateQuantity(line.id, line.quantity - 1)}
            onIncrease={() => updateQuantity(line.id, line.quantity + 1)}
          />
        </div>
      </div>
    </div>
  );
}
