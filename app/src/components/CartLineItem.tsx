"use client";

import type { CatalogItem } from "@/types/catalog";
import type { CartLine } from "@/types/order";
import { useCart } from "@/context/CartContext";
import { lineTotal } from "@/lib/pricing";
import { formatAed } from "@/lib/pricing";
import styles from "./CartLineItem.module.css";

export function CartLineItem({
  item,
  line,
}: {
  item: CatalogItem;
  line: CartLine;
}) {
  const { updateQuantity, removeLine, updateCakeMessage } = useCart();

  const optionLabels = item.optionGroups
    .map((group) => {
      const chosenId = line.selectedOptions[group.id];
      return group.choices.find((c) => c.id === chosenId)?.label;
    })
    .filter((label): label is string => Boolean(label));

  return (
    <div className={styles.line}>
      <div className={styles.info}>
        <div className={styles.nameRow}>
          <strong>{item.name}</strong>
          <span>{formatAed(lineTotal(item, line))}</span>
        </div>
        {optionLabels.length > 0 && (
          <p className={styles.options}>{optionLabels.join(", ")}</p>
        )}
        {line.cakeMessage && (
          <p className={styles.inscription}>&ldquo;{line.cakeMessage}&rdquo;</p>
        )}
        <label className={styles.editMessage}>
          Cake message (optional)
          <input
            type="text"
            value={line.cakeMessage ?? ""}
            onChange={(e) => updateCakeMessage(line.lineId, e.target.value)}
            placeholder="e.g. Happy Birthday Sarah"
          />
        </label>
      </div>
      <div className={styles.controls}>
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
        <button
          type="button"
          className={styles.remove}
          onClick={() => removeLine(line.lineId)}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
