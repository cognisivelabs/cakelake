"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CatalogItem } from "@/types/catalog";
import { useCart } from "@/context/CartContext";
import { formatAed } from "@/lib/pricing";
import { getCategory } from "@/lib/catalog";
import { CONFIG } from "@/lib/config";
import { PageHeader } from "@/components/PageHeader";
import styles from "./ItemDetailView.module.css";

export function ItemDetailView({ item }: { item: CatalogItem }) {
  const router = useRouter();
  const { addLine } = useCart();
  const category = getCategory(item.categoryId);
  const categoryLabel = category?.label ?? "Menu";
  const baseWeightPrice = item.weightTiers[0]?.price;

  const [weightTierId, setWeightTierId] = useState(item.weightTiers[0]?.id ?? "");
  const [flavourId, setFlavourId] = useState(item.flavours[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [cakeMessage, setCakeMessage] = useState("");
  const [customDescription, setCustomDescription] = useState("");

  const selectedTier = item.weightTiers.find((t) => t.id === weightTierId);
  const unitPrice = selectedTier?.price;
  const total = unitPrice === undefined ? undefined : unitPrice * quantity;

  const canAdd = weightTierId !== "" && (item.flavours.length === 0 || flavourId !== "");

  function handleAdd() {
    if (!canAdd) return;
    addLine({
      itemId: item.id,
      quantity,
      weightTierId,
      flavourId,
      cakeMessage: cakeMessage.trim() || undefined,
      customDescription: customDescription.trim() || undefined,
    });
    router.push("/menu");
  }

  if (!item.available) {
    return (
      <div>
        <PageHeader title={categoryLabel} backHref="/menu" backLabel="MENU" />
        <div className={styles.photo}>
          <span className={`${styles.unavailableBadge} mono-tag`}>UNAVAILABLE</span>
        </div>
        <div className={styles.content}>
          {category && (
            <span
              className={`${styles.tag} mono-tag`}
              style={{ background: `${category.accent}1a`, color: category.accent, alignSelf: "flex-start" }}
            >
              {category.label}
            </span>
          )}
          <h1 className={styles.title}>{item.name}</h1>
          <p className={styles.description}>{item.description}</p>
          <div className={styles.infoBox}>
            Not available for new orders right now. Message us and we&apos;ll tell
            you when it&apos;s back.
          </div>
        </div>
        <div className={styles.footer}>
          <a
            href={`https://wa.me/${CONFIG.bakeryWhatsAppNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.askButton}
          >
            ASK US ABOUT THIS CAKE
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={categoryLabel} backHref="/menu" backLabel="MENU" />
      <div className={styles.photo}>
        {item.flavours.length > 0 && (
          <span className={styles.photoLabel}>
            {item.flavours.find((f) => f.id === flavourId)?.label}
          </span>
        )}
      </div>

      {item.flavours.length > 0 && (
        <div className={styles.flavourSection}>
          <div className={styles.sectionLabel}>CHOOSE A FLAVOUR</div>
          <div className={styles.flavourStrip}>
            {item.flavours.map((flavour) => (
              <button
                key={flavour.id}
                type="button"
                className={styles.flavourOption}
                onClick={() => setFlavourId(flavour.id)}
              >
                <span
                  className={styles.flavourSwatch}
                  data-selected={flavour.id === flavourId}
                />
                <span
                  className={styles.flavourLabel}
                  data-selected={flavour.id === flavourId}
                >
                  {flavour.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.tags}>
          {category && (
            <span
              className={`${styles.tag} mono-tag`}
              style={{ background: `${category.accent}1a`, color: category.accent }}
            >
              {category.label}
            </span>
          )}
          {item.requiresDelivery && (
            <span className={`${styles.tag} ${styles.tagReady} mono-tag`}>Delivery only</span>
          )}
          <span
            className={`${styles.tag} ${item.leadTimeHours > 0 ? styles.tagNotice : styles.tagReady} mono-tag`}
          >
            {item.readyLabel}
          </span>
          <span className={`${styles.tag} ${styles.tagReady} mono-tag`}>Eggless</span>
        </div>
        <h1 className={styles.title}>
          {item.name}
          {item.flavours.length > 0 && flavourId
            ? ` · ${item.flavours.find((f) => f.id === flavourId)?.label}`
            : ""}
        </h1>
        <p className={styles.description}>{item.description}</p>
      </div>

      <div className={styles.content}>
        <div className={styles.sectionLabel}>
          {item.needsCustomDescription
            ? `WEIGHT${baseWeightPrice !== undefined ? ` · ${formatAed(baseWeightPrice)} PER KG` : ""}`
            : "SIZE"}
        </div>
        <div className={styles.weightRow}>
          {item.weightTiers.map((tier) => (
            <button
              key={tier.id}
              type="button"
              className={styles.weightOption}
              data-selected={tier.id === weightTierId}
              onClick={() => setWeightTierId(tier.id)}
            >
              {tier.label}
              <span className={styles.weightPrice}>
                {tier.price === undefined ? "Ask us" : formatAed(tier.price)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {item.needsCustomDescription && (
        <div className={styles.content}>
          <div className={styles.sectionLabel}>WHAT SHOULD IT LOOK LIKE?</div>
          <textarea
            className={styles.textInput}
            value={customDescription}
            onChange={(e) => setCustomDescription(e.target.value)}
            placeholder="Describe the design you have in mind"
            rows={3}
          />
        </div>
      )}

      {item.cakeMessageMaxLength > 0 && (
        <div className={styles.content}>
          <div className={styles.sectionLabel}>MESSAGE ON THE CAKE</div>
          <div className={`${styles.messageField} ${cakeMessage ? styles.messageFieldActive : ""}`}>
            <input
              type="text"
              value={cakeMessage}
              maxLength={item.cakeMessageMaxLength}
              onChange={(e) => setCakeMessage(e.target.value)}
              placeholder="Optional"
            />
            <span className={styles.charCount}>
              {cakeMessage.length}/{item.cakeMessageMaxLength}
            </span>
          </div>
          <p className={styles.hint}>Leave blank if you&apos;d rather have it plain.</p>
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.infoBox}>
          {item.requiresDelivery
            ? "This needs a day's notice and is delivered by us — the fee is confirmed in chat."
            : `Baked to order in the shop — ${item.readyLabel.toLowerCase()}.`}
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.quantityStepper}>
          <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
            −
          </button>
          <span>{quantity}</span>
          <button type="button" onClick={() => setQuantity((q) => q + 1)}>
            +
          </button>
        </div>
        <button type="button" className={styles.addButton} disabled={!canAdd} onClick={handleAdd}>
          ADD{total !== undefined ? ` · ${formatAed(total)}` : ""}
        </button>
      </div>
    </div>
  );
}
