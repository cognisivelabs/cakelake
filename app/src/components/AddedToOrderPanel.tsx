import Link from "next/link";
import type { CatalogItem } from "@/types/catalog";
import { formatAed } from "@/lib/pricing";
import { ROUTES } from "@/lib/routes";
import { Photo } from "@/components/Photo";
import { ReadyTag } from "@/components/ItemTags";
import styles from "./ItemDetailView.module.css";

/** What the panel shows about the line just added, captured at the
 * moment of adding (the order has already moved on by the time it renders). */
export type AddedSnapshot = {
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

// "Added to your order" — a bottom sheet on mobile, a right-side panel on
// desktop (same markup; only the CSS layout differs).
export function AddedToOrderPanel({
  item,
  snapshot,
  onClose,
}: {
  item: CatalogItem;
  snapshot: AddedSnapshot;
  onClose: () => void;
}) {
  return (
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
            onClick={() => onClose()}
          >
            ✕
          </button>
        </div>

        <div className={styles.addedCard}>
          <div className={styles.addedPhoto}>
            <Photo src={item.imageUrl} />
          </div>
          <div className={styles.addedInfo}>
            <div className={styles.addedName}>{item.name}</div>
            {snapshot.tierLabel && (
              <div className={styles.addedMeta}>{snapshot.tierLabel}</div>
            )}
            {snapshot.cakeMessage && (
              <div className={styles.addedMessage}>&ldquo;{snapshot.cakeMessage}&rdquo;</div>
            )}
            <div className={styles.addedTagsRow}>
              <ReadyTag item={item} />
              <span className={styles.addedQty}>Qty {snapshot.quantity}</span>
            </div>
          </div>
          <div className={styles.addedPrice}>
            {snapshot.lineTotal === undefined ? "Ask us" : formatAed(snapshot.lineTotal)}
          </div>
        </div>

        {/* Desktop only — mobile's sheet has no room for an itemized
            list and just shows the summary row below. */}
        {snapshot.otherLines.length > 0 && (
          <div className={styles.addedOtherSection}>
            <div className={styles.addedOtherLabel}>ALSO IN YOUR ORDER</div>
            {snapshot.otherLines.map((line, i) => (
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
            {snapshot.itemCount} item{snapshot.itemCount === 1 ? "" : "s"} in your order
          </span>
          <span className={styles.addedSummaryTotal}>{formatAed(snapshot.orderTotalAmount)}</span>
        </div>

        <div className={styles.addedActions}>
          <Link href={ROUTES.cart} className={styles.addedPrimary}>
            REVIEW ORDER · {snapshot.itemCount} ITEM{snapshot.itemCount === 1 ? "" : "S"}
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
  );
}
