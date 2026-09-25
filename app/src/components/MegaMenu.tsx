import Link from "next/link";
import { Photo } from "@/components/Photo";
import { getCatalog, getFlavourTags, getMostOrdered, getCategory, getOccasions } from "@/lib/catalog";
import { getMenuGroups } from "@/lib/menuGroups";
import { formatAed } from "@/lib/pricing";
import { categoryRoute, flavourRoute, itemRoute, occasionRoute, ROUTES } from "@/lib/routes";
import styles from "./MegaMenu.module.css";

// The Cakes mega-menu (desktop header) — the whole menu in one hover.
// Everything is read from the catalog, so it can't drift from the menu.
export function CakesMegaMenu({ onNavigate }: { onNavigate: () => void }) {
  const groups = getMenuGroups();
  const featured = getMostOrdered()[0];
  const featuredTier = featured?.weightTiers.find((t) => t.price !== undefined);

  return (
    <div className={styles.inner}>
      {groups.map((group) => (
        <div key={group.id} className={styles.column}>
          <div className={styles.label}>{group.label}</div>
          <ul className={styles.list}>
            {group.entries.map(({ category, priceLabel }) => (
              <li key={category.id}>
                <Link href={categoryRoute(category.id)} className={styles.link} onClick={onNavigate}>
                  {category.label} <span className={styles.muted}>· {priceLabel}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className={styles.column}>
        <div className={styles.label}>BY FLAVOUR</div>
        <div className={styles.pills}>
          {getFlavourTags().map((tag) => (
            <Link key={tag.id} href={flavourRoute(tag.id)} className={styles.pill} onClick={onNavigate}>
              {tag.label}
            </Link>
          ))}
        </div>
      </div>

      {featured && (
        <Link href={itemRoute(featured.id)} className={styles.card} onClick={onNavigate}>
          <div className={styles.cardPhoto}>
            <Photo src={featured.imageUrl} />
            <span className={`${styles.cardBadge} mono-tag`}>MOST ORDERED</span>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.cardName}>{featured.name}</div>
            <div className={styles.cardMeta}>
              {getCategory(featured.categoryId)?.label}
              {featuredTier?.price !== undefined && ` · ${featuredTier.label} ${formatAed(featuredTier.price)}`}
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}

// The Occasions dropdown — the same cakes, entered by the moment.
export function OccasionsMenu({ onNavigate }: { onNavigate: () => void }) {
  const total = getCatalog().length;
  return (
    <div className={styles.inner}>
      <div className={styles.column}>
        <div className={styles.label}>SHOP BY OCCASION</div>
        <ul className={styles.list}>
          {getOccasions().map((occasion) => (
            <li key={occasion.id}>
              <Link href={occasionRoute(occasion.id)} className={styles.link} onClick={onNavigate}>
                {occasion.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.column}>
        <div className={styles.label}>OR JUST BROWSE</div>
        <ul className={styles.list}>
          <li>
            <Link href={ROUTES.menu} className={styles.link} onClick={onNavigate}>
              The whole menu <span className={styles.muted}>· {total} cakes</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
