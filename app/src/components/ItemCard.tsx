import Link from "next/link";
import type { CatalogItem } from "@/types/catalog";
import { cheapestPrice, formatAed } from "@/lib/pricing";
import { hideBrokenImage, withBasePath } from "@/lib/assets";
import styles from "./ItemCard.module.css";

function priceFrom(item: CatalogItem): string {
  const price = cheapestPrice([item]);
  return price === undefined ? "Ask us" : `From ${formatAed(price)}`;
}

export function ItemCard({ item }: { item: CatalogItem }) {
  if (!item.available) {
    return (
      <div className={`${styles.card} ${styles.soldOut}`}>
        <div className={styles.photo}>
          <span className={`${styles.unavailableBadge} mono-tag`}>UNAVAILABLE</span>
        </div>
        <div className={styles.body}>
          <div className={styles.name}>{item.name}</div>
          <div className={styles.flavours}>{item.description}</div>
          <div className={styles.footer}>
            <span className={styles.price}>{priceFrom(item)}</span>
            <Link href={`/menu/${item.id}`} className={styles.askButton}>
              ASK US
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const previewImage = item.flavours.find((f) => f.imageUrl)?.imageUrl;

  return (
    <Link href={`/menu/${item.id}`} className={styles.card}>
      <div className={styles.photo}>
        {previewImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={withBasePath(previewImage)}
            alt=""
            className={styles.photoImage}
            onError={hideBrokenImage}
          />
        )}
        {item.flavours.length > 0 && (
          <span className={`${styles.flavourCount} mono-tag`}>
            {item.flavours.length} FLAVOUR{item.flavours.length === 1 ? "" : "S"}
          </span>
        )}
      </div>
      <div className={styles.body}>
        <div className={styles.name}>{item.name}</div>
        <div className={styles.flavours}>
          {item.flavours.length > 0
            ? item.flavours
                .slice(0, 3)
                .map((f) => f.label)
                .join(" · ") + (item.flavours.length > 3 ? ` · ${item.flavours.length - 3} more` : "")
            : item.description}
        </div>
        <span className={`${styles.readyTag} mono-tag`}>{item.readyLabel}</span>
        <div className={styles.footer}>
          <span className={styles.price}>{priceFrom(item)}</span>
          <span className={styles.viewButton}>VIEW</span>
        </div>
      </div>
    </Link>
  );
}
