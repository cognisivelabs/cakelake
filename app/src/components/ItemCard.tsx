"use client";

import { useState } from "react";
import type { CatalogItem } from "@/types/catalog";
import type { SelectedOptions } from "@/types/order";
import { useCart } from "@/context/CartContext";
import { unitPrice } from "@/lib/pricing";
import { formatAed } from "@/lib/pricing";
import styles from "./ItemCard.module.css";

export function ItemCard({ item }: { item: CatalogItem }) {
  const { addLine } = useCart();
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [quantity, setQuantity] = useState(1);
  const [cakeMessage, setCakeMessage] = useState("");
  const [justAdded, setJustAdded] = useState(false);

  const missingRequired = item.optionGroups.some(
    (g) => g.required && !selectedOptions[g.id],
  );

  const previewLine = {
    lineId: "preview",
    itemId: item.id,
    quantity: 1,
    selectedOptions,
  };
  const priceEach = unitPrice(item, previewLine);

  function handleAdd() {
    if (missingRequired) return;
    addLine(
      item.id,
      selectedOptions,
      quantity,
      cakeMessage.trim() || undefined,
    );
    setJustAdded(true);
    setQuantity(1);
    setCakeMessage("");
    window.setTimeout(() => setJustAdded(false), 1500);
  }

  if (!item.available) {
    return (
      <div className={`${styles.card} ${styles.soldOut}`}>
        <div className={styles.header}>
          <h3>{item.name}</h3>
          <span className={styles.soldOutBadge}>Sold out</span>
        </div>
        <p className={styles.description}>{item.description}</p>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3>{item.name}</h3>
        <span className={styles.price}>{formatAed(priceEach)}</span>
      </div>
      <p className={styles.description}>{item.description}</p>

      {item.leadTimeHours > 0 && (
        <p className={styles.leadTime}>
          Requires {item.leadTimeHours} hours notice
        </p>
      )}

      {item.optionGroups.map((group) => (
        <fieldset key={group.id} className={styles.optionGroup}>
          <legend>
            {group.label}
            {group.required ? " (required)" : ""}
          </legend>
          {group.choices.map((choice) => (
            <label key={choice.id} className={styles.optionChoice}>
              <input
                type="radio"
                name={`${item.id}-${group.id}`}
                checked={selectedOptions[group.id] === choice.id}
                onChange={() =>
                  setSelectedOptions((prev) => ({
                    ...prev,
                    [group.id]: choice.id,
                  }))
                }
              />
              {choice.label}
              {choice.priceDelta ? ` (+${formatAed(choice.priceDelta)})` : ""}
            </label>
          ))}
        </fieldset>
      ))}

      <label className={styles.cakeMessage}>
        What should we write on this cake? (optional)
        <input
          type="text"
          value={cakeMessage}
          onChange={(e) => setCakeMessage(e.target.value)}
          placeholder="e.g. Happy Birthday Sarah"
        />
      </label>

      <div className={styles.footer}>
        <div className={styles.quantityStepper}>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span>{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <button
          type="button"
          className={styles.addButton}
          disabled={missingRequired}
          onClick={handleAdd}
        >
          {justAdded ? "Added ✓" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
