import Link from "next/link";
import type { CatalogItem } from "@/types/catalog";
import { cheapestPrice, formatAed } from "@/lib/pricing";
import { Photo } from "@/components/Photo";
import { itemRoute } from "@/lib/routes";
import styles from "./ItemCard.module.css";

function priceFrom(item: CatalogItem): string {
  const price = cheapestPrice([item]);
  return price === undefined ? "Ask us" : formatAed(price);
}

// A menu card for one catalog item: photo, name, price and a VIEW button.
// The whole card links to the item's detail page.
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
            <Link href={itemRoute(item.slug)} className={styles.askButton}>
              ASK US
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link href={itemRoute(item.slug)} className={styles.card}>
      <div className={styles.photo}>
        <Photo src={item.imageUrl} slot="thumbnail" />
        {item.mostOrderedRank !== undefined && (
          <span className={styles.mostOrderedBadge}>Most ordered</span>
        )}
      </div>
      <div className={styles.body}>
        <div className={styles.name}>{item.name}</div>
        <div className={styles.footer}>
          <span className={styles.price}>{priceFrom(item)}</span>
          <span className={styles.viewButton}>VIEW</span>
        </div>
      </div>
    </Link>
  );
}
