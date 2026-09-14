import Link from "next/link";
import type { CatalogItem } from "@/types/catalog";
import { cheapestPrice, formatAed } from "@/lib/pricing";
import { hideBrokenImage, withBasePath } from "@/lib/assets";
import { resolveImageStyle } from "@/lib/imageConfig";
import { itemRoute } from "@/lib/routes";
import styles from "./ItemCard.module.css";

function priceFrom(item: CatalogItem): string {
  const price = cheapestPrice([item]);
  return price === undefined ? "Ask us" : formatAed(price);
}

// Sep 2026 recategorisation: this card is now one flavour (one flattened
// catalog item), not a multi-flavour group — no more "+N FLAVOURS"
// badge or flavour-list subtitle, matching the updated Hi-Fi's simpler
// card (photo, name, price, a button). Tapping ADD still opens the item
// detail page rather than adding straight from the card — there's no
// weight-tier/quantity picker here to add with yet.
export function ItemCard({ item }: { item: CatalogItem }) {
  if (!item.available) {
    return (
      <div className={`${styles.card} ${styles.soldOut}`}>
        <div className={styles.photo}>
          <span className={`${styles.unavailableBadge} mono-tag`}>UNAVAILABLE</span>
        </div>
        <div className={styles.body}>
          <div className={styles.name}>{item.name}</div>
          <div className={styles.footer}>
            <span className={styles.price}>{priceFrom(item)}</span>
            <Link href={itemRoute(item.id)} className={styles.askButton}>
              ASK US
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link href={itemRoute(item.id)} className={styles.card}>
      <div className={styles.photo}>
        {item.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={withBasePath(item.imageUrl)}
            alt=""
            className={styles.photoImage}
            style={resolveImageStyle(item.imageUrl, "thumbnail")}
            onError={hideBrokenImage}
          />
        )}
      </div>
      <div className={styles.body}>
        <div className={styles.name}>{item.name}</div>
        <div className={styles.footer}>
          <span className={styles.price}>{priceFrom(item)}</span>
          <span className={styles.addButton}>ADD</span>
        </div>
      </div>
    </Link>
  );
}
