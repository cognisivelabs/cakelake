"use client";

import type { CatalogItem } from "@/types/catalog";
import type { CartLine } from "@/types/order";
import { useCart } from "@/context/CartContext";
import { lineTotal, formatAed } from "@/lib/pricing";
import { resolveSelection } from "@/lib/order";
import { withBasePath } from "@/lib/assets";
import styles from "./CartLineItem.module.css";

export function CartLineItem({ item, line }: { item: CatalogItem; line: CartLine }) {
  const { updateQuantity, removeLine } = useCart();

  const { tier, flavour } = resolveSelection(item, line);
  const total = lineTotal(item, line);

  return (
    <div className={styles.line}>
      <div className={styles.photo}>
        {flavour?.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={withBasePath(flavour.imageUrl)}
            alt=""
            className={styles.photoImage}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}
      </div>
      <div className={styles.info}>
        <div className={styles.nameRow}>
          <strong>
            {item.name}
            {tier ? ` · ${tier.label}` : ""}
          </strong>
          <button type="button" className={styles.remove} onClick={() => removeLine(line.lineId)}>
            Remove
          </button>
        </div>
        {flavour && <p className={styles.flavourLine}>{flavour.label}</p>}
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
