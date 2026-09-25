"use client";

import { useState } from "react";
import Link from "next/link";
import type { CatalogItem } from "@/types/catalog";
import { useCart } from "@/context/CartContext";
import { formatAed, orderTotal, lineTotal } from "@/lib/pricing";
import { resolveSelection, orderItemCount, resolveOrderLines, describeLine } from "@/lib/order";
import { getCategory, getCatalog, getSiblingItems } from "@/lib/catalog";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { hideBrokenImage, withBasePath } from "@/lib/assets";
import { resolveImageStyle } from "@/lib/imageConfig";
import { EXTERNAL_LINK_PROPS } from "@/lib/externalLink";
import { ROUTES, categoryRoute, itemRoute } from "@/lib/routes";
import { ResponsiveHeader } from "@/components/ResponsiveHeader";
import { Footer } from "@/components/Footer";
import styles from "./ItemDetailView.module.css";

type AddedSnapshot = {
  tierLabel?: string;
  cakeMessage?: string;
  quantity: number;
  lineTotal?: number;
  itemCount: number;
  orderTotalAmount: number;
  // Desktop's panel lists what else is already in the order (see
  // "Added to order — desktop" in the Hi-Fi) — mobile's sheet has no
  // room and just shows the itemCount/orderTotalAmount summary above.
  otherLines: { label: string; quantity: number; total?: number }[];
};

export function ItemDetailView({ item }: { item: CatalogItem }) {
  const { order, addLine } = useCart();
  const category = getCategory(item.categoryId);
  const categoryLabel = category?.label ?? "Menu";
  // Sep 2026 recategorisation: Photo Cakes/3D Cakes are the only items
  // still priced by open-ended weight (an unpriced "Ask us" tier at the
  // top end) rather than a fixed ½kg/1kg pair — used below to label the
  // size section "WEIGHT ... PER KG" instead of "SIZE" for just those.
  const isWeightPriced = item.weightTiers.some((t) => t.price === undefined);
  const baseWeightPrice = item.weightTiers[0]?.price;
  // Flavour is no longer a picker on this page (Sep 2026
  // recategorisation) — every other item in the same category is
  // cross-linked instead, at the foot of the page.
  const siblingItems = getSiblingItems(item);

  const [weightTierId, setWeightTierId] = useState(item.weightTiers[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [cakeMessage, setCakeMessage] = useState("");
  // See docs/design/CLB-Hi-Fi-Screens.dc.html's "Added to order" screens —
  // a bottom sheet on mobile, a right-side panel on desktop. Same state,
  // only the CSS layout differs between the two (like the rest of this
  // component).
  const [addedSnapshot, setAddedSnapshot] = useState<AddedSnapshot | null>(null);

  const { tier: selectedTier } = resolveSelection(item, { weightTierId });
  const unitPrice = selectedTier?.price;
  const total = unitPrice === undefined ? undefined : unitPrice * quantity;

  const canAdd = weightTierId !== "";

  function handleAdd() {
    if (!canAdd) return;
    // Snapshot the "also in your order" lines before adding — order.lines
    // doesn't include the new one yet at this point.
    const catalog = getCatalog();
    const otherLines = resolveOrderLines(order, catalog).map(({ item: lineItem, line }) => ({
      label: describeLine(lineItem, line),
      quantity: line.quantity,
      total: lineTotal(lineItem, line),
    }));
    addLine({
      itemId: item.id,
      quantity,
      weightTierId,
      cakeMessage: cakeMessage.trim() || undefined,
    });
    setAddedSnapshot({
      tierLabel: selectedTier?.label,
      cakeMessage: cakeMessage.trim() || undefined,
      quantity,
      lineTotal: total,
      itemCount: orderItemCount(order) + quantity,
      orderTotalAmount: orderTotal(order, catalog) + (total ?? 0),
      otherLines,
    });
  }

  if (!item.available) {
    return (
      <div className={styles.page}>
        <ResponsiveHeader title={categoryLabel} backHref={ROUTES.menu} backLabel="MENU" />
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
            href={buildWhatsAppUrl()}
            {...EXTERNAL_LINK_PROPS}
            className={styles.askButton}
          >
            ASK US ABOUT THIS CAKE
          </a>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <ResponsiveHeader title={categoryLabel} backHref={ROUTES.menu} backLabel="MENU" />

      {/* Desktop only — see docs/design/CLB-Hi-Fi-Screens.dc.html's
          "Item detail — desktop": a breadcrumb replaces mobile's plain
          "← MENU" back-link once there's room for one. The category crumb
          goes to /menu with that category pre-selected (hash-based, since
          there's no per-category route). */}
      <nav className={styles.breadcrumb}>
        <Link href={ROUTES.menu}>← Menu</Link>
        <span className={styles.breadcrumbSep}>/</span>
        <Link href={category ? categoryRoute(category.id) : ROUTES.menu}>{categoryLabel}</Link>
        <span className={styles.breadcrumbSep}>/</span>
        <span>{item.name}</span>
      </nav>

      <div className={styles.desktopGrid}>
        <div className={styles.leftCol}>
          <div className={styles.photo}>
            {item.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={withBasePath(item.imageUrl)}
                alt={item.name}
                className={styles.photoImage}
                style={resolveImageStyle(item.imageUrl, "hero")}
                onError={hideBrokenImage}
              />
            )}
          </div>
        </div>

        <div className={styles.rightCol}>
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
            <h1 className={styles.title}>{item.name}</h1>
            <p className={styles.description}>{item.description}</p>
          </div>

          <div className={styles.content}>
            <div className={styles.sectionLabel}>
              {isWeightPriced
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

          {item.cakeMessageMaxLength > 0 && (
            <div className={styles.content}>
              <div className={styles.sectionLabel}>MESSAGE ON THE CAKE</div>
              <div className={styles.messageField}>
                <input
                  type="text"
                  className="no-focus-ring"
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

          {siblingItems.length > 0 && (
            <div className={styles.otherFlavoursSection}>
              <div className={styles.sectionLabel}>OTHER FLAVOURS IN {categoryLabel.toUpperCase()}</div>
              <div className={styles.otherFlavoursStrip}>
                {siblingItems.map((sibling) => (
                  <Link
                    key={sibling.id}
                    href={itemRoute(sibling.id)}
                    className={styles.otherFlavourLink}
                  >
                    <span className={styles.otherFlavourSwatch}>
                      {sibling.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={withBasePath(sibling.imageUrl)}
                          alt=""
                          className={styles.otherFlavourSwatchImage}
                          style={resolveImageStyle(sibling.imageUrl, "thumbnail")}
                          onError={hideBrokenImage}
                        />
                      )}
                    </span>
                    <span className={styles.otherFlavourLabel}>{sibling.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className={styles.footer}>
            <div className={styles.quantityStepper}>
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span>{quantity}</span>
              <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((q) => q + 1)}>
                +
              </button>
            </div>
            <button type="button" className={styles.addButton} disabled={!canAdd} onClick={handleAdd}>
              ADD{total !== undefined ? ` · ${formatAed(total)}` : ""}
            </button>
          </div>
        </div>
      </div>

      {addedSnapshot && (
        <div className={styles.addedOverlay}>
          <div className={styles.addedSheet}>
            <div className={styles.addedHandle} />
            <div className={styles.addedHeader}>
              <span className={styles.addedCheck}>✓</span>
              <span className={styles.addedTitle}>Added to your order</span>
              <span className={styles.addedHeaderSpacer} />
              {/* Desktop only — mobile dismisses via KEEP SHOPPING/REVIEW
                  ORDER instead; see the .addedClose desktop override. */}
              <button
                type="button"
                className={styles.addedClose}
                aria-label="Close"
                onClick={() => setAddedSnapshot(null)}
              >
                ✕
              </button>
            </div>

            <div className={styles.addedCard}>
              <div className={styles.addedPhoto}>
                {item.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={withBasePath(item.imageUrl)}
                    alt=""
                    className={styles.addedPhotoImage}
                    onError={hideBrokenImage}
                  />
                )}
              </div>
              <div className={styles.addedInfo}>
                <div className={styles.addedName}>{item.name}</div>
                {addedSnapshot.tierLabel && (
                  <div className={styles.addedMeta}>{addedSnapshot.tierLabel}</div>
                )}
                {addedSnapshot.cakeMessage && (
                  <div className={styles.addedMessage}>&ldquo;{addedSnapshot.cakeMessage}&rdquo;</div>
                )}
                <div className={styles.addedTagsRow}>
                  <span
                    className={`${styles.tag} ${item.leadTimeHours > 0 ? styles.tagNotice : styles.tagReady} mono-tag`}
                  >
                    {item.readyLabel}
                  </span>
                  <span className={styles.addedQty}>Qty {addedSnapshot.quantity}</span>
                </div>
              </div>
              <div className={styles.addedPrice}>
                {addedSnapshot.lineTotal === undefined ? "Ask us" : formatAed(addedSnapshot.lineTotal)}
              </div>
            </div>

            {/* Desktop only — mobile's sheet has no room for an itemized
                list and just shows the summary row below. */}
            {addedSnapshot.otherLines.length > 0 && (
              <div className={styles.addedOtherSection}>
                <div className={styles.addedOtherLabel}>ALSO IN YOUR ORDER</div>
                {addedSnapshot.otherLines.map((line, i) => (
                  <div key={i} className={styles.addedOtherRow}>
                    <span>
                      {line.quantity}× {line.label}
                    </span>
                    <span>{line.total === undefined ? "Ask us" : formatAed(line.total)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.addedSummary}>
              <span>
                {addedSnapshot.itemCount} item{addedSnapshot.itemCount === 1 ? "" : "s"} in your order
              </span>
              <span className={styles.addedSummaryTotal}>{formatAed(addedSnapshot.orderTotalAmount)}</span>
            </div>

            <div className={styles.addedActions}>
              <Link href={ROUTES.cart} className={styles.addedPrimary}>
                REVIEW ORDER · {addedSnapshot.itemCount} ITEM{addedSnapshot.itemCount === 1 ? "" : "S"}
              </Link>
              <Link href={ROUTES.menu} className={styles.addedSecondary}>
                KEEP SHOPPING
              </Link>
            </div>

            <p className={styles.addedNote}>
              Nothing is charged here — we confirm price and time on WhatsApp.
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
